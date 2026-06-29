import { QiMenPlate, QiMenPalace } from '@/types';

const DOORS = ['休', '生', '傷', '杜', '景', '死', '驚', '開'];
const STARS = ['蓬', '任', '沖', '輔', '英', '芮', '柱', '心'];
const DEITIES = ['值符', '騰蛇', '太陰', '六合', '白虎', '玄武', '九地', '九天'];
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const PALACE_NAMES = ['坎一', '坤二', '震三', '巽四', '中五', '乾六', '兌七', '艮八', '離九'];

function getJuNumber(date: Date): number {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return (dayOfYear % 9) + 1;
}

export function calculateQiMen(datetime?: Date): QiMenPlate {
  const now = datetime ?? new Date();
  const hour = now.getHours();
  const isYang = hour >= 5 && hour < 17;
  const ju = getJuNumber(now);
  const seed = now.getTime();

  const palaces: QiMenPalace[] = PALACE_NAMES.map((name, i) => ({
    position: i + 1,
    name,
    door: DOORS[(seed + i * 3) % 8],
    star: STARS[(seed + i * 5) % 8],
    deity: DEITIES[(seed + i * 7) % 8],
    stem: STEMS[(seed + i * 2) % 10],
  }));

  return {
    datetime: now.toISOString(),
    dun: isYang ? '陽遁' : '陰遁',
    ju,
    zhiFu: STARS[seed % 8],
    zhiShi: DOORS[seed % 8],
    palaces,
  };
}

export function getQiMenGuidance(plate: QiMenPlate): string {
  const openDoor = plate.palaces.find((p) => p.door === '開');
  const lifeDoor = plate.palaces.find((p) => p.door === '生');
  return `${plate.dun}${plate.ju}局。值符${plate.zhiFu}，值使${plate.zhiShi}。` +
    `${openDoor ? `開門在${openDoor.name}，利於開創行動。` : ''}` +
    `${lifeDoor ? `生門在${lifeDoor.name}，利於求財生長。` : ''}`;
}

export function getAuspiciousDirections(plate: QiMenPlate): string[] {
  const auspicious = plate.palaces.filter(
    (p) => p.door === '開' || p.door === '生' || p.door === '休'
  );
  return auspicious.map((p) => `${p.name}（${p.door}門·${p.star}星）`);
}
