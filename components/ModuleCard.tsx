import { StyleSheet, Pressable, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { Text } from '@/components/Themed';
import { ModuleDefinition } from '@/constants/Modules';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { cardShadow, radius } from '@/constants/Theme';

interface ModuleCardProps {
  module: ModuleDefinition;
  compact?: boolean;
}

export default function ModuleCard({ module, compact = false }: ModuleCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Pressable
      onPress={() => router.push(module.route as never)}
      style={({ pressed }) => [styles.wrapper, { opacity: pressed ? 0.88 : 1 }]}
    >
      <LinearGradient
        colors={[module.color + '35', module.color + '12', colors.card]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          cardShadow(colorScheme),
          compact && styles.cardCompact,
          { borderColor: module.color + '30' },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: module.color + '45' }]}>
          <SymbolView
            name={module.icon as Parameters<typeof SymbolView>[0]['name']}
            tintColor={module.color}
            size={compact ? 24 : 28}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, compact && styles.titleCompact]}>{module.title}</Text>
          {!compact && (
            <>
              <Text style={[styles.titleEn, { color: colors.textSecondary }]}>{module.titleEn}</Text>
              <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
                {module.description}
              </Text>
            </>
          )}
          {compact && (
            <Text style={[styles.descriptionCompact, { color: colors.textSecondary }]} numberOfLines={1}>
              {module.description}
            </Text>
          )}
        </View>
        <View style={[styles.chevronCircle, { backgroundColor: colors.backgroundSecondary }]}>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            tintColor={colors.textSecondary}
            size={16}
          />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: radius.md,
    gap: 14,
    borderWidth: 1,
    ...Platform.select({
      web: { backdropFilter: 'blur(8px)' },
      default: {},
    }),
  },
  cardCompact: {
    padding: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  titleCompact: {
    fontSize: 16,
  },
  titleEn: {
    fontSize: 12,
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  descriptionCompact: {
    fontSize: 12,
    marginTop: 2,
  },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
