import { useState } from 'react';
import { StyleSheet, ScrollView, Pressable, View, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Text } from '@/components/Themed';
import { useSubscription } from '@/context/SubscriptionContext';
import { SUBSCRIPTION_PLANS } from '@/constants/Features';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function SubscribeScreen() {
  const { upgrade, isPremium, restore, packages, purchasesAvailable } = useSubscription();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [loading, setLoading] = useState<string | null>(null);

  const displayPlans = packages.map((pkg) => {
    const fallback = SUBSCRIPTION_PLANS.find((p) => p.id === pkg.id);
    return {
      id: pkg.id,
      name: pkg.title,
      price: pkg.price,
      period: pkg.period,
      popular: pkg.id === 'yearly',
      features: fallback?.features ?? [],
    };
  });

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    try {
      const result = await upgrade(planId);
      if (result.success) {
        router.back();
      } else if (result.error) {
        Alert.alert('購買失敗', result.error);
      }
    } finally {
      setLoading(null);
    }
  };

  const handleRestore = async () => {
    setLoading('restore');
    try {
      const restored = await restore();
      Alert.alert(restored ? '恢復成功' : '未找到購買紀錄', restored ? '您的會員資格已恢復' : '請確認曾以此帳號購買');
      if (restored) router.back();
    } finally {
      setLoading(null);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <LinearGradient
        colors={[colors.primary + '40', colors.background]}
        style={styles.hero}
      >
        <SymbolView
          name={{ ios: 'crown.fill', android: 'star', web: 'star' }}
          tintColor={colors.secondary}
          size={48}
        />
        <Text style={styles.title}>PeaceZense 會員</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          解鎖完整命理分析，成為自己最好的命理師
        </Text>
      </LinearGradient>

      {isPremium && (
        <View style={[styles.activeBadge, { backgroundColor: colors.secondary + '25' }]}>
          <Text style={[styles.activeText, { color: colors.secondary }]}>✓ 您已是會員</Text>
        </View>
      )}

      {displayPlans.map((plan) => (
        <Pressable
          key={plan.id}
          onPress={() => handleSubscribe(plan.id)}
          disabled={!!loading}
          style={({ pressed }) => [
            styles.planCard,
            {
              backgroundColor: colors.card,
              borderColor: plan.popular ? colors.secondary : colors.border,
              opacity: pressed ? 0.9 : 1,
            },
            plan.popular && styles.popularCard,
          ]}
        >
          {plan.popular && (
            <View style={[styles.popularBadge, { backgroundColor: colors.secondary }]}>
              <Text style={styles.popularText}>最受歡迎</Text>
            </View>
          )}
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.priceRow}>
            {loading === plan.id ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <Text style={[styles.price, { color: colors.primary }]}>{plan.price}</Text>
                <Text style={[styles.period, { color: colors.textSecondary }]}>{plan.period}</Text>
              </>
            )}
          </View>
          {plan.features.map((f) => (
            <View key={f} style={styles.featureRow}>
              <Text style={{ color: colors.accent }}>✓</Text>
              <Text style={[styles.featureText, { color: colors.text }]}>{f}</Text>
            </View>
          ))}
        </Pressable>
      ))}

      <Text style={[styles.note, { color: colors.textSecondary }]}>
        {purchasesAvailable
          ? '透過 App Store / Google Play 安全付款，隨時可取消訂閱。'
          : '開發模式：未設定 RevenueCat API Key，點擊方案可體驗會員功能。正式版請設定 .env 並使用 EAS Build。'}
      </Text>

      <Pressable onPress={handleRestore} disabled={!!loading} style={styles.restoreBtn}>
        {loading === 'restore' ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          <Text style={[styles.restoreText, { color: colors.accent }]}>恢復購買</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  hero: { alignItems: 'center', padding: 32, borderRadius: 20, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', marginTop: 12 },
  tagline: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  activeBadge: { padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  activeText: { fontWeight: '700', fontSize: 15 },
  planCard: { borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2 },
  popularCard: { borderWidth: 2 },
  popularBadge: {
    position: 'absolute', top: -10, right: 16,
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
  },
  popularText: { color: '#1A1428', fontSize: 11, fontWeight: '700' },
  planName: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 16, minHeight: 40 },
  price: { fontSize: 32, fontWeight: '800' },
  period: { fontSize: 14 },
  featureRow: { flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'flex-start' },
  featureText: { fontSize: 14, flex: 1, lineHeight: 20 },
  note: { fontSize: 12, lineHeight: 20, textAlign: 'center', marginTop: 8 },
  restoreBtn: { alignItems: 'center', marginTop: 16, padding: 12, minHeight: 44 },
  restoreText: { fontSize: 14, fontWeight: '600' },
});
