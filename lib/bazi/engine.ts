import { Solar } from 'lunar-javascript';
import {
  BaziChart,
  BaziPillar,
  BaziTenGod,
  BaziLuckPillar,
  BaziFullReport,
} from '@/types';
import { correctToTrueSolarTime, formatSolarTimeNote } from '@/lib/solarTime';
import { getLongitudeForPlace } from '@/constants/Cities';

const STEM_ELEMENTS: Record<string, string> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};
const BRANCH_ELEMENTS: Record<string, string> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};

function parsePillar(ganZhi: string): BaziPillar {
  const stem = ganZhi[0];
  const branch = ganZhi[1];
  return {
    stem,
    branch,
    stemElement: STEM_ELEMENTS[stem] ?? '',
    branchElement: BRANCH_ELEMENTS[branch] ?? '',
  };
}

function normalizeTenGod(god: string): string {
  const map: Record<string, string> = {
    劫财: '劫財', 伤官: '傷官', 偏财: '偏財', 正财: '正財',
    七杀: '七殺', 偏印: '偏印', 正印: '正印', 比肩: '比肩',
    食神: '食神', 正官: '正官', 偏官: '偏官', 日主: '日主',
  };
  return map[god] ?? god;
}

function genderToSect(gender: string): number {
  return gender === 'female' ? 0 : 1;
}

export function calculateBaziFull(
  birthDate: string,
  birthTime: string,
  gender: string,
  options?: { longitude?: number; useTrueSolarTime?: boolean; birthPlace?: string },
): BaziFullReport {
  const longitude = getLongitudeForPlace(
    options?.birthPlace ?? '',
    options?.longitude,
  );
  const useCorrection = options?.useTrueSolarTime ?? true;
  const corrected = correctToTrueSolarTime(birthDate, birthTime, longitude, useCorrection);

  const [year, month, day] = corrected.date.split('-').map(Number);
  const [hour, minute = 0] = corrected.time.split(':').map(Number);
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();

  const chart: BaziChart = {
    year: parsePillar(ec.getYear()),
    month: parsePillar(ec.getMonth()),
    day: parsePillar(ec.getDay()),
    hour: parsePillar(ec.getTime()),
    dayMaster: ec.getDayGan(),
    dayMasterElement: STEM_ELEMENTS[ec.getDayGan()] ?? '',
  };

  const tenGods: BaziTenGod[] = [
    { pillar: '年', stem: chart.year.stem, god: normalizeTenGod(ec.getYearShiShenGan()), hidden: String(ec.getYearHideGan()), branchGod: String(ec.getYearShiShenZhi()) },
    { pillar: '月', stem: chart.month.stem, god: normalizeTenGod(ec.getMonthShiShenGan()), hidden: String(ec.getMonthHideGan()), branchGod: String(ec.getMonthShiShenZhi()) },
    { pillar: '日', stem: chart.day.stem, god: '日主', hidden: String(ec.getDayHideGan()), branchGod: String(ec.getDayShiShenZhi()) },
    { pillar: '時', stem: chart.hour.stem, god: normalizeTenGod(ec.getTimeShiShenGan()), hidden: String(ec.getTimeHideGan()), branchGod: String(ec.getTimeShiShenZhi()) },
  ];

  const yun = ec.getYun(genderToSect(gender));
  const luckPillars: BaziLuckPillar[] = yun.getDaYun()
    .filter((d: { getGanZhi: () => string }) => d.getGanZhi())
    .map((d: { getGanZhi: () => string; getStartAge: () => number; getEndAge: () => number }) => ({
      ganZhi: d.getGanZhi(),
      startAge: d.getStartAge(),
      endAge: d.getEndAge(),
    }));

  const currentYear = new Date().getFullYear();
  const birthYear = year;
  const currentAge = currentYear - birthYear;

  let currentLuck: BaziLuckPillar | null = null;
  for (const lp of luckPillars) {
    if (currentAge >= lp.startAge && currentAge <= lp.endAge) {
      currentLuck = lp;
      break;
    }
  }

  return {
    chart,
    tenGods,
    naYin: {
      year: ec.getYearNaYin(),
      month: ec.getMonthNaYin(),
      day: ec.getDayNaYin(),
      hour: ec.getTimeNaYin(),
    },
    mingGong: ec.getMingGong(),
    shenGong: ec.getShenGong(),
    taiYuan: ec.getTaiYuan(),
    luckPillars,
    currentLuck,
    currentAge,
    solarDate: solar.toYmd(),
    lunarDate: lunar.toString(),
    jieQi: lunar.getJieQi() || lunar.getPrevJieQi()?.getName() || '',
    solarTimeNote: formatSolarTimeNote(corrected.offsetMinutes, longitude),
    correctedTime: corrected.time,
  };
}

export function getElementBalance(chart: BaziChart): Record<string, number> {
  const elements: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const pillars = [chart.year, chart.month, chart.day, chart.hour];
  for (const p of pillars) {
    if (p.stemElement) elements[p.stemElement]++;
    if (p.branchElement) elements[p.branchElement]++;
  }
  return elements;
}
