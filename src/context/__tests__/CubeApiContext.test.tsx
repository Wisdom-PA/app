import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { CubeApiProvider, useCubeApiContext } from '../CubeApiContext';

describe('CubeApiProvider', () => {
  it('provides mock cube API when no base URL is set', () => {
    function Probe(): React.JSX.Element {
      const { cubeBaseUrl } = useCubeApiContext();
      return <Text>{cubeBaseUrl == null ? 'using-mock' : 'using-remote'}</Text>;
    }
    render(
      <CubeApiProvider>
        <Probe />
      </CubeApiProvider>
    );
    expect(screen.getByText('using-mock')).toBeTruthy();
  });
});
