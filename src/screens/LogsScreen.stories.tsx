import React from 'react';
import type { CubeApi } from '../api/cubeApi';
import { mockCubeApi } from '../api/mockCubeApi';
import { CubeApiProvider } from '../context/CubeApiContext';
import { LogsScreen } from './LogsScreen';

function withProvider(
  ui: React.ReactElement,
  cubeApiOverride?: CubeApi
): React.JSX.Element {
  return <CubeApiProvider cubeApiOverride={cubeApiOverride}>{ui}</CubeApiProvider>;
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

const withChainsApi: CubeApi = {
  ...mockCubeApi,
  getLogs: async () => ({ chains: [{ chain_id: 'a' }] }),
};

export default {
  title: 'Screens/LogsScreen',
  component: LogsScreen,
};

export const Default = (): React.JSX.Element => withProvider(<LogsScreen />);

export const Loading = (): React.JSX.Element => withProvider(<LogsScreen />, loadingApi);

export const ErrorState = (): React.JSX.Element => withProvider(<LogsScreen />, errorApi);

export const WithChains = (): React.JSX.Element =>
  withProvider(<LogsScreen />, withChainsApi);
