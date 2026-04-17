import type { DeviceSummary, ProfileSummary, RoutineSummary } from '../api/cubeApi.types';

export type DevicesStackParamList = {
  DevicesList: undefined;
  DeviceDetail: { device: DeviceSummary };
};

export type RoutinesStackParamList = {
  RoutinesList: undefined;
  RoutineDetail: { routine: RoutineSummary };
  RoutineHistory: undefined;
};

export type ProfilesStackParamList = {
  ProfilesList: undefined;
  ProfileDetail: { profile: ProfileSummary };
};

export type LogsStackParamList = {
  LogsList: undefined;
  LogChainDetail: { chainJson: string; title: string };
};

export type SettingsStackParamList = {
  SettingsList: undefined;
  CubeSettings: undefined;
  ConnectivityWizard: { initialStep?: 'pair' | 'wifi' | 'verify' };
  InternetActivity: undefined;
};

export type ChatStackParamList = {
  ChatMain: undefined;
};
