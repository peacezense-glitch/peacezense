import { ZiWeiChart, ZiWeiPalace } from '@/types';

const PALACE_NAMES = [
  '命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄',
  '遷移', '交友', '官祿', '田宅', '福德', '父母',
];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const MAIN_STARS = [
  '紫微', '天機', '太陽', '武曲', '天同', '廉貞',
  '天府', '太陰', '貪狼', '巨門', '天相', '天梁', '七殺', '破軍',
];
const MINOR_STARS = [
  '文昌', '文曲', '左輔', '右弼', '天魁', '天鉞',
  '祿存', '天馬', '擎羊', '陀羅', '火星', '鈴星',
];

function assignStars(seed: number, count: number, pool: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.abs(seed + i * 7) % pool.length;
    if (!result.includes(pool[idx])) {
      result.push(pool[idx]);
    }
  }
  return result;
}

export function calculateZiWei(birthDate: string, birthTime: string, gender: string): ZiWeiChart {
  const date = new Date(`${birthDate}T${birthTime}`);
  const seed = date.getTime();
  const monthBranch = BRANCHES[(date.getMonth() + 2) % 12];
  const hourBranch = BRANCHES[Math.floor((date.getHours() + 1) / 2) % 12];

  const mingIndex = Math.abs(seed) % 12;
  const shenIndex = (mingIndex + 6) % 12;

  const palaces: ZiWeiPalace[] = PALACE_NAMES.map((name, i) => {
    const branchIndex = (mingIndex + i) % 12;
    const palaceSeed = seed + i * 1000;
    return {
      name,
      branch: BRANCHES[branchIndex],
      mainStars: assignStars(palaceSeed, 1 + (i % 3), MAIN_STARS),
      minorStars: assignStars(palaceSeed + 500, i % 4, MINOR_STARS),
    };
  });

  return {
    mingGong: `${PALACE_NAMES[0]}（${BRANCHES[mingIndex]}）`,
    shenGong: `${PALACE_NAMES[(shenIndex - mingIndex + 12) % 12]}（${BRANCHES[shenIndex]}）`,
    palaces,
  };
}

export function getZiWeiSummary(chart: ZiWeiChart): string {
  const ming = chart.palaces[0];
  const stars = ming.mainStars.join('、');
  return `命宮在${ming.branch}，主星${stars}。身宮在${chart.shenGong}。命宮主星決定先天格局，身宮則反映後天行運傾向。`;
}
