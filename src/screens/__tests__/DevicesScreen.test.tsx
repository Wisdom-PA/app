import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { CubeApiProvider } from '../../context/CubeApiContext';
import { DevicesScreen } from '../DevicesScreen';

function renderWithProvider(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<CubeApiProvider>{ui}</CubeApiProvider>);
}

describe('DevicesScreen', () => {
  it('loads devices from mock API and exposes screen label', async () => {
    renderWithProvider(<DevicesScreen />);
    expect(screen.getByLabelText('Devices screen')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText('Living room light')).toBeTruthy();
    });
    expect(screen.getByText('Kitchen light')).toBeTruthy();
    expect(screen.getByText(/Mock cube/)).toBeTruthy();
  });

  it('shows error when API fails', async () => {
    const failing: CubeApi = {
      ...mockCubeApi,
      getDevices: async () => {
        throw new Error('Cube unavailable');
      },
    };
    render(
      <CubeApiProvider cubeApiOverride={failing}>
        <DevicesScreen />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Cube unavailable')).toBeTruthy();
    });
    expect(screen.getByLabelText('Devices error')).toBeTruthy();
  });

  it('opens retry dialog from error state and can cancel', async () => {
    const failing: CubeApi = {
      ...mockCubeApi,
      getDevices: async () => {
        throw new Error('Cube unavailable');
      },
    };
    render(
      <CubeApiProvider cubeApiOverride={failing}>
        <DevicesScreen />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Cube unavailable')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Retry loading devices'));
    expect(screen.getByText('Try loading devices again?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Cancel'));
  });

  it('shows empty message when API returns no devices', async () => {
    const emptyApi: CubeApi = {
      ...mockCubeApi,
      getDevices: async () => ({ devices: [] }),
    };
    render(
      <CubeApiProvider cubeApiOverride={emptyApi}>
        <DevicesScreen />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/No devices reported by the cube/)).toBeTruthy();
    });
  });
});
