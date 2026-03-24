import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsScreen } from '../../screens/SettingsScreen';

export type SettingsStackParamList = {
  SettingsList: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SettingsList" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
}
