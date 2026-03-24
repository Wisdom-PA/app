import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { DevicesScreen } from '../DevicesScreen';

describe('DevicesScreen', () => {
  it('renders placeholder text', () => {
    render(<DevicesScreen />);
    expect(screen.getByText(/Devices – list and control/)).toBeTruthy();
  });
});
