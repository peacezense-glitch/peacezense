import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { BaziPillar } from '@/types';

interface PillarDisplayProps {
  label: string;
  pillar: BaziPillar;
}

function PillarCell({ label, pillar }: PillarDisplayProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.cell, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={styles.stem}>{pillar.stem}</Text>
      <Text style={styles.branch}>{pillar.branch}</Text>
      <Text style={[styles.element, { color: colors.accent }]}>
        {pillar.stemElement}/{pillar.branchElement}
      </Text>
    </View>
  );
}

interface BaziChartDisplayProps {
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour: BaziPillar;
}

export default function BaziChartDisplay({ year, month, day, hour }: BaziChartDisplayProps) {
  return (
    <View style={styles.row}>
      <PillarCell label="年柱" pillar={year} />
      <PillarCell label="月柱" pillar={month} />
      <PillarCell label="日柱" pillar={day} />
      <PillarCell label="時柱" pillar={hour} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  label: {
    fontSize: 11,
    marginBottom: 6,
  },
  stem: {
    fontSize: 22,
    fontWeight: '700',
  },
  branch: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  element: {
    fontSize: 10,
    marginTop: 6,
  },
});
