import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { LogsScreen } from '../LogsScreen';

describe('LogsScreen', () => {
  it('renders placeholder text', () => {
    render(<LogsScreen />);
    expect(screen.getByText(/Logs – behaviour/)).toBeTruthy();
  });
});
