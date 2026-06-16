export interface UserProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: 'male' | 'female' | 'other';
}

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthPlace: '台北',
  gender: 'other',
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

export interface ZodiacSign {
  name: string;
  nameEn: string;
  symbol: string;
  element: string;
  dates: string;
  traits: string;
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
  palaces: ZiWeiPalace[];
}
