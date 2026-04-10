import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfilesStackParamList } from '../paramLists';
import { ProfileDetailScreen } from '../../screens/ProfileDetailScreen';
import { ProfilesScreen } from '../../screens/ProfilesScreen';

const Stack = createNativeStackNavigator<ProfilesStackParamList>();

export function ProfilesStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfilesList" component={ProfilesScreen} options={{ title: 'Profiles' }} />
      <Stack.Screen
        name="ProfileDetail"
        component={ProfileDetailScreen}
        options={({ route }) => ({
          title: route.params.profile.display_name ?? 'Profile',
        })}
      />
    </Stack.Navigator>
  );
}

export type { ProfilesStackParamList } from '../paramLists';
