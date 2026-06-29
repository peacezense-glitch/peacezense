import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { radius } from '@/constants/Theme';

interface ChipProps {
  label: string;
  color?: string;
  style?: ViewStyle;
}

export default function Chip({ label, color, style }: ChipProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const tint = color ?? colors.accent;

  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: tint + '18', borderColor: tint + '40' },
        style,
      ]}
    >
      <Text style={[styles.label, { color: tint }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
