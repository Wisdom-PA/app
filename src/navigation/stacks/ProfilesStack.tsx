import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfilesScreen } from '../../screens/ProfilesScreen';

export type ProfilesStackParamList = {
  ProfilesList: undefined;
};

const Stack = createNativeStackNavigator<ProfilesStackParamList>();

export function ProfilesStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfilesList" component={ProfilesScreen} options={{ title: 'Profiles' }} />
    </Stack.Navigator>
  );
}
