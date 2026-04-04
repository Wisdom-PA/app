import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { CubeApiProvider } from '../../context/CubeApiContext';
import { SettingsScreen } from '../SettingsScreen';

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

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
    expect(Alert.alert).toHaveBeenCalledWith(
      'Saved',
      expect.stringContaining('192.168.0.5:8080')
    );
    expect(screen.getByText(/Current: http:\/\/192.168.0.5:8080/)).toBeTruthy();
  });

  it('shows invalid URL alert when scheme is missing', () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    fireEvent.changeText(screen.getByLabelText('Cube base URL'), '192.168.1.1');
    fireEvent.press(screen.getByLabelText('Save cube URL'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Invalid URL',
      expect.stringContaining('http://')
    );
  });

  it('saves empty field as mock cube', () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    fireEvent.press(screen.getByLabelText('Save cube URL'));
    expect(Alert.alert).toHaveBeenCalledWith('Saved', 'Using mock cube API.');
    expect(screen.getByText(/Current: Mock cube API/)).toBeTruthy();
  });

  it('use mock clears URL and shows alert', () => {
    render(
      <CubeApiProvider>
        <SettingsScreen />
      </CubeApiProvider>
    );
    fireEvent.changeText(screen.getByLabelText('Cube base URL'), 'http://example.com');
    fireEvent.press(screen.getByLabelText('Save cube URL'));
    fireEvent.press(screen.getByLabelText('Use mock cube'));
    expect(Alert.alert).toHaveBeenCalledWith('Saved', 'Using mock cube API.');
    expect(screen.getByText(/Current: Mock cube API/)).toBeTruthy();
  });
});
