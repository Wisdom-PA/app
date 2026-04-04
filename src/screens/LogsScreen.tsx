import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useCubeApiContext } from '../context/CubeApiContext';

export function LogsScreen(): React.JSX.Element {
  const { cubeApi, cubeBaseUrl } = useCubeApiContext();
  const [chainCount, setChainCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await cubeApi.getLogs();
      setChainCount(Array.isArray(res.chains) ? res.chains.length : 0);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not load logs.';
      setError(msg);
      setChainCount(null);
    } finally {
      setLoading(false);
    }
  }, [cubeApi]);

  useEffect(() => {
    void load();
  }, [load]);

  const sourceLabel = cubeBaseUrl == null ? 'Mock cube' : cubeBaseUrl;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityLabel="Logs screen"
    >
      <Text style={styles.heading}>Logs</Text>
      <Text style={styles.source}>Source: {sourceLabel}</Text>
      <Text style={styles.help}>
        Behaviour log chains (intents, actions, internet calls) will appear here when the cube
        exposes them.
      </Text>

      {loading ? (
        <View style={styles.centered} accessibilityLabel="Logs loading">
          <ActivityIndicator size="large" accessibilityLabel="Loading logs" />
        </View>
      ) : null}

      {error != null ? (
        <View style={styles.errorBox} accessibilityLabel="Logs error">
          <Text style={styles.errorText}>{error}</Text>
          <Text
            style={styles.retry}
            onPress={() => {
              Alert.alert('Retry', 'Try loading logs again?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Retry', onPress: () => void load() },
              ]);
            }}
            accessibilityRole="button"
            accessibilityLabel="Retry loading logs"
          >
            Tap to retry
          </Text>
        </View>
      ) : null}

      {!loading && error == null && chainCount != null && chainCount === 0 ? (
        <Text style={styles.empty} accessibilityLabel="Logs empty state">
          No behaviour log chains yet.
        </Text>
      ) : null}

      {!loading && error == null && chainCount != null && chainCount > 0 ? (
        <Text style={styles.summary}>{chainCount} chain(s) — detailed view coming later.</Text>
      ) : null}
    </ScrollView>
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
  help: {
    fontSize: 13,
    opacity: 0.75,
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
  summary: { paddingHorizontal: 16, fontSize: 14 },
});
