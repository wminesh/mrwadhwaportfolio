"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface AmbientTelemetryCanvasProps {
  hoverReveal?: boolean;
  revealRadius?: number;
  className?: string;
}

function createGlowTexture(): THREE.CanvasTexture | null {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.35, "rgba(255, 255, 255, 0.7)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Interactive Three.js 3D telemetry lattice scoped to its parent section.
 * Acts as a hover-reveal cursor aperture (`hoverReveal = true`) so moving the pointer
 * exposes the live field while keeping the default canvas clean for downstream scroll paths.
 */
export function AmbientTelemetryCanvas({
  hoverReveal = true,
  revealRadius = 420,
  className = "",
}: AmbientTelemetryCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const host = container.parentElement ?? container;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    const initialWidth = Math.max(container.clientWidth, 1);
    const initialHeight = Math.max(container.clientHeight, 1);

    const camera = new THREE.PerspectiveCamera(
      48,
      initialWidth / initialHeight,
      0.1,
      100
    );
    camera.position.set(0, 5.2, 11.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initialWidth, initialHeight);
    container.appendChild(renderer.domElement);

    const cols = 52;
    const rows = 32;
    const count = cols * rows;
    const spacing = 0.42;

    const baseX = new Float32Array(count);
    const baseZ = new Float32Array(count);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const isAnchorSignal = new Uint8Array(count);

    let idx = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        const px = (x - (cols - 1) / 2) * spacing;
        const pz = (z - (rows - 1) / 2) * spacing;
        baseX[idx] = px;
        baseZ[idx] = pz;
        positions[idx * 3] = px;
        positions[idx * 3 + 1] = 0;
        positions[idx * 3 + 2] = pz;
        isAnchorSignal[idx] = (x * 7 + z * 11) % 29 === 0 ? 1 : 0;
        idx++;
      }
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    pointsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const glowTexture = createGlowTexture();
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.14,
      map: glowTexture ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
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
      opacity: 0.28,
      depthWrite: false,
    });
    const lattice = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lattice);

    const baseColor = new THREE.Color("#2A303D");
    const peakColor = new THREE.Color("#F4F3EE");
    const signalColor = new THREE.Color("#FF5C28");

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(99, 99);
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hitPoint = new THREE.Vector3(999, 0, 999);
    const smoothHit = new THREE.Vector3(999, 0, 999);
    const pointerParallax = { x: 0, y: 0 };

    let pulseOriginX = 0;
    let pulseOriginZ = 0;
    let pulseStart = -10;

    let isHovered = !hoverReveal;
    let isInView = true;
    let targetMaskX = initialWidth * 0.5;
    let targetMaskY = initialHeight * 0.5;
    let smoothMaskX = targetMaskX;
    let smoothMaskY = targetMaskY;
    let maskAlpha = hoverReveal ? 0 : 1;

    const applyMask = () => {
      if (!hoverReveal) {
        container.style.opacity = "0.9";
        container.style.maskImage = "";
        container.style.webkitMaskImage = "";
        return;
      }

      const grad = `radial-gradient(${revealRadius}px circle at ${smoothMaskX.toFixed(1)}px ${smoothMaskY.toFixed(1)}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.48) 45%, transparent 74%)`;
      container.style.maskImage = grad;
      container.style.webkitMaskImage = grad;
      container.style.opacity = (maskAlpha * 0.95).toFixed(3);
    };

    applyMask();

    const clock = new THREE.Clock();
    let rafId = 0;

    const renderFrame = (elapsed: number) => {
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

      for (let i = 0; i < count; i++) {
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

        const totalY = wave + cursorLift + shockwave;
        posAttr.setY(i, totalY);

        const heat = Math.min(
          1,
          cursorInfluence * 0.95 +
            shockwave * 1.15 +
            (isAnchorSignal[i] ? 0.55 : 0)
        );

        let r = baseColor.r + (signalColor.r - baseColor.r) * heat;
        let g = baseColor.g + (signalColor.g - baseColor.g) * heat;
        let b = baseColor.b + (signalColor.b - baseColor.b) * heat;

        if (cursorInfluence > 0.65) {
          const tip = (cursorInfluence - 0.65) / 0.35;
          r += (peakColor.r - r) * tip * 0.6;
          g += (peakColor.g - g) * tip * 0.6;
          b += (peakColor.b - b) * tip * 0.6;
        }

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

      renderer.render(scene, camera);
    };

    const animate = () => {
      if (!isInView || (hoverReveal && !isHovered && maskAlpha <= 0.005)) {
        rafId = 0;
        return;
      }

      if (hoverReveal) {
        const targetAlpha = isHovered ? 1 : 0;
        maskAlpha += (targetAlpha - maskAlpha) * 0.12;
        smoothMaskX += (targetMaskX - smoothMaskX) * 0.22;
        smoothMaskY += (targetMaskY - smoothMaskY) * 0.22;
        applyMask();
      }

      renderFrame(clock.getElapsedTime());
      rafId = window.requestAnimationFrame(animate);
    };

    const ensureRunning = () => {
      if (prefersReducedMotion || rafId !== 0 || !isInView) return;
      rafId = window.requestAnimationFrame(animate);
    };

    const updatePointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      targetMaskX = px;
      targetMaskY = py;

      const nx = (px / Math.max(rect.width, 1)) * 2 - 1;
      const ny = -(py / Math.max(rect.height, 1)) * 2 + 1;
      pointerNdc.set(nx, ny);
      pointerParallax.x = nx;
      pointerParallax.y = -ny;
    };

    const onPointerEnter = (e: PointerEvent) => {
      isHovered = true;
      updatePointer(e);
      if (hoverReveal && maskAlpha <= 0.01) {
        smoothMaskX = targetMaskX;
        smoothMaskY = targetMaskY;
      }
      if (prefersReducedMotion) {
        maskAlpha = 1;
        smoothMaskX = targetMaskX;
        smoothMaskY = targetMaskY;
        applyMask();
        renderFrame(0);
      } else {
        ensureRunning();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isHovered) {
        isHovered = true;
      }
      updatePointer(e);
      if (prefersReducedMotion) {
        maskAlpha = 1;
        smoothMaskX = targetMaskX;
        smoothMaskY = targetMaskY;
        applyMask();
      } else {
        ensureRunning();
      }
    };

    const onPointerLeave = () => {
      if (hoverReveal) {
        isHovered = false;
      }
      pointerNdc.set(99, 99);
      hitPoint.set(999, 0, 999);
      if (prefersReducedMotion && hoverReveal) {
        maskAlpha = 0;
        applyMask();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, [role='tab']")) return;

      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      const ny = -((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1;
      raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const clickHit = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(groundPlane, clickHit)) {
        pulseOriginX = clickHit.x;
        pulseOriginZ = clickHit.z;
        pulseStart = clock.getElapsedTime();
        ensureRunning();
      }
    };

    host.addEventListener("pointerenter", onPointerEnter, { passive: true });
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave, { passive: true });
    host.addEventListener("pointerdown", onPointerDown, { passive: true });

    const resizeRenderer = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      if (prefersReducedMotion) {
        renderFrame(0);
      }
    };

    const resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        isInView = entry.isIntersecting;
        if (isInView && (isHovered || !hoverReveal)) {
          ensureRunning();
        }
      },
      { threshold: 0.02 }
    );
    intersectionObserver.observe(host);

    if (prefersReducedMotion) {
      renderFrame(0);
    } else if (!hoverReveal) {
      ensureRunning();
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      host.removeEventListener("pointerenter", onPointerEnter);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("pointerdown", onPointerDown);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      glowTexture?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [hoverReveal, revealRadius]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
    />
  );
}
