import type { Meta, StoryObj } from '@storybook/react';
import { ListItem } from './ListItem';

const meta: Meta<typeof ListItem> = {
  component: ListItem,
  title: 'Components/ListItem',
};

export default meta;

type Story = StoryObj<typeof ListItem>;

export const TitleOnly: Story = {
  args: { title: 'Living room light' },
};

export const WithSubtitle: Story = {
  args: { title: 'Living room light', subtitle: 'On · Brightness 80%' },
};

export const Pressable: Story = {
  args: {
    title: 'Evening lights',
    subtitle: 'Routine',
    onPress: () => {},
  },
};
