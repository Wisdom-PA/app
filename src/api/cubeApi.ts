import type {
  Status,
  DeviceConfig,
  DeviceConfigPatch,
  DeviceList,
  DeviceSummary,
  DeviceStatePatch,
  DeviceDiscoverResponse,
  RoutineList,
  RoutinePatch,
  RoutineRunHistoryList,
  RoutineSummary,
  ProfileList,
  LogQueryResult,
  ChatReply,
  InternetActivityList,
} from './cubeApi.types';

/**
 * Cube HTTP API (contracts/openapi/cube-app.yaml). Implemented by {@link mockCubeApi} and {@link createHttpCubeApi}.
 */
export interface CubeApi {
  getStatus(): Promise<Status>;
  getConfig(): Promise<DeviceConfig>;
  patchConfig(patch: DeviceConfigPatch): Promise<DeviceConfig>;
  getDevices(): Promise<DeviceList>;
  discoverDevices(): Promise<DeviceDiscoverResponse>;
  patchDevice(deviceId: string, patch: DeviceStatePatch): Promise<DeviceSummary>;
  getRoutines(): Promise<RoutineList>;
  getRoutineRunHistory(params?: { limit?: number }): Promise<RoutineRunHistoryList>;
  patchRoutine(routineId: string, patch: RoutinePatch): Promise<RoutineSummary>;
  getProfiles(): Promise<ProfileList>;
  getLogs(params?: { since?: string; limit?: number }): Promise<LogQueryResult>;
  sendChat(message: string): Promise<ChatReply>;
  getInternetActivity(): Promise<InternetActivityList>;
  createBackup(): Promise<ArrayBuffer>;
  restoreBackup(payload: ArrayBuffer): Promise<void>;
}

function joinUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function formatCubeErrorBody(text: string, statusText: string): string {
  const raw = text || statusText;
  try {
    const parsed = JSON.parse(text) as { error?: { code?: string; message?: string } };
    const err = parsed?.error;
    if (err?.code) {
      return `${err.code}: ${err.message ?? ''}`.trim();
    }
  } catch {
    // use raw text
  }
  return raw;
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Cube API ${response.status}: ${formatCubeErrorBody(text, response.statusText)}`,
    );
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
    async discoverDevices() {
      const r = await fetch(joinUrl(baseUrl, '/devices/discover'), { method: 'POST' });
      return readJson<DeviceDiscoverResponse>(r);
    },
    async patchDevice(deviceId, patch) {
      const path = `/devices/${encodeURIComponent(deviceId)}`;
      const r = await fetch(joinUrl(baseUrl, path), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      return readJson<DeviceSummary>(r);
    },
    async getRoutines() {
      const r = await fetch(joinUrl(baseUrl, '/routines'));
      return readJson<RoutineList>(r);
    },
    async getRoutineRunHistory(params) {
      const q = new URLSearchParams();
      if (params?.limit != null) {
        q.set('limit', String(params.limit));
      }
      const qs = q.toString();
      const path = qs ? `/routines/history?${qs}` : '/routines/history';
      const r = await fetch(joinUrl(baseUrl, path));
      return readJson<RoutineRunHistoryList>(r);
    },
    async patchRoutine(routineId, patch) {
      const path = `/routines/${encodeURIComponent(routineId)}`;
      const r = await fetch(joinUrl(baseUrl, path), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      return readJson<RoutineSummary>(r);
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
    async sendChat(message) {
      const r = await fetch(joinUrl(baseUrl, '/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      return readJson<ChatReply>(r);
    },
    async getInternetActivity() {
      const r = await fetch(joinUrl(baseUrl, '/internet-activity'));
      return readJson<InternetActivityList>(r);
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
