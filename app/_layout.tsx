import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { UserProfileProvider } from '@/context/UserProfileContext';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <UserProfileProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modules/bazi"
          options={{ title: '八字', headerBackTitle: '返回' }}
        />
        <Stack.Screen
          name="modules/ziwei"
          options={{ title: '紫微斗數', headerBackTitle: '返回' }}
        />
        <Stack.Screen
          name="modules/human-design"
          options={{ title: '人類圖', headerBackTitle: '返回' }}
        />
        <Stack.Screen
          name="modules/astrology"
          options={{ title: '占星', headerBackTitle: '返回' }}
        />
        <Stack.Screen
          name="modules/mayan"
          options={{ title: '瑪雅曆法', headerBackTitle: '返回' }}
        />
        <Stack.Screen
          name="modules/iching"
          options={{ title: '易經占卜', headerBackTitle: '返回' }}
        />
        <Stack.Screen
          name="modules/qimen"
          options={{ title: '奇門遁甲', headerBackTitle: '返回' }}
        />
      </Stack>
    </UserProfileProvider>
  );
}
