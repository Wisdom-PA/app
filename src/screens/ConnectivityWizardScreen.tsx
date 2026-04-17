import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useCubeApiContext } from '../context/CubeApiContext';
import type { SettingsStackParamList } from '../navigation/paramLists';

type StepId = 'pair' | 'wifi' | 'verify';

type Props = NativeStackScreenProps<SettingsStackParamList, 'ConnectivityWizard'>;

export function ConnectivityWizardScreen(_props: Props): React.JSX.Element {
  const route = useRoute<RouteProp<SettingsStackParamList, 'ConnectivityWizard'>>();
  const { cubeApi, cubeBaseUrl } = useCubeApiContext();
  const [step, setStep] = useState<StepId>('pair');
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [verifyState, setVerifyState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  useEffect(() => {
    const s = route.params?.initialStep;
    if (s === 'pair' || s === 'wifi' || s === 'verify') {
      setStep(s);
    }
  }, [route.params?.initialStep]);

  const openAppSettings = useCallback(async (): Promise<void> => {
    setSettingsError(null);
    try {
      await Linking.openSettings();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not open settings.';
      setSettingsError(msg);
    }
  }, []);

  const runVerify = useCallback(async (): Promise<void> => {
    setVerifyState('loading');
    setVerifyMessage(null);
    try {
      const s = await cubeApi.getStatus();
      setVerifyState('done');
      setVerifyMessage(
        `Reachable. Version ${s.version}, ready: ${s.ready ? 'yes' : 'no'}, privacy: ${s.privacy_mode}.`,
      );
    } catch (e) {
      setVerifyState('done');
      const msg = e instanceof Error ? e.message : 'Request failed.';
      setVerifyMessage(msg);
    }
  }, [cubeApi]);

  const sourceLabel = cubeBaseUrl == null ? 'Mock cube (no LAN URL set)' : cubeBaseUrl;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityLabel="Connectivity setup screen"
    >
      <Text style={styles.lead}>
        Phase 10 companion flow: prepare Bluetooth and Wi‑Fi on the phone, then confirm the app can
        talk to the cube over your LAN using the base URL on Settings.
      </Text>

      <View style={styles.tabs} accessibilityRole="tablist">
        {(
          [
            { id: 'pair' as const, label: 'Bluetooth', a11y: 'bluetooth' },
            { id: 'wifi' as const, label: 'Wi‑Fi', a11y: 'wifi' },
            { id: 'verify' as const, label: 'Verify LAN', a11y: 'verify-lan' },
          ] as const
        ).map(({ id, label, a11y }) => {
          const selected = step === id;
          return (
            <Pressable
              key={id}
              onPress={() => setStep(id)}
              style={[styles.tab, selected && styles.tabSelected]}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={`Connectivity step ${a11y}`}
            >
              <Text style={[styles.tabLabel, selected && styles.tabLabelSelected]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      {step === 'pair' ? (
        <View style={styles.panel} accessibilityLabel="Bluetooth pairing guidance">
          <Text style={styles.title}>Pair with the cube</Text>
          <Text style={styles.body}>
            Production pairing will discover the cube over Bluetooth, exchange keys, and establish a
            secure session (F9.T2). Until that ships, use the cube base URL on the main Settings screen
            for development (for example http://192.168.1.10:8080).
          </Text>
          <Text style={styles.body}>
            Use your phone&apos;s Bluetooth screen to confirm Bluetooth is on. You can open the
            system settings for this app if you need to grant nearby devices or location permissions
            later.
          </Text>
          <Pressable
            onPress={() => void openAppSettings()}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            accessibilityRole="button"
            accessibilityLabel="Open device app settings"
          >
            <Text style={styles.buttonText}>Open app settings</Text>
          </Pressable>
          {settingsError != null ? (
            <Text style={styles.errorText} accessibilityLabel="Settings open error">
              {settingsError}
            </Text>
          ) : null}
        </View>
      ) : null}

      {step === 'wifi' ? (
        <View style={styles.panel} accessibilityLabel="Wi-Fi setup guidance">
          <Text style={styles.title}>Wi‑Fi on the cube</Text>
          <Text style={styles.body}>
            Provisioning will let you pick a network and send credentials securely to the cube (F9.T3).
            Until then, join the cube to the same LAN as this phone using the manufacturer or OS flow,
            then set the cube base URL under Settings.
          </Text>
          <Pressable
            onPress={() => void openAppSettings()}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            accessibilityRole="button"
            accessibilityLabel="Open device app settings for Wi-Fi"
          >
            <Text style={styles.buttonText}>Open app settings</Text>
          </Pressable>
          {settingsError != null ? (
            <Text style={styles.errorText} accessibilityLabel="Settings open error">
              {settingsError}
            </Text>
          ) : null}
        </View>
      ) : null}

      {step === 'verify' ? (
        <View style={styles.panel} accessibilityLabel="LAN verification panel">
          <Text style={styles.title}>Verify LAN access</Text>
          <Text style={styles.body}>Active API target:</Text>
          <Text style={styles.mono}>{sourceLabel}</Text>
          <Text style={styles.body}>
            Calls GET /status on that base URL (or the mock when no URL is set). Use this after pairing
            and Wi‑Fi are sorted out.
          </Text>
          <Pressable
            onPress={() => void runVerify()}
            style={({ pressed }) => [
              styles.button,
              pressed && verifyState !== 'loading' && styles.buttonPressed,
              verifyState === 'loading' && styles.buttonDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Check cube connection"
            disabled={verifyState === 'loading'}
          >
            <Text style={styles.buttonText}>Check connection</Text>
          </Pressable>
          {verifyState === 'loading' ? (
            <View style={styles.row}>
              <ActivityIndicator accessibilityLabel="Checking cube connection" />
              <Text style={styles.body}>Checking…</Text>
            </View>
          ) : null}
          {verifyMessage != null ? (
            <Text style={styles.verifyResult} accessibilityLabel="Connection check result">
              {verifyMessage}
            </Text>
          ) : null}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  lead: { fontSize: 14, lineHeight: 20, opacity: 0.8, marginBottom: 16 },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    alignItems: 'center',
  },
  tabSelected: {
    borderColor: 'rgba(0,80,200,0.45)',
    backgroundColor: 'rgba(0,80,200,0.06)',
  },
  tabLabel: { fontSize: 13, fontWeight: '500', opacity: 0.75 },
  tabLabelSelected: { opacity: 1 },
  panel: { marginTop: 4 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
  body: { fontSize: 15, lineHeight: 22, opacity: 0.88, marginBottom: 10 },
  mono: {
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 12,
    opacity: 0.9,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,80,200,0.12)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 4,
  },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { fontSize: 15, fontWeight: '600' },
  errorText: { marginTop: 10, fontSize: 14, color: '#a40000' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  verifyResult: { marginTop: 12, fontSize: 15, lineHeight: 22 },
});
