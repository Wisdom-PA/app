import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ChatStackParamList } from '../paramLists';
import { ChatScreen } from '../../screens/ChatScreen';

const Stack = createNativeStackNavigator<ChatStackParamList>();

export function ChatStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatMain" component={ChatScreen} options={{ title: 'Chat' }} />
    </Stack.Navigator>
  );
}

export type { ChatStackParamList } from '../paramLists';
