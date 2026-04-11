import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { DevicesStack } from '../../navigation/stacks/DevicesStack';
import { withStackNavigation } from '../../test/withStackNavigation';

describe('DevicesScreen', () => {
  it('loads devices from mock API and exposes screen label', async () => {
    render(withStackNavigation(DevicesStack));
    expect(screen.getByLabelText('Devices screen')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText('Living room light')).toBeTruthy();
    });
    expect(screen.getByText('Kitchen light')).toBeTruthy();
    expect(screen.getByLabelText('Room Living room')).toBeTruthy();
    expect(screen.getByLabelText('Room Kitchen')).toBeTruthy();
    expect(screen.getByText(/Mock cube/)).toBeTruthy();
  });

  it('shows error when API fails', async () => {
    const failing: CubeApi = {
      ...mockCubeApi,
      getDevices: async () => {
        throw new Error('Cube unavailable');
      },
    };
    render(withStackNavigation(DevicesStack, failing));
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
    render(withStackNavigation(DevicesStack, failing));
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
    render(withStackNavigation(DevicesStack, emptyApi));
    await waitFor(() => {
      expect(screen.getByText(/No devices reported by the cube/)).toBeTruthy();
    });
  });

  it('scan for devices calls discoverDevices and replaces list', async () => {
    const discover = jest.fn().mockResolvedValue({
      status: 'complete' as const,
      added: 0,
      devices: [
        {
          id: 'found-1',
          name: 'Hall light',
          type: 'light',
          room: 'Hall',
          power: true,
          brightness: 1,
        },
      ],
    });
    const api: CubeApi = {
      ...mockCubeApi,
      discoverDevices: discover,
    };
    render(withStackNavigation(DevicesStack, api));
    await waitFor(() => {
      expect(screen.getByText('Living room light')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Scan for devices'));
    await waitFor(() => {
      expect(discover).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.getByText('Hall light')).toBeTruthy();
    });
    expect(screen.getByLabelText('Room Hall')).toBeTruthy();
  });
});
