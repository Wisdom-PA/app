import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Toggle } from '../Toggle';

describe('Toggle', () => {
  it('renders label', () => {
    render(<Toggle label="Paranoid mode" value={false} onValueChange={() => {}} />);
    expect(screen.getByText('Paranoid mode')).toBeTruthy();
  });

  it('calls onValueChange when toggled', () => {
    const onValueChange = jest.fn();
    render(<Toggle label="Switch" value={false} onValueChange={onValueChange} />);
    const switchEl = screen.getByRole('switch', { name: 'Switch' });
    expect(switchEl).toBeTruthy();
    fireEvent(switchEl, 'valueChange', true);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});
