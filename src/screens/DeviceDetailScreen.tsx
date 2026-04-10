import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { DevicesStackParamList } from '../navigation/paramLists';

type Props = NativeStackScreenProps<DevicesStackParamList, 'DeviceDetail'>;

export function DeviceDetailScreen({ route }: Props): React.JSX.Element {
  const { device } = route.params;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityLabel="Device detail"
    >
      <Text style={styles.title}>{device.name ?? device.id}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>ID</Text>
        <Text style={styles.value} selectable>
          {device.id}
        </Text>
      </View>
      {device.type != null && device.type !== '' ? (
        <View style={styles.row}>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.value}>{device.type}</Text>
        </View>
      ) : null}
      {device.room != null && device.room !== '' ? (
        <View style={styles.row}>
          <Text style={styles.label}>Room</Text>
          <Text style={styles.value}>{device.room}</Text>
        </View>
      ) : null}
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
});
