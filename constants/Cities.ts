export interface CityPreset {
  name: string;
  longitude: number;
  latitude: number;
  timezone: number;
}

export const CITY_PRESETS: CityPreset[] = [
  { name: '台北', longitude: 121.5654, latitude: 25.033, timezone: 8 },
  { name: '高雄', longitude: 120.3014, latitude: 22.6273, timezone: 8 },
  { name: '香港', longitude: 114.1694, latitude: 22.3193, timezone: 8 },
  { name: '北京', longitude: 116.4074, latitude: 39.9042, timezone: 8 },
  { name: '上海', longitude: 121.4737, latitude: 31.2304, timezone: 8 },
  { name: '廣州', longitude: 113.2644, latitude: 23.1291, timezone: 8 },
  { name: '深圳', longitude: 114.0579, latitude: 22.5431, timezone: 8 },
  { name: '東京', longitude: 139.6917, latitude: 35.6895, timezone: 9 },
  { name: '首爾', longitude: 126.978, latitude: 37.5665, timezone: 9 },
  { name: '新加坡', longitude: 103.8198, latitude: 1.3521, timezone: 8 },
  { name: '吉隆坡', longitude: 101.6869, latitude: 3.139, timezone: 8 },
  { name: '曼谷', longitude: 100.5018, latitude: 13.7563, timezone: 7 },
  { name: '雪梨', longitude: 151.2093, latitude: -33.8688, timezone: 10 },
  { name: '墨爾本', longitude: 144.9631, latitude: -37.8136, timezone: 10 },
  { name: '洛杉磯', longitude: -118.2437, latitude: 34.0522, timezone: -8 },
  { name: '紐約', longitude: -74.006, latitude: 40.7128, timezone: -5 },
  { name: '倫敦', longitude: -0.1276, latitude: 51.5074, timezone: 0 },
  { name: '巴黎', longitude: 2.3522, latitude: 48.8566, timezone: 1 },
];

export function findCity(name: string): CityPreset | undefined {
  return CITY_PRESETS.find((c) => c.name === name);
}

export function getLongitudeForPlace(place: string, customLongitude?: number): number {
  if (customLongitude !== undefined && customLongitude !== 0) return customLongitude;
  const city = findCity(place);
  return city?.longitude ?? 120; // default Taiwan meridian
}
