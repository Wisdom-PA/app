// Gesture handler touches native init(); mock for Jest (see App.tsx GestureHandlerRootView).
jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    GestureHandlerRootView: View,
    GestureDetector: View,
    Swipeable: View,
    DrawerLayout: View,
    ScrollView: View,
    FlatList: View,
    State: {},
    Directions: {},
  };
});

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-crypto', () => ({
  getRandomBytesAsync: jest.fn(async (byteCount) => {
    const out = new Uint8Array(byteCount);
    for (let i = 0; i < byteCount; i += 1) {
      out[i] = (i * 41 + 7) % 256;
    }
    return out;
  }),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve(undefined)),
  deleteItemAsync: jest.fn(() => Promise.resolve(undefined)),
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
}));
