import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { RetryLoadDialog } from '../RetryLoadDialog';

describe('RetryLoadDialog', () => {
  it('retries after primary and closes', () => {
    const onClose = jest.fn();
    const onRetry = jest.fn();
    render(
      <RetryLoadDialog
        visible
        message="Try again?"
        onClose={onClose}
        onRetry={onRetry}
      />
    );
    fireEvent.press(screen.getByLabelText('Retry'));
    expect(onClose).toHaveBeenCalled();
    expect(onRetry).toHaveBeenCalled();
  });

  it('closes on cancel', () => {
    const onClose = jest.fn();
    const onRetry = jest.fn();
    render(
      <RetryLoadDialog
        visible
        message="M"
        onClose={onClose}
        onRetry={onRetry}
      />
    );
    fireEvent.press(screen.getByLabelText('Cancel'));
    expect(onClose).toHaveBeenCalled();
    expect(onRetry).not.toHaveBeenCalled();
  });
});
