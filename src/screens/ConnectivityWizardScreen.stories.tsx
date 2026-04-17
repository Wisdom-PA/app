import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { CubeApi } from '../api/cubeApi';
import { mockCubeApi } from '../api/mockCubeApi';
import { CubeApiProvider } from '../context/CubeApiContext';
import type { SettingsStackParamList } from '../navigation/paramLists';
import { ConnectivityWizardScreen } from './ConnectivityWizardScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default {
  title: 'Screens/ConnectivityWizardScreen',
  component: ConnectivityWizardScreen,
};

function WizardStory(params?: { initialStep?: 'pair' | 'wifi' | 'verify' }, api?: CubeApi): React.JSX.Element {
  return (
    <CubeApiProvider cubeApiOverride={api}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="ConnectivityWizard"
            component={ConnectivityWizardScreen}
            initialParams={params}
            options={{ title: 'Connectivity' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CubeApiProvider>
  );
}

export const Default = (): React.JSX.Element => WizardStory();

export const VerifyTab = (): React.JSX.Element => WizardStory({ initialStep: 'verify' });

export const VerifyFailure = (): React.JSX.Element => {
  const bad: CubeApi = {
    ...mockCubeApi,
    getStatus: async () => {
      throw new Error('Cube API 503: offline');
    },
  };
  return WizardStory({ initialStep: 'verify' }, bad);
};
