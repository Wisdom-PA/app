import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { CubeApiProvider } from '../context/CubeApiContext';
import type { SettingsStackParamList } from '../navigation/paramLists';
import { CubeSettingsScreen } from './CubeSettingsScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default {
  title: 'Screens/CubeSettingsScreen',
  component: CubeSettingsScreen,
};

export const Default = (): React.JSX.Element => (
  <CubeApiProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="CubeSettings"
          component={CubeSettingsScreen}
          options={{ title: 'Cube settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </CubeApiProvider>
);
