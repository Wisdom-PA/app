import { render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { SettingsStackParamList } from '../../navigation/paramLists';
import { PairingPlaceholderScreen } from '../PairingPlaceholderScreen';
import { WiFiPlaceholderScreen } from '../WiFiPlaceholderScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

describe('Connectivity placeholder screens', () => {
  it('renders pairing placeholder', () => {
    const Ui = (): React.JSX.Element => (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="PairingPlaceholder" component={PairingPlaceholderScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
    render(<Ui />);
    expect(screen.getByLabelText('Pairing placeholder')).toBeTruthy();
    expect(screen.getByText('Pairing')).toBeTruthy();
  });

  it('renders Wi-Fi placeholder', () => {
    const Ui = (): React.JSX.Element => (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="WiFiPlaceholder" component={WiFiPlaceholderScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
    render(<Ui />);
    expect(screen.getByLabelText('Wi-Fi setup placeholder')).toBeTruthy();
    expect(screen.getByText('Wi‑Fi setup')).toBeTruthy();
  });
});
