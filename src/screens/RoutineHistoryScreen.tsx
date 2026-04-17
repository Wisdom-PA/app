import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RoutineRunEntry } from '../api/cubeApi.types';
import { RetryLoadDialog } from '../components/RetryLoadDialog';
import { useCubeApiContext } from '../context/CubeApiContext';

export function RoutineHistoryScreen(): React.JSX.Element {
  const { cubeApi, cubeBaseUrl } = useCubeApiContext();
  const [runs, setRuns] = useState<RoutineRunEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryOpen, setRetryOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await cubeApi.getRoutineRunHistory({ limit: 50 });
      setRuns(Array.isArray(res.runs) ? res.runs : []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not load routine history.';
      setError(msg);
      setRuns(null);
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
        accessibilityLabel="Routine history screen"
      >
        <Text style={styles.heading}>Routine runs</Text>
        <Text style={styles.source}>Source: {sourceLabel}</Text>

        {loading ? (
          <View style={styles.centered} accessibilityLabel="Routine history loading">
            <ActivityIndicator size="large" accessibilityLabel="Loading routine history" />
          </View>
        ) : null}

        {error != null ? (
          <View style={styles.errorBox} accessibilityLabel="Routine history error">
            <Text style={styles.errorText}>{error}</Text>
            <Text
              style={styles.retry}
              onPress={() => setRetryOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Retry loading routine history"
            >
              Tap to retry
            </Text>
          </View>
        ) : null}

        {!loading && error == null && runs != null && runs.length === 0 ? (
          <Text style={styles.empty} accessibilityLabel="Routine history empty state">
            No routine runs recorded yet.
          </Text>
        ) : null}

        {!loading && error == null && runs != null && runs.length > 0 ? (
          <View accessibilityLabel="Routine run list">
            {runs.map((r) => (
              <View key={r.run_id} style={styles.card} accessibilityLabel={`Run ${r.routine_name}`}>
                <Text style={styles.cardTitle}>{r.routine_name || r.routine_id}</Text>
                <Text style={styles.cardMeta}>
                  {r.at}
                  {' · '}
                  {r.ok ? 'All steps ok' : 'One or more steps failed'}
                </Text>
                {r.steps.map((s) => (
                  <Text
                    key={`${r.run_id}-${s.index}`}
                    style={styles.step}
                    accessibilityLabel={`Step ${String(s.index)} ${s.kind}`}
                  >
                    {s.index}: {s.kind} — {s.summary}
                    {s.ok ? '' : ' (failed)'}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
      <RetryLoadDialog
        visible={retryOpen}
        message="Try loading routine history again?"
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
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardMeta: { fontSize: 13, opacity: 0.75, marginBottom: 8 },
  step: { fontSize: 13, marginTop: 4, opacity: 0.9 },
});
