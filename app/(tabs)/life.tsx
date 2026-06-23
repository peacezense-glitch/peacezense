import { StyleSheet, ScrollView } from 'react-native';
import ModuleCard from '@/components/ModuleCard';
import GradientBackground from '@/components/GradientBackground';
import ScreenHeader from '@/components/ScreenHeader';
import { LIFE_MODULES } from '@/constants/Modules';

export default function LifeScreen() {
  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="人生層面"
          subtitle="涵蓋先天命格與生命藍圖，透過多種命理體系交叉參照，更全面地理解自己的本質與天賦。"
        />
        {LIFE_MODULES.map((m) => (
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
