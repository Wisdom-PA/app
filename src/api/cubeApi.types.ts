/**
 * Types aligned with contracts/openapi/cube-app.yaml (cube ↔ app API).
 */

export interface Status {
  version: string;
  ready: boolean;
  privacy_mode?: 'paranoid' | 'normal';
  /** When true, cube blocks outbound internet (global offline mode). */
  global_offline?: boolean;
}

export interface DeviceConfig {
  device_name?: string;
  default_privacy_mode?: 'paranoid' | 'normal';
  global_offline?: boolean;
}

export interface DeviceConfigPatch {
  device_name?: string;
  default_privacy_mode?: 'paranoid' | 'normal';
  global_offline?: boolean;
}

export interface DeviceSummary {
  id: string;
  name?: string;
  type?: string;
  room?: string;
  power?: boolean;
  /** Normalized 0.0–1.0 when dimmable. */
  brightness?: number;
}

export interface DeviceStatePatch {
  power?: boolean;
  brightness?: number;
}

export interface ChatReply {
  reply: string;
  source: 'on_device' | 'online';
}

export interface InternetActivityEvent {
  id?: string;
  at?: string;
  service_category?: string;
  summary?: string;
  profile_display_name?: string;
}

export interface InternetActivityList {
  events: InternetActivityEvent[];
}

export interface DeviceList {
  devices: DeviceSummary[];
}

/** Structured error body from cube (e.g. PATCH unknown device). */
export interface ApiError {
  code: string;
  message: string;
}

export interface DeviceErrorResponse {
  error: ApiError;
}

export interface DeviceDiscoverResponse {
  status: 'complete';
  added: number;
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
