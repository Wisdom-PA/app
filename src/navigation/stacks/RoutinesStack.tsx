import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RoutinesScreen } from '../../screens/RoutinesScreen';

export type RoutinesStackParamList = {
  RoutinesList: undefined;
};

const Stack = createNativeStackNavigator<RoutinesStackParamList>();

export function RoutinesStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RoutinesList" component={RoutinesScreen} options={{ title: 'Routines' }} />
    </Stack.Navigator>
  );
}
