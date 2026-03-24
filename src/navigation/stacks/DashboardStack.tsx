import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../../screens/DashboardScreen';

export type DashboardStackParamList = {
  DashboardList: undefined;
};

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export function DashboardStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DashboardList" component={DashboardScreen} options={{ title: 'Dashboard' }} />
    </Stack.Navigator>
  );
}
