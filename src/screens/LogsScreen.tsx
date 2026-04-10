import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ListItem } from '../components/ListItem';
import { RetryLoadDialog } from '../components/RetryLoadDialog';
import { useCubeApiContext } from '../context/CubeApiContext';
import type { LogsStackParamList } from '../navigation/paramLists';
import { logChainListTitle } from './logChainTitle';

type LogsListNav = NativeStackNavigationProp<LogsStackParamList, 'LogsList'>;

export function LogsScreen(): React.JSX.Element {
  const navigation = useNavigation<LogsListNav>();
  const { cubeApi, cubeBaseUrl } = useCubeApiContext();
  const [chains, setChains] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryOpen, setRetryOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await cubeApi.getLogs();
      setChains(Array.isArray(res.chains) ? res.chains : []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not load logs.';
      setError(msg);
      setChains(null);
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
      accessibilityLabel="Logs screen"
    >
      <Text style={styles.heading}>Logs</Text>
      <Text style={styles.source}>Source: {sourceLabel}</Text>
      <Text style={styles.help}>
        Open a chain to inspect raw JSON. Richer chain views arrive with the cube log query API
        (F8.T1.S4).
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
            onPress={() => setRetryOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Retry loading logs"
          >
            Tap to retry
          </Text>
        </View>
      ) : null}

      {!loading && error == null && chains != null && chains.length === 0 ? (
        <Text style={styles.empty} accessibilityLabel="Logs empty state">
          No behaviour log chains yet.
        </Text>
      ) : null}

      {!loading && error == null && chains != null && chains.length > 0 ? (
        <View accessibilityLabel="Logs chain list">
          {chains.map((c, i) => {
            const title = logChainListTitle(c, i);
            return (
              <ListItem
                key={`chain-${i}`}
                title={title}
                accessibilityLabel={`Log ${title}`}
                accessibilityHint="Opens chain detail"
                onPress={() =>
                  navigation.navigate('LogChainDetail', {
                    chainJson: JSON.stringify(c),
                    title,
                  })
                }
              />
            );
          })}
        </View>
      ) : null}
    </ScrollView>
    <RetryLoadDialog
      visible={retryOpen}
      message="Try loading logs again?"
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
});
