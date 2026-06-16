import { ZodiacSign } from '@/types';

const SIGNS: ZodiacSign[] = [
  { name: '牡羊座', nameEn: 'Aries', symbol: '♈', element: '火', dates: '3/21 - 4/19', traits: '勇敢、熱情、開創力強' },
  { name: '金牛座', nameEn: 'Taurus', symbol: '♉', element: '土', dates: '4/20 - 5/20', traits: '穩重、務實、感官敏銳' },
  { name: '雙子座', nameEn: 'Gemini', symbol: '♊', element: '風', dates: '5/21 - 6/20', traits: '靈活、好奇、溝通能力佳' },
  { name: '巨蟹座', nameEn: 'Cancer', symbol: '♋', element: '水', dates: '6/21 - 7/22', traits: '感性、保護、直覺敏銳' },
  { name: '獅子座', nameEn: 'Leo', symbol: '♌', element: '火', dates: '7/23 - 8/22', traits: '自信、慷慨、領導魅力' },
  { name: '處女座', nameEn: 'Virgo', symbol: '♍', element: '土', dates: '8/23 - 9/22', traits: '細緻、分析、追求完美' },
  { name: '天秤座', nameEn: 'Libra', symbol: '♎', element: '風', dates: '9/23 - 10/22', traits: '和諧、公正、審美品味' },
  { name: '天蠍座', nameEn: 'Scorpio', symbol: '♏', element: '水', dates: '10/23 - 11/21', traits: '深刻、神秘、轉化力量' },
  { name: '射手座', nameEn: 'Sagittarius', symbol: '♐', element: '火', dates: '11/22 - 12/21', traits: '自由、樂觀、探索精神' },
  { name: '摩羯座', nameEn: 'Capricorn', symbol: '♑', element: '土', dates: '12/22 - 1/19', traits: '堅毅、野心、結構思維' },
  { name: '水瓶座', nameEn: 'Aquarius', symbol: '♒', element: '風', dates: '1/20 - 2/18', traits: '創新、獨立、人道關懷' },
  { name: '雙魚座', nameEn: 'Pisces', symbol: '♓', element: '水', dates: '2/19 - 3/20', traits: '夢幻、同理、靈性直覺' },
];

const SIGN_BOUNDARIES = [
  [3, 21], [4, 20], [5, 21], [6, 21], [7, 23], [8, 23],
  [9, 23], [10, 23], [11, 22], [12, 22], [1, 20], [2, 19],
];

export function getSunSign(birthDate: string): ZodiacSign {
  const [, month, day] = birthDate.split('-').map(Number);
  let index = 11;
  for (let i = 0; i < 12; i++) {
    const [m, d] = SIGN_BOUNDARIES[i];
    if (month === m && day >= d) index = i;
    else if (month === ((m % 12) + 1) && day < SIGN_BOUNDARIES[(i + 1) % 12][1]) index = i;
  }
  if (month === 12 && day >= 22) index = 9;
  if (month === 1 && day < 20) index = 9;
  if (month === 1 && day >= 20) index = 10;
  if (month === 2 && day < 19) index = 10;
  if (month === 2 && day >= 19) index = 11;
  if (month === 3 && day < 21) index = 11;
  return SIGNS[index];
}

export function getRisingSignApprox(birthTime: string): ZodiacSign {
  const [hour] = birthTime.split(':').map(Number);
  const index = Math.floor(((hour + 6) % 24) / 2) % 12;
  return SIGNS[index];
}

export function getMoonSignApprox(birthDate: string): ZodiacSign {
  const date = new Date(birthDate);
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = Math.floor((dayOfYear * 12) / 365) % 12;
  return SIGNS[index];
}

export function getAstrologyReading(sun: ZodiacSign, moon: ZodiacSign, rising: ZodiacSign): string {
  return `太陽${sun.name}賦予你${sun.traits}的特質；月亮${moon.name}影響你的內在情感世界；上升${rising.name}則是你展現給世界的面貌。三者結合，勾勒出你獨特的宇宙藍圖。`;
}
