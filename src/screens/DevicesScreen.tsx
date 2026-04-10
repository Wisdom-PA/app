import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
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

  useEffect(() => {
    void load();
  }, [load]);

  const sourceLabel = cubeBaseUrl == null ? 'Mock cube' : cubeBaseUrl;

  return (
    <>
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityLabel="Devices screen"
    >
      <Text style={styles.heading}>Devices</Text>
      <Text style={styles.source}>Source: {sourceLabel}</Text>

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
          {devices.map((d) => (
            <ListItem
              key={d.id}
              title={d.name ?? d.id}
              subtitle={[d.type, d.room].filter(Boolean).join(' · ') || undefined}
              accessibilityLabel={`Device ${d.name ?? d.id}`}
              accessibilityHint="Opens device details"
              onPress={() => navigation.navigate('DeviceDetail', { device: d })}
            />
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
    marginBottom: 12,
  },
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
});
