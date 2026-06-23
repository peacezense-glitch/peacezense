import { StyleSheet, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Text } from '@/components/Themed';
import { useSubscription } from '@/context/SubscriptionContext';
import { FeatureKey, getFeatureLabel } from '@/constants/Features';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { cardShadow, radius } from '@/constants/Theme';

interface PremiumGateProps {
  feature: FeatureKey;
  children: React.ReactNode;
  compact?: boolean;
}

export default function PremiumGate({ feature, children, compact = false }: PremiumGateProps) {
  const { canAccess } = useSubscription();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  if (canAccess(feature)) {
    return <>{children}</>;
  }

  return (
    <View style={[styles.wrapper, cardShadow(colorScheme)]}>
      <View style={styles.preview} pointerEvents="none">
        {children}
      </View>
      <LinearGradient
        colors={['transparent', colors.card + 'CC', colors.card + 'F5']}
        style={styles.overlay}
      >
        <View style={[styles.lockBadge, { backgroundColor: colors.secondary + '25' }]}>
          <SymbolView
            name={{ ios: 'lock.fill', android: 'lock', web: 'lock' } as unknown as Parameters<
              typeof SymbolView
            >[0]['name']}
            tintColor={colors.secondary}
            size={compact ? 20 : 24}
          />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          {getFeatureLabel(feature)}
        </Text>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          升級會員解鎖完整分析
        </Text>
        <Pressable
          onPress={() => router.push('/subscribe' as never)}
          style={[styles.button, { backgroundColor: colors.secondary }]}
        >
          <Text style={[styles.buttonText, { color: colors.onSecondary }]}>升級會員</Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: radius.md,
    marginBottom: 4,
  },
  preview: {
    opacity: 0.45,
    maxHeight: 200,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 6,
  },
  lockBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  desc: {
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: radius.pill,
    marginTop: 8,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 14,
  },
});
