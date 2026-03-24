import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { PlaceholderScreen } from '../PlaceholderScreen';

describe('PlaceholderScreen', () => {
  it('renders message', () => {
    render(
      <PlaceholderScreen
        message="Test message"
        accessibilityLabel="Test label"
      />
    );
    expect(screen.getByText('Test message')).toBeTruthy();
  });

  it('uses accessibility label', () => {
    render(
      <PlaceholderScreen
        message="Content"
        accessibilityLabel="Screen placeholder"
      />
    );
    expect(screen.getByLabelText('Screen placeholder')).toBeTruthy();
  });
});
