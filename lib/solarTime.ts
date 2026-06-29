/**
 * 真太陽時校正
 * 出生地經度與東經120度（中原時區）之差，每度4分鐘
 */
export function correctToTrueSolarTime(
  birthDate: string,
  birthTime: string,
  longitude: number,
  useCorrection = true,
): { date: string; time: string; offsetMinutes: number } {
  if (!useCorrection) {
    return { date: birthDate, time: birthTime, offsetMinutes: 0 };
  }

  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = birthTime.split(':').map(Number);

  // 標準子午線（中原時區東經120度）
  const standardMeridian = 120;
  const offsetMinutes = Math.round((longitude - standardMeridian) * 4);

  const totalMinutes = hour * 60 + minute + offsetMinutes;
  const corrected = new Date(year, month - 1, day, 0, totalMinutes, 0);

  const cy = corrected.getFullYear();
  const cm = String(corrected.getMonth() + 1).padStart(2, '0');
  const cd = String(corrected.getDate()).padStart(2, '0');
  const ch = String(corrected.getHours()).padStart(2, '0');
  const cmin = String(corrected.getMinutes()).padStart(2, '0');

  return {
    date: `${cy}-${cm}-${cd}`,
    time: `${ch}:${cmin}`,
    offsetMinutes,
  };
}

export function formatSolarTimeNote(offsetMinutes: number, longitude: number): string {
  if (offsetMinutes === 0) return `出生地經度 ${longitude.toFixed(1)}°，無需時差校正。`;
  const direction = offsetMinutes > 0 ? '加' : '減';
  return `出生地經度 ${longitude.toFixed(1)}°，真太陽時${direction} ${Math.abs(offsetMinutes)} 分鐘。`;
}
