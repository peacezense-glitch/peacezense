export { SIGNS, SIGN_COLORS, ELEMENT_COLORS, longitudeToSign, formatDegree } from './signs';
export {
  calculateNatalChart,
  getAstrologyReading,
  getAspectSummary,
} from './engine';

/** @deprecated Use calculateNatalChart instead */
export { SIGNS as _SIGNS } from './signs';
import { calculateNatalChart } from './engine';

export function getSunSign(birthDate: string) {
  return calculateNatalChart(birthDate, '12:00', 25, 121).sunSign;
}

export function getMoonSignApprox(birthDate: string) {
  return calculateNatalChart(birthDate, '12:00', 25, 121).moonSign;
}

export function getRisingSignApprox(birthTime: string) {
  return calculateNatalChart('2000-01-01', birthTime, 25, 121).risingSign;
}
