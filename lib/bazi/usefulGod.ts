import { BaziChart, UsefulGodAnalysis } from '@/types';
import { getElementBalance } from './engine';

const GENERATES: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const CONTROLS: Record<string, string> = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };
const GENERATED_BY: Record<string, string> = { 木: '水', 火: '木', 土: '火', 金: '土', 水: '金' };
const CONTROLLED_BY: Record<string, string> = { 木: '金', 火: '水', 土: '木', 金: '火', 水: '土' };

const ELEMENT_TRAITS: Record<string, string> = {
  木: '成長、創造、仁慈、向上',
  火: '熱情、表達、禮儀、光明',
  土: '穩重、包容、信用、承載',
  金: '果斷、紀律、正義、革新',
  水: '智慧、靈活、溝通、適應',
};

export function analyzeUsefulGod(chart: BaziChart): UsefulGodAnalysis {
  const balance = getElementBalance(chart);
  const dm = chart.dayMasterElement;
  const self = balance[dm] ?? 0;
  const total = Object.values(balance).reduce((a, b) => a + b, 0);
  const isStrong = self >= total / 3;

  let useful: string[];
  let avoid: string[];
  let strength: string;

  if (isStrong) {
    useful = [GENERATES[dm], CONTROLS[dm], CONTROLLED_BY[dm]].filter(Boolean);
    avoid = [dm, GENERATED_BY[dm]];
    strength = '偏旺';
  } else {
    useful = [GENERATED_BY[dm], dm];
    avoid = [CONTROLS[dm], CONTROLLED_BY[dm]];
    strength = '偏弱';
  }

  const dominant = Object.entries(balance).sort((a, b) => b[1] - a[1])[0];
  const lacking = Object.entries(balance).filter(([, v]) => v === 0).map(([k]) => k);

  return {
    dayMaster: chart.dayMaster,
    dayMasterElement: dm,
    strength,
    isStrong,
    usefulElements: [...new Set(useful)],
    avoidElements: [...new Set(avoid)],
    dominantElement: dominant[0],
    dominantCount: dominant[1],
    lackingElements: lacking,
    elementTraits: ELEMENT_TRAITS,
    summary: buildSummary(chart.dayMaster, dm, strength, useful, lacking),
  };
}

function buildSummary(
  dayMaster: string,
  element: string,
  strength: string,
  useful: string[],
  lacking: string[],
): string {
  let s = `日主${dayMaster}（${element}）${strength}。`;
  s += `喜用${useful.join('、')}，宜補強這些能量以達平衡。`;
  if (lacking.length > 0) {
    s += `命局缺${lacking.join('、')}，可透過環境、色彩、方位或生活習慣適度補足。`;
  }
  return s;
}
