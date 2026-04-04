import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { CubeApiProvider } from '../../context/CubeApiContext';
import { RoutinesScreen } from '../RoutinesScreen';

function renderWithProvider(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<CubeApiProvider>{ui}</CubeApiProvider>);
}

describe('RoutinesScreen', () => {
  it('loads routines from mock API and exposes screen label', async () => {
    renderWithProvider(<RoutinesScreen />);
    expect(screen.getByLabelText('Routines screen')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText('Evening lights')).toBeTruthy();
    });
    expect(screen.getByText('Good morning')).toBeTruthy();
    expect(screen.getByText(/Mock cube/)).toBeTruthy();
  });

  it('shows error when API fails', async () => {
    const failing: CubeApi = {
      ...mockCubeApi,
      getRoutines: async () => {
        throw new Error('Cube unavailable');
      },
    };
    render(
      <CubeApiProvider cubeApiOverride={failing}>
        <RoutinesScreen />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Cube unavailable')).toBeTruthy();
    });
    expect(screen.getByLabelText('Routines error')).toBeTruthy();
  });

  it('opens retry dialog from error state and can cancel', async () => {
    const failing: CubeApi = {
      ...mockCubeApi,
      getRoutines: async () => {
        throw new Error('Cube unavailable');
      },
    };
    render(
      <CubeApiProvider cubeApiOverride={failing}>
        <RoutinesScreen />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Cube unavailable')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Retry loading routines'));
    expect(screen.getByText('Try loading routines again?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Cancel'));
  });
});
