import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { DevicesStack } from '../../navigation/stacks/DevicesStack';
import { withStackNavigation } from '../../test/withStackNavigation';

describe('DeviceDetailScreen', () => {
  it('shows light controls and toggles power', async () => {
    render(withStackNavigation(DevicesStack));
    await waitFor(() => {
      expect(screen.getByLabelText('Device Living room light')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Device Living room light'));
    await waitFor(() => {
      expect(screen.getByLabelText('Device controls')).toBeTruthy();
    });
    const toggle = screen.getByLabelText('Device power');
    fireEvent(toggle, 'valueChange', false);
    await waitFor(() => {
      expect(screen.getByLabelText('Device power').props.value).toBe(false);
    });
  });
});
