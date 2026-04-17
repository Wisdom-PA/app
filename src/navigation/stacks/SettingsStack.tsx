import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../paramLists';
import { ConnectivityWizardScreen } from '../../screens/ConnectivityWizardScreen';
import { CubeSettingsScreen } from '../../screens/CubeSettingsScreen';
import { InternetActivityScreen } from '../../screens/InternetActivityScreen';
import { SettingsScreen } from '../../screens/SettingsScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SettingsList" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="CubeSettings" component={CubeSettingsScreen} options={{ title: 'Cube settings' }} />
      <Stack.Screen
        name="ConnectivityWizard"
        component={ConnectivityWizardScreen}
        options={{ title: 'Connectivity' }}
      />
      <Stack.Screen
        name="InternetActivity"
        component={InternetActivityScreen}
        options={{ title: 'Internet activity' }}
      />
    </Stack.Navigator>
  );
}

export type { SettingsStackParamList } from '../paramLists';
