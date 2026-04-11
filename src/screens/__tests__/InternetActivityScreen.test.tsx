import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { CubeApiProvider } from '../../context/CubeApiContext';
import { InternetActivityScreen } from '../InternetActivityScreen';

describe('InternetActivityScreen', () => {
  jest.setTimeout(20000);

  it('loads events from mock API', async () => {
    render(
      <CubeApiProvider>
        <InternetActivityScreen />
      </CubeApiProvider>
    );
    expect(screen.getByLabelText('Internet activity screen')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByLabelText('Internet activity list')).toBeTruthy();
    });
    expect(screen.getByText(/Mock cube/)).toBeTruthy();
  });

  it('shows error and retry when API fails', async () => {
    const failing: CubeApi = {
      ...mockCubeApi,
      getInternetActivity: async () => {
        throw new Error('net down');
      },
    };
    render(
      <CubeApiProvider cubeApiOverride={failing}>
        <InternetActivityScreen />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('net down')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Retry loading internet activity'));
    expect(screen.getByText('Try loading internet activity again?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Retry'));
    await waitFor(() => {
      expect(screen.getByText('net down')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Retry loading internet activity'));
    fireEvent.press(screen.getByLabelText('Cancel'));
  });

  it('lists event using service_category when summary is missing', async () => {
    const api: CubeApi = {
      ...mockCubeApi,
      getInternetActivity: async () => ({
        events: [
          {
            id: 'e2',
            at: '2026-04-10T11:00:00Z',
            service_category: 'dns',
            summary: undefined,
            profile_display_name: undefined,
          },
        ],
      }),
    };
    render(
      <CubeApiProvider cubeApiOverride={api}>
        <InternetActivityScreen />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByLabelText('Internet activity e2')).toBeTruthy();
    });
    expect(screen.getByText('dns')).toBeTruthy();
  });

  it('shows empty when API returns no events', async () => {
    const empty: CubeApi = {
      ...mockCubeApi,
      getInternetActivity: async () => ({ events: [] }),
    };
    render(
      <CubeApiProvider cubeApiOverride={empty}>
        <InternetActivityScreen />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/No recent internet activity/)).toBeTruthy();
    });
  });
});
