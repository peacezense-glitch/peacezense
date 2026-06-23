import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text } from '@/components/Themed';
import ModuleCard from '@/components/ModuleCard';
import { LIFE_MODULES, EVENT_MODULES } from '@/constants/Modules';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useUserProfile } from '@/context/UserProfileContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { getDailyFortune } from '@/lib/dailyFortune';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { profile } = useUserProfile();
  const { isPremium } = useSubscription();
  const router = useRouter();

  const fortune = getDailyFortune(
    profile.birthDate,
    profile.birthTime,
    profile.gender,
    {
      longitude: profile.longitude,
      useTrueSolarTime: profile.useTrueSolarTime,
      birthPlace: profile.birthPlace,
    },
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[colors.primary + '40', colors.background]}
        style={styles.hero}
      >
        <Text style={styles.logo}>☯ PeaceZense</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          命理靈性導航 · 成為自己最好的命理師
        </Text>
        {profile.name ? (
          <Text style={[styles.greeting, { color: colors.accent }]}>
            歡迎回來，{profile.name}
          </Text>
        ) : (
          <Text style={[styles.greeting, { color: colors.accent }]}>
            請至「我的」設定出生資料，解鎖完整命盤
          </Text>
        )}
      </LinearGradient>

      <View style={[styles.fortuneCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.fortuneTitle, { color: colors.secondary }]}>今日運勢</Text>
        <Text style={[styles.fortuneDate, { color: colors.textSecondary }]}>
          {fortune.date} · {fortune.lunarDate} · {fortune.dayGanZhi}日
        </Text>
        <Text style={styles.fortuneTip}>{fortune.tip}</Text>
        <View style={styles.fortuneMeta}>
          <Text style={[styles.metaItem, { color: colors.accent }]}>幸運色 {fortune.luckyColor}</Text>
          <Text style={[styles.metaItem, { color: colors.accent }]}>吉方 {fortune.luckyDirection}</Text>
          <Text style={[styles.metaItem, { color: colors.accent }]}>幸運數 {fortune.luckyNumber}</Text>
        </View>
        <Text style={[styles.fortuneBazi, { color: colors.textSecondary }]}>
          {fortune.baziSummary}
        </Text>
        <Text style={[styles.fortuneIching, { color: colors.textSecondary }]}>
          今日卦象：{fortune.ichingHexagram}
        </Text>
      </View>

      {!isPremium && (
        <Pressable
          onPress={() => router.push('/subscribe' as never)}
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
        >
          <LinearGradient
            colors={[colors.secondary + '40', colors.primary + '20']}
            style={styles.upgradeBanner}
          >
            <Text style={[styles.upgradeTitle, { color: colors.secondary }]}>
              ✦ 升級會員
            </Text>
            <Text style={[styles.upgradeDesc, { color: colors.textSecondary }]}>
              解鎖大運流年、紫微全盤、AI 命理師對話
            </Text>
          </LinearGradient>
        </Pressable>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>人生層面</Text>
        <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
          探索先天命格與生命藍圖
        </Text>
        {LIFE_MODULES.map((m) => (
          <ModuleCard key={m.id} module={m} compact />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>事件層面</Text>
        <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
          為當下決策尋求指引
        </Text>
        {EVENT_MODULES.map((m) => (
          <ModuleCard key={m.id} module={m} compact />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 32 },
  hero: { padding: 24, paddingTop: 16, paddingBottom: 24 },
  logo: { fontSize: 32, fontWeight: '800', letterSpacing: 2 },
  tagline: { fontSize: 14, marginTop: 8, lineHeight: 20 },
  greeting: { fontSize: 13, marginTop: 12, fontStyle: 'italic' },
  fortuneCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  fortuneTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  fortuneDate: { fontSize: 12, marginBottom: 10 },
  fortuneTip: { fontSize: 16, lineHeight: 24, fontWeight: '500', marginBottom: 12 },
  fortuneMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 10 },
  metaItem: { fontSize: 12, fontWeight: '600' },
  fortuneBazi: { fontSize: 12, lineHeight: 18, marginBottom: 4 },
  fortuneIching: { fontSize: 12 },
  upgradeBanner: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
  },
  upgradeTitle: { fontSize: 16, fontWeight: '700' },
  upgradeDesc: { fontSize: 13, marginTop: 4 },
  section: { paddingHorizontal: 20, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  sectionDesc: { fontSize: 13, marginBottom: 12 },
});
