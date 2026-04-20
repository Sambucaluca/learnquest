import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Tabs } from './src/navigation/Tabs';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { QuizScreen } from './src/screens/QuizScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { useStore } from './src/store/useStore';
import { colors } from './src/theme';
import type { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.text,
    primary: colors.primary,
    border: colors.border,
    notification: colors.primary,
  },
};

export default function App() {
  const onboarded = useStore((s) => s.onboarded);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={navTheme}>
        {onboarded ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen
              name="Quiz"
              component={QuizScreen}
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="Result"
              component={ResultScreen}
              options={{ presentation: 'card', animation: 'fade' }}
            />
          </Stack.Navigator>
        ) : (
          <OnboardingScreen />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
