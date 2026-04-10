import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { SettingsStackParamList } from '../navigation/paramLists';
import { WiFiPlaceholderScreen } from './WiFiPlaceholderScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default {
  title: 'Screens/WiFiPlaceholderScreen',
  component: WiFiPlaceholderScreen,
};

export const Default = (): React.JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="WiFiPlaceholder"
        component={WiFiPlaceholderScreen}
        options={{ title: 'Wi‑Fi setup' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
