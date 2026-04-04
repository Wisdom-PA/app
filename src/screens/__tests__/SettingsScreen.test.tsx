import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { CubeApiProvider } from '../../context/CubeApiContext';
import { SettingsScreen } from '../SettingsScreen';

describe('SettingsScreen', () => {
  it('renders cube connection section', () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    expect(screen.getByText(/Cube connection/)).toBeTruthy();
    expect(screen.getByLabelText('Cube base URL')).toBeTruthy();
    expect(screen.getByLabelText('Save cube URL')).toBeTruthy();
    expect(screen.getByLabelText('Use mock cube')).toBeTruthy();
  });
});
