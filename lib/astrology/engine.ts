import {
  MakeTime,
  Observer,
  Body,
  Equator,
  Ecliptic,
  SunPosition,
  EclipticGeoMoon,
  SiderealTime,
} from 'astronomy-engine';
import { NatalChart, NatalPlanet, ZodiacSign } from '@/types';
import { SIGNS, longitudeToSign, formatDegree } from './signs';

const PLANET_BODIES: { id: string; name: string; symbol: string; body?: Body }[] = [
  { id: 'sun', name: '太陽', symbol: '☉', body: Body.Sun },
  { id: 'moon', name: '月亮', symbol: '☽', body: Body.Moon },
  { id: 'mercury', name: '水星', symbol: '☿', body: Body.Mercury },
  { id: 'venus', name: '金星', symbol: '♀', body: Body.Venus },
  { id: 'mars', name: '火星', symbol: '♂', body: Body.Mars },
  { id: 'jupiter', name: '木星', symbol: '♃', body: Body.Jupiter },
  { id: 'saturn', name: '土星', symbol: '♄', body: Body.Saturn },
];

function calcAscendant(time: ReturnType<typeof MakeTime>, lat: number, lng: number): number {
  const gst = SiderealTime(time);
  const lst = gst + lng / 15.0;
  const ramc = (lst * 15 * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const oblRad = (23.4397 * Math.PI) / 180;

  const y = Math.cos(ramc);
  const x = -(Math.sin(ramc) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad));
  let asc = (Math.atan2(y, x) * 180) / Math.PI;
  if (asc < 0) asc += 360;
  return asc;
}

function calcMC(time: ReturnType<typeof MakeTime>, lng: number): number {
  const gst = SiderealTime(time);
  const lst = gst + lng / 15.0;
  let mc = (lst * 15) % 360;
  if (mc < 0) mc += 360;
  return mc;
}

function getPlanetLongitude(
  id: string,
  time: ReturnType<typeof MakeTime>,
  observer: Observer,
): number {
  if (id === 'sun') {
    return SunPosition(time).elon;
  }
  if (id === 'moon') {
    return EclipticGeoMoon(time).lon;
  }
  const config = PLANET_BODIES.find((p) => p.id === id);
  if (!config?.body) return 0;
  const eq = Equator(config.body, time, observer, true, true);
  return Ecliptic(eq.vec).elon;
}

export function calculateNatalChart(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
): NatalChart {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = birthTime.split(':').map(Number);
  const date = new Date(year, month - 1, day, hour, minute, 0);
  const time = MakeTime(date);
  const observer = new Observer(latitude, longitude, 0);

  const ascLon = calcAscendant(time, latitude, longitude);
  const mcLon = calcMC(time, longitude);

  const planets: NatalPlanet[] = PLANET_BODIES.map((p) => {
    const lon = getPlanetLongitude(p.id, time, observer);
    const sign = longitudeToSign(lon);
    return {
      id: p.id,
      name: p.name,
      symbol: p.symbol,
      longitude: lon,
      sign,
      degreeLabel: formatDegree(lon),
    };
  });

  const sun = planets.find((p) => p.id === 'sun')!.sign;
  const moon = planets.find((p) => p.id === 'moon')!.sign;
  const rising = longitudeToSign(ascLon);

  const houses = Array.from({ length: 12 }, (_, i) => {
    const cuspLon = (ascLon + i * 30) % 360;
    return {
      number: i + 1,
      cuspLongitude: cuspLon,
      sign: longitudeToSign(cuspLon),
    };
  });

  return {
    planets,
    ascendant: { longitude: ascLon, sign: rising, degreeLabel: formatDegree(ascLon) },
    midheaven: { longitude: mcLon, sign: longitudeToSign(mcLon), degreeLabel: formatDegree(mcLon) },
    houses,
    sunSign: sun,
    moonSign: moon,
    risingSign: rising,
    birthDateTime: date.toISOString(),
    latitude,
    longitude,
  };
}

export function getAstrologyReading(sun: ZodiacSign, moon: ZodiacSign, rising: ZodiacSign): string {
  return `太陽${sun.name}賦予你${sun.traits}的特質；月亮${moon.name}影響你的內在情感世界；上升${rising.name}則是你展現給世界的面貌。三者結合，勾勒出你獨特的宇宙藍圖。`;
}

export function getAspectSummary(chart: NatalChart): string[] {
  const aspects: string[] = [];
  const sun = chart.planets.find((p) => p.id === 'sun');
  const moon = chart.planets.find((p) => p.id === 'moon');
  if (sun && moon) {
    const diff = Math.abs(sun.longitude - moon.longitude) % 360;
    const angle = diff > 180 ? 360 - diff : diff;
    if (angle < 10) aspects.push('日月合相：意志與情感高度一致，內外統一。');
    else if (Math.abs(angle - 180) < 10) aspects.push('日月對沖：理性與感性拉扯，需在兩極間找平衡。');
    else if (Math.abs(angle - 120) < 8) aspects.push('日月三分：才華與直覺和諧流動，表達力佳。');
    else if (Math.abs(angle - 90) < 8) aspects.push('日月四分：內在張力推動成長，需學習整合。');
  }
  return aspects;
}
