import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Text } from '@/components/Themed';
import ModuleCard from '@/components/ModuleCard';
import GradientBackground from '@/components/GradientBackground';
import Chip from '@/components/ui/Chip';
import { LIFE_MODULES, EVENT_MODULES } from '@/constants/Modules';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { cardShadow, radius, spacing } from '@/constants/Theme';
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
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.primary + '50', colors.secondary + '20', 'transparent']}
          style={styles.hero}
        >
          <View style={styles.heroRow}>
            <Text style={[styles.logo, { color: colors.text }]}>☯ PeaceZense</Text>
            {!isPremium && (
              <Pressable
                onPress={() => router.push('/subscribe' as never)}
                style={[styles.proBadge, { backgroundColor: colors.secondary }]}
              >
                <Text style={[styles.proBadgeText, { color: colors.onSecondary }]}>升級</Text>
              </Pressable>
            )}
          </View>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            命理靈性導航 · 成為自己最好的命理師
          </Text>
          {profile.name ? (
            <Text style={[styles.greeting, { color: colors.accent }]}>
              歡迎回來，{profile.name}
            </Text>
          ) : (
            <Pressable onPress={() => router.push('/(tabs)/profile' as never)}>
              <Text style={[styles.greeting, { color: colors.accent }]}>
                請至「我的」設定出生資料，解鎖完整命盤 →
              </Text>
            </Pressable>
          )}
        </LinearGradient>

        <View
          style={[
            styles.fortuneCard,
            cardShadow(colorScheme),
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.fortuneAccent, { backgroundColor: colors.secondary }]} />
          <View style={styles.fortuneHeader}>
            <Text style={[styles.fortuneTitle, { color: colors.secondary }]}>今日運勢</Text>
            <View style={[styles.fortuneIcon, { backgroundColor: colors.primary + '20' }]}>
              <SymbolView
                name={{ ios: 'sun.max.fill', android: 'wb_sunny', web: 'wb_sunny' } as unknown as Parameters<
                  typeof SymbolView
                >[0]['name']}
                tintColor={colors.primary}
                size={18}
              />
            </View>
          </View>
          <Text style={[styles.fortuneDate, { color: colors.textSecondary }]}>
            {fortune.date} · {fortune.lunarDate} · {fortune.dayGanZhi}日
          </Text>
          <Text style={[styles.fortuneTip, { color: colors.text }]}>{fortune.tip}</Text>
          <View style={styles.fortuneMeta}>
            <Chip label={`幸運色 ${fortune.luckyColor}`} color={colors.secondary} />
            <Chip label={`吉方 ${fortune.luckyDirection}`} color={colors.primary} />
            <Chip label={`幸運數 ${fortune.luckyNumber}`} color={colors.accent} />
          </View>
          <Text style={[styles.fortuneBazi, { color: colors.textSecondary }]}>
            {fortune.baziSummary}
          </Text>
          <Text style={[styles.fortuneIching, { color: colors.textSecondary }]}>
            今日卦象：{fortune.ichingHexagram}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/modules/bazi-date' as never)}
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
        >
          <LinearGradient
            colors={[colors.secondary + '35', colors.secondary + '15']}
            style={[
              styles.zeriBanner,
              cardShadow(colorScheme),
              { borderColor: colors.secondary + '50' },
            ]}
          >
            <View style={styles.zeriRow}>
              <View style={[styles.zeriIcon, { backgroundColor: colors.secondary + '40' }]}>
                <SymbolView
                  name={{ ios: 'calendar.badge.clock', android: 'event', web: 'event' } as unknown as Parameters<
                    typeof SymbolView
                  >[0]['name']}
                  tintColor={colors.onSecondary}
                  size={22}
                />
              </View>
              <View style={styles.zeriText}>
                <Text style={[styles.zeriTitle, { color: colors.onSecondary }]}>八字擇日</Text>
                <Text style={[styles.zeriDesc, { color: colors.onSecondary, opacity: 0.75 }]}>
                  結婚、搬家、開業… 依命盤挑選良辰吉日
                </Text>
              </View>
              <SymbolView
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' } as unknown as Parameters<
                  typeof SymbolView
                >[0]['name']}
                tintColor={colors.onSecondary}
                size={18}
              />
            </View>
          </LinearGradient>
        </Pressable>

        {!isPremium && (
          <Pressable
            onPress={() => router.push('/subscribe' as never)}
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
          >
            <LinearGradient
              colors={[colors.primary + '30', colors.secondary + '25']}
              style={[styles.upgradeBanner, cardShadow(colorScheme), { borderColor: colors.primary + '30' }]}
            >
              <Text style={[styles.upgradeTitle, { color: colors.primary }]}>
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
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: spacing.xxxl },
  hero: { padding: spacing.xxl, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  heroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontSize: 30, fontWeight: '800', letterSpacing: 1.5 },
  proBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.pill },
  proBadgeText: { fontSize: 12, fontWeight: '700' },
  tagline: { fontSize: 14, marginTop: spacing.sm, lineHeight: 22 },
  greeting: { fontSize: 13, marginTop: spacing.md, fontWeight: '500' },
  fortuneCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  fortuneAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  fortuneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  fortuneIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fortuneTitle: { fontSize: 18, fontWeight: '800' },
  fortuneDate: { fontSize: 12, marginBottom: spacing.md },
  fortuneTip: { fontSize: 17, lineHeight: 26, fontWeight: '600', marginBottom: spacing.md },
  fortuneMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  fortuneBazi: { fontSize: 12, lineHeight: 18, marginBottom: 4 },
  fortuneIching: { fontSize: 12 },
  zeriBanner: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  zeriRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  zeriIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zeriText: { flex: 1 },
  zeriTitle: { fontSize: 17, fontWeight: '800' },
  zeriDesc: { fontSize: 13, marginTop: 2, lineHeight: 18 },
  upgradeBanner: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  upgradeTitle: { fontSize: 16, fontWeight: '800' },
  upgradeDesc: { fontSize: 13, marginTop: 4, lineHeight: 20 },
  section: { paddingHorizontal: spacing.xl, marginTop: spacing.sm },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  sectionDesc: { fontSize: 13, marginBottom: spacing.md },
});
