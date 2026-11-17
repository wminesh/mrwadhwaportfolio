"use client";

import { type RefObject, useEffect, useRef } from "react";
import * as THREE from "three";

interface HeroTextInversionOverlayProps {
  headlineRef: RefObject<HTMLHeadingElement | null>;
  className?: string;
}

interface WordBox {
  text: string;
  x: number;
  y: number;
}

const CELL_SIZE = 10;
const TRAIL_COUNT = 14;
const HILL_AMP = 1.15;
const FILL_THRESHOLD = 0.5;
const PROXIMITY_PAD_X = 96;
const PROXIMITY_PAD_Y = 64;

function createNodeTexture(): THREE.CanvasTexture | null {
  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 32;
  const g = c.getContext("2d");
  if (!g) return null;

  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.55, "rgba(255, 255, 255, 0.7)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(c);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Velocity-reactive copper mask + embedded Three.js telemetry lattice + dark-ink headline inversion.
 * Everything (telemetry lattice and inverted words) is composited inside the copper blob via
 * `source-atop`, leaving the hero background cleanly obsidian outside the mask.
 */
export function HeroTextInversionOverlay({
  headlineRef,
  className = "",
}: HeroTextInversionOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const headline = headlineRef.current;
    if (!canvas || !headline) return;

    const host = canvas.parentElement;
    if (!host) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let gridW = 0;
    let gridH = 0;
    let hillField = new Float32Array(0);
    let maskCanvas: HTMLCanvasElement | null = null;
    let maskCtx: CanvasRenderingContext2D | null = null;
    let maskImg: ImageData | null = null;

    let fontString = "";
    let letterSpacing = "0px";
    let words: WordBox[] = [];
    let headlineBounds = { left: 0, top: 0, right: 0, bottom: 0 };

    const trail: { x: number; y: number }[] = [];
    const target = { x: 0, y: 0 };
    const lastHead = { x: 0, y: 0 };
    let speed = 0;
    let isHeadlineActive = false;
    let isInView = true;
    let blobAlpha = 0;
    let rafId = 0;

    // Three.js telemetry scene rendered offscreen and clipped inside the copper mask
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 5.2, 11.5);
    camera.lookAt(0, 0, 0);

    const threeRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    const cols = 52;
    const rows = 32;
    const nodeCount = cols * rows;
    const spacing = 0.42;

    const baseX = new Float32Array(nodeCount);
    const baseZ = new Float32Array(nodeCount);
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);
    const isAnchorSignal = new Uint8Array(nodeCount);

    let pIdx = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        const px = (x - (cols - 1) / 2) * spacing;
        const pz = (z - (rows - 1) / 2) * spacing;
        baseX[pIdx] = px;
        baseZ[pIdx] = pz;
        positions[pIdx * 3] = px;
        positions[pIdx * 3 + 1] = 0;
        positions[pIdx * 3 + 2] = pz;
        isAnchorSignal[pIdx] = (x * 7 + z * 11) % 29 === 0 ? 1 : 0;
        pIdx++;
      }
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    pointsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const nodeTexture = createNodeTexture();
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.13,
      map: nodeTexture ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    const lineIndices: number[] = [];
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        const current = x * rows + z;
        if (x < cols - 1) {
          lineIndices.push(current, (x + 1) * rows + z);
        }
        if (z < rows - 1) {
          lineIndices.push(current, x * rows + (z + 1));
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      pointsGeometry.getAttribute("position")
    );
    lineGeometry.setAttribute("color", pointsGeometry.getAttribute("color"));
    lineGeometry.setIndex(lineIndices);

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.36,
      depthWrite: false,
    });
    const lattice = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lattice);

    const inkDark = new THREE.Color("#090A0C");
    const inkLight = new THREE.Color("#F4F3EE");
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(99, 99);
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hitPoint = new THREE.Vector3(999, 0, 999);
    const smoothHit = new THREE.Vector3(999, 0, 999);
    const pointerParallax = { x: 0, y: 0 };

    const threeClock = new THREE.Clock();
    let pulseOriginX = 0;
    let pulseOriginZ = 0;
    let pulseStart = -10;

    const lobeCount = TRAIL_COUNT * 2;
    const hx = new Float32Array(lobeCount);
    const hy = new Float32Array(lobeCount);
    const hs = new Float32Array(lobeCount);

    const renderTelemetryFrame = (elapsed: number) => {
      if (pointerNdc.x <= 1.5 && pointerNdc.x >= -1.5) {
        raycaster.setFromCamera(pointerNdc, camera);
        raycaster.ray.intersectPlane(groundPlane, hitPoint);
      }

      smoothHit.x += (hitPoint.x - smoothHit.x) * 0.14;
      smoothHit.z += (hitPoint.z - smoothHit.z) * 0.14;

      const posAttr = pointsGeometry.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      const colAttr = pointsGeometry.getAttribute(
        "color"
      ) as THREE.BufferAttribute;

      const pulseAge = elapsed - pulseStart;
      const pulseRadius = pulseAge * 7.5;
      const pulseActive = pulseAge >= 0 && pulseAge < 2.2;

      for (let i = 0; i < nodeCount; i++) {
        const x = baseX[i];
        const z = baseZ[i];

        const wave =
          Math.sin(x * 0.42 + elapsed * 0.85) * 0.34 +
          Math.cos(z * 0.52 + elapsed * 0.6) * 0.28;

        const dx = x - smoothHit.x;
        const dz = z - smoothHit.z;
        const distCursor = Math.hypot(dx, dz);
        const cursorInfluence = Math.max(0, 1 - distCursor / 3.4);
        const cursorLift = cursorInfluence * cursorInfluence * 1.15;

        let shockwave = 0;
        if (pulseActive) {
          const dPulse = Math.hypot(x - pulseOriginX, z - pulseOriginZ);
          const ringDelta = Math.abs(dPulse - pulseRadius);
          if (ringDelta < 1.35) {
            shockwave = (1 - ringDelta / 1.35) * (1 - pulseAge / 2.2) * 0.95;
          }
        }

        posAttr.setY(i, wave + cursorLift + shockwave);

        const highlight = Math.min(
          1,
          cursorInfluence * 0.85 +
            shockwave * 1.1 +
            (isAnchorSignal[i] ? 0.45 : 0)
        );
        const r = inkDark.r + (inkLight.r - inkDark.r) * highlight;
        const g = inkDark.g + (inkLight.g - inkDark.g) * highlight;
        const b = inkDark.b + (inkLight.b - inkDark.b) * highlight;
        colAttr.setXYZ(i, r, g, b);
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      const targetRotY = pointerParallax.x * 0.08;
      points.rotation.y += (targetRotY - points.rotation.y) * 0.05;
      lattice.rotation.y = points.rotation.y;

      camera.position.x += (pointerParallax.x * 1.1 - camera.position.x) * 0.04;
      camera.position.y +=
        (5.2 - pointerParallax.y * 0.55 - camera.position.y) * 0.04;
      camera.lookAt(0, 0.2, 0);

      threeRenderer.render(scene, camera);
    };

    const measure = () => {
      const hostRect = host.getBoundingClientRect();
      const hRect = headline.getBoundingClientRect();

      width = Math.max(hostRect.width, 1);
      height = Math.max(hostRect.height, 1);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      threeRenderer.setPixelRatio(dpr);
      threeRenderer.setSize(width, height, false);

      gridW = Math.ceil(width / CELL_SIZE);
      gridH = Math.ceil(height / CELL_SIZE);
      hillField = new Float32Array((gridW + 1) * (gridH + 1));

      maskCanvas = document.createElement("canvas");
      maskCanvas.width = gridW + 1;
      maskCanvas.height = gridH + 1;
      maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (maskCtx) {
        maskImg = maskCtx.createImageData(gridW + 1, gridH + 1);
      }

      headlineBounds = {
        left: hRect.left - hostRect.left,
        top: hRect.top - hostRect.top,
        right: hRect.right - hostRect.left,
        bottom: hRect.bottom - hostRect.top,
      };

      const cs = getComputedStyle(headline);
      fontString = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;

      ctx.font = fontString;
      const metrics = ctx.measureText("H");
      const ascent =
        metrics.fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.88;

      const wordEls = headline.querySelectorAll<HTMLElement>("[data-word]");
      words = Array.from(wordEls).map((el) => {
        const box = el.getBoundingClientRect();
        const rawText = el.textContent ?? "";
        return {
          text:
            cs.textTransform === "uppercase"
              ? rawText.toUpperCase()
              : rawText,
          x: box.left - hostRect.left,
          y: box.top - hostRect.top + ascent,
        };
      });

      if (trail.length === 0) {
        const initX =
          (headlineBounds.left + headlineBounds.right) * 0.5 || width * 0.4;
        const initY =
          (headlineBounds.top + headlineBounds.bottom) * 0.5 || height * 0.5;
        for (let i = 0; i < TRAIL_COUNT; i++) {
          trail.push({ x: initX, y: initY });
        }
        target.x = initX;
        target.y = initY;
        lastHead.x = initX;
        lastHead.y = initY;
      }
    };

    const drawFrame = () => {
      if (!maskCanvas || !maskCtx || !maskImg || width === 0 || height === 0) {
        return;
      }

      const targetAlpha = isHeadlineActive ? 1 : 0;
      blobAlpha +=
        (targetAlpha - blobAlpha) * (prefersReducedMotion ? 1 : 0.16);

      if (!isHeadlineActive && blobAlpha <= 0.008) {
        blobAlpha = 0;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rafId = 0;
        return;
      }

      const k0 = prefersReducedMotion ? 1 : 0.22;
      const kk = prefersReducedMotion ? 1 : 0.32;

      trail[0].x += (target.x - trail[0].x) * k0;
      trail[0].y += (target.y - trail[0].y) * k0;
      for (let i = 1; i < TRAIL_COUNT; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * kk;
        trail[i].y += (trail[i - 1].y - trail[i].y) * kk;
      }

      const stepSpeed = prefersReducedMotion
        ? 0
        : Math.min(
            Math.hypot(trail[0].x - lastHead.x, trail[0].y - lastHead.y),
            40
          );
      speed += (stepSpeed - speed) * 0.15;
      lastHead.x = trail[0].x;
      lastHead.y = trail[0].y;

      const sigma =
        Math.max(30, Math.min(width, 900) * 0.08) + speed * 1.15;

      for (let a = 0; a < TRAIL_COUNT; a++) {
        const f = 1 - a / TRAIL_COUNT;
        const s2 = sigma * (0.35 + 0.65 * f);
        const nextPt = trail[Math.min(a + 1, TRAIL_COUNT - 1)];
        hx[a * 2] = trail[a].x;
        hy[a * 2] = trail[a].y;
        hs[a * 2] = s2;
        hx[a * 2 + 1] = (trail[a].x + nextPt.x) * 0.5;
        hy[a * 2 + 1] = (trail[a].y + nextPt.y) * 0.5;
        hs[a * 2 + 1] = s2;
      }

      const stride = gridW + 1;
      for (let gy = 0; gy <= gridH; gy++) {
        const py = gy * CELL_SIZE;
        for (let gx = 0; gx <= gridW; gx++) {
          const px = gx * CELL_SIZE;
          let best = 0;
          for (let q = 0; q < lobeCount; q++) {
            const dx = px - hx[q];
            const dy = py - hy[q];
            const s = hs[q];
            const d2 = dx * dx + dy * dy;
            if (d2 > 9 * s * s) continue;
            const w = Math.exp(-d2 / (2 * s * s)) * (1 - q / (lobeCount * 1.15));
            if (w > best) best = w;
          }
          hillField[gy * stride + gx] = best * HILL_AMP;
        }
      }

      const pixels = maskImg.data;
      for (let m = 0; m < hillField.length; m++) {
        let alpha = (hillField[m] - FILL_THRESHOLD) * 12;
        if (alpha < 0) alpha = 0;
        if (alpha > 1) alpha = 1;
        const idx = m * 4;
        pixels[idx] = 255;
        pixels[idx + 1] = 92;
        pixels[idx + 2] = 40;
        pixels[idx + 3] = Math.round(alpha * blobAlpha * 255);
      }
      maskCtx.putImageData(maskImg, 0, 0);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // 1. Draw the organic Telemetry Copper mask
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(
        maskCanvas,
        0,
        0,
        (gridW + 1) * CELL_SIZE,
        (gridH + 1) * CELL_SIZE
      );

      // 2. Clip the live 3D telemetry lattice directly inside the orange mask
      renderTelemetryFrame(prefersReducedMotion ? 0 : threeClock.getElapsedTime());
      ctx.globalCompositeOperation = "source-atop";
      ctx.drawImage(threeRenderer.domElement, 0, 0, width, height);

      // 3. Invert headline words into Obsidian ink inside the orange mask
      if ("letterSpacing" in ctx) {
        (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
          letterSpacing;
      }
      ctx.font = fontString;
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#090A0C";

      for (let i = 0; i < words.length; i++) {
        ctx.fillText(words[i].text, words[i].x, words[i].y);
      }

      ctx.globalCompositeOperation = "source-over";
      if ("letterSpacing" in ctx) {
        (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
          "0px";
      }

      if (!prefersReducedMotion && (isHeadlineActive || blobAlpha > 0.008)) {
        rafId = window.requestAnimationFrame(drawFrame);
      } else {
        rafId = 0;
      }
    };

    const ensureRunning = () => {
      if (prefersReducedMotion) {
        drawFrame();
        return;
      }
      if (rafId === 0 && isInView) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const hostRect = host.getBoundingClientRect();
      const px = e.clientX - hostRect.left;
      const py = e.clientY - hostRect.top;

      const nx = (px / Math.max(hostRect.width, 1)) * 2 - 1;
      const ny = -(py / Math.max(hostRect.height, 1)) * 2 + 1;
      pointerNdc.set(nx, ny);
      pointerParallax.x = nx;
      pointerParallax.y = -ny;

      // Refresh word positions if hero entrance transform finished after initial measure
      const hRect = headline.getBoundingClientRect();
      const currentTop = hRect.top - hostRect.top;
      if (Math.abs(currentTop - headlineBounds.top) > 1) {
        measure();
      }

      const nearHeadline =
        px >= headlineBounds.left - PROXIMITY_PAD_X &&
        px <= headlineBounds.right + PROXIMITY_PAD_X &&
        py >= headlineBounds.top - PROXIMITY_PAD_Y &&
        py <= headlineBounds.bottom + PROXIMITY_PAD_Y;

      if (nearHeadline && !isHeadlineActive) {
        for (let i = 0; i < trail.length; i++) {
          trail[i].x = px;
          trail[i].y = py;
        }
        lastHead.x = px;
        lastHead.y = py;
      }

      isHeadlineActive = nearHeadline;
      target.x = px;
      target.y = py;

      if (nearHeadline || blobAlpha > 0.008) {
        ensureRunning();
      }
    };

    const onPointerLeave = () => {
      isHeadlineActive = false;
      pointerNdc.set(99, 99);
      hitPoint.set(999, 0, 999);
      if (blobAlpha > 0.008) {
        ensureRunning();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const targetEl = e.target as HTMLElement | null;
      if (targetEl?.closest("a, button, [role='tab']")) return;

      const hostRect = host.getBoundingClientRect();
      const nx = ((e.clientX - hostRect.left) / Math.max(hostRect.width, 1)) * 2 - 1;
      const ny = -((e.clientY - hostRect.top) / Math.max(hostRect.height, 1)) * 2 + 1;
      raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const clickHit = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(groundPlane, clickHit)) {
        pulseOriginX = clickHit.x;
        pulseOriginZ = clickHit.z;
        pulseStart = threeClock.getElapsedTime();
        if (isHeadlineActive) {
          ensureRunning();
        }
      }
    };

    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave, { passive: true });
    host.addEventListener("pointerdown", onPointerDown, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        isInView = entry.isIntersecting;
        if (!isInView) {
          isHeadlineActive = false;
          if (rafId) {
            window.cancelAnimationFrame(rafId);
            rafId = 0;
          }
        }
      },
      { threshold: 0.02 }
    );
    intersectionObserver.observe(host);

    let disposed = false;
    const readyPromise =
      document.fonts && document.fonts.load
        ? document.fonts
            .load('1em "Bebas Neue"')
            .catch(() => undefined)
            .then(() => document.fonts.ready)
        : Promise.resolve();

    readyPromise.then(() => {
      if (disposed) return;
      measure();
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(host);
    });

    return () => {
      disposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("pointerdown", onPointerDown);
      resizeObserver?.disconnect();
      intersectionObserver.disconnect();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      nodeTexture?.dispose();
      threeRenderer.dispose();
    };
  }, [headlineRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-20 h-full w-full ${className}`}
    />
  );
}
