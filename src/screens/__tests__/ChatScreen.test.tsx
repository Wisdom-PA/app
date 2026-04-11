import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { CubeApi } from '../../api/cubeApi';
import { mockCubeApi } from '../../api/mockCubeApi';
import { ChatStack } from '../../navigation/stacks/ChatStack';
import { withStackNavigation } from '../../test/withStackNavigation';

describe('ChatScreen', () => {
  it('does not send when input is empty', async () => {
    render(withStackNavigation(ChatStack));
    await waitFor(() => {
      expect(screen.getByLabelText('Chat screen')).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText('Send chat message'));
    expect(screen.getByText(/Send a message to the on-device assistant/)).toBeTruthy();
  });

  it('sends on submit editing', async () => {
    render(withStackNavigation(ChatStack));
    await waitFor(() => {
      expect(screen.getByLabelText('Chat screen')).toBeTruthy();
    });
    const input = screen.getByLabelText('Chat message input');
    fireEvent.changeText(input, 'hi');
    fireEvent(input, 'submitEditing');
    await waitFor(() => {
      expect(screen.getByText(/Stub reply: hi/)).toBeTruthy();
    });
  });

  it('renders and sends a message with stub reply', async () => {
    render(withStackNavigation(ChatStack));
    await waitFor(() => {
      expect(screen.getByLabelText('Chat screen')).toBeTruthy();
    });
    fireEvent.changeText(screen.getByLabelText('Chat message input'), 'hello');
    fireEvent.press(screen.getByLabelText('Send chat message'));
    await waitFor(() => {
      expect(screen.getByText(/Stub reply: hello/)).toBeTruthy();
    });
    expect(screen.getByLabelText('Assistant message')).toBeTruthy();
    expect(screen.getByText('on_device')).toBeTruthy();
  });

  it('shows generic error when sendChat throws non-Error', async () => {
    const bad: CubeApi = {
      ...mockCubeApi,
      sendChat: async () => {
        throw 'nope';
      },
    };
    render(withStackNavigation(ChatStack, bad));
    await waitFor(() => {
      expect(screen.getByLabelText('Chat screen')).toBeTruthy();
    });
    fireEvent.changeText(screen.getByLabelText('Chat message input'), 'x');
    fireEvent.press(screen.getByLabelText('Send chat message'));
    await waitFor(() => {
      expect(screen.getByText('Could not send message.')).toBeTruthy();
    });
  });

  it('shows error when sendChat fails', async () => {
    const bad: CubeApi = {
      ...mockCubeApi,
      sendChat: async () => {
        throw new Error('chat failed');
      },
    };
    render(withStackNavigation(ChatStack, bad));
    await waitFor(() => {
      expect(screen.getByLabelText('Chat screen')).toBeTruthy();
    });
    fireEvent.changeText(screen.getByLabelText('Chat message input'), 'x');
    fireEvent.press(screen.getByLabelText('Send chat message'));
    await waitFor(() => {
      expect(screen.getByText('chat failed')).toBeTruthy();
    });
    expect(screen.getByLabelText('Chat error')).toBeTruthy();
  });
});
