import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useCubeApiContext } from '../context/CubeApiContext';

export function SettingsScreen(): React.JSX.Element {
  const { cubeBaseUrl, setCubeBaseUrl } = useCubeApiContext();
  const [draft, setDraft] = useState('');

  useEffect(() => {
    setDraft(cubeBaseUrl ?? '');
  }, [cubeBaseUrl]);

  const onSave = (): void => {
    const t = draft.trim();
    if (t === '') {
      setCubeBaseUrl(null);
      Alert.alert('Saved', 'Using mock cube API.');
      return;
    }
    if (!/^https?:\/\//i.test(t)) {
      Alert.alert('Invalid URL', 'Enter a URL starting with http:// or https://, or clear the field to use the mock.');
      return;
    }
    setCubeBaseUrl(t);
    Alert.alert('Saved', `Cube base URL set to ${t.replace(/\/$/, '')}.`);
  };

  const onUseMock = (): void => {
    setDraft('');
    setCubeBaseUrl(null);
    Alert.alert('Saved', 'Using mock cube API.');
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityLabel="Settings"
    >
      <Text style={styles.heading}>Cube connection</Text>
      <Text style={styles.help}>
        For a dev cube on your LAN, enter its base URL (same host/port as the HTTP gateway). Leave
        blank to use the built-in mock API.
      </Text>

      <Text
        style={styles.label}
        accessibilityRole="header"
      >
        Base URL
      </Text>
      <TextInput
        style={styles.input}
        value={draft}
        onChangeText={setDraft}
        placeholder="http://192.168.1.10:8080"
        placeholderTextColor="#888"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        accessibilityLabel="Cube base URL"
        accessibilityHint="HTTP or HTTPS URL of the cube API, or leave empty for mock"
      />

      <View style={styles.row}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={onSave}
          accessibilityLabel="Save cube URL"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.buttonSecondary, pressed && styles.buttonPressed]}
          onPress={onUseMock}
          accessibilityLabel="Use mock cube"
          accessibilityRole="button"
        >
          <Text style={styles.buttonSecondaryText}>Use mock</Text>
        </Pressable>
      </View>

      <Text style={styles.status}>
        Current: {cubeBaseUrl == null ? 'Mock cube API' : cubeBaseUrl}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  help: {
    fontSize: 14,
    opacity: 0.75,
    paddingHorizontal: 16,
    marginBottom: 16,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  input: {
    marginHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 8,
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  buttonSecondaryText: { color: '#2563eb', fontWeight: '600', fontSize: 16 },
  status: {
    fontSize: 13,
    opacity: 0.8,
    paddingHorizontal: 16,
  },
});
