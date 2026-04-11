import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { CubeApiProvider, useCubeApiContext } from '../../context/CubeApiContext';
import type { SettingsStackParamList } from '../../navigation/paramLists';
import { CubeSettingsScreen } from '../CubeSettingsScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

function wrap(override?: CubeApi): React.JSX.Element {
  return (
    <CubeApiProvider cubeApiOverride={override}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="CubeSettings" component={CubeSettingsScreen} options={{ title: 'Cube' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CubeApiProvider>
  );
}

function CubeSettingsWithLanSource(): React.JSX.Element {
  const { setCubeBaseUrl } = useCubeApiContext();
  React.useEffect(() => {
    setCubeBaseUrl('http://10.0.0.2:8080/');
  }, [setCubeBaseUrl]);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="CubeSettings" component={CubeSettingsScreen} options={{ title: 'Cube' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

describe('CubeSettingsScreen', () => {
  it('shows LAN source label when base URL is set', async () => {
    render(
      <CubeApiProvider cubeApiOverride={mockCubeApi}>
        <CubeSettingsWithLanSource />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Source: http:\/\/10\.0\.0\.2:8080/)).toBeTruthy();
    });
  });

  it('shows generic message when load fails with non-Error', async () => {
    const bad: CubeApi = {
      ...mockCubeApi,
      getConfig: async () => {
        throw 'x';
      },
    };
    render(wrap(bad));
    await waitFor(() => {
      expect(screen.getByText('Could not load config.')).toBeTruthy();
    });
  });

  it('shows generic message when save fails with non-Error', async () => {
    const bad: CubeApi = {
      ...mockCubeApi,
      patchConfig: async () => {
        throw 'x';
      },
    };
    render(wrap(bad));
    await waitFor(() => {
      expect(screen.getByLabelText('Cube device name')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Save cube settings'));
    await waitFor(() => {
      expect(screen.getByText('Save failed.')).toBeTruthy();
    });
  });

  it('loads config and saves', async () => {
    render(wrap());
    await waitFor(() => {
      expect(screen.getByLabelText('Cube settings')).toBeTruthy();
    });
    expect(screen.getByLabelText('Cube device name')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Default privacy paranoid'));
    fireEvent.press(screen.getByLabelText('Default privacy normal'));
    fireEvent.press(screen.getByLabelText('Save cube settings'));
    await waitFor(() => {
      expect(screen.getByText('Saved')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('OK'));
  });
});
