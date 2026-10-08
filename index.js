import { install } from 'react-native-quick-crypto';
install();
const { registerRootComponent } = require('expo');
const App = require('./App').default;
registerRootComponent(App);
