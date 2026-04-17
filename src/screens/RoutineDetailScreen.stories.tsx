import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { CubeApiProvider } from '../context/CubeApiContext';
import type { RoutinesStackParamList } from '../navigation/paramLists';
import { RoutineDetailScreen } from './RoutineDetailScreen';

const Stack = createNativeStackNavigator<RoutinesStackParamList>();

export default {
  title: 'Screens/RoutineDetailScreen',
  component: RoutineDetailScreen,
};

export const Default = (): React.JSX.Element => (
  <CubeApiProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="RoutineDetail"
          component={RoutineDetailScreen}
          options={{ title: 'Evening lights' }}
          initialParams={{ routine: { id: 'r1', name: 'Evening lights' } }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </CubeApiProvider>
);
