import React from 'react';
import type { CubeApi } from '../api/cubeApi';
import { mockCubeApi } from '../api/mockCubeApi';
import { CubeApiProvider } from '../context/CubeApiContext';
import { ProfilesScreen } from './ProfilesScreen';

function withProvider(
  ui: React.ReactElement,
  cubeApiOverride?: CubeApi
): React.JSX.Element {
  return <CubeApiProvider cubeApiOverride={cubeApiOverride}>{ui}</CubeApiProvider>;
}

const loadingApi: CubeApi = {
  ...mockCubeApi,
  getProfiles: () => new Promise(() => {}),
};

const errorApi: CubeApi = {
  ...mockCubeApi,
  getProfiles: async () => {
    throw new Error('Network error');
  },
};

const emptyApi: CubeApi = {
  ...mockCubeApi,
  getProfiles: async () => ({ profiles: [] }),
};

export default {
  title: 'Screens/ProfilesScreen',
  component: ProfilesScreen,
};

export const Default = (): React.JSX.Element => withProvider(<ProfilesScreen />);

export const Loading = (): React.JSX.Element =>
  withProvider(<ProfilesScreen />, loadingApi);

export const ErrorState = (): React.JSX.Element =>
  withProvider(<ProfilesScreen />, errorApi);

export const EmptyList = (): React.JSX.Element =>
  withProvider(<ProfilesScreen />, emptyApi);
