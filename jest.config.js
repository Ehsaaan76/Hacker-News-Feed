module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^react-native$': '<rootDir>/__mocks__/react-native.js',
    '^nativewind/jsx-runtime$': '<rootDir>/__mocks__/nativewind-jsx-runtime.js',
    '^nativewind/jsx-dev-runtime$': '<rootDir>/__mocks__/nativewind-jsx-runtime.js',
    '^nativewind$': '<rootDir>/__mocks__/nativewind.js',
    '^react-native-css-interop(?:/.*)?$': '<rootDir>/__mocks__/react-native-css-interop.js',
    '^react-native-safe-area-context$': '<rootDir>/__mocks__/react-native-safe-area-context.js',
    '^@shopify/flash-list$': '<rootDir>/__mocks__/@shopify/flash-list.js',
    '^react-native-mmkv$': '<rootDir>/__mocks__/react-native-mmkv.js',
    '^react-native-toast-message$': '<rootDir>/__mocks__/react-native-toast-message.js',
    '^lucide-react-native$': '<rootDir>/__mocks__/lucide-react-native.js',
  },
};
