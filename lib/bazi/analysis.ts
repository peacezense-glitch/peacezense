import { BaziFullReport, LifeAnalysisTopic } from '@/types';
import { analyzeUsefulGod } from './usefulGod';

const PERSONALITY: Record<string, Record<string, string>> = {
  木: {
    偏旺: '你天生具有領導氣質與開創精神，做事有遠見且富有同情心。有時過於理想化，需注意務實與耐心。',
    偏弱: '你溫和細膩、善於觀察，具有很強的學習與適應能力。需培養自信，勇於表達自我觀點。',
  },
  火: {
    偏旺: '你熱情開朗、表達力強，天生具有感染力與舞台魅力。需注意情緒管理，避免過於急躁衝動。',
    偏弱: '你內斂沉穩、思考深入，做事認真且有耐心。可多參與社交活動，激發內在熱情。',
  },
  土: {
    偏旺: '你誠實可靠、腳踏實地，是他人信賴的基石。有時過於固執保守，需保持開放心態。',
    偏弱: '你靈活變通、反應敏捷，善於在變化中找到機會。需建立穩定的作息與財務規劃。',
  },
  金: {
    偏旺: '你果斷堅毅、原則性強，具有卓越的執行力與判斷力。需注意柔軟度，避免過於剛硬。',
    偏弱: '你細膩敏感、審美品味佳，善於分析與規劃。需培養決斷力，把握時機果斷行動。',
  },
  水: {
    偏旺: '你聰明機智、善於謀略，適應力極強且富有想像力。需注意專注力，避免三心二意。',
    偏弱: '你純真善良、直覺敏銳，具有很強的共情能力。需加強邏輯思維與目標規劃。',
  },
};

const WEALTH: Record<string, string> = {
  比肩: '適合合夥創業或團隊協作模式，財富來自人脈與合作。注意避免因義氣而財務損失。',
  劫財: '財運起伏較大，有橫財機會但需謹慎理財。不宜過度投機，穩健累積為上策。',
  食神: '才華變現能力強，適合從事創意、餐飲、教育、文化等行業。越輕鬆愉快越能招財。',
  傷官: '技術與創新是你的財富密碼，適合自由職業或專業領域深耕。注意與上司的溝通方式。',
  偏財: '商業嗅覺敏銳，適合投資、貿易、銷售等領域。把握機會但忌貪心，見好就收。',
  正財: '勤勞致富的命格，穩定薪資與持續經營是財富主線。適合金融、管理、實業等穩健行業。',
  偏官: '事業心強，在競爭環境中脫穎而出。適合管理、軍警、法律等需要魄力的領域。',
  七殺: '事業心強，在競爭環境中脫穎而出。適合管理、軍警、法律等需要魄力的領域。',
  正官: '貴人運佳，適合體制內發展或大型企業任職。按部就班累積聲望與財富。',
  偏印: '特殊技能與直覺是你的財富來源，適合研究、技術、玄學、醫療等專業領域。',
  正印: '學識與文化修養帶來財富，適合教育、出版、顧問等知識型行業。貴人常在長輩與導師。',
};

const LOVE: Record<string, string> = {
  木: '你在感情中重視成長與精神交流，欣賞有上進心的伴侶。需避免過度付出而忽略自身需求。',
  火: '你熱情浪漫、敢愛敢恨，感情世界豐富多彩。需學習在激情之外經營細水長流的親密關係。',
  土: '你忠誠可靠、重視承諾，是理想的長期伴侶。需增加生活情趣，避免感情陷入平淡。',
  金: '你對感情有標準與原則，一旦認定便專注執著。需學習柔軟表達，避免過於理性而顯得冷漠。',
  水: '你感性細膩、浪漫多情，具有很強的吸引力。需建立安全感，避免過度敏感或多疑。',
};

