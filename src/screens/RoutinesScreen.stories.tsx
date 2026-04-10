import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import type { CubeApi } from '../api/cubeApi';
import { mockCubeApi } from '../api/mockCubeApi';
import { CubeApiProvider } from '../context/CubeApiContext';
import { RoutinesStack } from '../navigation/stacks/RoutinesStack';

function withProvider(cubeApiOverride?: CubeApi): React.JSX.Element {
  return (
    <CubeApiProvider cubeApiOverride={cubeApiOverride}>
      <NavigationContainer>
        <RoutinesStack />
      </NavigationContainer>
    </CubeApiProvider>
  );
}

const loadingApi: CubeApi = {
  ...mockCubeApi,
  getRoutines: () => new Promise(() => {}),
};

const errorApi: CubeApi = {
  ...mockCubeApi,
  getRoutines: async () => {
    throw new Error('Network error');
  },
};

const emptyApi: CubeApi = {
  ...mockCubeApi,
  getRoutines: async () => ({ routines: [] }),
};

export default {
  title: 'Screens/RoutinesScreen',
  component: RoutinesStack,
};

export const Default = (): React.JSX.Element => withProvider();

export const Loading = (): React.JSX.Element => withProvider(loadingApi);

export const ErrorState = (): React.JSX.Element => withProvider(errorApi);

export const EmptyList = (): React.JSX.Element => withProvider(emptyApi);
