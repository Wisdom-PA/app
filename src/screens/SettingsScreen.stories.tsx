import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { CubeApiProvider } from '../context/CubeApiContext';
import { SettingsStack } from '../navigation/stacks/SettingsStack';

export default {
  title: 'Screens/SettingsScreen',
  component: SettingsStack,
};

export const Default = (): React.JSX.Element => (
  <CubeApiProvider>
    <NavigationContainer>
      <SettingsStack />
    </NavigationContainer>
  </CubeApiProvider>
);
