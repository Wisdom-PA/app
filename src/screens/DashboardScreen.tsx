import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Status } from '../api/cubeApi.types';
import { ListItem } from '../components/ListItem';
import { RetryLoadDialog } from '../components/RetryLoadDialog';
import { useCubeApiContext } from '../context/CubeApiContext';

export function DashboardScreen(): React.JSX.Element {
  const { cubeApi, cubeBaseUrl } = useCubeApiContext();
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryOpen, setRetryOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await cubeApi.getStatus();
      setStatus(s);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not load cube status.';
      setError(msg);
      setStatus(null);
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
      accessibilityLabel="Dashboard"
    >
      <Text style={styles.heading}>Cube status</Text>
      <Text style={styles.source}>Source: {sourceLabel}</Text>

      {loading ? (
        <View style={styles.centered} accessibilityLabel="Dashboard loading">
          <ActivityIndicator size="large" accessibilityLabel="Loading status" />
        </View>
      ) : null}

      {error != null ? (
        <View style={styles.errorBox} accessibilityLabel="Dashboard error">
          <Text style={styles.errorText}>{error}</Text>
          <Text
            style={styles.retry}
            onPress={() => setRetryOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Retry loading status"
          >
            Tap to retry
          </Text>
        </View>
      ) : null}

      {!loading && error == null && status != null ? (
        <View accessibilityLabel="Dashboard status details">
          <ListItem title="Version" subtitle={status.version} />
          <ListItem
            title="Ready"
            subtitle={status.ready ? 'Yes' : 'No'}
            accessibilityLabel={`Ready ${status.ready ? 'yes' : 'no'}`}
          />
          <ListItem
            title="Privacy mode"
            subtitle={status.privacy_mode ?? '—'}
            accessibilityLabel={`Privacy mode ${status.privacy_mode ?? 'unknown'}`}
          />
        </View>
      ) : null}
    </ScrollView>
    <RetryLoadDialog
      visible={retryOpen}
      message="Try loading status again?"
      onClose={() => setRetryOpen(false)}
      onRetry={() => void load()}
    />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
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
  centered: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  errorBox: {
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(200, 0, 0, 0.08)',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 8,
  },
  retry: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
