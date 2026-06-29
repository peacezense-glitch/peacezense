import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { BaziFullReport, LifeAnalysisTopic } from '@/types';
import { analyzeUsefulGod } from '@/lib/bazi/usefulGod';
import { generateLifeAnalysis } from '@/lib/bazi/analysis';

function buildHtml(
  report: BaziFullReport,
  userName: string,
  topics: LifeAnalysisTopic[],
): string {
  const useful = analyzeUsefulGod(report.chart);
  const pillars = [
    ['年', report.chart.year],
    ['月', report.chart.month],
    ['日', report.chart.day],
    ['時', report.chart.hour],
  ];

  const pillarRows = pillars
    .map(([label, p]) => {
      const pillar = p as typeof report.chart.year;
      return `<tr><td>${label}柱</td><td>${pillar.stem}${pillar.branch}</td><td>${pillar.stemElement}/${pillar.branchElement}</td></tr>`;
    })
    .join('');

  const topicSections = topics
    .map(
      (t) =>
        `<h3>${t.title}</h3><p><strong>${t.summary}</strong></p><p>${t.detail}</p>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body { font-family: "PingFang TC", "Noto Sans TC", sans-serif; padding: 40px; color: #2C2438; }
  h1 { color: #6B4E9B; border-bottom: 2px solid #C9A962; padding-bottom: 8px; }
  h2 { color: #6B4E9B; margin-top: 24px; }
  h3 { color: #C9A962; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  td, th { border: 1px solid #E0D8EC; padding: 8px 12px; text-align: center; }
  th { background: #6B4E9B; color: white; }
  .footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; }
</style></head><body>
  <h1>☯ PeaceZense 命之書</h1>
  <p>${userName ? `${userName} 的` : ''}八字命理報告</p>
  <p>農曆：${report.lunarDate} · ${report.jieQi}</p>
  ${report.solarTimeNote ? `<p>${report.solarTimeNote}</p>` : ''}

  <h2>命盤四柱</h2>
  <table><tr><th>柱</th><th>干支</th><th>五行</th></tr>${pillarRows}</table>

  <h2>喜用神</h2>
  <p>日主 ${report.chart.dayMaster}（${report.chart.dayMasterElement}）· ${useful.strength}</p>
  <p>喜：${useful.usefulElements.join('、')} · 忌：${useful.avoidElements.join('、')}</p>
  <p>${useful.summary}</p>

  <h2>命之書 · 人生專題</h2>
  ${topicSections}

  <div class="footer">
    <p>本報告由 PeaceZense 生成，僅供自我探索參考。</p>
    <p>生成時間：${new Date().toLocaleString('zh-TW')}</p>
  </div>
</body></html>`;
}

export async function exportBaziReportPdf(
  report: BaziFullReport,
  userName: string,
): Promise<void> {
  const topics = generateLifeAnalysis(report);
  const html = buildHtml(report, userName, topics);
  const { uri } = await Print.printToFileAsync({ html, base64: false });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: '分享命之書',
      UTI: 'com.adobe.pdf',
    });
  }
}
