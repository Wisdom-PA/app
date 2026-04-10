import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import type { CubeApi } from '../api/cubeApi';
import { mockCubeApi } from '../api/mockCubeApi';
import { CubeApiProvider } from '../context/CubeApiContext';
import { LogsStack } from '../navigation/stacks/LogsStack';

function withProvider(cubeApiOverride?: CubeApi): React.JSX.Element {
  return (
    <CubeApiProvider cubeApiOverride={cubeApiOverride}>
      <NavigationContainer>
        <LogsStack />
      </NavigationContainer>
    </CubeApiProvider>
  );
}

const loadingApi: CubeApi = {
  ...mockCubeApi,
  getLogs: () => new Promise(() => {}),
};

const errorApi: CubeApi = {
  ...mockCubeApi,
  getLogs: async () => {
    throw new Error('Network error');
  },
};

const emptyLogsApi: CubeApi = {
  ...mockCubeApi,
  getLogs: async () => ({ chains: [] }),
};

const withChainsApi: CubeApi = {
  ...mockCubeApi,
  getLogs: async () => ({ chains: [{ chain_id: 'a' }] }),
};

export default {
  title: 'Screens/LogsScreen',
  component: LogsStack,
};

export const Default = (): React.JSX.Element => withProvider(emptyLogsApi);

export const Loading = (): React.JSX.Element => withProvider(loadingApi);

export const ErrorState = (): React.JSX.Element => withProvider(errorApi);

export const WithChains = (): React.JSX.Element => withProvider(withChainsApi);
