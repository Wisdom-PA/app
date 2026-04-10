import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { DevicesStackParamList } from '../navigation/paramLists';
import { DeviceDetailScreen } from './DeviceDetailScreen';

const Stack = createNativeStackNavigator<DevicesStackParamList>();

export default {
  title: 'Screens/DeviceDetailScreen',
  component: DeviceDetailScreen,
};

export const Default = (): React.JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="DeviceDetail"
        component={DeviceDetailScreen}
        options={{ title: 'Living room light' }}
        initialParams={{
          device: {
            id: 'light-1',
            name: 'Living room light',
            type: 'light',
            room: 'Living room',
            power: true,
            brightness: 0.75,
          },
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
