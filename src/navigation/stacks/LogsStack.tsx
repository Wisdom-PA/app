import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogsScreen } from '../../screens/LogsScreen';

export type LogsStackParamList = {
  LogsList: undefined;
};

const Stack = createNativeStackNavigator<LogsStackParamList>();

export function LogsStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LogsList" component={LogsScreen} options={{ title: 'Logs' }} />
    </Stack.Navigator>
  );
}
