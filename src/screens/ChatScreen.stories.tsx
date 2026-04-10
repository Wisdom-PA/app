import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { ChatStackParamList } from '../navigation/paramLists';
import { CubeApiProvider } from '../context/CubeApiContext';
import { ChatScreen } from './ChatScreen';

const Stack = createNativeStackNavigator<ChatStackParamList>();

export default {
  title: 'Screens/ChatScreen',
  component: ChatScreen,
};

export const Default = (): React.JSX.Element => (
  <CubeApiProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ChatMain" component={ChatScreen} options={{ title: 'Chat' }} />
      </Stack.Navigator>
    </NavigationContainer>
  </CubeApiProvider>
);
