import { Toggle } from './Toggle';

export default {
  title: 'Components/Toggle',
  component: Toggle,
};

export const Off = {
  args: { label: 'Paranoid mode', value: false, onValueChange: () => {} },
};

export const On = {
  args: { label: 'Paranoid mode', value: true, onValueChange: () => {} },
};

export const Disabled = {
  args: { label: 'Guest profile', value: false, onValueChange: () => {}, disabled: true },
};
