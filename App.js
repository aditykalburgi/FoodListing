import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/styles/common';

// Custom theme for React Native Paper
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    background: colors.background,
    surface: colors.white,
    onSurface: colors.text,
  },
  roundness: 12,
};

function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.white}
          translucent={false}
        />
        <RootNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
