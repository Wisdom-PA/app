import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { DeviceSummary } from '../api/cubeApi.types';
import { ListItem } from '../components/ListItem';
import { RetryLoadDialog } from '../components/RetryLoadDialog';
import { useCubeApiContext } from '../context/CubeApiContext';
import type { DevicesStackParamList } from '../navigation/paramLists';

type DevicesListNav = NativeStackNavigationProp<DevicesStackParamList, 'DevicesList'>;

export function DevicesScreen(): React.JSX.Element {
  const navigation = useNavigation<DevicesListNav>();
  const { cubeApi, cubeBaseUrl } = useCubeApiContext();
  const [devices, setDevices] = useState<DeviceSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryOpen, setRetryOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [scanning, setScanning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await cubeApi.getDevices();
      setDevices(res.devices);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not load devices.';
      setError(msg);
      setDevices(null);
    } finally {
      setLoading(false);
    }
  }, [cubeApi]);

  const scanForDevices = useCallback(async () => {
    setScanning(true);
    setError(null);
    try {
      const res = await cubeApi.discoverDevices();
      setDevices(res.devices);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Discovery failed.';
      setError(msg);
    } finally {
      setScanning(false);
    }
  }, [cubeApi]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await cubeApi.getDevices();
      setDevices(res.devices);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not refresh devices.';
      setError(msg);
    } finally {
      setRefreshing(false);
    }
  }, [cubeApi]);

  useEffect(() => {
    void load();
  }, [load]);

  const grouped = useMemo(() => {
    if (devices == null) {
      return [];
    }
    const map = new Map<string, DeviceSummary[]>();
    for (const d of devices) {
      const room = d.room != null && d.room !== '' ? d.room : 'Other';
      const list = map.get(room) ?? [];
      list.push(d);
      map.set(room, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [devices]);

  const sourceLabel = cubeBaseUrl == null ? 'Mock cube' : cubeBaseUrl;

  return (
    <>
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityLabel="Devices screen"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
      }
    >
      <Text style={styles.heading}>Devices</Text>
      <Text style={styles.source}>Source: {sourceLabel}</Text>

      <View style={styles.scanRow}>
        <Pressable
          onPress={() => void scanForDevices()}
          disabled={scanning}
          style={({ pressed }) => [styles.scanButton, pressed && styles.scanButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Scan for devices"
          accessibilityHint="Runs discovery on the cube and refreshes the list"
        >
          <Text style={styles.scanButtonText}>{scanning ? 'Scanning…' : 'Scan for devices'}</Text>
        </Pressable>
        {scanning ? (
          <ActivityIndicator style={styles.scanSpinner} accessibilityLabel="Scanning for devices" />
        ) : null}
      </View>

      {loading ? (
        <View style={styles.centered} accessibilityLabel="Devices loading">
          <ActivityIndicator size="large" accessibilityLabel="Loading devices" />
        </View>
      ) : null}

      {error != null ? (
        <View style={styles.errorBox} accessibilityLabel="Devices error">
          <Text style={styles.errorText}>{error}</Text>
          <Text
            style={styles.retry}
            onPress={() => setRetryOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Retry loading devices"
          >
            Tap to retry
          </Text>
        </View>
      ) : null}

      {!loading && error == null && devices != null && devices.length === 0 ? (
        <Text style={styles.empty}>No devices reported by the cube.</Text>
      ) : null}

      {!loading && error == null && devices != null && devices.length > 0 ? (
        <View accessibilityLabel="Devices list">
          {grouped.map(([room, list]) => (
            <View key={room}>
              <Text
                style={styles.roomHeading}
                accessibilityRole="header"
                accessibilityLabel={`Room ${room}`}
              >
                {room}
              </Text>
              {list.map((d) => (
                <ListItem
                  key={d.id}
                  title={d.name ?? d.id}
                  subtitle={
                    [
                      d.type,
                      d.power != null ? (d.power ? 'On' : 'Off') : null,
                      d.brightness != null ? `${Math.round((d.brightness ?? 0) * 100)}%` : null,
                      d.reachable === false ? 'Offline' : null,
                    ]
                      .filter(Boolean)
                      .join(' · ') || undefined
                  }
                  accessibilityLabel={`Device ${d.name ?? d.id}`}
                  accessibilityHint="Opens device details"
                  onPress={() => navigation.navigate('DeviceDetail', { device: d })}
                />
              ))}
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
    <RetryLoadDialog
      visible={retryOpen}
      message="Try loading devices again?"
      onClose={() => setRetryOpen(false)}
      onRetry={() => void load()}
    />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  source: {
    fontSize: 13,
    opacity: 0.7,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  scanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 12,
  },
  scanButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  scanButtonPressed: {
    opacity: 0.85,
  },
  scanButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  scanSpinner: { marginLeft: 4 },
  centered: { paddingVertical: 24, alignItems: 'center' },
  errorBox: {
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(200, 0, 0, 0.08)',
  },
  errorText: { fontSize: 14, marginBottom: 8 },
  retry: { fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
  empty: { paddingHorizontal: 16, fontSize: 14, opacity: 0.8 },
  roomHeading: {
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.55,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
});
