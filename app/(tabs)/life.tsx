import { StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/Themed';
import ModuleCard from '@/components/ModuleCard';
import { LIFE_MODULES } from '@/constants/Modules';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function LifeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.intro, { color: colors.textSecondary }]}>
        人生層面涵蓋你的先天命格與生命藍圖。透過多種命理體系交叉參照，更全面地理解自己的本質與天賦。
      </Text>
      {LIFE_MODULES.map((m) => (
        <ModuleCard key={m.id} module={m} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  intro: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
});
