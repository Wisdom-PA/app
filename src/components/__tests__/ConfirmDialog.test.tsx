import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ConfirmDialog } from '../ConfirmDialog';

describe('ConfirmDialog', () => {
  it('shows title, message, and primary action', () => {
    const onPrimary = jest.fn();
    render(
      <ConfirmDialog
        visible
        title="Title"
        message="Body text"
        primaryLabel="OK"
        onPrimary={onPrimary}
        onDismiss={() => {}}
      />
    );
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Body text')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('OK'));
    expect(onPrimary).toHaveBeenCalledTimes(1);
  });

  it('invokes secondary then primary independently', () => {
    const onPrimary = jest.fn();
    const onSecondary = jest.fn();
    render(
      <ConfirmDialog
        visible
        title="T"
        message="M"
        primaryLabel="Retry"
        onPrimary={onPrimary}
        secondaryLabel="Cancel"
        onSecondary={onSecondary}
        onDismiss={() => {}}
      />
    );
    fireEvent.press(screen.getByLabelText('Cancel'));
    expect(onSecondary).toHaveBeenCalledTimes(1);
    expect(onPrimary).not.toHaveBeenCalled();
    fireEvent.press(screen.getByLabelText('Retry'));
    expect(onPrimary).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when backdrop is pressed', () => {
    const onDismiss = jest.fn();
    render(
      <ConfirmDialog
        visible
        title="T"
        message="M"
        primaryLabel="OK"
        onPrimary={() => {}}
        onDismiss={onDismiss}
      />
    );
    fireEvent.press(screen.getByLabelText('Dismiss dialog'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
