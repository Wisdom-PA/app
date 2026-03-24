import type { Meta, StoryObj } from '@storybook/react';
import { PlaceholderScreen } from './PlaceholderScreen';

const meta: Meta<typeof PlaceholderScreen> = {
  component: PlaceholderScreen,
  title: 'Components/PlaceholderScreen',
};

export default meta;

type Story = StoryObj<typeof PlaceholderScreen>;

export const Default: Story = {
  args: {
    message: 'This screen is a placeholder. Connect to a cube to get started.',
    accessibilityLabel: 'Placeholder',
  },
};
