import type {
  Status,
  DeviceConfig,
  DeviceConfigPatch,
  DeviceList,
  RoutineList,
  ProfileList,
  LogQueryResult,
} from './cubeApi.types';

/**
 * Cube HTTP API (contracts/openapi/cube-app.yaml). Implemented by {@link mockCubeApi} and {@link createHttpCubeApi}.
 */
export interface CubeApi {
  getStatus(): Promise<Status>;
  getConfig(): Promise<DeviceConfig>;
  patchConfig(patch: DeviceConfigPatch): Promise<DeviceConfig>;
  getDevices(): Promise<DeviceList>;
  getRoutines(): Promise<RoutineList>;
  getProfiles(): Promise<ProfileList>;
  getLogs(params?: { since?: string; limit?: number }): Promise<LogQueryResult>;
  createBackup(): Promise<ArrayBuffer>;
  restoreBackup(payload: ArrayBuffer): Promise<void>;
}

function joinUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Cube API ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

/**
 * HTTP client for the cube LAN API. Use base URL such as `http://192.168.1.10:8080` or `http://localhost:8080`.
 */
export function createHttpCubeApi(baseUrl: string): CubeApi {
  return {
    async getStatus() {
      const r = await fetch(joinUrl(baseUrl, '/status'));
      return readJson<Status>(r);
    },
    async getConfig() {
      const r = await fetch(joinUrl(baseUrl, '/config'));
      return readJson<DeviceConfig>(r);
    },
    async patchConfig(patch: DeviceConfigPatch) {
      const r = await fetch(joinUrl(baseUrl, '/config'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      return readJson<DeviceConfig>(r);
    },
    async getDevices() {
      const r = await fetch(joinUrl(baseUrl, '/devices'));
      return readJson<DeviceList>(r);
    },
    async getRoutines() {
      const r = await fetch(joinUrl(baseUrl, '/routines'));
      return readJson<RoutineList>(r);
    },
    async getProfiles() {
      const r = await fetch(joinUrl(baseUrl, '/profiles'));
      return readJson<ProfileList>(r);
    },
    async getLogs(params) {
      const q = new URLSearchParams();
      if (params?.since) {
        q.set('since', params.since);
      }
      if (params?.limit != null) {
        q.set('limit', String(params.limit));
      }
      const qs = q.toString();
      const path = qs ? `/logs?${qs}` : '/logs';
      const r = await fetch(joinUrl(baseUrl, path));
      return readJson<LogQueryResult>(r);
    },
    async createBackup() {
      const r = await fetch(joinUrl(baseUrl, '/backup'), { method: 'POST' });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(`Cube API ${r.status}: ${text || r.statusText}`);
      }
      return r.arrayBuffer();
    },
    async restoreBackup(payload: ArrayBuffer) {
      const r = await fetch(joinUrl(baseUrl, '/restore'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: payload,
      });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(`Cube API ${r.status}: ${text || r.statusText}`);
      }
    },
  };
}
