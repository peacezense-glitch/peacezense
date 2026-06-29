import { StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { InfoCard, InfoRow, ModuleScreenLayout } from '@/components/InfoCard';
import { useUserProfile } from '@/context/UserProfileContext';
import { calculateHumanDesign, getHumanDesignGuidance } from '@/lib/humanDesign';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function HumanDesignScreen() {
  const { profile } = useUserProfile();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const hd = calculateHumanDesign(profile.birthDate, profile.birthTime);
  const guidance = getHumanDesignGuidance(hd);

  return (
    <ModuleScreenLayout>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        人類圖 · Human Design System
      </Text>

      <InfoCard title="能量類型">
        <Text style={styles.typeName}>{hd.type}</Text>
        <Text style={[styles.typeDesc, { color: colors.textSecondary }]}>
          {hd.typeDescription}
        </Text>
      </InfoCard>

      <InfoCard title="人生策略">
        <InfoRow label="策略" value={hd.strategy} />
        <InfoRow label="內在權威" value={hd.authority} />
        <InfoRow label="人生角色" value={hd.profile} />
      </InfoCard>

      <InfoCard title="能量中心">
        <InfoRow label="定義中心" value={hd.definedCenters.join('、')} />
        <InfoRow label="未定義中心" value={hd.undefinedCenters.join('、')} />
      </InfoCard>

      <InfoCard title="指引">
        <Text style={[styles.body, { color: colors.textSecondary }]}>{guidance}</Text>
      </InfoCard>
    </ModuleScreenLayout>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  typeName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  typeDesc: {
    fontSize: 14,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
});
