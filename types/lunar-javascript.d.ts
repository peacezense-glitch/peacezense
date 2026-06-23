declare module 'lunar-javascript' {
  export class Solar {
    static fromYmdHms(y: number, m: number, d: number, h: number, mi: number, s: number): Solar;
    static fromYmd(y: number, m: number, d: number): Solar;
    getLunar(): Lunar;
    toYmd(): string;
  }
  export class Lunar {
    getEightChar(): EightChar;
    getMonth(): number;
    toString(): string;
    getJieQi(): string;
    getPrevJieQi(): { getName(): string } | null;
  }
  export class EightChar {
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
    getDayGan(): string;
    getYearShiShenGan(): string;
    getMonthShiShenGan(): string;
    getTimeShiShenGan(): string;
    getYearHideGan(): string;
    getMonthHideGan(): string;
    getDayHideGan(): string;
    getTimeHideGan(): string;
    getYearShiShenZhi(): string;
    getMonthShiShenZhi(): string;
    getDayShiShenZhi(): string;
    getTimeShiShenZhi(): string;
    getYearNaYin(): string;
    getMonthNaYin(): string;
    getDayNaYin(): string;
    getTimeNaYin(): string;
    getMingGong(): string;
    getShenGong(): string;
    getTaiYuan(): string;
    getYun(gender: number): Yun;
  }
  export class Yun {
    getDaYun(): DaYun[];
  }
  export class DaYun {
    getGanZhi(): string;
    getStartAge(): number;
    getEndAge(): number;
  }
}
