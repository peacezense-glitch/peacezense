import { StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/Themed';
import ModuleCard from '@/components/ModuleCard';
import { EVENT_MODULES } from '@/constants/Modules';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function EventsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.intro, { color: colors.textSecondary }]}>
        事件層面協助你在特定時刻做出決策。無論是面臨抉擇、規劃行動，或尋求當下指引，這些工具都能提供獨特的視角。
      </Text>
      {EVENT_MODULES.map((m) => (
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
