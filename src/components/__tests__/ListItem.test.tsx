import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ListItem } from '../ListItem';

describe('ListItem', () => {
  it('renders title', () => {
    render(<ListItem title="Test item" />);
    expect(screen.getByText('Test item')).toBeTruthy();
  });

  it('renders subtitle when provided', () => {
    render(<ListItem title="Title" subtitle="Subtitle" />);
    expect(screen.getByText('Subtitle')).toBeTruthy();
  });

  it('omits subtitle when empty', () => {
    render(<ListItem title="Title" subtitle="" />);
    expect(screen.queryByText('Subtitle')).toBeNull();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<ListItem title="Tap me" onPress={onPress} />);
    const button = screen.getByRole('button', { name: 'Tap me' });
    expect(button).toBeTruthy();
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
