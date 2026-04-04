import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { CubeApiProvider } from '../../context/CubeApiContext';
import { SettingsScreen } from '../SettingsScreen';

describe('SettingsScreen', () => {
  it('renders backup section and restore is disabled until backup exists', () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    expect(screen.getByText(/Backup & restore/)).toBeTruthy();
    expect(screen.getByLabelText('Create backup from cube')).toBeTruthy();
    expect(screen.getByLabelText('Restore last backup to cube').props.accessibilityState?.disabled).toBe(
      true
    );
  });

  it('creates backup then restores last payload via confirmation', async () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    fireEvent.press(screen.getByLabelText('Create backup from cube'));
    await waitFor(() => {
      expect(screen.getByText('Backup created')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('OK'));
    expect(screen.getByLabelText('Restore last backup to cube').props.accessibilityState?.disabled).toBe(
      false
    );
    fireEvent.press(screen.getByLabelText('Restore last backup to cube'));
    expect(screen.getByText('Restore backup?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Restore'));
    await waitFor(() => {
      expect(screen.getByText('Restore sent')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('OK'));
  });

  it('shows backup failed when createBackup throws', async () => {
    const bad: CubeApi = {
      ...mockCubeApi,
      createBackup: async () => {
        throw new Error('no backup');
      },
    };
    render(
      <CubeApiProvider cubeApiOverride={bad}>
        <SettingsScreen />
      </CubeApiProvider>
    );
    fireEvent.press(screen.getByLabelText('Create backup from cube'));
    await waitFor(() => {
      expect(screen.getByText('Backup failed')).toBeTruthy();
    });
    expect(screen.getByText(/no backup/)).toBeTruthy();
    fireEvent.press(screen.getByLabelText('OK'));
  });

  it('shows restore failed when restoreBackup throws', async () => {
    const bad: CubeApi = {
      ...mockCubeApi,
      restoreBackup: async () => {
        throw new Error('reject');
      },
    };
    render(
      <CubeApiProvider cubeApiOverride={bad}>
        <SettingsScreen />
      </CubeApiProvider>
    );
    fireEvent.press(screen.getByLabelText('Create backup from cube'));
    await waitFor(() => {
      expect(screen.getByText('Backup created')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('OK'));
    fireEvent.press(screen.getByLabelText('Restore last backup to cube'));
    fireEvent.press(screen.getByLabelText('Restore'));
    await waitFor(() => {
      expect(screen.getByText('Restore failed')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('OK'));
  });

  it('renders cube connection section', () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    expect(screen.getByText(/Cube connection/)).toBeTruthy();
    expect(screen.getByLabelText('Cube base URL')).toBeTruthy();
    expect(screen.getByLabelText('Save cube URL')).toBeTruthy();
    expect(screen.getByLabelText('Use mock cube')).toBeTruthy();
  });

  it('saves a valid http URL and updates status', () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    fireEvent.changeText(screen.getByLabelText('Cube base URL'), 'http://192.168.0.5:8080');
    fireEvent.press(screen.getByLabelText('Save cube URL'));
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText(/Cube base URL set to http:\/\/192.168.0.5:8080/)).toBeTruthy();
    fireEvent.press(screen.getByLabelText('OK'));
    expect(screen.getByText(/Current: http:\/\/192.168.0.5:8080/)).toBeTruthy();
  });

  it('shows invalid URL dialog when scheme is missing', () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    fireEvent.changeText(screen.getByLabelText('Cube base URL'), '192.168.1.1');
    fireEvent.press(screen.getByLabelText('Save cube URL'));
    expect(screen.getByText('Invalid URL')).toBeTruthy();
    expect(screen.getByText(/Enter a URL starting/)).toBeTruthy();
    fireEvent.press(screen.getByLabelText('OK'));
  });

  it('saves empty field as mock cube', () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    fireEvent.press(screen.getByLabelText('Save cube URL'));
    expect(screen.getByText('Saved')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('OK'));
    expect(screen.getByText(/Current: Mock cube API/)).toBeTruthy();
  });

  it('use mock clears URL and shows dialog', () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    fireEvent.changeText(screen.getByLabelText('Cube base URL'), 'http://example.com');
    fireEvent.press(screen.getByLabelText('Save cube URL'));
    fireEvent.press(screen.getByLabelText('OK'));
    fireEvent.press(screen.getByLabelText('Use mock cube'));
    expect(screen.getByText('Saved')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('OK'));
    expect(screen.getByText(/Current: Mock cube API/)).toBeTruthy();
  });
});
