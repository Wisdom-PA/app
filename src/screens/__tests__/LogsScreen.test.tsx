import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { LogsStack } from '../../navigation/stacks/LogsStack';
import { withStackNavigation } from '../../test/withStackNavigation';

describe('LogsScreen', () => {
  it('loads logs from mock API, empty state, and screen label', async () => {
    const emptyLogs: CubeApi = {
      ...mockCubeApi,
      getLogs: async () => ({ chains: [] }),
    };
    render(withStackNavigation(LogsStack, emptyLogs));
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
    render(withStackNavigation(LogsStack, failing));
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
    render(withStackNavigation(LogsStack, failing));
    await waitFor(() => {
      expect(screen.getByText('Cube unavailable')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Retry loading logs'));
    expect(screen.getByText('Try loading logs again?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Cancel'));
  });

  it('lists chains when API returns them', async () => {
    const withChains: CubeApi = {
      ...mockCubeApi,
      getLogs: async () => ({ chains: [{ chain_id: 'abc-def-ghi' }, { x: 1 }] }),
    };
    render(withStackNavigation(LogsStack, withChains));
    await waitFor(() => {
      expect(screen.getByLabelText('Logs chain list')).toBeTruthy();
    });
    expect(screen.getByLabelText('Log Chain abc-def-ghi')).toBeTruthy();
    expect(screen.getByLabelText('Log Chain 2')).toBeTruthy();
  });
});
