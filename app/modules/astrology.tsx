import { StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import PremiumGate from '@/components/PremiumGate';
import NatalChartWheel from '@/components/NatalChart';
import { InfoCard, InfoRow, ModuleScreenLayout } from '@/components/InfoCard';
import { useUserProfile } from '@/context/UserProfileContext';
import { calculateNatalChart, getAstrologyReading, getAspectSummary } from '@/lib/astrology';
import { findCity } from '@/constants/Cities';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function AstrologyScreen() {
  const { profile } = useUserProfile();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const city = findCity(profile.birthPlace);
  const latitude = city?.latitude ?? 25.033;
  const longitude = profile.longitude || city?.longitude || 121.5654;

  const chart = calculateNatalChart(
    profile.birthDate,
    profile.birthTime,
    latitude,
    longitude,
  );
  const reading = getAstrologyReading(chart.sunSign, chart.moonSign, chart.risingSign);
  const aspects = getAspectSummary(chart);

  return (
    <ModuleScreenLayout>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        西洋占星 · 本命星盤（天體曆計算）
      </Text>

      <PremiumGate feature="astrology.natalChart">
        <NatalChartWheel chart={chart} />

        <InfoCard title="行星位置">
          {chart.planets.map((p) => (
            <InfoRow key={p.id} label={`${p.symbol} ${p.name}`} value={`${p.sign.symbol} ${p.sign.name} ${p.degreeLabel}`} />
          ))}
          <InfoRow label="↑ 上升" value={`${chart.ascendant.sign.symbol} ${chart.ascendant.sign.name} ${chart.ascendant.degreeLabel}`} />
          <InfoRow label="↑ 天頂" value={`${chart.midheaven.sign.symbol} ${chart.midheaven.sign.name} ${chart.midheaven.degreeLabel}`} />
        </InfoCard>
      </PremiumGate>

      <InfoCard title="太陽星座">
        <Text style={styles.signSymbol}>{chart.sunSign.symbol}</Text>
        <Text style={styles.signName}>{chart.sunSign.name} {chart.sunSign.nameEn}</Text>
        <InfoRow label="元素" value={chart.sunSign.element} />
        <Text style={[styles.traits, { color: colors.textSecondary }]}>{chart.sunSign.traits}</Text>
      </InfoCard>

      <InfoCard title="月亮星座">
        <Text style={styles.signSymbol}>{chart.moonSign.symbol}</Text>
        <Text style={styles.signName}>{chart.moonSign.name}</Text>
        <Text style={[styles.traits, { color: colors.textSecondary }]}>
          內在情感：{chart.moonSign.traits}
        </Text>
      </InfoCard>

      <InfoCard title="上升星座">
        <Text style={styles.signSymbol}>{chart.risingSign.symbol}</Text>
        <Text style={styles.signName}>{chart.risingSign.name}</Text>
        <Text style={[styles.traits, { color: colors.textSecondary }]}>
          外在形象：{chart.risingSign.traits}
        </Text>
      </InfoCard>

      {aspects.length > 0 && (
        <InfoCard title="重要相位">
          {aspects.map((a) => (
            <Text key={a} style={[styles.traits, { color: colors.textSecondary }]}>{a}</Text>
          ))}
        </InfoCard>
      )}

      <InfoCard title="綜合解讀">
        <Text style={[styles.body, { color: colors.textSecondary }]}>{reading}</Text>
      </InfoCard>
    </ModuleScreenLayout>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 14, marginBottom: 16 },
  signSymbol: { fontSize: 36, textAlign: 'center', marginBottom: 4 },
  signName: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  traits: { fontSize: 14, lineHeight: 22, marginTop: 8 },
  body: { fontSize: 14, lineHeight: 22 },
});
