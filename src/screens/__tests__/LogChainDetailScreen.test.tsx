import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { render, screen } from '@testing-library/react-native';
import type { LogsStackParamList } from '../../navigation/paramLists';
import { LogChainDetailScreen } from '../LogChainDetailScreen';

const Stack = createNativeStackNavigator<LogsStackParamList>();

describe('LogChainDetailScreen', () => {
  it('pretty-prints valid JSON', () => {
    const chainJson = JSON.stringify({ chain_id: 'x', n: 1 });
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="LogChainDetail"
            component={LogChainDetailScreen}
            initialParams={{ chainJson, title: 'T' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
    expect(screen.getByLabelText('Log chain detail')).toBeTruthy();
    expect(screen.getByText(/"chain_id"/)).toBeTruthy();
    expect(screen.getByText(/"x"/)).toBeTruthy();
  });

  it('shows raw body when JSON.parse fails', () => {
    const chainJson = 'not-json{';
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="LogChainDetail"
            component={LogChainDetailScreen}
            initialParams={{ chainJson, title: 'T' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
    expect(screen.getByText('not-json{')).toBeTruthy();
  });
});
