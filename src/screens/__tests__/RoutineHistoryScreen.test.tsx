import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { resetMockCubeApiState } from '../../api/mockCubeApi';
import type { RoutinesStackParamList } from '../../navigation/paramLists';
import { RoutineHistoryScreen } from '../RoutineHistoryScreen';
import { withStackNavigation } from '../../test/withStackNavigation';

const Stack = createNativeStackNavigator<RoutinesStackParamList>();

function RoutineHistoryTestStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RoutineHistory" component={RoutineHistoryScreen} options={{ title: 'Runs' }} />
    </Stack.Navigator>
  );
}

describe('RoutineHistoryScreen', () => {
  beforeEach(() => {
    resetMockCubeApiState();
  });

  it('loads mock history and shows a run', async () => {
    render(withStackNavigation(RoutineHistoryTestStack));
    expect(screen.getByLabelText('Routine history screen')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText('Evening lights')).toBeTruthy();
    });
    expect(screen.getByText(/All steps ok/)).toBeTruthy();
  });
});
