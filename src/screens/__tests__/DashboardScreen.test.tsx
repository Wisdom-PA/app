import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { CubeApiProvider } from '../../context/CubeApiContext';
import { DashboardScreen } from '../DashboardScreen';

function renderWithProvider(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<CubeApiProvider>{ui}</CubeApiProvider>);
}

describe('DashboardScreen', () => {
  it('loads and shows version from mock cube API', async () => {
    renderWithProvider(<DashboardScreen />);
    await waitFor(() => {
      expect(screen.getByText('0.1.0')).toBeTruthy();
    });
    expect(screen.getByText(/Mock cube/)).toBeTruthy();
  });

  it('has dashboard accessibility label', async () => {
    renderWithProvider(<DashboardScreen />);
    expect(screen.getByLabelText('Dashboard')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByLabelText(/Dashboard status details/)).toBeTruthy();
    });
  });

  it('shows error when status API fails', async () => {
    const failing: CubeApi = {
      ...mockCubeApi,
      getStatus: async () => {
        throw new Error('unreachable');
      },
    };
    render(
      <CubeApiProvider cubeApiOverride={failing}>
        <DashboardScreen />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('unreachable')).toBeTruthy();
    });
    expect(screen.getByLabelText('Dashboard error')).toBeTruthy();
  });
});
