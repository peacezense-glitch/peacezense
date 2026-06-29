import { calculateBaziFull, analyzeUsefulGod, generateLifeAnalysis } from '@/lib/bazi';
import { BaziFullReport } from '@/types';

interface ChatContext {
  report: BaziFullReport;
  userName: string;
}

const KEYWORD_HANDLERS: {
  keywords: string[];
  respond: (ctx: ChatContext) => string;
}[] = [
  {
    keywords: ['工作', '事業', '職場', '換工作', '升遷', '創業'],
    respond: ({ report }) => {
      const topics = generateLifeAnalysis(report);
      const wealth = topics.find((t) => t.id === 'wealth');
      return `根據你的八字，${wealth?.summary ?? ''}\n\n月柱十神為${report.tenGods[1].god}，這是你事業發展的核心方向。${report.currentLuck ? `目前行${report.currentLuck.ganZhi}大運（${report.currentLuck.startAge}-${report.currentLuck.endAge}歲），` : ''}建議在決策前觀察環境變化，順勢而為。`;
    },
  },
  {
    keywords: ['感情', '愛情', '婚姻', '桃花', '分手', '伴侶'],
    respond: ({ report }) => {
      const topics = generateLifeAnalysis(report);
      const love = topics.find((t) => t.id === 'love');
      return `從命盤來看，${love?.summary ?? ''}\n\n日支${report.chart.day.branch}為婚姻宮，時柱${report.tenGods[3].god}影響感情表達方式。${report.chart.dayMasterElement}日主在感情中宜保持真誠，也要給彼此成長空間。`;
    },
  },
  {
    keywords: ['財運', '賺錢', '投資', '理財', '財富', '收入'],
    respond: ({ report }) => {
      const useful = analyzeUsefulGod(report.chart);
      return `你的喜用神為${useful.usefulElements.join('、')}。財運方面，${useful.isStrong ? '日主偏旺，宜以才華和技能變現，避免過度槓桿。' : '日主偏弱，宜穩健累積，尋求貴人助力。'}\n\n納音日柱${report.naYin.day}，暗示你的財富節奏需要耐心經營。`;
    },
  },
  {
    keywords: ['健康', '身體', '生病', '養生'],
    respond: ({ report }) => {
      const topics = generateLifeAnalysis(report);
      const health = topics.find((t) => t.id === 'health');
      return `${health?.summary ?? ''}\n\n${health?.detail ?? ''}`;
    },
  },
  {
    keywords: ['今年', '流年', '運勢', '2025', '2026'],
    respond: ({ report }) => {
      const year = new Date().getFullYear();
      const useful = analyzeUsefulGod(report.chart);
      return `${year}年運勢概覽：日主${report.chart.dayMaster}（${useful.strength}），喜${useful.usefulElements.join('、')}。${report.currentLuck ? `當前${report.currentLuck.ganZhi}大運，` : ''}今年宜專注於能量場與你喜用神相符的領域，避免衝動決策。`;
    },
  },
  {
    keywords: ['性格', '特質', '優點', '缺點', '我是什麼人'],
    respond: ({ report }) => {
      const topics = generateLifeAnalysis(report);
      const p = topics.find((t) => t.id === 'personality');
      return `${p?.summary ?? ''}\n\n${p?.detail ?? ''}`;
    },
  },
  {
    keywords: ['學習', '考試', '學業', '進修'],
    respond: ({ report }) => {
      const topics = generateLifeAnalysis(report);
      const l = topics.find((t) => t.id === 'learning');
      return `${l?.summary ?? ''}\n\n${l?.detail ?? ''}`;
    },
  },
];

export async function generateFortuneReply(
  message: string,
  birthDate: string,
  birthTime: string,
  gender: string,
  userName: string,
  options?: { longitude?: number; useTrueSolarTime?: boolean; birthPlace?: string },
): Promise<string> {
  const report = calculateBaziFull(birthDate, birthTime, gender, options);
  const ctx: ChatContext = { report, userName };

  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (apiKey) {
    try {
      return await callOpenAI(message, ctx, apiKey);
    } catch {
      // fall through to rule-based
    }
  }

  const lower = message.toLowerCase();
  for (const handler of KEYWORD_HANDLERS) {
    if (handler.keywords.some((kw) => message.includes(kw) || lower.includes(kw))) {
      const greeting = userName ? `${userName}，` : '';
      return `${greeting}${handler.respond(ctx)}`;
    }
  }

  const useful = analyzeUsefulGod(report.chart);
  return `${userName ? userName + '，' : ''}根據你的八字（${report.chart.year.stem}${report.chart.year.branch} ${report.chart.month.stem}${report.chart.month.branch} ${report.chart.day.stem}${report.chart.day.branch} ${report.chart.hour.stem}${report.chart.hour.branch}），日主${report.chart.dayMaster}屬${report.chart.dayMasterElement}，${useful.strength}，喜${useful.usefulElements.join('、')}。\n\n你問的「${message}」，建議結合當下大運${report.currentLuck?.ganZhi ?? ''}的節奏來思考。命理是認識自我的鏡子，最終決定權在你手中。如需更深入的分析，可以問我關於事業、感情、財運或健康的問題。`;
}

async function callOpenAI(
  message: string,
  ctx: ChatContext,
  apiKey: string,
): Promise<string> {
  const { report, userName } = ctx;
  const useful = analyzeUsefulGod(report.chart);
  const systemPrompt = `你是 PeaceZense 的智能命理師，精通八字命理。用戶八字：${report.chart.year.stem}${report.chart.year.branch} ${report.chart.month.stem}${report.chart.month.branch} ${report.chart.day.stem}${report.chart.day.branch} ${report.chart.hour.stem}${report.chart.hour.branch}。日主${report.chart.dayMaster}（${report.chart.dayMasterElement}），${useful.strength}，喜${useful.usefulElements.join('、')}。命宮${report.mingGong}，身宮${report.shenGong}。用繁體中文，溫暖專業，200字內。`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 400,
      temperature: 0.7,
    }),
  });

  if (!res.ok) throw new Error('OpenAI API error');
  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content;
  if (!reply) throw new Error('Empty response');
  return userName ? `${userName}，${reply}` : reply;
}
