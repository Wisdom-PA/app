import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ProfilesScreen } from '../ProfilesScreen';

describe('ProfilesScreen', () => {
  it('renders placeholder text', () => {
    render(<ProfilesScreen />);
    expect(screen.getByText(/Profiles – adult/)).toBeTruthy();
  });
});
