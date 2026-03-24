import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { RoutinesScreen } from '../RoutinesScreen';

describe('RoutinesScreen', () => {
  it('renders placeholder text', () => {
    render(<RoutinesScreen />);
    expect(screen.getByText(/Routines – triggers/)).toBeTruthy();
  });
});
