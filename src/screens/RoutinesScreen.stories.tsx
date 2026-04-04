import React from 'react';
import type { CubeApi } from '../api/cubeApi';
import { mockCubeApi } from '../api/mockCubeApi';
import { CubeApiProvider } from '../context/CubeApiContext';
import { RoutinesScreen } from './RoutinesScreen';

function withProvider(
  ui: React.ReactElement,
  cubeApiOverride?: CubeApi
): React.JSX.Element {
  return <CubeApiProvider cubeApiOverride={cubeApiOverride}>{ui}</CubeApiProvider>;
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
  component: RoutinesScreen,
};

export const Default = (): React.JSX.Element => withProvider(<RoutinesScreen />);

export const Loading = (): React.JSX.Element =>
  withProvider(<RoutinesScreen />, loadingApi);

export const ErrorState = (): React.JSX.Element =>
  withProvider(<RoutinesScreen />, errorApi);

export const EmptyList = (): React.JSX.Element =>
  withProvider(<RoutinesScreen />, emptyApi);
