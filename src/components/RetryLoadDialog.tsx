import React from 'react';
import { ConfirmDialog } from './ConfirmDialog';

export interface RetryLoadDialogProps {
  visible: boolean;
  /** Shown under the "Retry" title (e.g. "Try loading status again?"). */
  message: string;
  onClose: () => void;
  onRetry: () => void;
}

/**
 * Two-button retry prompt over {@link ConfirmDialog}. Replaces {@link Alert} for load failures (F9.T1.S3).
 */
export function RetryLoadDialog({
  visible,
  message,
  onClose,
  onRetry,
}: RetryLoadDialogProps): React.JSX.Element {
  return (
    <ConfirmDialog
      visible={visible}
      title="Retry"
      message={message}
      secondaryLabel="Cancel"
      onSecondary={onClose}
      primaryLabel="Retry"
      onPrimary={() => {
        onClose();
        onRetry();
      }}
      onDismiss={onClose}
    />
  );
}
