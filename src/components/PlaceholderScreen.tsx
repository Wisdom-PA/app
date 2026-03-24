import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface PlaceholderScreenProps {
  message: string;
  accessibilityLabel: string;
}

export function PlaceholderScreen({ message, accessibilityLabel }: PlaceholderScreenProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.text} accessibilityLabel={accessibilityLabel}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
