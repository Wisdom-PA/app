import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { CubeApiProvider } from '../../context/CubeApiContext';
import { ProfilesScreen } from '../ProfilesScreen';

function renderWithProvider(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<CubeApiProvider>{ui}</CubeApiProvider>);
}

describe('ProfilesScreen', () => {
  it(
    'loads profiles from mock API and exposes screen label',
    async () => {
      renderWithProvider(<ProfilesScreen />);
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
    render(
      <CubeApiProvider cubeApiOverride={failing}>
        <ProfilesScreen />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Cube unavailable')).toBeTruthy();
    });
    expect(screen.getByLabelText('Profiles error')).toBeTruthy();
  });

  it('shows em dash for profile without role', async () => {
    const api: CubeApi = {
      ...mockCubeApi,
      getProfiles: async () => ({
        profiles: [{ id: 'p1', display_name: 'Name only' }],
      }),
    };
    render(
      <CubeApiProvider cubeApiOverride={api}>
        <ProfilesScreen />
      </CubeApiProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Role: —')).toBeTruthy();
    });
  });
});
