import { MayanSign } from '@/types';

const DAY_SIGNS = [
  { name: '紅龍', nameEn: 'Imix', meaning: '滋養、起源、母性能量' },
  { name: '白風', nameEn: 'Ik', meaning: '溝通、靈感、呼吸之氣' },
  { name: '藍夜', nameEn: 'Akbal', meaning: '夢境、直覺、內在探索' },
  { name: '黃種', nameEn: 'Kan', meaning: '播種、目標、生命力' },
  { name: '紅蛇', nameEn: 'Chicchan', meaning: '生命力、本能、蛻變' },
  { name: '白世界橋', nameEn: 'Cimi', meaning: '轉化、死亡與重生' },
  { name: '藍手', nameEn: 'Manik', meaning: '療癒、知識、完成' },
  { name: '黃星星', nameEn: 'Lamat', meaning: '優雅、藝術、和諧' },
  { name: '紅月', nameEn: 'Muluc', meaning: '淨化、流動、宇宙之水' },
  { name: '白狗', nameEn: 'Oc', meaning: '忠誠、愛、陪伴' },
  { name: '藍猴', nameEn: 'Chuen', meaning: '玩樂、創造、魔法' },
  { name: '黃人', nameEn: 'Eb', meaning: '自由意志、智慧、人性' },
  { name: '紅天行者', nameEn: 'Ben', meaning: '探索、空間、連結天地' },
  { name: '白巫師', nameEn: 'Ix', meaning: '永恆、施魔法、時間' },
  { name: '藍鷹', nameEn: 'Men', meaning: '遠見、心智、飛翔' },
  { name: '黃戰士', nameEn: 'Cib', meaning: '勇氣、質疑、智慧' },
  { name: '紅地球', nameEn: 'Caban', meaning: '導航、同步、根植' },
  { name: '白鏡', nameEn: 'Etznab', meaning: '反射、真相、無限' },
  { name: '藍風暴', nameEn: 'Cauac', meaning: '催化、轉化、能量釋放' },
  { name: '黃太陽', nameEn: 'Ahau', meaning: '光明、覺醒、宇宙意識' },
];

const TONES = [
  '磁性', '月亮', '電力', '自我存在', '超頻',
  '韻律', '共振', '銀河', '太陽', '行星',
  '光譜', '水晶', '宇宙',
];

export function calculateMayanSign(birthDate: string): MayanSign {
  const date = new Date(birthDate);
  const mayanEpoch = new Date(1960, 6, 26);
  const diffDays = Math.floor((date.getTime() - mayanEpoch.getTime()) / 86400000);
  const tzolkinIndex = ((diffDays % 260) + 260) % 260;

  const signIndex = tzolkinIndex % 20;
  const toneIndex = tzolkinIndex % 13;
  const sign = DAY_SIGNS[signIndex];

  return {
    number: toneIndex + 1,
    daySign: sign.name,
    daySignEn: sign.nameEn,
    meaning: sign.meaning,
    tone: TONES[toneIndex],
  };
}

export function getMayanKinDescription(sign: MayanSign): string {
  return `Kin ${sign.number}：${sign.tone}的${sign.daySign}（${sign.daySignEn}）。${sign.meaning}。這是你的瑪雅印記，指引你與宇宙節奏同步。`;
}
