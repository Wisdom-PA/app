import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { DevicesStack } from '../../navigation/stacks/DevicesStack';
import { withStackNavigation } from '../../test/withStackNavigation';

describe('DeviceDetailScreen', () => {
  it('shows light controls and toggles power', async () => {
    render(withStackNavigation(DevicesStack));
    await waitFor(() => {
      expect(screen.getByLabelText('Device Living room light')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Device Living room light'));
    await waitFor(() => {
      expect(screen.getByLabelText('Device controls')).toBeTruthy();
    });
    const toggle = screen.getByLabelText('Device power');
    fireEvent(toggle, 'valueChange', false);
    await waitFor(() => {
      expect(screen.getByLabelText('Device power').props.value).toBe(false);
    });
  });

  it('hides dimmer controls for non-light devices', async () => {
    const api: CubeApi = {
      ...mockCubeApi,
      getDevices: async () => ({
        devices: [{ id: 's1', name: 'Sensor', type: 'sensor', room: 'Hall' }],
      }),
    };
    render(withStackNavigation(DevicesStack, api));
    await waitFor(() => {
      expect(screen.getByLabelText('Device Sensor')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Device Sensor'));
    await waitFor(() => {
      expect(screen.getByLabelText('Device detail')).toBeTruthy();
    });
    expect(screen.queryByLabelText('Device controls')).toBeNull();
  });

  it('shows generic error when patch fails with non-Error', async () => {
    const api: CubeApi = {
      ...mockCubeApi,
      patchDevice: async () => {
        throw 'x';
      },
    };
    render(withStackNavigation(DevicesStack, api));
    await waitFor(() => {
      expect(screen.getByLabelText('Device Living room light')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Device Living room light'));
    await waitFor(() => {
      expect(screen.getByLabelText('Device power')).toBeTruthy();
    });
    fireEvent(screen.getByLabelText('Device power'), 'valueChange', false);
    await waitFor(() => {
      expect(screen.getByText('Update failed.')).toBeTruthy();
    });
  });
});
