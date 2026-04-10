import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RoutinesStackParamList } from '../navigation/paramLists';

type Props = NativeStackScreenProps<RoutinesStackParamList, 'RoutineDetail'>;

export function RoutineDetailScreen({ route }: Props): React.JSX.Element {
  const { routine } = route.params;

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
      <Text style={styles.note}>
        Triggers, conditions, and actions will be editable here when the cube routine API supports
        them.
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
