import { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import HexagramDisplay from '@/components/HexagramDisplay';
import { InfoCard, ModuleScreenLayout } from '@/components/InfoCard';
import { castHexagram, getIChingGuidance } from '@/lib/iching';
import { IChingHexagram } from '@/types';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function IChingScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [hexagram, setHexagram] = useState<IChingHexagram | null>(null);

  const cast = () => setHexagram(castHexagram());

  return (
    <ModuleScreenLayout>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        易經占卜 · 誠心問卦
      </Text>

      <Pressable
        onPress={cast}
        style={({ pressed }) => [
          styles.castButton,
          { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={styles.castText}>{hexagram ? '重新占卜' : '開始占卜'}</Text>
      </Pressable>

      {hexagram && (
        <>
          <InfoCard title={`第 ${hexagram.number} 卦`}>
            <HexagramDisplay lines={hexagram.lines} name={hexagram.name} />
            <Text style={[styles.nameEn, { color: colors.textSecondary }]}>
              {hexagram.nameEn}
            </Text>
            <Text style={styles.trigrams}>
              {hexagram.upperTrigram}上 · {hexagram.lowerTrigram}下
            </Text>
          </InfoCard>

          <InfoCard title="卦辭">
            <Text style={styles.judgment}>{hexagram.judgment}</Text>
          </InfoCard>

          <InfoCard title="象傳">
            <Text style={[styles.image, { color: colors.textSecondary }]}>
              {hexagram.image}
            </Text>
          </InfoCard>

          <InfoCard title="指引">
            <Text style={[styles.guidance, { color: colors.textSecondary }]}>
              {getIChingGuidance(hexagram)}
            </Text>
          </InfoCard>
        </>
      )}

      {!hexagram && (
        <InfoCard title="占卜說明">
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            靜心冥想你所問之事，然後按下「開始占卜」。易經以三枚銅錢法模擬起卦，為你呈現當下能量的卦象指引。
          </Text>
        </InfoCard>
      )}
    </ModuleScreenLayout>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  castButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  castText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  nameEn: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 4,
  },
  trigrams: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 8,
  },
  judgment: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
    textAlign: 'center',
  },
  image: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  guidance: {
    fontSize: 14,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
});
