import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RoutinesStackParamList } from '../paramLists';
import { RoutineDetailScreen } from '../../screens/RoutineDetailScreen';
import { RoutinesScreen } from '../../screens/RoutinesScreen';

const Stack = createNativeStackNavigator<RoutinesStackParamList>();

export function RoutinesStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RoutinesList" component={RoutinesScreen} options={{ title: 'Routines' }} />
      <Stack.Screen
        name="RoutineDetail"
        component={RoutineDetailScreen}
        options={({ route }) => ({
          title: route.params.routine.name ?? 'Routine',
        })}
      />
    </Stack.Navigator>
  );
}

export type { RoutinesStackParamList } from '../paramLists';
