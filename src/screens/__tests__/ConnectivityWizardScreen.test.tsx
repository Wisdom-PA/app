import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Linking } from 'react-native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { CubeApiProvider } from '../../context/CubeApiContext';
import type { SettingsStackParamList } from '../../navigation/paramLists';
import { ConnectivityWizardScreen } from '../ConnectivityWizardScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

function renderWizard(api?: CubeApi, initialStep?: 'pair' | 'wifi' | 'verify'): void {
  render(
    <CubeApiProvider cubeApiOverride={api}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="ConnectivityWizard"
            component={ConnectivityWizardScreen}
            initialParams={initialStep != null ? { initialStep } : {}}
            options={{ title: 'Connectivity' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CubeApiProvider>
  );
}

describe('ConnectivityWizardScreen', () => {
  const openSpy = jest.spyOn(Linking, 'openSettings');

  beforeEach(() => {
    openSpy.mockResolvedValue(undefined as unknown as void);
  });

  afterEach(() => {
    openSpy.mockRestore();
  });

  it('renders Bluetooth guidance by default', () => {
    renderWizard();
    expect(screen.getByLabelText('Connectivity setup screen')).toBeTruthy();
    expect(screen.getByLabelText('Bluetooth pairing guidance')).toBeTruthy();
  });

  it('opens Wi-Fi guidance when wifi tab is selected', () => {
    renderWizard();
    fireEvent.press(screen.getByLabelText('Connectivity step wifi'));
    expect(screen.getByLabelText('Wi-Fi setup guidance')).toBeTruthy();
  });

  it('runs LAN verify against mock and shows status', async () => {
    renderWizard(undefined, 'verify');
    fireEvent.press(screen.getByLabelText('Check cube connection'));
    await waitFor(() => {
      expect(screen.getByLabelText('Connection check result')).toBeTruthy();
    });
    expect(screen.getByText(/Reachable\. Version/)).toBeTruthy();
  });

  it('shows error when getStatus fails', async () => {
    const bad: CubeApi = {
      ...mockCubeApi,
      getStatus: async () => {
        throw new Error('net down');
      },
    };
    renderWizard(bad, 'verify');
    fireEvent.press(screen.getByLabelText('Check cube connection'));
    await waitFor(() => {
      expect(screen.getByText(/net down/)).toBeTruthy();
    });
  });

  it('invokes openSettings when app settings button is pressed', async () => {
    renderWizard();
    fireEvent.press(screen.getByLabelText('Open device app settings'));
    await waitFor(() => {
      expect(openSpy).toHaveBeenCalled();
    });
  });
});
