import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { CubeApiProvider } from '../context/CubeApiContext';
import type { SettingsStackParamList } from '../navigation/paramLists';
import { InternetActivityScreen } from './InternetActivityScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default {
  title: 'Screens/InternetActivityScreen',
  component: InternetActivityScreen,
};

export const Default = (): React.JSX.Element => (
  <CubeApiProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="InternetActivity"
          component={InternetActivityScreen}
          options={{ title: 'Internet activity' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </CubeApiProvider>
);
