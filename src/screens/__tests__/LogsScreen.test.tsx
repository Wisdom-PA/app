import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { CubeApiProvider } from '../../context/CubeApiContext';
import { LogsScreen } from '../LogsScreen';

function renderWithProvider(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<CubeApiProvider>{ui}</CubeApiProvider>);
}

describe('LogsScreen', () => {
  it('loads logs from mock API, empty state, and screen label', async () => {
    renderWithProvider(<LogsScreen />);
    expect(screen.getByLabelText('Logs screen')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByLabelText('Logs empty state')).toBeTruthy();
    });
    expect(screen.getByText(/No behaviour log chains yet/)).toBeTruthy();
    expect(screen.getByText(/Mock cube/)).toBeTruthy();
  });

  it('shows error when API fails', async () => {
    const failing: CubeApi = {
      ...mockCubeApi,
      getLogs: async () => {
        throw new Error('Cube unavailable');
      },
    };
    render(
      <CubeApiProvider cubeApiOverride={failing}>
        <LogsScreen />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Cube unavailable')).toBeTruthy();
    });
    expect(screen.getByLabelText('Logs error')).toBeTruthy();
  });

  it('opens retry dialog from error state and can cancel', async () => {
    const failing: CubeApi = {
      ...mockCubeApi,
      getLogs: async () => {
        throw new Error('Cube unavailable');
      },
    };
    render(
      <CubeApiProvider cubeApiOverride={failing}>
        <LogsScreen />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Cube unavailable')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Retry loading logs'));
    expect(screen.getByText('Try loading logs again?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Cancel'));
  });

  it('shows summary when chains are returned', async () => {
    const withChains: CubeApi = {
      ...mockCubeApi,
      getLogs: async () => ({ chains: [{ x: 1 }] }),
    };
    render(
      <CubeApiProvider cubeApiOverride={withChains}>
        <LogsScreen />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/1 chain/)).toBeTruthy();
    });
  });
});
