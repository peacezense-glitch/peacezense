import { useState } from 'react';
import { StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/Themed';
import BaziChartDisplay from '@/components/BaziChartDisplay';
import PremiumGate from '@/components/PremiumGate';
import { ElementBarChart, LifeAnalysisCard } from '@/components/AnalysisCards';
import LuckPillarChart from '@/components/LuckPillarChart';
import { InfoCard, InfoRow, ModuleScreenLayout } from '@/components/InfoCard';
import { useUserProfile } from '@/context/UserProfileContext';
import { useSubscription } from '@/context/SubscriptionContext';
import {
  calculateBaziFull,
  getElementBalance,
  analyzeUsefulGod,
  generateLifeAnalysis,
  getYearlyFlows,
} from '@/lib/bazi';
import { exportBaziReportPdf } from '@/lib/exportBaziPdf';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function BaziScreen() {
  const { profile } = useUserProfile();
  const { canAccess } = useSubscription();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [exporting, setExporting] = useState(false);

  const baziOptions = {
    longitude: profile.longitude,
    useTrueSolarTime: profile.useTrueSolarTime,
    birthPlace: profile.birthPlace,
  };

  const report = calculateBaziFull(
    profile.birthDate,
    profile.birthTime,
    profile.gender,
    baziOptions,
  );
  const balance = getElementBalance(report.chart);
  const useful = analyzeUsefulGod(report.chart);
  const lifeTopics = generateLifeAnalysis(report);
  const yearlyFlows = getYearlyFlows(
    profile.birthDate,
    profile.birthTime,
    profile.gender,
    baziOptions,
    3,
  );

  const handleExport = async () => {
    if (!canAccess('bazi.fullReport')) return;
    setExporting(true);
    try {
      await exportBaziReportPdf(report, profile.name);
    } finally {
      setExporting(false);
    }
  };

  return (
    <ModuleScreenLayout>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        四柱八字 · 專業命盤解析（節氣換月）
      </Text>

      {report.solarTimeNote && (
        <Text style={[styles.solarNote, { color: colors.accent }]}>
          {report.solarTimeNote}
          {report.correctedTime ? ` → 校正後 ${report.correctedTime}` : ''}
        </Text>
      )}

      <Pressable
        onPress={() => router.push('/modules/bazi-date' as never)}
        style={[styles.zeriBtn, { backgroundColor: colors.secondary }]}
      >
        <Text style={styles.zeriBtnTitle}>📅 八字擇日</Text>
        <Text style={styles.zeriBtnDesc}>結婚、搬家、開業… 依命盤挑選良辰吉日</Text>
      </Pressable>

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

      <PremiumGate feature="bazi.fullReport">
        <Pressable
          onPress={handleExport}
          disabled={exporting}
          style={[styles.exportBtn, { backgroundColor: colors.secondary }]}
        >
          {exporting ? (
            <ActivityIndicator color="#1A1428" />
          ) : (
            <Text style={styles.exportText}>匯出命之書 PDF</Text>
          )}
        </Pressable>
      </PremiumGate>

      <Text style={[styles.sectionTitle, { color: colors.secondary, marginTop: 8 }]}>
        流年運勢
      </Text>

      <PremiumGate feature="bazi.yearlyFlow">
        {yearlyFlows.map((flow) => (
          <InfoCard key={flow.year} title={`${flow.year}年 ${flow.ganZhi}`}>
            <Text style={[styles.body, { color: colors.textSecondary, marginBottom: 8 }]}>
              {flow.summary}
            </Text>
            {flow.topics.map((t) => (
              <InfoRow key={t.area} label={`${t.area} ${t.rating}`} value={t.advice} />
            ))}
          </InfoCard>
        ))}
      </PremiumGate>

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
  subtitle: { fontSize: 14, marginBottom: 8 },
  solarNote: { fontSize: 12, marginBottom: 16, lineHeight: 18 },
  body: { fontSize: 14, lineHeight: 22 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  sectionDesc: { fontSize: 13, marginBottom: 16, lineHeight: 20 },
  exportBtn: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  exportText: { color: '#1A1428', fontWeight: '700', fontSize: 15 },
  zeriBtn: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  zeriBtnTitle: { color: '#1A1428', fontSize: 17, fontWeight: '800' },
  zeriBtnDesc: { color: '#1A1428', fontSize: 13, marginTop: 4, opacity: 0.8 },
});
