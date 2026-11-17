import { aiProcurementCatalogStudy } from "./ai-procurement-catalog";
import { xcelMasterclassesStudy } from "./xcel-masterclasses";
import { xcelCtaButtonTestStudy } from "./xcel-cta-button-test";
import { healthqRehabMarketingSetupStudy } from "./healthq-rehab-marketing-setup";
import { platformReliabilityStudy } from "./platform-reliability";
import { tynkerAppRedesignStudy } from "./tynker-app-redesign";
import type { CaseStudy } from "./types";

export * from "./types";
export {
  aiProcurementCatalogStudy,
  xcelMasterclassesStudy,
  xcelCtaButtonTestStudy,
  healthqRehabMarketingSetupStudy,
  platformReliabilityStudy,
  tynkerAppRedesignStudy,
};

export const FLAGSHIP_CASE_STUDIES: CaseStudy[] = [
  aiProcurementCatalogStudy,
  xcelMasterclassesStudy,
  healthqRehabMarketingSetupStudy,
  platformReliabilityStudy,
  tynkerAppRedesignStudy,
];

export function getAdjacentCaseStudies(slug: string): {
  prevStudy: CaseStudy | null;
  nextStudy: CaseStudy | null;
} {
  const currentIndex = FLAGSHIP_CASE_STUDIES.findIndex(
    (item) => item.slug === slug
  );

  if (currentIndex === -1) {
    return { prevStudy: null, nextStudy: null };
  }

  return {
    prevStudy:
      currentIndex > 0 ? FLAGSHIP_CASE_STUDIES[currentIndex - 1] : null,
    nextStudy:
      currentIndex < FLAGSHIP_CASE_STUDIES.length - 1
        ? FLAGSHIP_CASE_STUDIES[currentIndex + 1]
        : null,
  };
}
