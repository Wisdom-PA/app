import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { CubeApiProvider } from '../../../context/CubeApiContext';
import { DevicesStack } from '../DevicesStack';
import { RoutinesStack } from '../RoutinesStack';
import { ProfilesStack } from '../ProfilesStack';
import { SettingsStack } from '../SettingsStack';
import { LogsStack } from '../LogsStack';

function wrap(children: React.ReactElement): React.ReactElement {
  return (
    <CubeApiProvider>
      <NavigationContainer>{children}</NavigationContainer>
    </CubeApiProvider>
  );
}

describe('DevicesStack', () => {
  it('renders Devices screen content', async () => {
    render(wrap(<DevicesStack />));
    await waitFor(() => {
      expect(screen.getByText('Living room light')).toBeTruthy();
    });
  });
});

describe('RoutinesStack', () => {
  it('renders Routines screen content', async () => {
    render(wrap(<RoutinesStack />));
    await waitFor(() => {
      expect(screen.getByText('Evening lights')).toBeTruthy();
    });
  });
});

describe('ProfilesStack', () => {
  it('renders Profiles screen content', async () => {
    render(wrap(<ProfilesStack />));
    await waitFor(() => {
      expect(screen.getByLabelText('Profile Adult')).toBeTruthy();
    });
  });
});

describe('SettingsStack', () => {
  it('renders Settings screen content', () => {
    render(wrap(<SettingsStack />));
    expect(screen.getByText(/Cube connection/)).toBeTruthy();
  });
});

describe('LogsStack', () => {
  it('renders Logs screen content', async () => {
    render(wrap(<LogsStack />));
    await waitFor(() => {
      expect(screen.getByText(/No behaviour log chains yet/)).toBeTruthy();
    });
  });
});
