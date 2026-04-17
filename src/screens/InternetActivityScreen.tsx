import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { InternetActivityEvent } from '../api/cubeApi.types';
import { ListItem } from '../components/ListItem';
import { RetryLoadDialog } from '../components/RetryLoadDialog';
import { useCubeApiContext } from '../context/CubeApiContext';

export function InternetActivityScreen(): React.JSX.Element {
  const { cubeApi, cubeBaseUrl } = useCubeApiContext();
  const [events, setEvents] = useState<InternetActivityEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryOpen, setRetryOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await cubeApi.getInternetActivity({ limit: 50 });
      setEvents(res.events);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not load internet activity.';
      setError(msg);
      setEvents(null);
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
        accessibilityLabel="Internet activity screen"
      >
        <Text style={styles.help}>
          Recent outbound internet calls logged on the cube for transparency. The developer mock API
          uses sample events; a real cube returns rows written by the on-device call logger.
        </Text>
        <Text style={styles.source}>Source: {sourceLabel}</Text>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator accessibilityLabel="Loading internet activity" />
          </View>
        ) : null}
        {error != null ? (
          <View style={styles.errorBox} accessibilityLabel="Internet activity error">
            <Text style={styles.errorText}>{error}</Text>
            <Text
              style={styles.retry}
              onPress={() => setRetryOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Retry loading internet activity"
            >
              Tap to retry
            </Text>
          </View>
        ) : null}
        {!loading && error == null && events != null && events.length === 0 ? (
          <Text style={styles.empty}>No recent internet activity reported.</Text>
        ) : null}
        {!loading && error == null && events != null && events.length > 0 ? (
          <View accessibilityLabel="Internet activity list">
            {events.map((ev, i) => (
              <ListItem
                key={ev.id ?? `ev-${i}`}
                title={ev.summary ?? ev.service_category ?? 'Event'}
                subtitle={[ev.at, ev.profile_display_name].filter(Boolean).join(' · ') || undefined}
                accessibilityLabel={`Internet activity ${ev.summary ?? ev.id ?? i}`}
              />
            ))}
          </View>
        ) : null}
      </ScrollView>
      <RetryLoadDialog
        visible={retryOpen}
        message="Try loading internet activity again?"
        onClose={() => setRetryOpen(false)}
        onRetry={() => void load()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  help: {
    fontSize: 14,
    opacity: 0.75,
    paddingHorizontal: 16,
    paddingTop: 12,
    lineHeight: 20,
  },
  source: {
    fontSize: 13,
    opacity: 0.7,
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
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
