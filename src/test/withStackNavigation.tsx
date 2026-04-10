import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import type { CubeApi } from '../api/cubeApi';
import { CubeApiProvider } from '../context/CubeApiContext';

/** Wraps a single-tab stack navigator for screen tests that use `useNavigation`. */
export function withStackNavigation(
  StackComponent: React.ComponentType,
  cubeApiOverride?: CubeApi
): React.JSX.Element {
  return (
    <CubeApiProvider cubeApiOverride={cubeApiOverride}>
      <NavigationContainer>
        <StackComponent />
      </NavigationContainer>
    </CubeApiProvider>
  );
}
