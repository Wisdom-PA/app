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
import type { RoutineSummary } from '../api/cubeApi.types';
import { useCubeApiContext } from '../context/CubeApiContext';
import type { RoutinesStackParamList } from '../navigation/paramLists';

type Props = NativeStackScreenProps<RoutinesStackParamList, 'RoutineDetail'>;

export function RoutineDetailScreen({ route, navigation }: Props): React.JSX.Element {
  const routineId = route.params.routine.id;
  const [routine, setRoutine] = useState<RoutineSummary>(route.params.routine);
  const [nameDraft, setNameDraft] = useState(route.params.routine.name ?? '');
  const { cubeApi } = useCubeApiContext();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const refreshFromList = useCallback(async () => {
    try {
      const res = await cubeApi.getRoutines();
      const found = res.routines.find((r) => r.id === routineId);
      if (found != null) {
        setRoutine(found);
        setNameDraft(found.name ?? '');
      }
    } catch {
      // keep last known routine
    }
  }, [cubeApi, routineId]);

  useFocusEffect(
    useCallback(() => {
      void refreshFromList();
    }, [refreshFromList])
  );

  const saveName = async (): Promise<void> => {
    const next = nameDraft.trim();
    if (next === '') {
      setSaveError('Name cannot be empty.');
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await cubeApi.patchRoutine(routineId, { name: next });
      setRoutine(updated);
      setNameDraft(updated.name ?? '');
      navigation.setParams({ routine: updated });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not save routine.';
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityLabel="Routine detail"
    >
      <Text style={styles.title}>{routine.name ?? routine.id}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>ID</Text>
        <Text style={styles.value} selectable>
          {routine.id}
        </Text>
      </View>
      <Text style={styles.label}>Display name</Text>
      <TextInput
        style={styles.input}
        value={nameDraft}
        onChangeText={setNameDraft}
        placeholder="Routine name"
        accessibilityLabel="Routine display name"
        autoCapitalize="sentences"
      />
      <Pressable
        style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
        onPress={() => void saveName()}
        disabled={saving}
        accessibilityRole="button"
        accessibilityLabel="Save routine name"
      >
        {saving ? (
          <ActivityIndicator color="#fff" accessibilityLabel="Saving routine" />
        ) : (
          <Text style={styles.saveBtnText}>Save name</Text>
        )}
      </Pressable>
      {saveError != null ? (
        <Text style={styles.error} accessibilityLabel="Routine save error">
          {saveError}
        </Text>
      ) : null}
      <Text style={styles.note}>
        Triggers, conditions, and actions stay on the cube until a fuller routine editor ships; the
        companion app syncs the display name only (F6.T5).
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
