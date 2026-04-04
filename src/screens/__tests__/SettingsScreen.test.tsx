import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { CubeApiProvider } from '../../context/CubeApiContext';
import { SettingsScreen } from '../SettingsScreen';

describe('SettingsScreen', () => {
  it('renders cube connection section', () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    expect(screen.getByText(/Cube connection/)).toBeTruthy();
    expect(screen.getByLabelText('Cube base URL')).toBeTruthy();
    expect(screen.getByLabelText('Save cube URL')).toBeTruthy();
    expect(screen.getByLabelText('Use mock cube')).toBeTruthy();
  });

  it('saves a valid http URL and updates status', () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    fireEvent.changeText(screen.getByLabelText('Cube base URL'), 'http://192.168.0.5:8080');
    fireEvent.press(screen.getByLabelText('Save cube URL'));
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText(/Cube base URL set to http:\/\/192.168.0.5:8080/)).toBeTruthy();
    fireEvent.press(screen.getByLabelText('OK'));
    expect(screen.getByText(/Current: http:\/\/192.168.0.5:8080/)).toBeTruthy();
  });

  it('shows invalid URL dialog when scheme is missing', () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    fireEvent.changeText(screen.getByLabelText('Cube base URL'), '192.168.1.1');
    fireEvent.press(screen.getByLabelText('Save cube URL'));
    expect(screen.getByText('Invalid URL')).toBeTruthy();
    expect(screen.getByText(/http:\/\//)).toBeTruthy();
    fireEvent.press(screen.getByLabelText('OK'));
  });

  it('saves empty field as mock cube', () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    fireEvent.press(screen.getByLabelText('Save cube URL'));
    expect(screen.getByText('Saved')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('OK'));
    expect(screen.getByText(/Current: Mock cube API/)).toBeTruthy();
  });

  it('use mock clears URL and shows dialog', () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    fireEvent.changeText(screen.getByLabelText('Cube base URL'), 'http://example.com');
    fireEvent.press(screen.getByLabelText('Save cube URL'));
    fireEvent.press(screen.getByLabelText('OK'));
    fireEvent.press(screen.getByLabelText('Use mock cube'));
    expect(screen.getByText('Saved')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('OK'));
    expect(screen.getByText(/Current: Mock cube API/)).toBeTruthy();
  });
});
