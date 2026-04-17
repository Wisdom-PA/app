import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { CubeApiProvider } from '../../../context/CubeApiContext';
import { DevicesStack } from '../DevicesStack';
import { RoutinesStack } from '../RoutinesStack';
import { ProfilesStack } from '../ProfilesStack';
import { SettingsStack } from '../SettingsStack';
import { LogsStack } from '../LogsStack';
import { ChatStack } from '../ChatStack';

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

  it('navigates to device detail when a row is pressed', async () => {
    render(wrap(<DevicesStack />));
    await waitFor(() => {
      expect(screen.getByLabelText('Device Living room light')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Device Living room light'));
    await waitFor(() => {
      expect(screen.getByLabelText('Device detail')).toBeTruthy();
    });
    expect(screen.getByText('light-1')).toBeTruthy();
  });
});

describe('RoutinesStack', () => {
  it('renders Routines screen content', async () => {
    render(wrap(<RoutinesStack />));
    await waitFor(() => {
      expect(screen.getByText('Evening lights')).toBeTruthy();
    });
  });

  it('navigates to routine detail when a row is pressed', async () => {
    render(wrap(<RoutinesStack />));
    await waitFor(() => {
      expect(screen.getByLabelText('Routine Evening lights')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Routine Evening lights'));
    await waitFor(() => {
      expect(screen.getByLabelText('Routine detail')).toBeTruthy();
    });
    expect(screen.getByText('r1')).toBeTruthy();
  });
});

describe('ProfilesStack', () => {
  it(
    'renders Profiles screen content',
    async () => {
      render(wrap(<ProfilesStack />));
      expect(
        await screen.findByText('Role: Adult', { exact: true }, { timeout: 15000 })
      ).toBeTruthy();
    },
    20000
  );

  it('navigates to profile detail when a row is pressed', async () => {
    render(wrap(<ProfilesStack />));
    expect(
      await screen.findByLabelText('Profile Adult', {}, { timeout: 15000 })
    ).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Profile Adult'));
    await waitFor(() => {
      expect(screen.getByLabelText('Profile detail')).toBeTruthy();
    });
    expect(screen.getByText('p1')).toBeTruthy();
  }, 20000);
});

describe('SettingsStack', () => {
  it('renders Settings screen content', () => {
    render(wrap(<SettingsStack />));
    expect(screen.getByText(/Cube connection/)).toBeTruthy();
  });

  it('navigates to cube settings from list', async () => {
    render(wrap(<SettingsStack />));
    fireEvent.press(screen.getByLabelText('Open cube settings'));
    await waitFor(() => {
      expect(screen.getByLabelText('Cube settings')).toBeTruthy();
    });
  });

  it('navigates to connectivity wizard from settings', async () => {
    render(wrap(<SettingsStack />));
    fireEvent.press(screen.getByLabelText('Open connectivity setup'));
    await waitFor(() => {
      expect(screen.getByLabelText('Connectivity setup screen')).toBeTruthy();
    });
  });
});

describe('ChatStack', () => {
  it('renders Chat screen', async () => {
    render(wrap(<ChatStack />));
    await waitFor(() => {
      expect(screen.getByLabelText('Chat screen')).toBeTruthy();
    });
  });
});

describe('LogsStack', () => {
  it('renders Logs screen with mock chains', async () => {
    render(wrap(<LogsStack />));
    await waitFor(() => {
      expect(screen.getByLabelText('Logs chain list')).toBeTruthy();
    });
    expect(screen.getByLabelText('Log Chain 550e8400…')).toBeTruthy();
  });

  it('opens log chain detail when a chain is pressed', async () => {
    render(wrap(<LogsStack />));
    await waitFor(() => {
      expect(screen.getByLabelText('Log Chain short')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Log Chain short'));
    await waitFor(() => {
      expect(screen.getByLabelText('Log chain detail')).toBeTruthy();
    });
    expect(screen.getByText(/Example chain/)).toBeTruthy();
  });
});
