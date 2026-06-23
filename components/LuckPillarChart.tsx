import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { BaziLuckPillar } from '@/types';

interface LuckPillarChartProps {
  pillars: BaziLuckPillar[];
  currentAge: number;
}

export default function LuckPillarChart({ pillars, currentAge }: LuckPillarChartProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      {pillars.map((p) => {
        const isCurrent = currentAge >= p.startAge && currentAge <= p.endAge;
        return (
          <View
            key={`${p.ganZhi}-${p.startAge}`}
            style={[
              styles.pillar,
              {
                backgroundColor: isCurrent ? colors.primary + '25' : colors.backgroundSecondary,
                borderColor: isCurrent ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={[styles.ganZhi, isCurrent && { color: colors.primary }]}>
              {p.ganZhi}
            </Text>
            <Text style={[styles.age, { color: colors.textSecondary }]}>
              {p.startAge}-{p.endAge}歲
            </Text>
            {isCurrent && (
              <Text style={[styles.current, { color: colors.secondary }]}>當前</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillar: {
    width: '30%',
    minWidth: 90,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  ganZhi: {
    fontSize: 18,
    fontWeight: '700',
  },
  age: {
    fontSize: 11,
    marginTop: 4,
  },
  current: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
});
