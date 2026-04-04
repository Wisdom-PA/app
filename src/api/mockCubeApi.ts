import type {
  Status,
  DeviceConfig,
  DeviceConfigPatch,
  DeviceList,
  RoutineList,
  ProfileList,
  LogQueryResult,
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
};

const MOCK_DEVICES: DeviceList = {
  devices: [
    { id: 'light-1', name: 'Living room light', type: 'light', room: 'Living room' },
    { id: 'light-2', name: 'Kitchen light', type: 'light', room: 'Kitchen' },
  ],
};

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
  chains: [],
};

const MOCK_BACKUP_LINE = 'WISDOM-BACKUP-v0\n';

let mutableConfig: DeviceConfig = { ...MOCK_CONFIG };

/** Call between tests so mock config mutations do not leak. */
export function resetMockCubeApiState(): void {
  mutableConfig = { ...MOCK_CONFIG };
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
    }),
  getConfig: async (): Promise<DeviceConfig> => Promise.resolve({ ...mutableConfig }),
  patchConfig: async (patch: DeviceConfigPatch): Promise<DeviceConfig> => {
    mutableConfig = {
      ...mutableConfig,
      ...(patch.device_name !== undefined ? { device_name: patch.device_name } : {}),
      ...(patch.default_privacy_mode !== undefined
        ? { default_privacy_mode: patch.default_privacy_mode }
        : {}),
    };
    return { ...mutableConfig };
  },
  getDevices: async (): Promise<DeviceList> => Promise.resolve(MOCK_DEVICES),
  getRoutines: async (): Promise<RoutineList> => Promise.resolve(MOCK_ROUTINES),
  getProfiles: async (): Promise<ProfileList> => Promise.resolve(MOCK_PROFILES),
  getLogs: async (_params?: { since?: string; limit?: number }): Promise<LogQueryResult> =>
    Promise.resolve(MOCK_LOGS),
  createBackup: async (): Promise<ArrayBuffer> => {
    const u = new TextEncoder().encode(MOCK_BACKUP_LINE);
    return u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength);
  },
  restoreBackup: async (_payload: ArrayBuffer): Promise<void> => {
    // No-op stub; real cube would validate and apply backup.
  },
};
