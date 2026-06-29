import { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { InfoCard, InfoRow, ModuleScreenLayout } from '@/components/InfoCard';
import { calculateQiMen, getQiMenGuidance, getAuspiciousDirections } from '@/lib/qimen';
import { QiMenPlate } from '@/types';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function QiMenScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [plate, setPlate] = useState<QiMenPlate | null>(null);

  const cast = () => setPlate(calculateQiMen());

  return (
    <ModuleScreenLayout>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        奇門遁甲 · 時空決策盤
      </Text>

      <Pressable
        onPress={cast}
        style={({ pressed }) => [
          styles.castButton,
          { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={styles.castText}>{plate ? '重新起盤' : '起盤'}</Text>
      </Pressable>

      {plate && (
        <>
          <InfoCard title="局勢概覽">
            <InfoRow label="遁法" value={plate.dun} />
            <InfoRow label="局數" value={`第 ${plate.ju} 局`} />
            <InfoRow label="值符" value={plate.zhiFu} />
            <InfoRow label="值使" value={plate.zhiShi} />
            <Text style={[styles.guidance, { color: colors.textSecondary }]}>
              {getQiMenGuidance(plate)}
            </Text>
          </InfoCard>

          <InfoCard title="吉方">
            {getAuspiciousDirections(plate).map((dir, i) => (
              <Text key={i} style={[styles.direction, { color: colors.accent }]}>
                {dir}
              </Text>
            ))}
          </InfoCard>

          <InfoCard title="九宮盤">
            {plate.palaces.map((p) => (
              <InfoRow
                key={p.position}
                label={p.name}
                value={`${p.door}門 · ${p.star}星 · ${p.deity}`}
              />
            ))}
          </InfoCard>
        </>
      )}

      {!plate && (
        <InfoCard title="奇門說明">
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            奇門遁甲是中國古代三大秘術之一，以時間為經、空間為緯，分析當下時空的能量格局。可用於擇吉、決策與趨避。
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
  guidance: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  direction: {
    fontSize: 14,
    paddingVertical: 4,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
});