const HEALTH: Record<string, string> = {
  木: '注意肝膽、筋骨與眼睛健康。保持規律運動，多接觸大自然，避免過度壓力與熬夜。',
  火: '注意心臟、血液循環與小腸。保持情緒穩定，避免過度興奮或焦躁，適度冥想靜心。',
  土: '注意脾胃、消化系統與肌肉。飲食規律清淡，避免過思慮傷脾，保持適度運動。',
  金: '注意肺部、呼吸系統與皮膚。多做深呼吸運動，避免悲傷過度，注意季節交替的保養。',
  水: '注意腎臟、泌尿系統與耳朵。保持充足睡眠，避免恐懼與過度焦慮，注意保暖防寒。',
};

function findDominantGod(report: BaziFullReport): string {
  const gods = report.tenGods
    .filter((t) => t.god !== '日主')
    .map((t) => t.god);
  const counts: Record<string, number> = {};
  for (const g of gods) {
    counts[g] = (counts[g] ?? 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? '正官';
}

export function generateLifeAnalysis(report: BaziFullReport): LifeAnalysisTopic[] {
  const useful = analyzeUsefulGod(report.chart);
  const dm = report.chart.dayMasterElement;
  const strength = useful.strength;
  const dominantGod = findDominantGod(report);

  return [
    {
      id: 'personality',
      title: '性格特質',
      icon: 'person',
      summary: PERSONALITY[dm]?.[strength] ?? '你的性格兼具多種特質，需要在生活中不斷探索與平衡。',
      detail: `日主${report.chart.dayMaster}屬${dm}，命局${strength}。命宮${report.mingGong}，身宮${report.shenGong}。命宮主先天性格根基，身宮反映後天行為傾向。你的十神中以${dominantGod}較為突出，這塑造了你處事的核心風格。`,
      keywords: [dm, strength, dominantGod],
    },
    {
      id: 'wealth',
      title: '財富事業',
      icon: 'work',
      summary: WEALTH[dominantGod] ?? '你的財運需要透過持續努力與正確選擇來開啟，穩健前行是最好的策略。',
      detail: `月柱十神為${report.tenGods[1].god}，主事業與財運方向。喜用${useful.usefulElements.join('、')}，在相關行業或方位發展較為有利。納音日柱${report.naYin.day}，暗示你的財富累積方式具有獨特節奏。`,
      keywords: ['財運', dominantGod, ...useful.usefulElements],
    },
    {
      id: 'love',
      title: '情感婚姻',
      icon: 'favorite',
      summary: LOVE[dm] ?? '你在感情中獨特而真摯，找到懂你的人將是一生的幸運。',
      detail: `日支${report.chart.day.branch}為婚姻宮，時柱十神${report.tenGods[3].god}影響晚年的感情狀態。${report.chart.dayMasterElement}日主在感情中${strength === '偏旺' ? '較為主動，宜學習傾聽與包容' : '較為被動，宜勇敢表達心意'}。`,
      keywords: ['感情', report.chart.day.branch],
    },
    {
      id: 'health',
      title: '健康養生',
      icon: 'health',
      summary: HEALTH[dm] ?? '保持身心平衡是健康的關鍵，規律生活是最好的養生之道。',
      detail: `五行${useful.lackingElements.length > 0 ? '缺' + useful.lackingElements.join('、') : '較為均衡'}。${useful.lackingElements.length > 0 ? '建議透過飲食、運動或環境調節來補足缺失能量。' : '維持現有的良好生活習慣即可。'}目前處於${report.currentLuck ? report.currentLuck.ganZhi + '大運' : '童限'}（${report.currentAge}歲），注意該運勢對健康的影響。`,
      keywords: ['健康', dm, ...useful.lackingElements],
    },
    {
      id: 'learning',
      title: '學習成長',
      icon: 'school',
      summary: `你的學習天賦與${dm}的特質相關，${useful.isStrong ? '適合深度鑽研一個領域成為專家' : '適合廣泛涉獵後找到真正熱愛的方向'}。`,
      detail: `印星（正印/偏印）代表學習與智慧。你的命局中${report.tenGods.filter((t) => t.god === '正印' || t.god === '偏印').map((t) => t.pillar + t.god).join('、') || '印星不顯'}。食神傷官主才華發揮，${report.tenGods.filter((t) => t.god === '食神' || t.god === '傷官').map((t) => t.pillar + t.god).join('、') || '才華需後天開發'}。`,
      keywords: ['學習', '成長'],
    },
  ];
}
