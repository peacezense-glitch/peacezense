import { StyleSheet, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Text } from '@/components/Themed';
import { useSubscription } from '@/context/SubscriptionContext';
import { FeatureKey, getFeatureLabel } from '@/constants/Features';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

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
    <View style={styles.wrapper}>
      <View style={styles.blurred} pointerEvents="none">
        {children}
      </View>
      <LinearGradient
        colors={['transparent', colors.background + 'EE', colors.background]}
        style={styles.overlay}
      >
        <SymbolView
          name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }}
          tintColor={colors.secondary}
          size={compact ? 24 : 32}
        />
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
          <Text style={styles.buttonText}>升級會員</Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 16,
  },
  blurred: {
    opacity: 0.3,
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
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  desc: {
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
  },
  buttonText: {
    color: '#1A1428',
    fontWeight: '700',
    fontSize: 14,
  },
});
