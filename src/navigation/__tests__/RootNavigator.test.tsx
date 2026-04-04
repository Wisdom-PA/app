import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { CubeApiProvider } from '../../context/CubeApiContext';
import { RootNavigator } from '../RootNavigator';

describe('RootNavigator', () => {
  it('renders all tab labels', () => {
    render(
      <CubeApiProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </CubeApiProvider>
    );
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Devices')).toBeTruthy();
    expect(screen.getByText('Routines')).toBeTruthy();
    expect(screen.getByText('Profiles')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Logs')).toBeTruthy();
  });
});
