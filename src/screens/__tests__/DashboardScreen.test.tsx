import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { CubeApiProvider } from '../../context/CubeApiContext';
import { DashboardScreen } from '../DashboardScreen';

function renderWithProvider(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<CubeApiProvider>{ui}</CubeApiProvider>);
}

const asyncWaitOptions = { timeout: 15000 };

describe('DashboardScreen', () => {
  it('loads and shows version from mock cube API', async () => {
    renderWithProvider(<DashboardScreen />);
    expect(await screen.findByText('0.1.0', {}, asyncWaitOptions)).toBeTruthy();
    expect(screen.getByText(/Mock cube/)).toBeTruthy();
  }, 20000);

  it('has dashboard accessibility label', async () => {
    renderWithProvider(<DashboardScreen />);
    expect(screen.getByLabelText('Dashboard')).toBeTruthy();
    expect(
      await screen.findByLabelText(/Dashboard status details/, {}, asyncWaitOptions)
    ).toBeTruthy();
  }, 20000);

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
    expect(await screen.findByText('unreachable', {}, asyncWaitOptions)).toBeTruthy();
    expect(screen.getByLabelText('Dashboard error')).toBeTruthy();
  }, 20000);

  it('opens retry dialog from error state and can cancel', async () => {
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
    expect(await screen.findByText('unreachable', {}, asyncWaitOptions)).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Retry loading status'));
    expect(screen.getByText('Try loading status again?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Cancel'));
  }, 20000);

  it('retry from dialog reloads status after a transient failure', async () => {
    let attempt = 0;
    const flaky: CubeApi = {
      ...mockCubeApi,
      getStatus: async () => {
        attempt += 1;
        if (attempt === 1) {
          throw new Error('unreachable');
        }
        return mockCubeApi.getStatus();
      },
    };
    render(
      <CubeApiProvider cubeApiOverride={flaky}>
        <DashboardScreen />
      </CubeApiProvider>
    );
    expect(await screen.findByText('unreachable', {}, asyncWaitOptions)).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Retry loading status'));
    fireEvent.press(screen.getByLabelText('Retry'));
    expect(await screen.findByText('0.1.0', {}, asyncWaitOptions)).toBeTruthy();
  }, 20000);
});
