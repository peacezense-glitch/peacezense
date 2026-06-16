import { BaziChart, BaziPillar } from '@/types';

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const STEM_ELEMENTS = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
const BRANCH_ELEMENTS = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'];

const MONTH_BRANCHES = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];

function createPillar(stemIndex: number, branchIndex: number): BaziPillar {
  const si = ((stemIndex % 10) + 10) % 10;
  const bi = ((branchIndex % 12) + 12) % 12;
  return {
    stem: STEMS[si],
    branch: BRANCHES[bi],
    stemElement: STEM_ELEMENTS[si],
    branchElement: BRANCH_ELEMENTS[bi],
  };
}

function getYearPillar(year: number): BaziPillar {
  return createPillar(year - 4, year - 4);
}

function getMonthPillar(year: number, month: number): BaziPillar {
  const yearStem = ((year - 4) % 10 + 10) % 10;
  const monthStemBase = (yearStem % 5) * 2;
  const monthStem = (monthStemBase + month) % 10;
  const branchIndex = MONTH_BRANCHES.indexOf(MONTH_BRANCHES[month - 1]);
  return createPillar(monthStem, branchIndex);
}

function getDayPillar(date: Date): BaziPillar {
  const base = new Date(1900, 0, 31);
  const diff = Math.floor((date.getTime() - base.getTime()) / 86400000);
  return createPillar(diff + 6, diff + 6);
}

function getHourPillar(dayStemIndex: number, hour: number): BaziPillar {
  const branchIndex = Math.floor((hour + 1) / 2) % 12;
  const hourStemBase = (dayStemIndex % 5) * 2;
  const hourStem = (hourStemBase + branchIndex) % 10;
  return createPillar(hourStem, branchIndex);
}

export function calculateBazi(birthDate: string, birthTime: string): BaziChart {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour] = birthTime.split(':').map(Number);
  const date = new Date(year, month - 1, day);

  const yearPillar = getYearPillar(year);
  const monthPillar = getMonthPillar(year, month);
  const dayPillar = getDayPillar(date);
  const dayStemIndex = STEMS.indexOf(dayPillar.stem);
  const hourPillar = getHourPillar(dayStemIndex, hour);

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    dayMaster: dayPillar.stem,
    dayMasterElement: dayPillar.stemElement,
  };
}

export function getElementBalance(chart: BaziChart): Record<string, number> {
  const elements: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const pillars = [chart.year, chart.month, chart.day, chart.hour];
  for (const p of pillars) {
    elements[p.stemElement]++;
    elements[p.branchElement]++;
  }
  return elements;
}

export function getDayMasterAnalysis(chart: BaziChart): string {
  const balance = getElementBalance(chart);
  const dm = chart.dayMasterElement;
  const supporting = balance[dm] ?? 0;
  const total = Object.values(balance).reduce((a, b) => a + b, 0);
  if (supporting >= total / 3) {
    return `日主${chart.dayMaster}（${dm}）偏旺，宜洩耗制化，發揮${dm}之特質。`;
  }
  return `日主${chart.dayMaster}（${dm}）偏弱，宜生扶比助，培養內在${dm}能量。`;
}
