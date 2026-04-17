import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { ProfileSummary } from '../api/cubeApi.types';
import { useCubeApiContext } from '../context/CubeApiContext';
import type { ProfilesStackParamList } from '../navigation/paramLists';

type Props = NativeStackScreenProps<ProfilesStackParamList, 'ProfileDetail'>;

function roleLabel(role: ProfileSummary['role']): string {
  if (role == null) {
    return '—';
  }
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function ProfileDetailScreen({ route, navigation }: Props): React.JSX.Element {
  const profileId = route.params.profile.id;
  const [profile, setProfile] = useState<ProfileSummary>(route.params.profile);
  const [nameDraft, setNameDraft] = useState(route.params.profile.display_name ?? '');
  const { cubeApi } = useCubeApiContext();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const refreshFromList = useCallback(async () => {
    try {
      const res = await cubeApi.getProfiles();
      const found = res.profiles.find((p) => p.id === profileId);
      if (found != null) {
        setProfile(found);
        setNameDraft(found.display_name ?? '');
      }
    } catch {
      // keep last known profile
    }
  }, [cubeApi, profileId]);

  useFocusEffect(
    useCallback(() => {
      void refreshFromList();
    }, [refreshFromList])
  );

  const saveDisplayName = async (): Promise<void> => {
    const next = nameDraft.trim();
    if (next === '') {
      setSaveError('Display name cannot be empty.');
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await cubeApi.patchProfile(profileId, { display_name: next });
      setProfile(updated);
      setNameDraft(updated.display_name ?? '');
      navigation.setParams({ profile: updated });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not save profile.';
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityLabel="Profile detail"
    >
      <Text style={styles.title}>{profile.display_name ?? profile.id}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>ID</Text>
        <Text style={styles.value} selectable>
          {profile.id}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{roleLabel(profile.role)}</Text>
      </View>
      <Text style={styles.label}>Display name</Text>
      <TextInput
        style={styles.input}
        value={nameDraft}
        onChangeText={setNameDraft}
        placeholder="Display name"
        accessibilityLabel="Profile display name"
        autoCapitalize="sentences"
      />
      <Pressable
        style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
        onPress={() => void saveDisplayName()}
        disabled={saving}
        accessibilityRole="button"
        accessibilityLabel="Save profile display name"
      >
        {saving ? (
          <ActivityIndicator color="#fff" accessibilityLabel="Saving profile" />
        ) : (
          <Text style={styles.saveBtnText}>Save display name</Text>
        )}
      </Pressable>
      {saveError != null ? (
        <Text style={styles.error} accessibilityLabel="Profile save error">
          {saveError}
        </Text>
      ) : null}
      <Text style={styles.note}>
        Voice selection, PIN, and permissions arrive with F7.T1–T3; the companion can sync the
        display name to the cube now (Phase 8 starter).
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  row: { marginBottom: 14 },
  label: { fontSize: 12, opacity: 0.65, marginBottom: 4 },
  value: { fontSize: 16 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  saveBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#047857',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveBtnPressed: { opacity: 0.85 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { fontSize: 14, color: '#a00', marginBottom: 8 },
  note: { fontSize: 14, opacity: 0.75, lineHeight: 20, marginTop: 8 },
});
