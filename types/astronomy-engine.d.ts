declare module 'astronomy-engine' {
  export class AstroTime {
    date: Date;
    ut: number;
    tt: number;
  }
  export function MakeTime(date: Date): AstroTime;
  export class Observer {
    constructor(latitude: number, longitude: number, height: number);
  }
  export enum Body {
    Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn,
  }
  export function Equator(
    body: Body,
    time: AstroTime,
    observer: Observer,
    ofdate: boolean,
    aberration: boolean,
  ): { vec: { x: number; y: number; z: number } };
  export function Ecliptic(vec: { x: number; y: number; z: number }): { elon: number; elat: number };
  export function SunPosition(time: AstroTime): { elon: number };
  export function EclipticGeoMoon(time: AstroTime): { lon: number };
  export function SiderealTime(time: AstroTime): number;
}
