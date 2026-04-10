import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useCubeApiContext } from '../context/CubeApiContext';
import type { SettingsStackParamList } from '../navigation/paramLists';

type Props = NativeStackScreenProps<SettingsStackParamList, 'CubeSettings'>;

export function CubeSettingsScreen(_props: Props): React.JSX.Element {
  const { cubeApi, cubeBaseUrl } = useCubeApiContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [privacy, setPrivacy] = useState<'paranoid' | 'normal'>('paranoid');
  const [globalOffline, setGlobalOffline] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ title: string; message: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const c = await cubeApi.getConfig();
      setDeviceName(c.device_name ?? '');
      setPrivacy(c.default_privacy_mode === 'normal' ? 'normal' : 'paranoid');
      setGlobalOffline(c.global_offline ?? false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not load config.';
      setLoadError(msg);
    } finally {
      setLoading(false);
    }
  }, [cubeApi]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const onSave = async (): Promise<void> => {
    setSaving(true);
    try {
      await cubeApi.patchConfig({
        device_name: deviceName.trim(),
        default_privacy_mode: privacy,
        global_offline: globalOffline,
      });
      setFeedback({ title: 'Saved', message: 'Cube configuration updated.' });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Save failed.';
      setFeedback({ title: 'Error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  const sourceLabel = cubeBaseUrl == null ? 'Mock cube' : cubeBaseUrl;

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        accessibilityLabel="Cube settings"
      >
        <Text style={styles.source}>Source: {sourceLabel}</Text>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator accessibilityLabel="Loading cube config" />
          </View>
        ) : null}
        {loadError != null ? (
          <Text style={styles.error} accessibilityLabel="Cube settings load error">
            {loadError}
          </Text>
        ) : null}
        {!loading && loadError == null ? (
          <>
            <Text style={styles.label}>Device name</Text>
            <TextInput
              style={styles.input}
              value={deviceName}
              onChangeText={setDeviceName}
              placeholder="Cube name"
              placeholderTextColor="#888"
              accessibilityLabel="Cube device name"
            />
            <Text style={styles.label}>Default privacy mode</Text>
            <View style={styles.row}>
              <Pressable
                style={({ pressed }) => [
                  styles.chip,
                  privacy === 'paranoid' && styles.chipSelected,
                  pressed && styles.chipPressed,
                ]}
                onPress={() => setPrivacy('paranoid')}
                accessibilityLabel="Default privacy paranoid"
                accessibilityRole="button"
              >
                <Text style={privacy === 'paranoid' ? styles.chipTextSelected : styles.chipText}>Paranoid</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.chip,
                  privacy === 'normal' && styles.chipSelected,
                  pressed && styles.chipPressed,
                ]}
                onPress={() => setPrivacy('normal')}
                accessibilityLabel="Default privacy normal"
                accessibilityRole="button"
              >
                <Text style={privacy === 'normal' ? styles.chipTextSelected : styles.chipText}>Normal</Text>
              </Pressable>
            </View>
            <View style={styles.switchRow}>
              <View style={styles.switchLabels}>
                <Text style={styles.labelInline}>Global offline</Text>
                <Text style={styles.help}>When on, outbound internet from the cube is blocked.</Text>
              </View>
              <Switch
                value={globalOffline}
                onValueChange={setGlobalOffline}
                accessibilityLabel="Global offline toggle"
              />
            </View>
            <Pressable
              style={({ pressed }) => [styles.saveBtn, saving && styles.saveBtnDisabled, pressed && styles.saveBtnPressed]}
              onPress={() => void onSave()}
              disabled={saving}
              accessibilityLabel="Save cube settings"
              accessibilityRole="button"
            >
              {saving ? (
                <ActivityIndicator color="#fff" accessibilityLabel="Saving cube settings" />
              ) : (
                <Text style={styles.saveBtnText}>Save</Text>
              )}
            </Pressable>
          </>
        ) : null}
      </ScrollView>
      <ConfirmDialog
        visible={feedback != null}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        primaryLabel="OK"
        onPrimary={() => setFeedback(null)}
        onDismiss={() => setFeedback(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 32, paddingHorizontal: 16 },
  source: { fontSize: 13, opacity: 0.7, marginTop: 12, marginBottom: 12 },
  centered: { paddingVertical: 24, alignItems: 'center' },
  error: { color: '#b91c1c', marginBottom: 12, fontSize: 14 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6, marginTop: 8 },
  labelInline: { fontSize: 16, fontWeight: '500' },
  help: { fontSize: 13, opacity: 0.7, marginTop: 4 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  chip: {
    borderWidth: 1,
    borderColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  chipSelected: { backgroundColor: '#2563eb' },
  chipPressed: { opacity: 0.85 },
  chipText: { color: '#2563eb', fontWeight: '600' },
  chipTextSelected: { color: '#fff', fontWeight: '600' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  switchLabels: { flex: 1 },
  saveBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnPressed: { opacity: 0.9 },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
