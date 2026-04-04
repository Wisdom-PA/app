import React from 'react';
import { render, screen } from '@testing-library/react-native';
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
  it('renders Devices screen content', () => {
    render(wrap(<DevicesStack />));
    expect(screen.getByText(/Devices – list and control/)).toBeTruthy();
  });
});

describe('RoutinesStack', () => {
  it('renders Routines screen content', () => {
    render(wrap(<RoutinesStack />));
    expect(screen.getByText(/Routines – triggers/)).toBeTruthy();
  });
});

describe('ProfilesStack', () => {
  it('renders Profiles screen content', () => {
    render(wrap(<ProfilesStack />));
    expect(screen.getByText(/Profiles – adult/)).toBeTruthy();
  });
});

describe('SettingsStack', () => {
  it('renders Settings screen content', () => {
    render(wrap(<SettingsStack />));
    expect(screen.getByText(/Cube connection/)).toBeTruthy();
  });
});

describe('LogsStack', () => {
  it('renders Logs screen content', () => {
    render(wrap(<LogsStack />));
    expect(screen.getByText(/Logs – behaviour/)).toBeTruthy();
  });
});
