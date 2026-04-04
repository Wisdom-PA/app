import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import type { CubeApi } from '../api/cubeApi';
import { createHttpCubeApi } from '../api/cubeApi';
import { mockCubeApi } from '../api/mockCubeApi';

export interface CubeApiContextValue {
  cubeApi: CubeApi;
  /** When null, the app uses {@link mockCubeApi}. Otherwise LAN base URL (e.g. `http://192.168.1.5:8080`). */
  cubeBaseUrl: string | null;
  setCubeBaseUrl: (url: string | null) => void;
}

const CubeApiContext = createContext<CubeApiContextValue | undefined>(undefined);

function normalizeBaseUrl(url: string | null): string | null {
  if (url == null) {
    return null;
  }
  const t = url.trim();
  if (t === '') {
    return null;
  }
  if (!/^https?:\/\//i.test(t)) {
    return null;
  }
  return t.replace(/\/$/, '');
}

export function CubeApiProvider({
  children,
  cubeApiOverride,
}: {
  children: React.ReactNode;
  /** When set (e.g. Storybook or tests), replaces mock/HTTP client selection. */
  cubeApiOverride?: CubeApi;
}): React.JSX.Element {
  const [cubeBaseUrl, setCubeBaseUrlState] = useState<string | null>(null);

  const setCubeBaseUrl = useCallback((url: string | null) => {
    setCubeBaseUrlState(normalizeBaseUrl(url));
  }, []);

  const cubeApi = useMemo((): CubeApi => {
    if (cubeApiOverride != null) {
      return cubeApiOverride;
    }
    if (cubeBaseUrl == null) {
      return mockCubeApi;
    }
    return createHttpCubeApi(cubeBaseUrl);
  }, [cubeBaseUrl, cubeApiOverride]);

  const value = useMemo(
    (): CubeApiContextValue => ({
      cubeApi,
      cubeBaseUrl,
      setCubeBaseUrl,
    }),
    [cubeApi, cubeBaseUrl, setCubeBaseUrl],
  );

  return <CubeApiContext.Provider value={value}>{children}</CubeApiContext.Provider>;
}

export function useCubeApiContext(): CubeApiContextValue {
  const ctx = useContext(CubeApiContext);
  if (ctx === undefined) {
    throw new Error('useCubeApiContext must be used within CubeApiProvider');
  }
  return ctx;
}
