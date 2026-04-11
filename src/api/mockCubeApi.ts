import type {
  Status,
  DeviceConfig,
  DeviceConfigPatch,
  DeviceList,
  DeviceSummary,
  DeviceStatePatch,
  DeviceDiscoverResponse,
  RoutineList,
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
    },
    {
      id: 'light-2',
      name: 'Kitchen light',
      type: 'light',
      room: 'Kitchen',
      power: false,
      brightness: 1,
    },
  ];
}

const MOCK_ROUTINES: RoutineList = {
  routines: [
    { id: 'r1', name: 'Evening lights' },
    { id: 'r2', name: 'Good morning' },
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

/** Call between tests so mock config mutations do not leak. */
export function resetMockCubeApiState(): void {
  mutableConfig = { ...MOCK_CONFIG };
  mutableDevices = initialDevices();
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
  discoverDevices: async (): Promise<DeviceDiscoverResponse> =>
    Promise.resolve({
      status: 'complete',
      added: 0,
      devices: mutableDevices.map((d) => ({ ...d })),
    }),
  patchDevice: async (deviceId: string, patch: DeviceStatePatch): Promise<DeviceSummary> => {
    const i = mutableDevices.findIndex((d) => d.id === deviceId);
    if (i < 0) {
      throw new Error('Cube API 404: DEVICE_NOT_FOUND: Unknown device id');
    }
    const updated = applyDevicePatch(mutableDevices[i], patch);
    mutableDevices[i] = updated;
    return { ...updated };
  },
  getRoutines: async (): Promise<RoutineList> => Promise.resolve(MOCK_ROUTINES),
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
