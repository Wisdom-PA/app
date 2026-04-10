import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { SettingsStackParamList } from '../navigation/paramLists';
import { PairingPlaceholderScreen } from './PairingPlaceholderScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default {
  title: 'Screens/PairingPlaceholderScreen',
  component: PairingPlaceholderScreen,
};

export const Default = (): React.JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="PairingPlaceholder"
        component={PairingPlaceholderScreen}
        options={{ title: 'Pairing' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
