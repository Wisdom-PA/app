import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { CubeApiProvider } from '../../context/CubeApiContext';
import { SettingsStack } from '../../navigation/stacks/SettingsStack';
import * as backupVault from '../../storage/backupVault';

jest.mock('../../storage/backupVault', () => ({
  saveEncryptedBackup: jest.fn().mockResolvedValue(undefined),
  loadEncryptedBackup: jest.fn().mockResolvedValue(null),
  clearEncryptedBackup: jest.fn().mockResolvedValue(undefined),
  hasEncryptedBackup: jest.fn().mockResolvedValue(false),
}));

async function renderSettings(cubeApiOverride?: CubeApi): Promise<void> {
  render(
    <CubeApiProvider cubeApiOverride={cubeApiOverride}>
      <NavigationContainer>
        <SettingsStack />
      </NavigationContainer>
    </CubeApiProvider>
  );
  await waitFor(() => {
    expect(screen.getByText(/Encrypted copy on device/)).toBeTruthy();
  });
}

describe('SettingsScreen', () => {
  it('renders backup section and restore is disabled until backup exists', async () => {
    await renderSettings();
    expect(screen.getByText(/Backup & restore/)).toBeTruthy();
    expect(screen.getByText(/Encrypted copy on device: no/)).toBeTruthy();
    expect(screen.getByLabelText('Create backup from cube')).toBeTruthy();
    expect(screen.getByLabelText('Restore last backup to cube').props.accessibilityState?.disabled).toBe(
      true
    );
    expect(screen.getByLabelText('Save backup encrypted on device').props.accessibilityState?.disabled).toBe(
      true
    );
    expect(screen.getByLabelText('Clear encrypted backup from device').props.accessibilityState?.disabled).toBe(
      true
    );
  });

  it('creates backup then restores last payload via confirmation', async () => {
    await renderSettings();
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

  it('saves encrypted copy after backup when button is pressed', async () => {
    const saveSpy = backupVault.saveEncryptedBackup as jest.Mock;
    saveSpy.mockClear();
    await renderSettings();
    fireEvent.press(screen.getByLabelText('Create backup from cube'));
    await waitFor(() => {
      expect(screen.getByText('Backup created')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('OK'));
    fireEvent.press(screen.getByLabelText('Save backup encrypted on device'));
    await waitFor(() => {
      expect(saveSpy).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.getByText('Saved on device')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('OK'));
    expect(screen.getByText(/Encrypted copy on device: yes/)).toBeTruthy();
  });

  it('clears device backup after confirmation', async () => {
    const clearSpy = backupVault.clearEncryptedBackup as jest.Mock;
    const hasSpy = backupVault.hasEncryptedBackup as jest.Mock;
    hasSpy.mockResolvedValueOnce(true);
    const buf = new TextEncoder().encode('x').buffer;
    (backupVault.loadEncryptedBackup as jest.Mock).mockResolvedValueOnce(buf.slice(0));
    clearSpy.mockClear();
    await renderSettings();
    expect(screen.getByText(/Encrypted copy on device: yes/)).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Clear encrypted backup from device'));
    expect(screen.getByText('Clear device backup?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Clear'));
    await waitFor(() => {
      expect(clearSpy).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.getByText('Cleared')).toBeTruthy();
    });
  });

  it('shows backup failed when createBackup throws', async () => {
    const bad: CubeApi = {
      ...mockCubeApi,
      createBackup: async () => {
        throw new Error('no backup');
      },
    };
    await renderSettings(bad);
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
    await renderSettings(bad);
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

  it('renders cube connection section', async () => {
    await renderSettings();
    expect(screen.getByText(/Cube connection/)).toBeTruthy();
    expect(screen.getByLabelText('Cube base URL')).toBeTruthy();
    expect(screen.getByLabelText('Save cube URL')).toBeTruthy();
    expect(screen.getByLabelText('Use mock cube')).toBeTruthy();
  });

  it('saves a valid http URL and updates status', async () => {
    await renderSettings();
    fireEvent.changeText(screen.getByLabelText('Cube base URL'), 'http://192.168.0.5:8080');
    fireEvent.press(screen.getByLabelText('Save cube URL'));
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText(/Cube base URL set to http:\/\/192.168.0.5:8080/)).toBeTruthy();
    fireEvent.press(screen.getByLabelText('OK'));
    expect(screen.getByText(/Current: http:\/\/192.168.0.5:8080/)).toBeTruthy();
  });

  it('shows invalid URL dialog when scheme is missing', async () => {
    await renderSettings();
    fireEvent.changeText(screen.getByLabelText('Cube base URL'), '192.168.1.1');
    fireEvent.press(screen.getByLabelText('Save cube URL'));
    expect(screen.getByText('Invalid URL')).toBeTruthy();
    expect(screen.getByText(/Enter a URL starting/)).toBeTruthy();
    fireEvent.press(screen.getByLabelText('OK'));
  });

  it('saves empty field as mock cube', async () => {
    await renderSettings();
    fireEvent.press(screen.getByLabelText('Save cube URL'));
    expect(screen.getByText('Saved')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('OK'));
    expect(screen.getByText(/Current: Mock cube API/)).toBeTruthy();
  });

  it('use mock clears URL and shows dialog', async () => {
    await renderSettings();
    fireEvent.changeText(screen.getByLabelText('Cube base URL'), 'http://example.com');
    fireEvent.press(screen.getByLabelText('Save cube URL'));
    fireEvent.press(screen.getByLabelText('OK'));
    fireEvent.press(screen.getByLabelText('Use mock cube'));
    expect(screen.getByText('Saved')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('OK'));
    expect(screen.getByText(/Current: Mock cube API/)).toBeTruthy();
  });
});
