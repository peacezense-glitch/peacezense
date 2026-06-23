import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from '@/components/Themed';
import GradientBackground from '@/components/GradientBackground';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { cardShadow, radius, spacing } from '@/constants/Theme';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}

export function InfoCard({ title, children, accent = false }: InfoCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        styles.card,
        cardShadow(colorScheme),
        {
          backgroundColor: colors.card,
          borderColor: accent ? colors.secondary + '60' : colors.border,
        },
      ]}
    >
      {accent && (
        <View style={[styles.accentStrip, { backgroundColor: colors.secondary }]} />
      )}
      <Text style={[styles.title, { color: accent ? colors.secondary : colors.accent }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.row, { borderBottomColor: colors.border + '80' }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

interface ModuleScreenLayoutProps {
  children: React.ReactNode;
}

export function ModuleScreenLayout({ children }: ModuleScreenLayoutProps) {
  return (
    <GradientBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accentStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
});
