const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

const finalConfig = mergeConfig(getDefaultConfig(__dirname), config);

// This tells Metro to process Tailwind styles using your global.css file
module.exports = withNativeWind(finalConfig, { input: './global.css' });