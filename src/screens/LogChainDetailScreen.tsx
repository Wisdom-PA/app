import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import type { LogsStackParamList } from '../navigation/paramLists';

type Props = NativeStackScreenProps<LogsStackParamList, 'LogChainDetail'>;

export function LogChainDetailScreen({ route }: Props): React.JSX.Element {
  const { chainJson } = route.params;

  const body = useMemo(() => {
    try {
      const parsed: unknown = JSON.parse(chainJson);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return chainJson;
    }
  }, [chainJson]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityLabel="Log chain detail"
    >
      <Text style={styles.mono} selectable>
        {body}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  mono: { fontFamily: 'monospace', fontSize: 12, lineHeight: 18 },
});
