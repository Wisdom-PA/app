import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import type { CubeApi } from '../api/cubeApi';
import { mockCubeApi } from '../api/mockCubeApi';
import { CubeApiProvider } from '../context/CubeApiContext';
import { ProfilesStack } from '../navigation/stacks/ProfilesStack';

function withProvider(cubeApiOverride?: CubeApi): React.JSX.Element {
  return (
    <CubeApiProvider cubeApiOverride={cubeApiOverride}>
      <NavigationContainer>
        <ProfilesStack />
      </NavigationContainer>
    </CubeApiProvider>
  );
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
  component: ProfilesStack,
};

export const Default = (): React.JSX.Element => withProvider();

export const Loading = (): React.JSX.Element => withProvider(loadingApi);

export const ErrorState = (): React.JSX.Element => withProvider(errorApi);

export const EmptyList = (): React.JSX.Element => withProvider(emptyApi);
