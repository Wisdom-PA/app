import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
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
});
