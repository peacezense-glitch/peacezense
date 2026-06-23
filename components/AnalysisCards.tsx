import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { LifeAnalysisTopic } from '@/types';

const ELEMENT_COLORS: Record<string, string> = {
  木: '#2E7D5A',
  火: '#D4763A',
  土: '#8B7355',
  金: '#C9A962',
  水: '#4A6FA5',
};

interface ElementBarChartProps {
  balance: Record<string, number>;
}

export function ElementBarChart({ balance }: ElementBarChartProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const max = Math.max(...Object.values(balance), 1);

  return (
    <View style={styles.container}>
      {Object.entries(balance).map(([element, count]) => (
        <View key={element} style={styles.row}>
          <Text style={[styles.label, { color: ELEMENT_COLORS[element] }]}>{element}</Text>
          <View style={[styles.barBg, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.barFill,
                {
                  backgroundColor: ELEMENT_COLORS[element],
                  width: `${(count / max) * 100}%`,
                  minWidth: count > 0 ? 8 : 0,
                },
              ]}
            />
          </View>
          <Text style={[styles.count, { color: colors.textSecondary }]}>{count}</Text>
        </View>
      ))}
    </View>
  );
}

interface LifeAnalysisCardProps {
  topic: LifeAnalysisTopic;
  index: number;
}

const CARD_COLORS = ['#6B4E9B', '#C9A962', '#8B2942', '#2E7D5A', '#4A6FA5'];

export function LifeAnalysisCard({ topic, index }: LifeAnalysisCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const accent = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: accent + '25' }]}>
          <Text style={[styles.badgeText, { color: accent }]}>{index + 1}</Text>
        </View>
        <Text style={styles.cardTitle}>{topic.title}</Text>
      </View>
      <Text style={[styles.summary, { color: colors.text }]}>{topic.summary}</Text>
      <Text style={[styles.detail, { color: colors.textSecondary }]}>{topic.detail}</Text>
      <View style={styles.keywords}>
        {topic.keywords.map((kw) => (
          <View key={kw} style={[styles.tag, { backgroundColor: accent + '15' }]}>
            <Text style={[styles.tagText, { color: accent }]}>{kw}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { width: 20, fontWeight: '700', fontSize: 14 },
  barBg: { flex: 1, height: 10, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  count: { width: 16, textAlign: 'right', fontSize: 13 },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  badge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontWeight: '800', fontSize: 14 },
  cardTitle: { fontSize: 18, fontWeight: '700' },
  summary: { fontSize: 15, lineHeight: 24, fontWeight: '500', marginBottom: 8 },
  detail: { fontSize: 13, lineHeight: 21 },
  keywords: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 11, fontWeight: '600' },
});
