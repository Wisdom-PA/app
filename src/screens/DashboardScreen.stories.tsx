import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DashboardScreen } from './DashboardScreen';

const meta: Meta<typeof DashboardScreen> = {
  component: DashboardScreen,
  title: 'Screens/DashboardScreen',
};

export default meta;

type Story = StoryObj<typeof DashboardScreen>;

export const Default: Story = {};
