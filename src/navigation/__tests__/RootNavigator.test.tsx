import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { CubeApiProvider } from '../../context/CubeApiContext';
import { RootNavigator } from '../RootNavigator';

describe('RootNavigator', () => {
  it('renders all tab labels', async () => {
    render(
      <CubeApiProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </CubeApiProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('0.1.0')).toBeTruthy();
    });

    expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Devices')).toBeTruthy();
    expect(screen.getByText('Routines')).toBeTruthy();
    expect(screen.getByText('Profiles')).toBeTruthy();
    expect(screen.getByText('Chat')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Logs')).toBeTruthy();

    await act(async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 500));
    });
  });
});
