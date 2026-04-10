import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ProfileSummary } from '../api/cubeApi.types';
import type { ProfilesStackParamList } from '../navigation/paramLists';

type Props = NativeStackScreenProps<ProfilesStackParamList, 'ProfileDetail'>;

function roleLabel(role: ProfileSummary['role']): string {
  if (role == null) {
    return '—';
  }
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function ProfileDetailScreen({ route }: Props): React.JSX.Element {
  const { profile } = route.params;

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
      <Text style={styles.note}>
        Device access, routines, and internet rules will appear here as profile APIs land (F9.T6).
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
  note: { fontSize: 14, opacity: 0.75, lineHeight: 20, marginTop: 8 },
});
