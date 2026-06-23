import { ZodiacSign } from '@/types';

export const SIGNS: ZodiacSign[] = [
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

export const SIGN_COLORS = [
  '#E74C3C', '#2ECC71', '#F39C12', '#3498DB',
  '#E74C3C', '#2ECC71', '#F39C12', '#3498DB',
  '#E74C3C', '#2ECC71', '#F39C12', '#3498DB',
];

export const ELEMENT_COLORS: Record<string, string> = {
  火: '#E74C3C',
  土: '#8B7355',
  風: '#F39C12',
  水: '#3498DB',
};

export function longitudeToSign(longitude: number): ZodiacSign {
  const index = Math.floor(((longitude % 360) + 360) % 360 / 30) % 12;
  return SIGNS[index];
}

export function formatDegree(longitude: number): string {
  const norm = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const deg = Math.floor(norm % 30);
  const min = Math.floor((norm % 1) * 60);
  return `${deg}°${String(min).padStart(2, '0')}' ${SIGNS[signIndex].symbol}`;
}
