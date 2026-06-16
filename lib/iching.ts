import { IChingHexagram, IChingLine } from '@/types';

const HEXAGRAMS: Omit<IChingHexagram, 'lines'>[] = [
  { number: 1, name: '乾', nameEn: 'The Creative', upperTrigram: '乾', lowerTrigram: '乾', judgment: '元亨利貞。', image: '天行健，君子以自強不息。' },
  { number: 2, name: '坤', nameEn: 'The Receptive', upperTrigram: '坤', lowerTrigram: '坤', judgment: '元亨，利牝馬之貞。', image: '地勢坤，君子以厚德載物。' },
  { number: 3, name: '屯', nameEn: 'Difficulty', upperTrigram: '坎', lowerTrigram: '震', judgment: '元亨利貞，勿用有攸往。', image: '雲雷屯，君子以經綸。' },
  { number: 4, name: '蒙', nameEn: 'Youthful Folly', upperTrigram: '艮', lowerTrigram: '坎', judgment: '亨。匪我求童蒙，童蒙求我。', image: '山下出泉，蒙。君子以果行育德。' },
  { number: 5, name: '需', nameEn: 'Waiting', upperTrigram: '坎', lowerTrigram: '乾', judgment: '有孚，光亨，貞吉，利涉大川。', image: '雲上於天，需。君子以飲食宴樂。' },
  { number: 6, name: '訟', nameEn: 'Conflict', upperTrigram: '乾', lowerTrigram: '坎', judgment: '有孚窒惕，中吉，終凶。', image: '天與水違行，訟。君子以作事謀始。' },
  { number: 7, name: '師', nameEn: 'The Army', upperTrigram: '坤', lowerTrigram: '坎', judgment: '貞，丈人吉，無咎。', image: '地中有水，師。君子以容民畜眾。' },
  { number: 8, name: '比', nameEn: 'Union', upperTrigram: '坎', lowerTrigram: '坤', judgment: '吉。原筮元永貞，無咎。', image: '地上有水，比。先王以建萬國，親諸侯。' },
  { number: 11, name: '泰', nameEn: 'Peace', upperTrigram: '坤', lowerTrigram: '乾', judgment: '小往大來，吉亨。', image: '天地交，泰。后以財成天地之道。' },
  { number: 12, name: '否', nameEn: 'Standstill', upperTrigram: '乾', lowerTrigram: '坤', judgment: '否之匪人，不利君子貞。', image: '天地不交，否。君子以儉德辟難。' },
  { number: 15, name: '謙', nameEn: 'Modesty', upperTrigram: '坤', lowerTrigram: '艮', judgment: '亨，君子有終。', image: '地中有山，謙。君子以裒多益寡。' },
  { number: 24, name: '復', nameEn: 'Return', upperTrigram: '坤', lowerTrigram: '震', judgment: '亨。出入無疾，朋來無咎。', image: '雷在地中，復。先王以至日閉關。' },
  { number: 29, name: '坎', nameEn: 'The Abysmal', upperTrigram: '坎', lowerTrigram: '坎', judgment: '習坎，有孚，維心亨。', image: '水洊至，習坎。君子以常德行。' },
  { number: 30, name: '離', nameEn: 'The Clinging', upperTrigram: '離', lowerTrigram: '離', judgment: '利貞，亨。畜牝牛，吉。', image: '明兩作，離。大人以繼明照於四方。' },
  { number: 36, name: '明夷', nameEn: 'Darkening', upperTrigram: '坤', lowerTrigram: '離', judgment: '利艱貞。', image: '明入地中，明夷。君子以蒞眾。' },
  { number: 49, name: '革', nameEn: 'Revolution', upperTrigram: '兌', lowerTrigram: '離', judgment: '己日乃孚，元亨利貞，悔亡。', image: '澤中有火，革。君子以治歷明時。' },
  { number: 50, name: '鼎', nameEn: 'The Cauldron', upperTrigram: '離', lowerTrigram: '巽', judgment: '元吉，亨。', image: '木上有火，鼎。君子以正位凝命。' },
  { number: 52, name: '艮', nameEn: 'Keeping Still', upperTrigram: '艮', lowerTrigram: '艮', judgment: '艮其背，不獲其身。', image: '兼山，艮。君子以思不出其位。' },
  { number: 57, name: '巽', nameEn: 'The Gentle', upperTrigram: '巽', lowerTrigram: '巽', judgment: '小亨，利有攸往，利見大人。', image: '隨風，巽。君子以申命行事。' },
  { number: 63, name: '既濟', nameEn: 'After Completion', upperTrigram: '坎', lowerTrigram: '離', judgment: '亨，小利貞，初吉終亂。', image: '水在火上，既濟。君子以思患而豫防之。' },
  { number: 64, name: '未濟', nameEn: 'Before Completion', upperTrigram: '離', lowerTrigram: '坎', judgment: '亨，小狐汔濟，濡其尾，無攸利。', image: '火在水上，未濟。君子以慎辨物居方。' },
];

function generateLine(): IChingLine {
  const coins = [
    Math.random() > 0.5 ? 3 : 2,
    Math.random() > 0.5 ? 3 : 2,
    Math.random() > 0.5 ? 3 : 2,
  ];
  const sum = coins.reduce((a, b) => a + b, 0);
  const value = sum as 6 | 7 | 8 | 9;
  return {
    value,
    isYang: value === 7 || value === 9,
    isChanging: value === 6 || value === 9,
  };
}

export function castHexagram(): IChingHexagram {
  const lines: IChingLine[] = [];
  for (let i = 0; i < 6; i++) {
    lines.push(generateLine());
  }

  const lowerBits = lines.slice(0, 3).map((l) => (l.isYang ? 1 : 0));
  const upperBits = lines.slice(3, 6).map((l) => (l.isYang ? 1 : 0));
  const index = (upperBits[0] + upperBits[1] * 2 + upperBits[2] * 4) * 8 +
    (lowerBits[0] + lowerBits[1] * 2 + lowerBits[2] * 4);
  const hexIndex = Math.min(index, HEXAGRAMS.length - 1);

  return { ...HEXAGRAMS[hexIndex], lines };
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
