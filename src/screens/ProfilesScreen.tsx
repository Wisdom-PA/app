import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ProfileSummary } from '../api/cubeApi.types';
import { ListItem } from '../components/ListItem';
import { RetryLoadDialog } from '../components/RetryLoadDialog';
import { useCubeApiContext } from '../context/CubeApiContext';
import type { ProfilesStackParamList } from '../navigation/paramLists';

function roleLabel(role: ProfileSummary['role']): string {
  if (role == null) {
    return '—';
  }
  return role.charAt(0).toUpperCase() + role.slice(1);
}

type ProfilesListNav = NativeStackNavigationProp<ProfilesStackParamList, 'ProfilesList'>;

export function ProfilesScreen(): React.JSX.Element {
  const navigation = useNavigation<ProfilesListNav>();
  const { cubeApi, cubeBaseUrl } = useCubeApiContext();
  const [profiles, setProfiles] = useState<ProfileSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryOpen, setRetryOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await cubeApi.getProfiles();
      setProfiles(res.profiles);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not load profiles.';
      setError(msg);
      setProfiles(null);
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
      accessibilityLabel="Profiles screen"
    >
      <Text style={styles.heading}>Profiles</Text>
      <Text style={styles.source}>Source: {sourceLabel}</Text>

      {loading ? (
        <View style={styles.centered} accessibilityLabel="Profiles loading">
          <ActivityIndicator size="large" accessibilityLabel="Loading profiles" />
        </View>
      ) : null}

      {error != null ? (
        <View style={styles.errorBox} accessibilityLabel="Profiles error">
          <Text style={styles.errorText}>{error}</Text>
          <Text
            style={styles.retry}
            onPress={() => setRetryOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Retry loading profiles"
          >
            Tap to retry
          </Text>
        </View>
      ) : null}

      {!loading && error == null && profiles != null && profiles.length === 0 ? (
        <Text style={styles.empty}>No profiles on the cube yet.</Text>
      ) : null}

      {!loading && error == null && profiles != null && profiles.length > 0 ? (
        <View accessibilityLabel="Profiles list">
          {profiles.map((p) => (
            <ListItem
              key={p.id}
              title={p.display_name ?? p.id}
              subtitle={`Role: ${roleLabel(p.role)}`}
              accessibilityLabel={`Profile ${p.display_name ?? p.id}`}
              accessibilityHint="Opens profile details"
              onPress={() => navigation.navigate('ProfileDetail', { profile: p })}
            />
          ))}
        </View>
      ) : null}
    </ScrollView>
    <RetryLoadDialog
      visible={retryOpen}
      message="Try loading profiles again?"
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
