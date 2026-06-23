import { StyleSheet, ScrollView } from 'react-native';
import ModuleCard from '@/components/ModuleCard';
import GradientBackground from '@/components/GradientBackground';
import ScreenHeader from '@/components/ScreenHeader';
import { EVENT_MODULES } from '@/constants/Modules';

export default function EventsScreen() {
  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="事件層面"
          subtitle="協助你在特定時刻做出決策。無論是面臨抉擇、規劃行動，或尋求當下指引，這些工具都能提供獨特的視角。"
        />
        {EVENT_MODULES.map((m) => (
          <ModuleCard key={m.id} module={m} />
        ))}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingBottom: 40,
  },
});
