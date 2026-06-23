export interface UserProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: 'male' | 'female' | 'other';
  longitude: number;
  useTrueSolarTime: boolean;
}

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthPlace: '台北',
  gender: 'other',
  longitude: 121.5654,
  useTrueSolarTime: true,
};

export interface BaziPillar {
  stem: string;
  branch: string;
  stemElement: string;
  branchElement: string;
}

export interface BaziChart {
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour: BaziPillar;
  dayMaster: string;
  dayMasterElement: string;
}

export interface BaziTenGod {
  pillar: string;
  stem: string;
  god: string;
  hidden: string;
  branchGod: string;
}

export interface BaziLuckPillar {
  ganZhi: string;
  startAge: number;
  endAge: number;
}

export interface BaziFullReport {
  chart: BaziChart;
  tenGods: BaziTenGod[];
  naYin: { year: string; month: string; day: string; hour: string };
  mingGong: string;
  shenGong: string;
  taiYuan: string;
  luckPillars: BaziLuckPillar[];
  currentLuck: BaziLuckPillar | null;
  currentAge: number;
  solarDate: string;
  lunarDate: string;
  jieQi: string;
  solarTimeNote?: string;
  correctedTime?: string;
}

export interface UsefulGodAnalysis {
  dayMaster: string;
  dayMasterElement: string;
  strength: string;
  isStrong: boolean;
  usefulElements: string[];
  avoidElements: string[];
  dominantElement: string;
  dominantCount: number;
  lackingElements: string[];
  elementTraits: Record<string, string>;
  summary: string;
}

export interface LifeAnalysisTopic {
  id: string;
  title: string;
  icon: string;
  summary: string;
  detail: string;
  keywords: string[];
}

export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

export interface ZodiacSign {
  name: string;
  nameEn: string;
  symbol: string;
  element: string;
  dates: string;
  traits: string;
}

export interface NatalPlanet {
  id: string;
  name: string;
  symbol: string;
  longitude: number;
  sign: ZodiacSign;
  degreeLabel: string;
}

export interface NatalAngle {
  longitude: number;
  sign: ZodiacSign;
  degreeLabel: string;
}

export interface NatalHouse {
  number: number;
  cuspLongitude: number;
  sign: ZodiacSign;
}

export interface NatalChart {
  planets: NatalPlanet[];
  ascendant: NatalAngle;
  midheaven: NatalAngle;
  houses: NatalHouse[];
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign: ZodiacSign;
  birthDateTime: string;
  latitude: number;
  longitude: number;
}

export interface MayanSign {
  number: number;
  daySign: string;
  daySignEn: string;
  meaning: string;
  tone: string;
}

export interface HumanDesignProfile {
  type: string;
  typeDescription: string;
  strategy: string;
  authority: string;
  profile: string;
  definedCenters: string[];
  undefinedCenters: string[];
}

export interface IChingLine {
  value: 6 | 7 | 8 | 9;
  isYang: boolean;
  isChanging: boolean;
}

export interface IChingHexagram {
  number: number;
  name: string;
  nameEn: string;
  upperTrigram: string;
  lowerTrigram: string;
  judgment: string;
  image: string;
  lines: IChingLine[];
}

export interface QiMenPlate {
  datetime: string;
  dun: '陽遁' | '陰遁';
  ju: number;
  zhiFu: string;
  zhiShi: string;
  palaces: QiMenPalace[];
}

export interface QiMenPalace {
  position: number;
  name: string;
  door: string;
  star: string;
  deity: string;
  stem: string;
}

export interface ZiWeiPalace {
  name: string;
  branch: string;
  mainStars: string[];
  minorStars: string[];
}

export interface ZiWeiChart {
  mingGong: string;
  shenGong: string;
  bureau: string;
  palaces: ZiWeiPalace[];
  gender: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface YearlyFlow {
  year: number;
  ganZhi: string;
  stem: string;
  branch: string;
  summary: string;
  topics: { area: string; rating: string; advice: string }[];
}
