export type FeatureKey =
  | 'bazi.chart'
  | 'bazi.tenGods'
  | 'bazi.usefulGod'
  | 'bazi.lifeAnalysis'
  | 'bazi.luckPillars'
  | 'bazi.yearlyFlow'
  | 'bazi.fullReport'
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
  'ziwei.fullChart',
  'astrology.natalChart',
  'humanDesign.bodygraph',
  'iching.history',
  'qimen.datetime',
  'ai.chat',
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'monthly',
    name: '月度會員',
    price: 'NT$ 299',
    period: '/月',
    features: [
      '完整大運流年分析',
      '紫微斗數全盤解讀',
      '西洋占星本命盤',
      '人類圖 BodyGraph',
      '易經占卜紀錄',
      '奇門遁甲擇日',
      '每日深度運勢',
    ],
  },
  {
    id: 'yearly',
    name: '年度會員',
    price: 'NT$ 1,999',
    period: '/年',
    popular: true,
    features: [
      '包含月度會員所有功能',
      '完整命書 PDF 匯出',
      'AI 命理師對話（即將推出）',
      '優先體驗新功能',
      '省 33% 最划算',
    ],
  },
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
