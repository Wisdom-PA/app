import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RoutineSummary } from '../api/cubeApi.types';
import { ListItem } from '../components/ListItem';
import { RetryLoadDialog } from '../components/RetryLoadDialog';
import { useCubeApiContext } from '../context/CubeApiContext';

export function RoutinesScreen(): React.JSX.Element {
  const { cubeApi, cubeBaseUrl } = useCubeApiContext();
  const [routines, setRoutines] = useState<RoutineSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryOpen, setRetryOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await cubeApi.getRoutines();
      setRoutines(res.routines);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not load routines.';
      setError(msg);
      setRoutines(null);
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
      accessibilityLabel="Routines screen"
    >
      <Text style={styles.heading}>Routines</Text>
      <Text style={styles.source}>Source: {sourceLabel}</Text>

      {loading ? (
        <View style={styles.centered} accessibilityLabel="Routines loading">
          <ActivityIndicator size="large" accessibilityLabel="Loading routines" />
        </View>
      ) : null}

      {error != null ? (
        <View style={styles.errorBox} accessibilityLabel="Routines error">
          <Text style={styles.errorText}>{error}</Text>
          <Text
            style={styles.retry}
            onPress={() => setRetryOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Retry loading routines"
          >
            Tap to retry
          </Text>
        </View>
      ) : null}

      {!loading && error == null && routines != null && routines.length === 0 ? (
        <Text style={styles.empty}>No routines on the cube yet.</Text>
      ) : null}

      {!loading && error == null && routines != null && routines.length > 0 ? (
        <View accessibilityLabel="Routines list">
          {routines.map((r) => (
            <ListItem
              key={r.id}
              title={r.name ?? r.id}
              accessibilityLabel={`Routine ${r.name ?? r.id}`}
            />
          ))}
        </View>
      ) : null}
    </ScrollView>
    <RetryLoadDialog
      visible={retryOpen}
      message="Try loading routines again?"
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
