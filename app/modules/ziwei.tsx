import { StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import PremiumGate from '@/components/PremiumGate';
import { InfoCard, InfoRow, ModuleScreenLayout } from '@/components/InfoCard';
import { useUserProfile } from '@/context/UserProfileContext';
import { calculateZiWei, getZiWeiSummary, getPalaceAnalysis } from '@/lib/ziwei';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function ZiWeiScreen() {
  const { profile } = useUserProfile();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const chart = calculateZiWei(profile.birthDate, profile.birthTime, profile.gender);
  const summary = getZiWeiSummary(chart);

  return (
    <ModuleScreenLayout>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        紫微斗數 · 安宮法排盤
      </Text>

      <InfoCard title="命身宮">
        <InfoRow label="命宮" value={chart.mingGong} />
        <InfoRow label="身宮" value={chart.shenGong} />
        <InfoRow label="五行局" value={chart.bureau} />
        <Text style={[styles.summary, { color: colors.textSecondary }]}>{summary}</Text>
      </InfoCard>

      <PremiumGate feature="ziwei.fullChart">
        {chart.palaces.map((palace) => (
          <InfoCard key={palace.name} title={`${palace.name}（${palace.branch}）`}>
            <InfoRow label="主星" value={palace.mainStars.join('、') || '空宮'} />
            {palace.minorStars.length > 0 && (
              <InfoRow label="輔星" value={palace.minorStars.join('、')} />
            )}
            <Text style={[styles.analysis, { color: colors.textSecondary }]}>
              {getPalaceAnalysis(palace)}
            </Text>
          </InfoCard>
        ))}
      </PremiumGate>
    </ModuleScreenLayout>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 14, marginBottom: 16 },
  summary: { fontSize: 14, lineHeight: 22, marginTop: 8 },
  analysis: { fontSize: 13, lineHeight: 20, marginTop: 8 },
});
