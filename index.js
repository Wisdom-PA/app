// Must be first: React Navigation / native-stack require gesture handler before other RN imports.
import 'react-native-gesture-handler';
import registerRootComponent from 'expo/src/launch/registerRootComponent';
import App from './App';

registerRootComponent(App);
