import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  component: Toggle,
  title: 'Components/Toggle',
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Off: Story = {
  args: { label: 'Paranoid mode', value: false, onValueChange: () => {} },
};

export const On: Story = {
  args: { label: 'Paranoid mode', value: true, onValueChange: () => {} },
};

export const Disabled: Story = {
  args: { label: 'Guest profile', value: false, onValueChange: () => {}, disabled: true },
};
