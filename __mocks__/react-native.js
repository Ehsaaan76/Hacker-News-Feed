const React = require('react');

function createHostComponent() {
  return ({ children }) => children ?? null;
}

module.exports = {
  View: createHostComponent(),
  Text: createHostComponent(),
  ScrollView: createHostComponent(),
  TouchableOpacity: createHostComponent(),
  Modal: createHostComponent(),
  SafeAreaView: createHostComponent(),
  ActivityIndicator: createHostComponent(),
  StatusBar: createHostComponent(),
  StyleSheet: {
    create: (styles) => styles,
  },
  Linking: {
    openURL: () => Promise.resolve(),
  },
  Platform: { OS: 'test' },
  AppRegistry: {
    registerComponent: () => null,
  },
  Fragment: React.Fragment,
};