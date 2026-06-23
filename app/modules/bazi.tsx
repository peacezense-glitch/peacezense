import { StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import BaziChartDisplay from '@/components/BaziChartDisplay';
import PremiumGate from '@/components/PremiumGate';
import { ElementBarChart, LifeAnalysisCard } from '@/components/AnalysisCards';
import LuckPillarChart from '@/components/LuckPillarChart';
import { InfoCard, InfoRow, ModuleScreenLayout } from '@/components/InfoCard';
import { useUserProfile } from '@/context/UserProfileContext';
import {
  calculateBaziFull,
  getElementBalance,
  analyzeUsefulGod,
  generateLifeAnalysis,
} from '@/lib/bazi';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function BaziScreen() {
  const { profile } = useUserProfile();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const report = calculateBaziFull(profile.birthDate, profile.birthTime, profile.gender);
  const balance = getElementBalance(report.chart);
  const useful = analyzeUsefulGod(report.chart);
  const lifeTopics = generateLifeAnalysis(report);

  return (
    <ModuleScreenLayout>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        四柱八字 · 專業命盤解析（節氣換月）
      </Text>

      <InfoCard title="命盤四柱">
        <BaziChartDisplay
          year={report.chart.year}
          month={report.chart.month}
          day={report.chart.day}
          hour={report.chart.hour}
        />
        <InfoRow label="農曆" value={report.lunarDate} />
        <InfoRow label="節氣" value={report.jieQi || '—'} />
      </InfoCard>

      <InfoCard title="十神格局">
        {report.tenGods.map((tg) => (
          <InfoRow
            key={tg.pillar}
            label={`${tg.pillar}柱 ${tg.stem}`}
            value={`${tg.god} · 藏${tg.hidden}`}
          />
        ))}
      </InfoCard>

      <InfoCard title="納音">
        <InfoRow label="年" value={report.naYin.year} />
        <InfoRow label="月" value={report.naYin.month} />
        <InfoRow label="日" value={report.naYin.day} />
        <InfoRow label="時" value={report.naYin.hour} />
      </InfoCard>

      <InfoCard title="喜用神">
        <InfoRow label="日主" value={`${useful.dayMaster}（${useful.dayMasterElement}）`} />
        <InfoRow label="強弱" value={useful.strength} />
        <InfoRow label="喜用" value={useful.usefulElements.join('、')} />
        <InfoRow label="忌" value={useful.avoidElements.join('、')} />
        <Text style={[styles.body, { color: colors.textSecondary, marginTop: 8 }]}>
          {useful.summary}
        </Text>
      </InfoCard>

      <InfoCard title="五行分佈">
        <ElementBarChart balance={balance} />
      </InfoCard>

      <InfoCard title="命宮身宮">
        <InfoRow label="命宮" value={report.mingGong} />
        <InfoRow label="身宮" value={report.shenGong} />
        <InfoRow label="胎元" value={report.taiYuan} />
      </InfoCard>

      <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
        命之書 · 五大人生專題
      </Text>
      <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
        免費完整分析，涵蓋性格、財富、情感、健康、學習
      </Text>

      {lifeTopics.map((topic, i) => (
        <LifeAnalysisCard key={topic.id} topic={topic} index={i} />
      ))}

      <Text style={[styles.sectionTitle, { color: colors.secondary, marginTop: 8 }]}>
        大運流年
      </Text>

      <PremiumGate feature="bazi.luckPillars">
        <InfoCard title={`大運（${report.currentAge}歲）`}>
          {report.currentLuck && (
            <InfoRow
              label="當前大運"
              value={`${report.currentLuck.ganZhi}（${report.currentLuck.startAge}-${report.currentLuck.endAge}歲）`}
            />
          )}
          <LuckPillarChart pillars={report.luckPillars} currentAge={report.currentAge} />
        </InfoCard>
      </PremiumGate>

      <InfoCard title="免責聲明">
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          本分析基於傳統命理學原理，僅供自我探索與娛樂參考，不構成專業建議。人生由自己掌握，命理是認識自我的工具之一。
        </Text>
      </InfoCard>
    </ModuleScreenLayout>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 14, marginBottom: 16 },
  body: { fontSize: 14, lineHeight: 22 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  sectionDesc: { fontSize: 13, marginBottom: 16, lineHeight: 20 },
});
