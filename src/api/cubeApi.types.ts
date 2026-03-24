/**
 * Types aligned with contracts/openapi/cube-app.yaml (cube ↔ app API).
 */

export interface Status {
  version: string;
  ready: boolean;
  privacy_mode?: 'paranoid' | 'normal';
}

export interface DeviceConfig {
  device_name?: string;
  default_privacy_mode?: 'paranoid' | 'normal';
}

export interface DeviceConfigPatch {
  device_name?: string;
  default_privacy_mode?: 'paranoid' | 'normal';
}

export interface DeviceSummary {
  id: string;
  name?: string;
  type?: string;
  room?: string;
}

export interface DeviceList {
  devices: DeviceSummary[];
}

export interface RoutineSummary {
  id: string;
  name?: string;
}

export interface RoutineList {
  routines: RoutineSummary[];
}

export interface ProfileSummary {
  id: string;
  role?: 'adult' | 'guest' | 'child';
  display_name?: string;
}

export interface ProfileList {
  profiles: ProfileSummary[];
}

export interface LogQueryResult {
  chains: unknown[];
}
