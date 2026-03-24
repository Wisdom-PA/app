import type {
  Status,
  DeviceConfig,
  DeviceList,
  RoutineList,
  ProfileList,
  LogQueryResult,
} from './cubeApi.types';

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

/**
 * Mock cube API client for development and tests.
 * Use in app when no real cube is connected; use in integration tests as stub.
 */
export const mockCubeApi = {
  getStatus: async (): Promise<Status> => Promise.resolve(MOCK_STATUS),
  getConfig: async (): Promise<DeviceConfig> => Promise.resolve(MOCK_CONFIG),
  getDevices: async (): Promise<DeviceList> => Promise.resolve(MOCK_DEVICES),
  getRoutines: async (): Promise<RoutineList> => Promise.resolve(MOCK_ROUTINES),
  getProfiles: async (): Promise<ProfileList> => Promise.resolve(MOCK_PROFILES),
  getLogs: async (_params?: { since?: string; limit?: number }): Promise<LogQueryResult> =>
    Promise.resolve(MOCK_LOGS),
};
