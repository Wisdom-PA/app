import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ConfirmDialog } from './ConfirmDialog';

export default {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
};

function OpenSingle(): React.JSX.Element {
  const [visible, setVisible] = useState(true);
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Pressable onPress={() => setVisible(true)} accessibilityLabel="Open dialog">
        <Text>Open</Text>
      </Pressable>
      <ConfirmDialog
        visible={visible}
        title="Saved"
        message="Using mock cube API."
        primaryLabel="OK"
        onPrimary={() => setVisible(false)}
        onDismiss={() => setVisible(false)}
      />
    </View>
  );
}

function OpenTwoButton(): React.JSX.Element {
  const [visible, setVisible] = useState(true);
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Pressable onPress={() => setVisible(true)} accessibilityLabel="Open two-button dialog">
        <Text>Open</Text>
      </Pressable>
      <ConfirmDialog
        visible={visible}
        title="Retry?"
        message="Try loading again."
        secondaryLabel="Cancel"
        onSecondary={() => setVisible(false)}
        primaryLabel="Retry"
        onPrimary={() => setVisible(false)}
        onDismiss={() => setVisible(false)}
      />
    </View>
  );
}

export const SingleButton = (): React.JSX.Element => <OpenSingle />;

export const TwoButtons = (): React.JSX.Element => <OpenTwoButton />;
