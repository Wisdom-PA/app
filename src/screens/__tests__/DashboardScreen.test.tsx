import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { DashboardScreen } from '../DashboardScreen';

describe('DashboardScreen', () => {
  it('renders placeholder text', () => {
    render(<DashboardScreen />);
    expect(screen.getByText(/Dashboard – connect to a cube/)).toBeTruthy();
  });

  it('has accessibility label', () => {
    render(<DashboardScreen />);
    expect(screen.getByLabelText('Dashboard placeholder')).toBeTruthy();
  });
});
