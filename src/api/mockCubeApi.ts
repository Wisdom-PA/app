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
import type { CubeApi } from './cubeApi';

const MOCK_STATUS: Status = {
  version: '0.1.0',
  ready: true,
  privacy_mode: 'paranoid',
};

const MOCK_CONFIG: DeviceConfig = {
  device_name: 'Mock Cube',
  default_privacy_mode: 'paranoid',
  global_offline: false,
};

function initialDevices(): DeviceSummary[] {
  return [
    {
      id: 'light-1',
      name: 'Living room light',
      type: 'light',
      room: 'Living room',
      power: true,
      brightness: 1,
      reachable: true,
    },
    {
      id: 'light-2',
      name: 'Kitchen light',
      type: 'light',
      room: 'Kitchen',
      power: false,
      brightness: 1,
      reachable: true,
    },
  ];
}

const MOCK_ROUTINES: RoutineList = {
  routines: [
    { id: 'r1', name: 'Evening lights' },
    { id: 'r2', name: 'Good morning' },
  ],
};

const MOCK_ROUTINE_RUN_HISTORY: RoutineRunHistoryList = {
  runs: [
    {
      run_id: '550e8400-e29b-41d4-a716-446655440002',
      at: '2026-04-10T18:00:00Z',
      routine_id: 'r1',
      routine_name: 'Evening lights',
      ok: true,
      steps: [{ index: 0, kind: 'DEVICE_STATE', summary: 'light-1 on', ok: true }],
    },
  ],
};

const MOCK_PROFILES: ProfileList = {
  profiles: [
    { id: 'p1', role: 'adult', display_name: 'Adult' },
    { id: 'p2', role: 'guest', display_name: 'Guest' },
  ],
};

const MOCK_LOGS: LogQueryResult = {
  chains: [
    {
      chain_id: '550e8400-e29b-41d4-a716-446655440000',
      chain_start_ts: '2026-04-01T12:00:00Z',
      intents: [{ utterance: 'turn on living room light', intent_index: 0 }],
    },
    {
      chain_id: 'short',
      note: 'Example chain without full schema',
    },
  ],
};

const MOCK_INTERNET_ACTIVITY: InternetActivityList = {
  events: [
    {
      id: 'evt-1',
      at: '2026-04-10T10:00:00Z',
      service_category: 'weather',
      summary: 'GET forecast (stub)',
      profile_display_name: 'Adult',
    },
  ],
};

const MOCK_BACKUP_LINE = 'WISDOM-BACKUP-v0\n';

let mutableConfig: DeviceConfig = { ...MOCK_CONFIG };
let mutableDevices: DeviceSummary[] = initialDevices();

function initialRoutines(): RoutineSummary[] {
  return MOCK_ROUTINES.routines.map((r) => ({ ...r }));
}

let mutableRoutines: RoutineSummary[] = initialRoutines();

/** Call between tests so mock config mutations do not leak. */
export function resetMockCubeApiState(): void {
  mutableConfig = { ...MOCK_CONFIG };
  mutableDevices = initialDevices();
  mutableRoutines = initialRoutines();
}

/** Test hook: simulate an offline device before discovery (F6.T3). */
export function setMockDeviceReachable(deviceId: string, reachable: boolean): void {
  const i = mutableDevices.findIndex((d) => d.id === deviceId);
  if (i >= 0) {
    mutableDevices[i] = { ...mutableDevices[i], reachable };
  }
}

function applyDevicePatch(device: DeviceSummary, patch: DeviceStatePatch): DeviceSummary {
  const next = { ...device };
  if (patch.power !== undefined) {
    next.power = patch.power;
  }
  if (patch.brightness !== undefined) {
    const b = patch.brightness;
    next.brightness = Math.max(0, Math.min(1, b));
  }
  return next;
}

/**
 * Mock cube API client for development and tests.
 * Use in app when no real cube is connected; use in integration tests as stub.
 */
