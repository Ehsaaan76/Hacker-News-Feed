module.exports = {
  presets: [
    ['module:@react-native/babel-preset', { jsxImportSource: 'nativewind' }],
    'nativewind/babel',
  ],
  plugins: [
    'react-native-worklets/plugin', // Changed from reanimated for v4 compatibility
  ],
};