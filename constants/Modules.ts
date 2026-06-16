export type ModuleCategory = 'life' | 'event';

export interface ModuleDefinition {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  category: ModuleCategory;
  icon: { ios: string; android: string; web: string };
  route: string;
  color: string;
}

export const LIFE_MODULES: ModuleDefinition[] = [
  {
    id: 'bazi',
    title: '八字',
    titleEn: 'Bazi',
    description: '四柱命理，洞察先天命格與大運流年',
    category: 'life',
    icon: { ios: 'square.grid.3x3.fill', android: 'grid_view', web: 'grid_view' },
    route: '/modules/bazi',
    color: '#8B4513',
  },
  {
    id: 'ziwei',
    title: '紫微斗數',
    titleEn: 'Zi Wei',
    description: '星曜宮位，解析人生各面向際遇',
    category: 'life',
    icon: { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
    route: '/modules/ziwei',
    color: '#6B4E9B',
  },
  {
    id: 'human-design',
    title: '人類圖',
    titleEn: 'Human Design',
    description: '能量類型與內在權威，活出真我設計',
    category: 'life',
    icon: { ios: 'figure.stand', android: 'accessibility_new', web: 'accessibility_new' },
    route: '/modules/human-design',
    color: '#C9A962',
  },
  {
    id: 'astrology',
    title: '占星',
    titleEn: 'Astrology',
    description: '西洋星座與行星相位，探索宇宙藍圖',
    category: 'life',
    icon: { ios: 'moon.stars.fill', android: 'nightlight', web: 'nightlight' },
    route: '/modules/astrology',
    color: '#4A6FA5',
  },
  {
    id: 'mayan',
    title: '瑪雅曆法',
    titleEn: 'Mayan Calendar',
    description: 'Tzolkin 神聖曆，連結宇宙能量印記',
    category: 'life',
    icon: { ios: 'sun.max.fill', android: 'wb_sunny', web: 'wb_sunny' },
    route: '/modules/mayan',
    color: '#D4763A',
  },
];

export const EVENT_MODULES: ModuleDefinition[] = [
  {
    id: 'iching',
    title: '易經占卜',
    titleEn: 'I Ching',
    description: '六十四卦智慧，為當下指引方向',
    category: 'event',
    icon: { ios: 'hexagon.fill', android: 'hexagon', web: 'hexagon' },
    route: '/modules/iching',
    color: '#2E7D5A',
  },
  {
    id: 'qimen',
    title: '奇門遁甲',
    titleEn: 'Qi Men',
    description: '時空格局，擇吉避凶與決策輔助',
    category: 'event',
    icon: { ios: 'compass.drawing', android: 'explore', web: 'explore' },
    route: '/modules/qimen',
    color: '#8B2942',
  },
];

export const ALL_MODULES = [...LIFE_MODULES, ...EVENT_MODULES];