export const mockCubeApi: CubeApi = {
  getStatus: async (): Promise<Status> =>
    Promise.resolve({
      ...MOCK_STATUS,
      privacy_mode: mutableConfig.default_privacy_mode ?? MOCK_STATUS.privacy_mode,
      global_offline: mutableConfig.global_offline ?? false,
    }),
  getConfig: async (): Promise<DeviceConfig> => Promise.resolve({ ...mutableConfig }),
  patchConfig: async (patch: DeviceConfigPatch): Promise<DeviceConfig> => {
    mutableConfig = {
      ...mutableConfig,
      ...(patch.device_name !== undefined ? { device_name: patch.device_name } : {}),
      ...(patch.default_privacy_mode !== undefined
        ? { default_privacy_mode: patch.default_privacy_mode }
        : {}),
      ...(patch.global_offline !== undefined ? { global_offline: patch.global_offline } : {}),
    };
    return { ...mutableConfig };
  },
  getDevices: async (): Promise<DeviceList> =>
    Promise.resolve({ devices: mutableDevices.map((d) => ({ ...d })) }),
  discoverDevices: async (): Promise<DeviceDiscoverResponse> => {
    mutableDevices = mutableDevices.map((d) => ({ ...d, reachable: true }));
    return {
      status: 'complete',
      added: 0,
      devices: mutableDevices.map((d) => ({ ...d })),
    };
  },
  patchDevice: async (deviceId: string, patch: DeviceStatePatch): Promise<DeviceSummary> => {
    const i = mutableDevices.findIndex((d) => d.id === deviceId);
    if (i < 0) {
      throw new Error('Cube API 404: DEVICE_NOT_FOUND: Unknown device id');
    }
    if (mutableDevices[i].reachable === false) {
      throw new Error('Cube API 503: DEVICE_UNREACHABLE: Device is not reachable');
    }
    const updated = applyDevicePatch(mutableDevices[i], patch);
    mutableDevices[i] = updated;
    return { ...updated };
  },
  getRoutines: async (): Promise<RoutineList> =>
    Promise.resolve({ routines: mutableRoutines.map((r) => ({ ...r })) }),
  getRoutineRunHistory: async (_params?: { limit?: number }): Promise<RoutineRunHistoryList> =>
    Promise.resolve({
      runs: MOCK_ROUTINE_RUN_HISTORY.runs.map((e) => ({
        ...e,
        steps: e.steps.map((s) => ({ ...s })),
      })),
    }),
  patchRoutine: async (routineId: string, patch: RoutinePatch): Promise<RoutineSummary> => {
    if (patch.name === undefined || patch.name.trim() === '') {
      throw new Error('Cube API 400: ROUTINE_PATCH_INVALID: Missing or empty name');
    }
    const i = mutableRoutines.findIndex((r) => r.id === routineId);
    if (i < 0) {
      throw new Error('Cube API 404: ROUTINE_NOT_FOUND: Unknown routine id');
    }
    const next = { ...mutableRoutines[i], name: patch.name.trim() };
    mutableRoutines[i] = next;
    return { ...next };
  },
  getProfiles: async (): Promise<ProfileList> => Promise.resolve(MOCK_PROFILES),
  getLogs: async (_params?: { since?: string; limit?: number }): Promise<LogQueryResult> =>
    Promise.resolve(MOCK_LOGS),
  sendChat: async (message: string): Promise<ChatReply> =>
    Promise.resolve({
      reply: `Stub reply: ${message}`,
      source: 'on_device',
    }),
  getInternetActivity: async (): Promise<InternetActivityList> =>
    Promise.resolve({
      events: MOCK_INTERNET_ACTIVITY.events.map((e) => ({ ...e })),
    }),
  createBackup: async (): Promise<ArrayBuffer> => {
    const u = new TextEncoder().encode(MOCK_BACKUP_LINE);
    return u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength);
  },
  restoreBackup: async (_payload: ArrayBuffer): Promise<void> => {
    // No-op stub; real cube would validate and apply backup.
  },
};
