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
import { useCubeApiContext } from '../context/CubeApiContext';

type Row = { id: string; role: 'user' | 'assistant'; text: string; source?: string };

export function ChatScreen(): React.JSX.Element {
  const { cubeApi, cubeBaseUrl } = useCubeApiContext();
  const [input, setInput] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sourceLabel = cubeBaseUrl == null ? 'Mock cube' : cubeBaseUrl;

  const send = useCallback(async (): Promise<void> => {
    const t = input.trim();
    if (t === '' || sending) {
      return;
    }
    setSending(true);
    setError(null);
    setInput('');
    const userId = `u-${Date.now()}`;
    setRows((r) => [...r, { id: userId, role: 'user', text: t }]);
    try {
      const reply = await cubeApi.sendChat(t);
      setRows((r) => [
        ...r,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: reply.reply,
          source: reply.source,
        },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not send message.';
      setError(msg);
      setInput(t);
    } finally {
      setSending(false);
    }
  }, [cubeApi, input, sending]);

  return (
    <View style={styles.root} accessibilityLabel="Chat screen">
      <Text style={styles.source}>Source: {sourceLabel}</Text>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        accessibilityLabel="Chat message list"
      >
        {rows.length === 0 ? (
          <Text style={styles.hint}>Send a message to the on-device assistant (stub).</Text>
        ) : null}
        {rows.map((row) => (
          <View
            key={row.id}
            style={[styles.bubble, row.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant]}
            accessibilityLabel={row.role === 'user' ? 'User message' : 'Assistant message'}
          >
            <Text style={[styles.bubbleText, row.role === 'user' && styles.bubbleTextUser]}>{row.text}</Text>
            {row.role === 'assistant' && row.source != null ? (
              <Text style={styles.sourceTag}>{row.source}</Text>
            ) : null}
          </View>
        ))}
      </ScrollView>
      {error != null ? (
        <Text style={styles.error} accessibilityLabel="Chat error">
          {error}
        </Text>
      ) : null}
      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Message"
          placeholderTextColor="#888"
          editable={!sending}
          accessibilityLabel="Chat message input"
          onSubmitEditing={() => void send()}
          returnKeyType="send"
        />
        <Pressable
          style={({ pressed }) => [styles.sendBtn, pressed && styles.sendBtnPressed, sending && styles.sendBtnDisabled]}
          onPress={() => void send()}
          disabled={sending}
          accessibilityLabel="Send chat message"
          accessibilityRole="button"
        >
          {sending ? (
            <ActivityIndicator color="#fff" accessibilityLabel="Sending message" />
          ) : (
            <Text style={styles.sendBtnText}>Send</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  source: {
    fontSize: 13,
    opacity: 0.7,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
  hint: { fontSize: 14, opacity: 0.75, marginTop: 8 },
  bubble: {
    maxWidth: '92%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
  },
  bubbleAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  bubbleText: { fontSize: 16, color: '#111' },
  bubbleTextUser: { color: '#fff' },
  sourceTag: { fontSize: 11, opacity: 0.6, marginTop: 6 },
  error: {
    color: '#b91c1c',
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 14,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 44,
  },
  sendBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  sendBtnPressed: { opacity: 0.9 },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
