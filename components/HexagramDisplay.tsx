import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { IChingLine } from '@/types';

interface HexagramDisplayProps {
  lines: IChingLine[];
  name: string;
}

export default function HexagramDisplay({ lines, name }: HexagramDisplayProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const reversed = [...lines].reverse();

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.hexagram}>
        {reversed.map((line, i) => (
          <View key={i} style={styles.lineRow}>
            {line.isYang ? (
              <View style={[styles.yangLine, { backgroundColor: colors.primary }]} />
            ) : (
              <View style={styles.yinRow}>
                <View style={[styles.yinSegment, { backgroundColor: colors.primary }]} />
                <View style={[styles.yinSegment, { backgroundColor: colors.primary }]} />
              </View>
            )}
            {line.isChanging && (
              <Text style={[styles.changing, { color: colors.secondary }]}>變</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  hexagram: {
    gap: 8,
    width: 120,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  yangLine: {
    flex: 1,
    height: 8,
    borderRadius: 2,
  },
  yinRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  yinSegment: {
    flex: 1,
    height: 8,
    borderRadius: 2,
  },
  changing: {
    fontSize: 12,
    fontWeight: '600',
    width: 20,
  },
});
