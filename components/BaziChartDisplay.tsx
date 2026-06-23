import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { ELEMENT_COLORS, cardShadow, radius } from '@/constants/Theme';
import { BaziPillar } from '@/types';

interface PillarDisplayProps {
  label: string;
  pillar: BaziPillar;
  highlight?: boolean;
}

function PillarCell({ label, pillar, highlight }: PillarDisplayProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const stemColor = ELEMENT_COLORS[pillar.stemElement] ?? colors.accent;
  const branchColor = ELEMENT_COLORS[pillar.branchElement] ?? colors.accent;

  return (
    <View
      style={[
        styles.cell,
        cardShadow(colorScheme),
        {
          backgroundColor: stemColor + '12',
          borderColor: highlight ? colors.secondary : stemColor + '35',
          borderWidth: highlight ? 2 : 1,
        },
      ]}
    >
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.stem, { color: stemColor }]}>{pillar.stem}</Text>
      <Text style={[styles.branch, { color: branchColor }]}>{pillar.branch}</Text>
      <View style={[styles.elementBadge, { backgroundColor: stemColor + '20' }]}>
        <Text style={[styles.element, { color: stemColor }]}>
          {pillar.stemElement}/{pillar.branchElement}
        </Text>
      </View>
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
      <PillarCell label="日柱" pillar={day} highlight />
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
    borderRadius: radius.sm,
  },
  label: {
    fontSize: 11,
    marginBottom: 6,
    fontWeight: '600',
  },
  stem: {
    fontSize: 24,
    fontWeight: '800',
  },
  branch: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  elementBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  element: {
    fontSize: 10,
    fontWeight: '600',
  },
});
