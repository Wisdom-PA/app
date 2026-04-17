import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ListItem } from '../components/ListItem';
import { useCubeApiContext } from '../context/CubeApiContext';
import type { SettingsStackParamList } from '../navigation/paramLists';
import {
  clearEncryptedBackup,
  hasEncryptedBackup,
  loadEncryptedBackup,
  saveEncryptedBackup,
} from '../storage/backupVault';

type Feedback = { title: string; message: string } | null;

type SettingsNav = NativeStackNavigationProp<SettingsStackParamList, 'SettingsList'>;

export function SettingsScreen(): React.JSX.Element {
  const navigation = useNavigation<SettingsNav>();
  const { cubeApi, cubeBaseUrl, setCubeBaseUrl } = useCubeApiContext();
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false);
  const [clearVaultConfirmOpen, setClearVaultConfirmOpen] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [encryptSaving, setEncryptSaving] = useState(false);
  const [vaultClearing, setVaultClearing] = useState(false);
  const [storedOnDevice, setStoredOnDevice] = useState(false);
  const [lastBackupPayload, setLastBackupPayload] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    setDraft(cubeBaseUrl ?? '');
  }, [cubeBaseUrl]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const has = await hasEncryptedBackup();
        if (cancelled) {
          return;
        }
        setStoredOnDevice(has);
        if (has) {
          const buf = await loadEncryptedBackup();
          if (cancelled || buf == null) {
            return;
          }
          setLastBackupPayload(buf.slice(0));
        }
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : 'Could not read stored backup.';
          setFeedback({ title: 'Stored backup', message: msg });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dismissFeedback = (): void => {
    setFeedback(null);
  };

  const onSave = (): void => {
    const t = draft.trim();
    if (t === '') {
      setCubeBaseUrl(null);
      setFeedback({ title: 'Saved', message: 'Using mock cube API.' });
      return;
    }
    if (!/^https?:\/\//i.test(t)) {
      setFeedback({
        title: 'Invalid URL',
        message:
          'Enter a URL starting with http:// or https://, or clear the field to use the mock.',
      });
      return;
    }
    setCubeBaseUrl(t);
    setFeedback({ title: 'Saved', message: `Cube base URL set to ${t.replace(/\/$/, '')}.` });
  };

  const onUseMock = (): void => {
    setDraft('');
    setCubeBaseUrl(null);
    setFeedback({ title: 'Saved', message: 'Using mock cube API.' });
  };

  const onCreateBackup = async (): Promise<void> => {
    setBackupLoading(true);
    try {
      const buf = await cubeApi.createBackup();
      setLastBackupPayload(buf.slice(0));
      setFeedback({
        title: 'Backup created',
        message: `Received ${buf.byteLength} bytes. Use “Restore last backup” to send it to the cube, or “Save encrypted on device” to keep a copy on this phone.`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Backup failed.';
      setFeedback({ title: 'Backup failed', message: msg });
    } finally {
      setBackupLoading(false);
    }
  };

  const runRestore = async (): Promise<void> => {
    if (lastBackupPayload == null) {
      return;
    }
    setRestoreLoading(true);
    try {
      await cubeApi.restoreBackup(lastBackupPayload);
      setFeedback({
        title: 'Restore sent',
        message: 'The cube accepted the restore request.',
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Restore failed.';
      setFeedback({ title: 'Restore failed', message: msg });
    } finally {
      setRestoreLoading(false);
    }
  };

  const onSaveEncryptedOnDevice = async (): Promise<void> => {
    if (lastBackupPayload == null) {
      return;
    }
    setEncryptSaving(true);
    try {
      await saveEncryptedBackup(lastBackupPayload);
      setStoredOnDevice(true);
      setFeedback({
        title: 'Saved on device',
        message:
          'Backup is encrypted with a key in the device keystore and stored locally. You can restore to the cube from this screen anytime.',
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not save backup on device.';
      setFeedback({ title: 'Save failed', message: msg });
    } finally {
      setEncryptSaving(false);
    }
  };

  const onClearStoredBackup = async (): Promise<void> => {
    setVaultClearing(true);
    try {
      await clearEncryptedBackup();
      setStoredOnDevice(false);
      setFeedback({
        title: 'Cleared',
        message: 'Encrypted backup removed from this device. Session restore buffer is unchanged.',
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not clear stored backup.';
      setFeedback({ title: 'Clear failed', message: msg });
    } finally {
      setVaultClearing(false);
    }
  };

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        accessibilityLabel="Settings"
      >
        <Text style={styles.heading}>Cube connection</Text>
        <Text style={styles.help}>
          For a dev cube on your LAN, enter its base URL (same host/port as the HTTP gateway). Leave
          blank to use the built-in mock API.
        </Text>

        <Text
          style={styles.label}
          accessibilityRole="header"
        >
          Base URL
        </Text>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="http://192.168.1.10:8080"
          placeholderTextColor="#888"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          accessibilityLabel="Cube base URL"
          accessibilityHint="HTTP or HTTPS URL of the cube API, or leave empty for mock"
        />

        <View style={styles.row}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={onSave}
            accessibilityLabel="Save cube URL"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.buttonSecondary, pressed && styles.buttonPressed]}
            onPress={onUseMock}
            accessibilityLabel="Use mock cube"
            accessibilityRole="button"
          >
            <Text style={styles.buttonSecondaryText}>Use mock</Text>
          </Pressable>
        </View>

        <Text style={styles.status}>
          Current: {cubeBaseUrl == null ? 'Mock cube API' : cubeBaseUrl}
        </Text>

        <Text style={[styles.heading, styles.sectionHeading]}>Cube & connectivity</Text>
        <ListItem
          title="Cube settings"
          subtitle="Name, default privacy, global offline"
          onPress={() => navigation.navigate('CubeSettings')}
          accessibilityLabel="Open cube settings"
          accessibilityHint="Opens cube configuration from the API"
        />
        <ListItem
          title="Internet activity"
          subtitle="Transparency log of outbound calls"
          onPress={() => navigation.navigate('InternetActivity')}
          accessibilityLabel="Open internet activity"
        />
        <ListItem
          title="Connectivity setup"
          subtitle="Bluetooth, Wi‑Fi, and verify LAN access"
          onPress={() => navigation.navigate('ConnectivityWizard', {})}
          accessibilityLabel="Open connectivity setup"
        />

        <Text style={[styles.heading, styles.sectionHeading]}>Backup & restore</Text>
        <Text style={styles.help}>
          Create a backup from the cube (POST /backup). Restore sends the in-memory payload to the
          cube (POST /restore). Optionally save the same payload encrypted on this phone (F9.T9.S2):
          key in the OS secure store, ciphertext in app storage.
        </Text>

        <Text style={styles.status}>
          Encrypted copy on device: {storedOnDevice ? 'yes' : 'no'}
        </Text>

        <View style={styles.row}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              (backupLoading || restoreLoading || encryptSaving || vaultClearing) && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => void onCreateBackup()}
            disabled={backupLoading || restoreLoading || encryptSaving || vaultClearing}
            accessibilityLabel="Create backup from cube"
            accessibilityRole="button"
          >
            {backupLoading ? (
              <ActivityIndicator color="#fff" accessibilityLabel="Creating backup" />
            ) : (
              <Text style={styles.buttonText}>Create backup</Text>
            )}
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.buttonSecondary,
              (restoreLoading || lastBackupPayload == null || backupLoading || encryptSaving || vaultClearing) &&
                styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setRestoreConfirmOpen(true)}
            disabled={restoreLoading || lastBackupPayload == null || backupLoading || encryptSaving || vaultClearing}
            accessibilityLabel="Restore last backup to cube"
            accessibilityRole="button"
          >
            {restoreLoading ? (
              <ActivityIndicator color="#2563eb" accessibilityLabel="Restoring backup" />
            ) : (
              <Text style={styles.buttonSecondaryText}>Restore last backup</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.row}>
          <Pressable
            style={({ pressed }) => [
              styles.buttonSecondary,
              (lastBackupPayload == null || backupLoading || encryptSaving || vaultClearing) &&
                styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => void onSaveEncryptedOnDevice()}
            disabled={lastBackupPayload == null || backupLoading || encryptSaving || vaultClearing}
            accessibilityLabel="Save backup encrypted on device"
            accessibilityRole="button"
          >
            {encryptSaving ? (
              <ActivityIndicator color="#2563eb" accessibilityLabel="Saving backup" />
            ) : (
              <Text style={styles.buttonSecondaryText}>Save encrypted on device</Text>
            )}
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.buttonSecondary,
              (!storedOnDevice || encryptSaving || vaultClearing) && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setClearVaultConfirmOpen(true)}
            disabled={!storedOnDevice || encryptSaving || vaultClearing}
            accessibilityLabel="Clear encrypted backup from device"
            accessibilityRole="button"
          >
            {vaultClearing ? (
              <ActivityIndicator color="#2563eb" accessibilityLabel="Clearing backup" />
            ) : (
              <Text style={styles.buttonSecondaryText}>Clear device backup</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={feedback != null}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        primaryLabel="OK"
        onPrimary={dismissFeedback}
        onDismiss={dismissFeedback}
      />

      <ConfirmDialog
        visible={restoreConfirmOpen}
        title="Restore backup?"
        message="This POSTs the last backup payload to the cube. Only continue if you trust this cube."
        secondaryLabel="Cancel"
        onSecondary={() => setRestoreConfirmOpen(false)}
        primaryLabel="Restore"
        onPrimary={() => {
          setRestoreConfirmOpen(false);
          void runRestore();
        }}
        onDismiss={() => setRestoreConfirmOpen(false)}
      />

      <ConfirmDialog
        visible={clearVaultConfirmOpen}
        title="Clear device backup?"
        message="Removes the encrypted backup from this phone. Your current in-memory restore buffer is not cleared."
        secondaryLabel="Cancel"
        onSecondary={() => setClearVaultConfirmOpen(false)}
        primaryLabel="Clear"
        onPrimary={() => {
          setClearVaultConfirmOpen(false);
          void onClearStoredBackup();
        }}
        onDismiss={() => setClearVaultConfirmOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeading: {
    marginTop: 8,
  },
  help: {
    fontSize: 14,
    opacity: 0.75,
    paddingHorizontal: 16,
    marginBottom: 16,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  input: {
    marginHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 8,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  buttonSecondaryText: { color: '#2563eb', fontWeight: '600', fontSize: 16 },
  status: {
    fontSize: 13,
    opacity: 0.8,
    paddingHorizontal: 16,
  },
});
