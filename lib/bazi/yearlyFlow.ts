import { Solar } from 'lunar-javascript';
import { BaziFullReport, YearlyFlow } from '@/types';
import { calculateBaziFull } from './engine';
import { analyzeUsefulGod } from './usefulGod';

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const AREA_ADVICE: Record<string, (stem: string, branch: string, useful: string[]) => string> = {
  事業: (stem, branch, useful) => {
    if (['甲', '乙', '丙', '丁'].includes(stem)) return '木火流年利於開創與表達，適合推進新計畫。';
    if (['庚', '辛'].includes(stem)) return '金年利於決策與執行，把握改革時機。';
    return '穩健前行，累積實力等待時機。';
  },
  財運: (_stem, _branch, useful) =>
    `流年財運與${useful.join('、')}能量相關，順勢而為可獲穩定收益。`,
  感情: (stem, branch) => {
    if (['子', '午', '卯', '酉'].includes(branch)) return '桃花能量活躍，單身者易遇緣分，有伴者注意溝通。';
    return '感情運平穩，用心經營勝過追求刺激。';
  },
  健康: (_stem, _branch, useful) =>
    `注意${useful[0] ?? '土'}氣相關的臟腑保養，規律作息為上。`,
};

export function getYearlyFlow(
  report: BaziFullReport,
  year: number = new Date().getFullYear(),
): YearlyFlow {
  const yearIndex = year - 4;
  const stem = STEMS[((yearIndex % 10) + 10) % 10];
  const branch = BRANCHES[((yearIndex % 12) + 12) % 12];
  const ganZhi = stem + branch;
  const useful = analyzeUsefulGod(report.chart);

  const stemElement = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' }[stem] ?? '';
  const isFavorable = useful.usefulElements.includes(stemElement);

  const topics = ['事業', '財運', '感情', '健康'].map((area) => ({
    area,
    rating: isFavorable ? '★★★★☆' : '★★★☆☆',
    advice: AREA_ADVICE[area](stem, branch, useful.usefulElements),
  }));

  const solar = Solar.fromYmd(year, 6, 1);
  const yearGod = solar.getLunar().getEightChar().getYearShiShenGan();

  return {
    year,
    ganZhi,
    stem,
    branch,
    summary: `${year}年干支${ganZhi}。${isFavorable ? '流年與喜用神呼應，整體運勢偏順。' : '流年與命局形成制化，宜謹慎應對、穩中求進。'}${report.currentLuck ? `當前行${report.currentLuck.ganZhi}大運。` : ''}流年十神近似${yearGod}。`,
    topics,
  };
}

export function getYearlyFlows(
  birthDate: string,
  birthTime: string,
  gender: string,
  options?: { longitude?: number; useTrueSolarTime?: boolean; birthPlace?: string },
  count = 3,
): YearlyFlow[] {
  const report = calculateBaziFull(birthDate, birthTime, gender, options);
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => getYearlyFlow(report, currentYear + i));
}
