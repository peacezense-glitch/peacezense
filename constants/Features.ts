export type FeatureKey =
  | 'bazi.chart'
  | 'bazi.tenGods'
  | 'bazi.usefulGod'
  | 'bazi.lifeAnalysis'
  | 'bazi.luckPillars'
  | 'bazi.yearlyFlow'
  | 'bazi.fullReport'
  | 'bazi.dateSelection'
  | 'ziwei.fullChart'
  | 'astrology.natalChart'
  | 'humanDesign.bodygraph'
  | 'iching.history'
  | 'qimen.datetime'
  | 'daily.fortune'
  | 'ai.chat';

export const FREE_FEATURES: FeatureKey[] = [
  'bazi.chart',
  'bazi.tenGods',
  'bazi.usefulGod',
  'bazi.lifeAnalysis',
  'daily.fortune',
];

export const PREMIUM_FEATURES: FeatureKey[] = [
  'bazi.luckPillars',
  'bazi.yearlyFlow',
  'bazi.fullReport',
  'bazi.dateSelection',
  'ziwei.fullChart',
  'astrology.natalChart',
  'humanDesign.bodygraph',
  'iching.history',
  'qimen.datetime',
  'ai.chat',
];

export function isFeatureFree(feature: FeatureKey): boolean {
  return FREE_FEATURES.includes(feature);
}

export function getFeatureLabel(feature: FeatureKey): string {
  const labels: Record<FeatureKey, string> = {
    'bazi.chart': '八字命盤',
    'bazi.tenGods': '十神分析',
    'bazi.usefulGod': '喜用神',
    'bazi.lifeAnalysis': '人生專題',
    'bazi.luckPillars': '大運分析',
    'bazi.yearlyFlow': '流年運勢',
    'bazi.fullReport': '完整命書',
    'bazi.dateSelection': '八字擇日進階',
    'ziwei.fullChart': '紫微全盤',
    'astrology.natalChart': '本命星盤',
    'humanDesign.bodygraph': '人類圖',
    'iching.history': '占卜紀錄',
    'qimen.datetime': '奇門擇日',
    'daily.fortune': '每日運勢',
    'ai.chat': 'AI 命理師',
  };
  return labels[feature] ?? feature;
}
