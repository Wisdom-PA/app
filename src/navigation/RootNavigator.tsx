import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardStack } from './stacks/DashboardStack';
import { DevicesStack } from './stacks/DevicesStack';
import { RoutinesStack } from './stacks/RoutinesStack';
import { ProfilesStack } from './stacks/ProfilesStack';
import { SettingsStack } from './stacks/SettingsStack';
import { LogsStack } from './stacks/LogsStack';

export type RootTabParamList = {
  Dashboard: undefined;
  Devices: undefined;
  Routines: undefined;
  Profiles: undefined;
  Settings: undefined;
  Logs: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarLabelPosition: 'below-icon',
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Devices" component={DevicesStack} options={{ title: 'Devices' }} />
      <Tab.Screen name="Routines" component={RoutinesStack} options={{ title: 'Routines' }} />
      <Tab.Screen name="Profiles" component={ProfilesStack} options={{ title: 'Profiles' }} />
      <Tab.Screen name="Settings" component={SettingsStack} options={{ title: 'Settings' }} />
      <Tab.Screen name="Logs" component={LogsStack} options={{ title: 'Logs' }} />
    </Tab.Navigator>
  );
}
