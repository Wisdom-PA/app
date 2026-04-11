import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { CubeApiProvider, useCubeApiContext } from '../CubeApiContext';

describe('CubeApiProvider', () => {
  it('throws when useCubeApiContext is used outside a provider', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    function Consumer(): null {
      useCubeApiContext();
      return null;
    }
    try {
      expect(() => render(<Consumer />)).toThrow(/useCubeApiContext must be used within CubeApiProvider/);
    } finally {
      err.mockRestore();
    }
  });

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

  it('uses cubeApiOverride when provided', async () => {
    const custom: CubeApi = {
      ...mockCubeApi,
      getStatus: async () => ({ version: '9.9.9', ready: true }),
    };
    function Probe(): React.JSX.Element {
      const { cubeApi } = useCubeApiContext();
      const [version, setVersion] = React.useState('');
      React.useEffect(() => {
        void cubeApi.getStatus().then((s) => setVersion(s.version));
      }, [cubeApi]);
      return <Text>{version}</Text>;
    }
    render(
      <CubeApiProvider cubeApiOverride={custom}>
        <Probe />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('9.9.9')).toBeTruthy();
    });
  });

  it('normalizes whitespace-only base URL to null', () => {
    function Probe(): React.JSX.Element {
      const { cubeBaseUrl, setCubeBaseUrl } = useCubeApiContext();
      return (
        <>
          <Text>{cubeBaseUrl ?? 'null'}</Text>
          <Pressable accessibilityLabel="set-ws" onPress={() => setCubeBaseUrl('  \n  ')}>
            <Text>set</Text>
          </Pressable>
        </>
      );
    }
    render(
      <CubeApiProvider>
        <Probe />
      </CubeApiProvider>
    );
    fireEvent.press(screen.getByLabelText('set-ws'));
    expect(screen.getByText('null')).toBeTruthy();
  });

  it('normalizes invalid base URL to null', () => {
    function Probe(): React.JSX.Element {
      const { cubeBaseUrl, setCubeBaseUrl } = useCubeApiContext();
      return (
        <>
          <Text>{cubeBaseUrl ?? 'null'}</Text>
          <Pressable accessibilityLabel="set-bad" onPress={() => setCubeBaseUrl('not-a-url')}>
            <Text>set</Text>
          </Pressable>
        </>
      );
    }
    render(
      <CubeApiProvider>
        <Probe />
      </CubeApiProvider>
    );
    fireEvent.press(screen.getByLabelText('set-bad'));
    expect(screen.getByText('null')).toBeTruthy();
  });

  it('uses HTTP client when a valid base URL is set', async () => {
    const prevFetch = global.fetch;
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ version: '1.0.0', ready: true }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    function Probe(): React.JSX.Element {
      const { cubeApi, setCubeBaseUrl } = useCubeApiContext();
      const [v, setV] = React.useState('');
      return (
        <>
          <Text accessibilityLabel="version">{v}</Text>
          <Pressable
            accessibilityLabel="set-lan"
            onPress={() => setCubeBaseUrl('http://127.0.0.1:9999')}
          >
            <Text>set</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="set-trailing"
            onPress={() => setCubeBaseUrl('http://192.168.0.1:1/')}
          >
            <Text>trail</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="fetch-status"
            onPress={() => {
              void cubeApi.getStatus().then((s) => setV(s.version));
            }}
          >
            <Text>go</Text>
          </Pressable>
        </>
      );
    }
    render(
      <CubeApiProvider>
        <Probe />
      </CubeApiProvider>
    );
    fireEvent.press(screen.getByLabelText('set-lan'));
    fireEvent.press(screen.getByLabelText('fetch-status'));
    await waitFor(() => {
      expect(screen.getByText('1.0.0')).toBeTruthy();
    });
    expect(fetchMock).toHaveBeenCalledWith('http://127.0.0.1:9999/status');

    fetchMock.mockClear();
    fireEvent.press(screen.getByLabelText('set-trailing'));
    fireEvent.press(screen.getByLabelText('fetch-status'));
    await waitFor(() => {
      expect(screen.getByText('1.0.0')).toBeTruthy();
    });
    expect(fetchMock).toHaveBeenCalledWith('http://192.168.0.1:1/status');
    global.fetch = prevFetch;
  });
});
