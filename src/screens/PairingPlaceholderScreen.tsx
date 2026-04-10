import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import type { SettingsStackParamList } from '../navigation/paramLists';

type Props = NativeStackScreenProps<SettingsStackParamList, 'PairingPlaceholder'>;

export function PairingPlaceholderScreen(_props: Props): React.JSX.Element {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityLabel="Pairing placeholder"
    >
      <Text style={styles.title}>Pairing</Text>
      <Text style={styles.body}>
        Bluetooth pairing and secure session setup with the cube will be implemented here. For now, set the cube base URL
        under Settings to reach a dev gateway on your LAN.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  body: { fontSize: 16, lineHeight: 24, opacity: 0.85 },
});
