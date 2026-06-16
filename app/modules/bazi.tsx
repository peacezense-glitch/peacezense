import { StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import BaziChartDisplay from '@/components/BaziChartDisplay';
import { InfoCard, InfoRow, ModuleScreenLayout } from '@/components/InfoCard';
import { useUserProfile } from '@/context/UserProfileContext';
import { calculateBazi, getElementBalance, getDayMasterAnalysis } from '@/lib/bazi';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function BaziScreen() {
  const { profile } = useUserProfile();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const chart = calculateBazi(profile.birthDate, profile.birthTime);
  const balance = getElementBalance(chart);
  const analysis = getDayMasterAnalysis(chart);

  return (
    <ModuleScreenLayout>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        四柱八字 · 先天命格解析
      </Text>

      <InfoCard title="命盤四柱">
        <BaziChartDisplay
          year={chart.year}
          month={chart.month}
          day={chart.day}
          hour={chart.hour}
        />
      </InfoCard>

      <InfoCard title="日主">
        <InfoRow label="日干" value={`${chart.dayMaster}（${chart.dayMasterElement}）`} />
        <Text style={[styles.analysis, { color: colors.textSecondary }]}>{analysis}</Text>
      </InfoCard>

      <InfoCard title="五行分佈">
        {Object.entries(balance).map(([element, count]) => (
          <InfoRow key={element} label={element} value={'█'.repeat(count) + ` (${count})`} />
        ))}
      </InfoCard>

      <InfoCard title="說明">
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          八字以出生年、月、日、時的干支組合，揭示先天命格特質。年柱代表祖上與早年，月柱代表父母與青年，日柱的日干為日主（命主本人），時柱代表子女與晚年。
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
  analysis: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
});
