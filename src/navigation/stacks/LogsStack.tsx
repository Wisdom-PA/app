import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { LogsStackParamList } from '../paramLists';
import { LogChainDetailScreen } from '../../screens/LogChainDetailScreen';
import { LogsScreen } from '../../screens/LogsScreen';

const Stack = createNativeStackNavigator<LogsStackParamList>();

export function LogsStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LogsList" component={LogsScreen} options={{ title: 'Logs' }} />
      <Stack.Screen
        name="LogChainDetail"
        component={LogChainDetailScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
}

export type { LogsStackParamList } from '../paramLists';
