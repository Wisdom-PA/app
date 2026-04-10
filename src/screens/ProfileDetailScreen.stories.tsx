import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { ProfilesStackParamList } from '../navigation/paramLists';
import { ProfileDetailScreen } from './ProfileDetailScreen';

const Stack = createNativeStackNavigator<ProfilesStackParamList>();

export default {
  title: 'Screens/ProfileDetailScreen',
  component: ProfileDetailScreen,
};

export const Default = (): React.JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileDetail"
        component={ProfileDetailScreen}
        options={{ title: 'Adult' }}
        initialParams={{ profile: { id: 'p1', role: 'adult', display_name: 'Adult' } }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
