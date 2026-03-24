import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { SettingsScreen } from '../SettingsScreen';

describe('SettingsScreen', () => {
  it('renders placeholder text', () => {
    render(<SettingsScreen />);
    expect(screen.getByText(/Settings – privacy/)).toBeTruthy();
  });
});
