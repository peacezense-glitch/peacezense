import { Solar } from 'lunar-javascript';
import { calculateBaziFull } from '@/lib/bazi';
import { castHexagram } from '@/lib/iching';

const FORTUNE_TIPS = [
  '今日宜靜心思考，不宜衝動決策。',
  '貴人運旺，主動溝通可獲意外收穫。',
  '財運平穩，穩健理財勝過冒進投資。',
  '感情運佳，適合表達真實感受。',
  '學習運強，適合吸收新知與技能。',
  '健康需注意作息，避免過度勞累。',
  '創意靈感豐富，適合從事創作活動。',
  '人際關係和諧，團隊合作事半功倍。',
];

export interface DailyFortune {
  date: string;
  lunarDate: string;
  dayGanZhi: string;
  jieQi: string;
  tip: string;
  luckyColor: string;
  luckyDirection: string;
  luckyNumber: number;
  baziSummary: string;
  ichingHexagram: string;
}

const COLORS = ['紅色', '金色', '綠色', '藍色', '紫色', '白色', '黃色'];
const DIRECTIONS = ['東', '南', '西', '北', '東南', '西南', '東北', '西北'];

export function getDailyFortune(
  birthDate: string,
  birthTime: string,
  gender: string,
  options?: { longitude?: number; useTrueSolarTime?: boolean; birthPlace?: string },
): DailyFortune {
  const now = new Date();
  const solar = Solar.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();

  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const report = calculateBaziFull(birthDate, birthTime, gender, options);
  const hex = castHexagram(seed);

  return {
    date: solar.toYmd(),
    lunarDate: lunar.toString(),
    dayGanZhi: ec.getDay(),
    jieQi: lunar.getJieQi() || '',
    tip: FORTUNE_TIPS[seed % FORTUNE_TIPS.length],
    luckyColor: COLORS[seed % COLORS.length],
    luckyDirection: DIRECTIONS[seed % DIRECTIONS.length],
    luckyNumber: (seed % 9) + 1,
    baziSummary: `日主${report.chart.dayMaster}（${report.chart.dayMasterElement}），今日干支${ec.getDay()}。${report.currentLuck ? `行${report.currentLuck.ganZhi}大運。` : ''}`,
    ichingHexagram: `第${hex.number}卦 ${hex.name}`,
  };
}
