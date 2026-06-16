import { StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { InfoCard, InfoRow, ModuleScreenLayout } from '@/components/InfoCard';
import { useUserProfile } from '@/context/UserProfileContext';
import {
  getSunSign,
  getMoonSignApprox,
  getRisingSignApprox,
  getAstrologyReading,
} from '@/lib/astrology';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function AstrologyScreen() {
  const { profile } = useUserProfile();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const sun = getSunSign(profile.birthDate);
  const moon = getMoonSignApprox(profile.birthDate);
  const rising = getRisingSignApprox(profile.birthTime);
  const reading = getAstrologyReading(sun, moon, rising);

  return (
    <ModuleScreenLayout>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        西洋占星 · 行星與星座
      </Text>

      <InfoCard title="太陽星座">
        <Text style={styles.signSymbol}>{sun.symbol}</Text>
        <Text style={styles.signName}>{sun.name} {sun.nameEn}</Text>
        <InfoRow label="元素" value={sun.element} />
        <InfoRow label="日期" value={sun.dates} />
        <Text style={[styles.traits, { color: colors.textSecondary }]}>{sun.traits}</Text>
      </InfoCard>

      <InfoCard title="月亮星座">
        <Text style={styles.signSymbol}>{moon.symbol}</Text>
        <Text style={styles.signName}>{moon.name}</Text>
        <Text style={[styles.traits, { color: colors.textSecondary }]}>
          內在情感與潛意識：{moon.traits}
        </Text>
      </InfoCard>

      <InfoCard title="上升星座">
        <Text style={styles.signSymbol}>{rising.symbol}</Text>
        <Text style={styles.signName}>{rising.name}</Text>
        <Text style={[styles.traits, { color: colors.textSecondary }]}>
          外在形象與第一印象：{rising.traits}
        </Text>
      </InfoCard>

      <InfoCard title="綜合解讀">
        <Text style={[styles.body, { color: colors.textSecondary }]}>{reading}</Text>
      </InfoCard>
    </ModuleScreenLayout>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  signSymbol: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 4,
  },
  signName: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  traits: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
});
