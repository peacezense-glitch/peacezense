import { StyleSheet, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/Themed';
import ModuleCard from '@/components/ModuleCard';
import { LIFE_MODULES, EVENT_MODULES } from '@/constants/Modules';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useUserProfile } from '@/context/UserProfileContext';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { profile } = useUserProfile();

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
          命理靈性導航 · 探索生命的多維藍圖
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

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>人生層面</Text>
        <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
          探索先天命格與生命藍圖
        </Text>
        {LIFE_MODULES.slice(0, 3).map((m) => (
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
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  greeting: {
    fontSize: 13,
    marginTop: 12,
    fontStyle: 'italic',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    marginBottom: 12,
  },
});
