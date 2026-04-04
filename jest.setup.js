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
