import { Platform, ViewStyle } from 'react-native';

export const ELEMENT_COLORS: Record<string, string> = {
  木: '#2E7D5A',
  火: '#D4763A',
  土: '#8B7355',
  金: '#C9A962',
  水: '#4A6FA5',
};

export const RATING_COLORS: Record<string, string> = {
  大吉: '#2E7D5A',
  吉: '#6B4E9B',
  平: '#C9A962',
  凶: '#8B2942',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  pill: 24,
} as const;

export function cardShadow(colorScheme: 'light' | 'dark'): ViewStyle {
  const shadowColor = colorScheme === 'light' ? '#2C2438' : '#000';
  return Platform.select({
    ios: {
      shadowColor,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: colorScheme === 'light' ? 0.1 : 0.25,
      shadowRadius: 10,
    },
    android: { elevation: 4 },
    default: {
      boxShadow: `0 3px 12px ${colorScheme === 'light' ? 'rgba(44,36,56,0.1)' : 'rgba(0,0,0,0.3)'}`,
    },
  }) as ViewStyle;
}

export function tabBarShadow(colorScheme: 'light' | 'dark'): ViewStyle {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: colorScheme === 'light' ? 0.06 : 0.2,
      shadowRadius: 8,
    },
    android: { elevation: 8 },
    default: {},
  }) as ViewStyle;
}
