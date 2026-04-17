import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { CubeApiProvider } from '../context/CubeApiContext';
import type { RoutinesStackParamList } from '../navigation/paramLists';
import { RoutineHistoryScreen } from './RoutineHistoryScreen';

const Stack = createNativeStackNavigator<RoutinesStackParamList>();

export default {
  title: 'Screens/RoutineHistoryScreen',
  component: RoutineHistoryScreen,
};

export const Default = (): React.JSX.Element => (
  <CubeApiProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="RoutineHistory" component={RoutineHistoryScreen} options={{ title: 'Runs' }} />
      </Stack.Navigator>
    </NavigationContainer>
  </CubeApiProvider>
);
