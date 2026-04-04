import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { RetryLoadDialog } from './RetryLoadDialog';

export default {
  title: 'Components/RetryLoadDialog',
  component: RetryLoadDialog,
};

function OpenRetry(): React.JSX.Element {
  const [visible, setVisible] = useState(true);
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Pressable onPress={() => setVisible(true)} accessibilityLabel="Open retry dialog">
        <Text>Open</Text>
      </Pressable>
      <RetryLoadDialog
        visible={visible}
        message="Try loading status again?"
        onClose={() => setVisible(false)}
        onRetry={() => setVisible(false)}
      />
    </View>
  );
}

export const Default = (): React.JSX.Element => <OpenRetry />;
