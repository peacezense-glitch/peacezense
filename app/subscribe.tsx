import { StyleSheet, ScrollView, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Text } from '@/components/Themed';
import { useSubscription } from '@/context/SubscriptionContext';
import { SUBSCRIPTION_PLANS } from '@/constants/Features';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function SubscribeScreen() {
  const { upgrade, isPremium, restore } = useSubscription();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const handleSubscribe = async (planId: string) => {
    await upgrade(planId === 'yearly' ? 'peacezense_yearly' : 'peacezense_monthly');
    router.back();
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
          <Text style={[styles.activeText, { color: colors.secondary }]}>
            ✓ 您已是會員
          </Text>
        </View>
      )}

      {SUBSCRIPTION_PLANS.map((plan) => (
        <Pressable
          key={plan.id}
          onPress={() => handleSubscribe(plan.id)}
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
            <Text style={[styles.price, { color: colors.primary }]}>{plan.price}</Text>
            <Text style={[styles.period, { color: colors.textSecondary }]}>{plan.period}</Text>
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
        免費版已包含八字命盤、十神、喜用神與五大人生專題分析。{'\n'}
        升級後解鎖大運流年、紫微全盤、AI 命理師、PDF 匯出等進階功能。{'\n'}
        付款功能即將上線，目前可體驗完整會員功能。
      </Text>

      <Pressable onPress={() => restore()} style={styles.restoreBtn}>
        <Text style={[styles.restoreText, { color: colors.accent }]}>恢復購買</Text>
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
  planCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
  },
  popularCard: { borderWidth: 2 },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: { color: '#1A1428', fontSize: 11, fontWeight: '700' },
  planName: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 16 },
  price: { fontSize: 32, fontWeight: '800' },
  period: { fontSize: 14 },
  featureRow: { flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'flex-start' },
  featureText: { fontSize: 14, flex: 1, lineHeight: 20 },
  note: { fontSize: 12, lineHeight: 20, textAlign: 'center', marginTop: 8 },
  restoreBtn: { alignItems: 'center', marginTop: 16, padding: 12 },
  restoreText: { fontSize: 14, fontWeight: '600' },
});
