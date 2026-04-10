import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { ProfilesStack } from '../../navigation/stacks/ProfilesStack';
import { withStackNavigation } from '../../test/withStackNavigation';

describe('ProfilesScreen', () => {
  it(
    'loads profiles from mock API and exposes screen label',
    async () => {
      render(withStackNavigation(ProfilesStack));
      expect(screen.getByLabelText('Profiles screen')).toBeTruthy();
      // Wait on unique copy (not accessibility): labels can differ across RN/test environments.
      expect(
        await screen.findByText('Role: Adult', { exact: true }, { timeout: 15000 })
      ).toBeTruthy();
      expect(screen.getByText('Role: Guest', { exact: true })).toBeTruthy();
      expect(screen.getByText(/Mock cube/)).toBeTruthy();
    },
    20000
  );

  it('shows error when API fails', async () => {
    const failing: CubeApi = {
      ...mockCubeApi,
      getProfiles: async () => {
        throw new Error('Cube unavailable');
      },
    };
    render(withStackNavigation(ProfilesStack, failing));
    await waitFor(() => {
      expect(screen.getByText('Cube unavailable')).toBeTruthy();
    });
    expect(screen.getByLabelText('Profiles error')).toBeTruthy();
  });

  it('opens retry dialog from error state and can cancel', async () => {
    const failing: CubeApi = {
      ...mockCubeApi,
      getProfiles: async () => {
        throw new Error('Cube unavailable');
      },
    };
    render(withStackNavigation(ProfilesStack, failing));
    await waitFor(() => {
      expect(screen.getByText('Cube unavailable')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Retry loading profiles'));
    expect(screen.getByText('Try loading profiles again?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Cancel'));
  });

  it('shows em dash for profile without role', async () => {
    const api: CubeApi = {
      ...mockCubeApi,
      getProfiles: async () => ({
        profiles: [{ id: 'p1', display_name: 'Name only' }],
      }),
    };
    render(withStackNavigation(ProfilesStack, api));
    await waitFor(() => {
      expect(screen.getByText('Role: —')).toBeTruthy();
    });
  });
});
