import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { LogsStackParamList } from '../navigation/paramLists';
import { LogChainDetailScreen } from './LogChainDetailScreen';

const Stack = createNativeStackNavigator<LogsStackParamList>();

const sample = JSON.stringify({ chain_id: 'demo', intents: [{ utterance: 'turn on lights' }] });

export default {
  title: 'Screens/LogChainDetailScreen',
  component: LogChainDetailScreen,
};

export const Default = (): React.JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="LogChainDetail"
        component={LogChainDetailScreen}
        options={{ title: 'Chain demo' }}
        initialParams={{ chainJson: sample, title: 'Chain demo' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
