import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DevicesStackParamList } from '../paramLists';
import { DeviceDetailScreen } from '../../screens/DeviceDetailScreen';
import { DevicesScreen } from '../../screens/DevicesScreen';

const Stack = createNativeStackNavigator<DevicesStackParamList>();

export function DevicesStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DevicesList" component={DevicesScreen} options={{ title: 'Devices' }} />
      <Stack.Screen
        name="DeviceDetail"
        component={DeviceDetailScreen}
        options={({ route }) => ({
          title: route.params.device.name ?? 'Device',
        })}
      />
    </Stack.Navigator>
  );
}

export type { DevicesStackParamList } from '../paramLists';
