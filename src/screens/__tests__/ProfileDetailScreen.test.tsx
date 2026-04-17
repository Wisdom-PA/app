import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { mockCubeApi, resetMockCubeApiState } from '../../api/mockCubeApi';
import type { ProfilesStackParamList } from '../../navigation/paramLists';
import { ProfileDetailScreen } from '../ProfileDetailScreen';
import { withStackNavigation } from '../../test/withStackNavigation';

const Stack = createNativeStackNavigator<ProfilesStackParamList>();

function ProfileDetailTestStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileDetail"
        component={ProfileDetailScreen}
        initialParams={{ profile: { id: 'p1', role: 'adult', display_name: 'Adult' } }}
      />
    </Stack.Navigator>
  );
}

describe('ProfileDetailScreen', () => {
  beforeEach(() => {
    resetMockCubeApiState();
  });

  it('saves display name via mock API', async () => {
    render(withStackNavigation(ProfileDetailTestStack));
    await waitFor(() => {
      expect(screen.getByLabelText('Profile display name')).toBeTruthy();
    });
    fireEvent.changeText(screen.getByLabelText('Profile display name'), 'Household lead');
    fireEvent.press(screen.getByLabelText('Save profile display name'));
    await waitFor(() => {
      expect(screen.getByText('Household lead')).toBeTruthy();
    });
    const list = await mockCubeApi.getProfiles();
    expect(list.profiles.find((p) => p.id === 'p1')?.display_name).toBe('Household lead');
  });
});
