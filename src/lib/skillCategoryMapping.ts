/**
 * Maps skill categories to service categories for job filtering
 * A worker with a specific skill should see jobs from these service categories
 */
export const SKILL_TO_SERVICE_CATEGORY_MAP: Record<string, string[]> = {
  'electrical': ['el', 'tekniska-installationer'],
  'plumbing': ['vvs', 'badrum'],
  'carpentry': ['snickeri', 'fonster-dorrar', 'kok'],
  'construction': ['snickeri', 'markarbeten', 'utbyggnad'],
  'painting': ['maleri'],
  'flooring': ['golv'],
  'tiling': ['badrum', 'kok', 'golv'],
  'roofing': ['takarbeten'],
  'hvac': ['vvs', 'tekniska-installationer'],
  'technology': ['tekniska-installationer', 'smarta-losningar'],
  'masonry': ['murverk', 'markarbeten'],
  'landscaping': ['markarbeten', 'tradgard'],
  'general': [] // General skills see all jobs (fallback)
};

/**
 * Get service categories that match a worker's skill categories
 */
export function getServiceCategoriesForSkills(skillCategories: string[]): string[] {
  const serviceCategoriesSet = new Set<string>();
  
  skillCategories.forEach(skillCat => {
    const mapped = SKILL_TO_SERVICE_CATEGORY_MAP[skillCat] || [];
    mapped.forEach(sc => serviceCategoriesSet.add(sc));
  });

  return Array.from(serviceCategoriesSet);
}
