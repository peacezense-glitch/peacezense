export { calculateBaziFull, getElementBalance } from './engine';
export { analyzeUsefulGod } from './usefulGod';
export { generateLifeAnalysis } from './analysis';
export { getYearlyFlow, getYearlyFlows } from './yearlyFlow';

import { calculateBaziFull, getElementBalance } from './engine';
import { analyzeUsefulGod } from './usefulGod';

/** @deprecated Use calculateBaziFull instead */
export function calculateBazi(birthDate: string, birthTime: string) {
  return calculateBaziFull(birthDate, birthTime, 'other').chart;
}

export function getDayMasterAnalysis(chart: ReturnType<typeof calculateBazi>) {
  return analyzeUsefulGod(chart).summary;
}
