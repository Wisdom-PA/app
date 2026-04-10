import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import type { DeviceSummary } from '../api/cubeApi.types';
import { useCubeApiContext } from '../context/CubeApiContext';
import type { DevicesStackParamList } from '../navigation/paramLists';

type Props = NativeStackScreenProps<DevicesStackParamList, 'DeviceDetail'>;

function isLight(device: DeviceSummary): boolean {
  return device.type === 'light';
}

export function DeviceDetailScreen({ route }: Props): React.JSX.Element {
  const deviceId = route.params.device.id;
  const [device, setDevice] = useState<DeviceSummary>(route.params.device);
  const { cubeApi } = useCubeApiContext();
  const [patchError, setPatchError] = useState<string | null>(null);
  const [patching, setPatching] = useState(false);

  const refreshFromList = useCallback(async () => {
    try {
      const res = await cubeApi.getDevices();
      const found = res.devices.find((d) => d.id === deviceId);
      if (found != null) {
        setDevice(found);
      }
    } catch {
      // keep last known device
    }
  }, [cubeApi, deviceId]);

  useFocusEffect(
    useCallback(() => {
      void refreshFromList();
    }, [refreshFromList]),
  );

  const patch = async (body: { power?: boolean; brightness?: number }): Promise<void> => {
    setPatching(true);
    setPatchError(null);
    try {
      const updated = await cubeApi.patchDevice(deviceId, body);
      setDevice(updated);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Update failed.';
      setPatchError(msg);
    } finally {
      setPatching(false);
    }
  };

  const onTogglePower = (next: boolean): void => {
    void patch({ power: next });
  };

  const adjustBrightness = (delta: number): void => {
    const current = device.brightness ?? 1;
    const next = Math.max(0, Math.min(1, Math.round((current + delta) * 100) / 100));
    void patch({ brightness: next });
  };

  const showControls = isLight(device);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityLabel="Device detail"
    >
      <Text style={styles.title}>{device.name ?? device.id}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>ID</Text>
        <Text style={styles.value} selectable>
          {device.id}
        </Text>
      </View>
      {device.type != null && device.type !== '' ? (
        <View style={styles.row}>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.value}>{device.type}</Text>
        </View>
      ) : null}
      {device.room != null && device.room !== '' ? (
        <View style={styles.row}>
          <Text style={styles.label}>Room</Text>
          <Text style={styles.value}>{device.room}</Text>
        </View>
      ) : null}

      {showControls ? (
        <View style={styles.controls} accessibilityLabel="Device controls">
          <View style={styles.switchRow}>
            <Text style={styles.labelInline}>Power</Text>
            <Switch
              value={device.power ?? false}
              onValueChange={onTogglePower}
              disabled={patching}
              accessibilityLabel="Device power"
            />
          </View>
          {patching ? (
            <ActivityIndicator style={styles.patchSpinner} accessibilityLabel="Updating device" />
          ) : null}
          <Text style={styles.label}>Brightness</Text>
          <Text style={styles.brightnessValue}>{(device.brightness ?? 1).toFixed(2)}</Text>
          <View style={styles.dimRow}>
            <Pressable
              style={({ pressed }) => [styles.dimBtn, pressed && styles.dimBtnPressed]}
              onPress={() => adjustBrightness(-0.05)}
              disabled={patching}
              accessibilityLabel="Dimmer"
              accessibilityRole="button"
            >
              <Text style={styles.dimBtnText}>−</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.dimBtn, pressed && styles.dimBtnPressed]}
              onPress={() => adjustBrightness(0.05)}
              disabled={patching}
              accessibilityLabel="Brighter"
              accessibilityRole="button"
            >
              <Text style={styles.dimBtnText}>+</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {patchError != null ? (
        <Text style={styles.error} accessibilityLabel="Device update error">
          {patchError}
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  row: { marginBottom: 14 },
  label: { fontSize: 12, opacity: 0.65, marginBottom: 4 },
  labelInline: { fontSize: 16, fontWeight: '500' },
  value: { fontSize: 16 },
  controls: { marginTop: 20, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#ccc' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  patchSpinner: { alignSelf: 'flex-start', marginBottom: 8 },
  brightnessValue: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  dimRow: { flexDirection: 'row', gap: 12 },
  dimBtn: {
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 64,
    alignItems: 'center',
  },
  dimBtnPressed: { opacity: 0.85 },
  dimBtnText: { fontSize: 20, fontWeight: '600', color: '#2563eb' },
  error: { color: '#b91c1c', marginTop: 16, fontSize: 14 },
});
