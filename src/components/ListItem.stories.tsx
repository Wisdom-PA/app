import { ListItem } from './ListItem';

export default {
  title: 'Components/ListItem',
  component: ListItem,
};

export const TitleOnly = {
  args: { title: 'Living room light' },
};

export const WithSubtitle = {
  args: { title: 'Living room light', subtitle: 'On · Brightness 80%' },
};

export const Pressable = {
  args: {
    title: 'Evening lights',
    subtitle: 'Routine',
    onPress: () => {},
  },
};
