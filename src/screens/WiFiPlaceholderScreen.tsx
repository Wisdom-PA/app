import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import type { SettingsStackParamList } from '../navigation/paramLists';

type Props = NativeStackScreenProps<SettingsStackParamList, 'WiFiPlaceholder'>;

export function WiFiPlaceholderScreen(_props: Props): React.JSX.Element {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityLabel="Wi-Fi setup placeholder"
    >
      <Text style={styles.title}>Wi‑Fi setup</Text>
      <Text style={styles.body}>
        Captive portal and Wi‑Fi provisioning flows for the cube will live here. Use your OS network settings or the cube
        manufacturer flow until this screen is wired up.
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
