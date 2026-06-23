import { Solar } from 'lunar-javascript';
import { ZiWeiChart, ZiWeiPalace } from '@/types';

const PALACE_NAMES = [
  '命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄',
  '遷移', '交友', '官祿', '田宅', '福德', '父母',
];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const ZIWEI_TABLE: Record<number, number[]> = {
  2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0],
  3: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0],
  4: [14, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0],
  5: [13, 14, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0],
  6: [12, 13, 14, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
};

const BUREAU_BY_NAYIN: Record<string, number> = {
  金: 4, 水: 2, 火: 6, 土: 5, 木: 3,
};

const MAIN_STAR_ORDER = [
  '紫微', '天機', '太陽', '武曲', '天同', '廉貞',
  '天府', '太陰', '貪狼', '巨門', '天相', '天梁', '七殺', '破軍',
];

function getHourBranchIndex(hour: number): number {
  return Math.floor((hour + 1) / 2) % 12;
}

function getLunarMonth(birthDate: string, birthTime: string): number {
  const [y, m, d] = birthDate.split('-').map(Number);
  const [h, mi] = birthTime.split(':').map(Number);
  return Solar.fromYmdHms(y, m, d, h, mi, 0).getLunar().getMonth();
}

function getMingShenIndex(lunarMonth: number, hourIndex: number): { ming: number; shen: number } {
  const ming = (2 + (lunarMonth - 1) - hourIndex + 12) % 12;
  const shen = (2 + (lunarMonth - 1) + hourIndex) % 12;
  return { ming, shen };
}

function getBureau(mingBranch: number, mingPalaceIndex: number): number {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const stemIdx = (mingBranch * 2 + mingPalaceIndex) % 10;
  const stem = stems[stemIdx];
  const element = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' }[stem] ?? '土';
  return BUREAU_BY_NAYIN[element] ?? 5;
}

function placeZiWeiStars(birthDay: number, bureau: number, mingIndex: number): Map<number, string[]> {
  const stars = new Map<number, string[]>();
  const add = (idx: number, star: string) => {
    const i = ((idx % 12) + 12) % 12;
    stars.set(i, [...(stars.get(i) ?? []), star]);
  };

  const table = ZIWEI_TABLE[bureau] ?? ZIWEI_TABLE[5];
  const ziweiPos = table[(birthDay - 1) % 16] ?? 0;

  add(mingIndex + ziweiPos, '紫微');
  add(mingIndex + ziweiPos + 1, '天機');
  add(mingIndex + ziweiPos + 3, '太陽');
  add(mingIndex + ziweiPos + 4, '武曲');
  add(mingIndex + ziweiPos + 5, '天同');
  add(mingIndex + ziweiPos + 8, '廉貞');

  const tianfuPos = (12 - ziweiPos) % 12;
  add(mingIndex + tianfuPos, '天府');
  add(mingIndex + tianfuPos + 1, '太陰');
  add(mingIndex + tianfuPos + 2, '貪狼');
  add(mingIndex + tianfuPos + 3, '巨門');
  add(mingIndex + tianfuPos + 4, '天相');
  add(mingIndex + tianfuPos + 5, '天梁');
  add(mingIndex + tianfuPos + 6, '七殺');
  add(mingIndex + (tianfuPos + 10) % 12, '破軍');

  return stars;
}

function placeMinorStars(
  birthYear: number,
  hourIndex: number,
  mingIndex: number,
): Map<number, string[]> {
  const stars = new Map<number, string[]>();
  const add = (idx: number, star: string) => {
    const i = ((idx % 12) + 12) % 12;
    stars.set(i, [...(stars.get(i) ?? []), star]);
  };

  const yearStem = (birthYear - 4) % 10;
  add(mingIndex + yearStem, '祿存');
  add(mingIndex + hourIndex, '文昌');
  add(mingIndex + (10 - hourIndex), '文曲');

  if (yearStem % 2 === 0) {
    add(mingIndex + 1, '擎羊');
    add(mingIndex + 7, '陀羅');
  }

  return stars;
}

export function calculateZiWei(birthDate: string, birthTime: string, gender: string): ZiWeiChart {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour] = birthTime.split(':').map(Number);
  const lunarMonth = getLunarMonth(birthDate, birthTime);
  const hourIndex = getHourBranchIndex(hour);
  const { ming, shen } = getMingShenIndex(lunarMonth, hourIndex);

  const bureau = getBureau(ming, ming);
  const mainStars = placeZiWeiStars(day, bureau, 0);
  const minorStars = placeMinorStars(year, hourIndex, ming);

  const palaces: ZiWeiPalace[] = PALACE_NAMES.map((name, i) => {
    const branchIndex = (ming - i + 12) % 12;
    const main = mainStars.get(branchIndex) ?? [];
    const minor = minorStars.get(branchIndex) ?? [];
    return { name, branch: BRANCHES[branchIndex], mainStars: main, minorStars: minor };
  });

  const shenPalaceIndex = (ming - shen + 12) % 12;

  return {
    mingGong: `${BRANCHES[ming]}`,
    shenGong: `${PALACE_NAMES[shenPalaceIndex]}（${BRANCHES[shen]}）`,
    bureau: `${bureau}局`,
    palaces,
    gender,
  };
}

export function getZiWeiSummary(chart: ZiWeiChart): string {
  const ming = chart.palaces[0];
  const stars = ming.mainStars.join('、') || '空宮';
  return `命宮在${ming.branch}，${chart.bureau}，主星${stars}。身宮在${chart.shenGong}。`;
}

export function getPalaceAnalysis(palace: ZiWeiPalace): string {
  const analyses: Record<string, string> = {
    命宮: '代表先天性格、人生格局與整體運勢走向。',
    兄弟: '代表手足關係、合夥人與平輩互動。',
    夫妻: '代表婚姻感情、配偶特質與親密關係。',
    子女: '代表子嗣、晚輩與創造力表現。',
    財帛: '代表金錢觀、收入來源與理財能力。',
    疾厄: '代表健康體質、潛在疾病與身心狀態。',
    遷移: '代表外出運、環境變化與人際拓展。',
    交友: '代表朋友關係、下屬與社交圈。',
    官祿: '代表事業發展、工作成就與社會地位。',
    田宅: '代表不動產、家庭環境與居住品質。',
    福德: '代表精神生活、興趣嗜好與內心幸福感。',
    父母: '代表與長輩的緣分、遺傳與早年環境。',
  };
  const base = analyses[palace.name] ?? '';
  if (palace.mainStars.length === 0) return `${base}此宮空宮，受對宮影響較大。`;
  return `${base}主星${palace.mainStars.join('、')}坐守，展現此領域的核心能量。`;
}
