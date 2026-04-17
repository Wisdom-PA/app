import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { mockCubeApi, resetMockCubeApiState } from '../../api/mockCubeApi';
import type { RoutinesStackParamList } from '../../navigation/paramLists';
import { RoutineDetailScreen } from '../RoutineDetailScreen';
import { withStackNavigation } from '../../test/withStackNavigation';

const Stack = createNativeStackNavigator<RoutinesStackParamList>();

function RoutineDetailTestStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RoutineDetail"
        component={RoutineDetailScreen}
        initialParams={{ routine: { id: 'r1', name: 'Evening lights' } }}
      />
    </Stack.Navigator>
  );
}

describe('RoutineDetailScreen', () => {
  beforeEach(() => {
    resetMockCubeApiState();
  });

  it('saves display name via mock API', async () => {
    render(withStackNavigation(RoutineDetailTestStack));
    await waitFor(() => {
      expect(screen.getByLabelText('Routine display name')).toBeTruthy();
    });
    fireEvent.changeText(screen.getByLabelText('Routine display name'), 'Sunset');
    fireEvent.press(screen.getByLabelText('Save routine name'));
    await waitFor(() => {
      expect(screen.getByText('Sunset')).toBeTruthy();
    });
    const list = await mockCubeApi.getRoutines();
    expect(list.routines.find((r) => r.id === 'r1')?.name).toBe('Sunset');
  });
});
