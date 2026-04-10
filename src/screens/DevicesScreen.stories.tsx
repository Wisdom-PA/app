import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import type { CubeApi } from '../api/cubeApi';
import { mockCubeApi } from '../api/mockCubeApi';
import { CubeApiProvider } from '../context/CubeApiContext';
import { DevicesStack } from '../navigation/stacks/DevicesStack';

function withProvider(cubeApiOverride?: CubeApi): React.JSX.Element {
  return (
    <CubeApiProvider cubeApiOverride={cubeApiOverride}>
      <NavigationContainer>
        <DevicesStack />
      </NavigationContainer>
    </CubeApiProvider>
  );
}

const loadingApi: CubeApi = {
  ...mockCubeApi,
  getDevices: () => new Promise(() => {}),
};

const errorApi: CubeApi = {
  ...mockCubeApi,
  getDevices: async () => {
    throw new Error('Network error');
  },
};

const emptyApi: CubeApi = {
  ...mockCubeApi,
  getDevices: async () => ({ devices: [] }),
};

export default {
  title: 'Screens/DevicesScreen',
  component: DevicesStack,
};

export const Default = (): React.JSX.Element => withProvider();

export const Loading = (): React.JSX.Element => withProvider(loadingApi);

export const ErrorState = (): React.JSX.Element => withProvider(errorApi);

export const EmptyList = (): React.JSX.Element => withProvider(emptyApi);
