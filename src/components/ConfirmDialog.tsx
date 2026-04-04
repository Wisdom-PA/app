import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  /** Primary action (e.g. OK, Retry). */
  primaryLabel: string;
  onPrimary: () => void;
  /** Optional second action (e.g. Cancel). */
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** Backdrop press and Android back. */
  onDismiss: () => void;
}

/**
 * Modal dialog for short confirmations or notices. Prefer over ad-hoc {@link Alert} where
 * consistent styling and accessibility are needed (F9.T1.S3).
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  onDismiss,
}: ConfirmDialogProps): React.JSX.Element {
  const { width } = useWindowDimensions();
  const maxWidth = Math.min(width - 48, 400);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      accessibilityViewIsModal
      accessibilityLabel={title ? `Dialog: ${title}` : 'Dialog'}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onDismiss}
        accessibilityLabel="Dismiss dialog"
        accessibilityRole="button"
      >
        <Pressable
          style={[styles.sheet, { maxWidth }]}
          onPress={(e) => e?.stopPropagation?.()}
          accessibilityRole="none"
        >
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            {secondaryLabel != null && onSecondary != null ? (
              <Pressable
                style={({ pressed }) => [styles.btnSecondary, styles.btnSecondarySpacing, pressed && styles.pressed]}
                onPress={() => {
                  onSecondary();
                }}
                accessibilityLabel={secondaryLabel}
                accessibilityRole="button"
              >
                <Text style={styles.btnSecondaryText}>{secondaryLabel}</Text>
              </Pressable>
            ) : null}
            <Pressable
              style={({ pressed }) => [styles.btnPrimary, pressed && styles.pressed]}
              onPress={() => {
                onPrimary();
              }}
              accessibilityLabel={primaryLabel}
              accessibilityRole="button"
            >
              <Text style={styles.btnPrimaryText}>{primaryLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sheet: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    opacity: 0.9,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    minWidth: 88,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  btnSecondarySpacing: {
    marginRight: 12,
  },
  btnSecondary: {
    borderWidth: 1,
    borderColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    minWidth: 88,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 16,
  },
  pressed: { opacity: 0.85 },
});
