import { IChingHexagram, IChingLine } from '@/types';
import { HEXAGRAMS_64 } from './iching/data';

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateLine(rand: () => number): IChingLine {
  const coins = [rand() > 0.5 ? 3 : 2, rand() > 0.5 ? 3 : 2, rand() > 0.5 ? 3 : 2];
  const sum = coins.reduce((a, b) => a + b, 0);
  const value = sum as 6 | 7 | 8 | 9;
  return {
    value,
    isYang: value === 7 || value === 9,
    isChanging: value === 6 || value === 9,
  };
}

export function castHexagram(seed?: number): IChingHexagram {
  const rand = seed !== undefined ? seededRandom(seed) : Math.random;
  const lines: IChingLine[] = [];
  for (let i = 0; i < 6; i++) {
    lines.push(generateLine(rand));
  }
  const hexIndex = seed !== undefined ? Math.abs(seed) % 64 : Math.floor(Math.random() * 64);
  return { ...HEXAGRAMS_64[hexIndex], lines };
}

export function getHexagramByNumber(num: number): Omit<IChingHexagram, 'lines'> {
  return HEXAGRAMS_64[((num - 1) % 64 + 64) % 64];
}

export function getChangingLines(hexagram: IChingHexagram): number[] {
  return hexagram.lines
    .map((line, i) => (line.isChanging ? i + 1 : -1))
    .filter((i) => i > 0);
}

export function getIChingGuidance(hexagram: IChingHexagram): string {
  const changing = getChangingLines(hexagram);
  let guidance = `第${hexagram.number}卦「${hexagram.name}」— ${hexagram.judgment}`;
  if (changing.length > 0) {
    guidance += ` 變爻位於第${changing.join('、')}爻，表示局勢正在轉化。`;
  }
  return guidance;
}
