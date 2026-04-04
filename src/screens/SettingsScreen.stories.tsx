import React from 'react';
import { CubeApiProvider } from '../context/CubeApiContext';
import { SettingsScreen } from './SettingsScreen';

export default {
  title: 'Screens/SettingsScreen',
  component: SettingsScreen,
  decorators: [
    (Story: React.ComponentType<object>): React.JSX.Element => (
      <CubeApiProvider>
        <Story />
      </CubeApiProvider>
    ),
  ],
};

export const Default = {};
