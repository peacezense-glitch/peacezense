import { StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { InfoCard, InfoRow, ModuleScreenLayout } from '@/components/InfoCard';
import { useUserProfile } from '@/context/UserProfileContext';
import { calculateMayanSign, getMayanKinDescription } from '@/lib/mayan';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function MayanScreen() {
  const { profile } = useUserProfile();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const sign = calculateMayanSign(profile.birthDate);
  const description = getMayanKinDescription(sign);

  return (
    <ModuleScreenLayout>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        瑪雅 Tzolkin 神聖曆 · 260 日輪迴
      </Text>

      <InfoCard title="你的瑪雅印記">
        <Text style={styles.kinNumber}>Kin {sign.number}</Text>
        <Text style={styles.daySign}>{sign.daySign}</Text>
        <Text style={[styles.daySignEn, { color: colors.textSecondary }]}>
          {sign.daySignEn}
        </Text>
        <InfoRow label="調性" value={sign.tone} />
      </InfoCard>

      <InfoCard title="能量意義">
        <Text style={[styles.meaning, { color: colors.textSecondary }]}>
          {sign.meaning}
        </Text>
      </InfoCard>

      <InfoCard title="完整解讀">
        <Text style={[styles.body, { color: colors.textSecondary }]}>{description}</Text>
      </InfoCard>

      <InfoCard title="關於 Tzolkin">
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Tzolkin 是瑪雅文明的神聖曆法，由 13 個調性與 20 個日印組成 260 天的循環。每個出生日期對應一個獨特的 Kin，揭示你與宇宙能量的連結方式。
        </Text>
      </InfoCard>
    </ModuleScreenLayout>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  kinNumber: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  daySign: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
  daySignEn: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  meaning: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
});
