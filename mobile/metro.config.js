const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// The project lives on a non-APFS volume, so macOS scatters AppleDouble
// sidecar files (`._foo.tsx`). Metro would otherwise try to parse them as modules.
config.resolver.blockList = [/.*\/\._.*/];

// Bundle the magazine PDF as a static asset so react-native-pdf can require() it.
config.resolver.assetExts.push('pdf');

module.exports = config;
