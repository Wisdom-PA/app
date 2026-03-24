import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DevicesScreen } from '../../screens/DevicesScreen';

export type DevicesStackParamList = {
  DevicesList: undefined;
};

const Stack = createNativeStackNavigator<DevicesStackParamList>();

export function DevicesStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DevicesList" component={DevicesScreen} options={{ title: 'Devices' }} />
    </Stack.Navigator>
  );
}
