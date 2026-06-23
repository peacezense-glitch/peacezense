import { Solar } from 'lunar-javascript';
import { calculateBaziFull } from './engine';
import { analyzeUsefulGod } from './usefulGod';
import { BaziChart } from '@/types';

export interface DateEventType {
  id: string;
  name: string;
  description: string;
  preferredElements: string[];
}

export const DATE_EVENT_TYPES: DateEventType[] = [
  { id: 'wedding', name: '結婚嫁娶', description: '宜合日、贵人日，忌冲夫妻生肖', preferredElements: ['土', '金'] },
  { id: 'moving', name: '搬家入宅', description: '宜开日、成日，忌冲宅主生肖', preferredElements: ['土', '水'] },
  { id: 'business', name: '開業開張', description: '宜成日、开日，利财星当令', preferredElements: ['火', '金'] },
  { id: 'contract', name: '簽約交易', description: '宜成日、定日，忌破日', preferredElements: ['金', '水'] },
  { id: 'travel', name: '出行旅遊', description: '宜驿马日、天马日，忌煞日', preferredElements: ['水', '木'] },
  { id: 'renovation', name: '動土裝修', description: '宜开日、成日，忌冲太岁', preferredElements: ['土', '火'] },
  { id: 'medical', name: '醫療手術', description: '宜天医日，忌破日、绝日', preferredElements: ['木', '水'] },
  { id: 'dating', name: '相親約會', description: '宜桃花日、合日', preferredElements: ['火', '水'] },
];

export interface AuspiciousDate {
  date: string;
  ganZhi: string;
  score: number;
  rating: '大吉' | '吉' | '平' | '凶';
  reasons: string[];
  lunarDate: string;
}

const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const CLASH: Record<string, string> = {
  子: '午', 丑: '未', 寅: '申', 卯: '酉', 辰: '戌', 巳: '亥',
  午: '子', 未: '丑', 申: '寅', 酉: '卯', 戌: '辰', 亥: '巳',
};

const GENERATES: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const CONTROLS: Record<string, string> = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };

function getDayPillar(dateStr: string): { stem: string; branch: string; stemElement: string } {
  const [y, m, d] = dateStr.split('-').map(Number);
  const solar = Solar.fromYmd(y, m, d);
  const ec = solar.getLunar().getEightChar();
  const gz = ec.getDay();
  const STEM_EL: Record<string, string> = {
    甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
    己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
  };
  const BR_EL: Record<string, string> = {
    子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
    午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
  };
  return {
    stem: gz[0],
    branch: gz[1],
    stemElement: STEM_EL[gz[0]] ?? '',
  };
}

function scoreDate(
  dateStr: string,
  userChart: BaziChart,
  usefulElements: string[],
  avoidElements: string[],
  event: DateEventType,
): { score: number; reasons: string[] } {
  const day = getDayPillar(dateStr);
  const reasons: string[] = [];
  let score = 60;

  if (usefulElements.includes(day.stemElement)) {
    score += 15;
    reasons.push(`日干五行${day.stemElement}為喜用，利於此事`);
  }
  if (avoidElements.includes(day.stemElement)) {
    score -= 15;
    reasons.push(`日干五行${day.stemElement}為忌神，宜避`);
  }
  if (event.preferredElements.includes(day.stemElement)) {
    score += 8;
    reasons.push(`五行${day.stemElement}利於${event.name}`);
  }

  const userBranches = [userChart.year.branch, userChart.month.branch, userChart.day.branch, userChart.hour.branch];
  if (CLASH[day.branch] && userBranches.includes(CLASH[day.branch])) {
    score -= 25;
    reasons.push(`日支${day.branch}冲命盘，大凶，切忌`);
  } else if (!reasons.some((r) => r.includes('冲'))) {
    score += 5;
    reasons.push('无冲煞，日子平和');
  }

  const dm = userChart.dayMasterElement;
  if (GENERATES[dm] === day.stemElement) {
    score += 8;
    reasons.push('日干泄秀，适合表达与开创');
  }
  if (CONTROLS[dm] === day.stemElement) {
    score -= 5;
  }

  const [y, m, d] = dateStr.split('-').map(Number);
  const solar = Solar.fromYmd(y, m, d);
  const jieQi = solar.getLunar().getJieQi();
  if (jieQi) {
    score -= 3;
    reasons.push(`逢节气${jieQi}，气场转换，宜谨慎`);
  }

  const dow = new Date(dateStr).getDay();
  if (event.id === 'business' && (dow === 1 || dow === 3 || dow === 5)) {
    score += 5;
    reasons.push('工作日开业，利人气聚集');
  }
  if (event.id === 'wedding' && (dow === 0 || dow === 6)) {
    score += 5;
    reasons.push('周末嫁娶，方便宾客');
  }

  return { score: Math.max(0, Math.min(100, score)), reasons };
}

function scoreToRating(score: number): AuspiciousDate['rating'] {
  if (score >= 85) return '大吉';
  if (score >= 70) return '吉';
  if (score >= 50) return '平';
  return '凶';
}

export function findAuspiciousDates(
  birthDate: string,
  birthTime: string,
  gender: string,
  eventId: string,
  startDate: string,
  days: number,
  options?: { longitude?: number; useTrueSolarTime?: boolean; birthPlace?: string },
  limit = 10,
): AuspiciousDate[] {
  const report = calculateBaziFull(birthDate, birthTime, gender, options);
  const useful = analyzeUsefulGod(report.chart);
  const event = DATE_EVENT_TYPES.find((e) => e.id === eventId) ?? DATE_EVENT_TYPES[0];

  const results: AuspiciousDate[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;

    const { score, reasons } = scoreDate(
      dateStr,
      report.chart,
      useful.usefulElements,
      useful.avoidElements,
      event,
    );

    const pillar = getDayPillar(dateStr);
    const lunar = Solar.fromYmd(y, d.getMonth() + 1, d.getDate()).getLunar().toString();

    results.push({
      date: dateStr,
      ganZhi: pillar.stem + pillar.branch,
      score,
      rating: scoreToRating(score),
      reasons,
      lunarDate: lunar,
    });
  }

  return results
    .filter((r) => r.rating !== '凶')
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getDateSelectionSummary(
  eventId: string,
  topDate: AuspiciousDate,
): string {
  const event = DATE_EVENT_TYPES.find((e) => e.id === eventId);
  return `就「${event?.name ?? '此事'}」而言，${topDate.date}（${topDate.ganZhi}日）為首選吉日，評分 ${topDate.score} 分（${topDate.rating}）。${topDate.reasons[0] ?? ''}`;
}
