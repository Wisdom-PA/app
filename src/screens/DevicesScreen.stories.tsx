import React from 'react';
import type { CubeApi } from '../api/cubeApi';
import { mockCubeApi } from '../api/mockCubeApi';
import { CubeApiProvider } from '../context/CubeApiContext';
import { DevicesScreen } from './DevicesScreen';

function withProvider(
  ui: React.ReactElement,
  cubeApiOverride?: CubeApi
): React.JSX.Element {
  return <CubeApiProvider cubeApiOverride={cubeApiOverride}>{ui}</CubeApiProvider>;
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
  component: DevicesScreen,
};

export const Default = (): React.JSX.Element => withProvider(<DevicesScreen />);

export const Loading = (): React.JSX.Element =>
  withProvider(<DevicesScreen />, loadingApi);

export const ErrorState = (): React.JSX.Element =>
  withProvider(<DevicesScreen />, errorApi);

export const EmptyList = (): React.JSX.Element =>
  withProvider(<DevicesScreen />, emptyApi);
