import React from 'react';
import { PlaceholderScreen } from '../components/PlaceholderScreen';

export function DashboardScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      message="Dashboard – connect to a cube to see devices and status."
      accessibilityLabel="Dashboard placeholder"
    />
  );
}
