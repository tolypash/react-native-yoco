const { withProjectBuildGradle, withPlugins } = require("expo/config-plugins");

// const ONO_SDK_VERSION = "1.23.6"

// const YOCO_DEVICE_MODULES = [
//   "com.yoco.ono.common:kozen-android:" + ONO_SDK_VERSION,
//   "com.yoco.ono.android:kozenAndroid:" + ONO_SDK_VERSION,
//   "com.yoco.ono.common:dspread-android:" + ONO_SDK_VERSION,
//   "com.yoco.ono.common:miura-android:" + ONO_SDK_VERSION,
//   "com.yoco.ono.common:datecs-android:" + ONO_SDK_VERSION,
//   "com.yoco.ono.android:dspreadAndroid:" + ONO_SDK_VERSION,
//   "com.yoco.ono.android:miuraAndroid:" + ONO_SDK_VERSION,
//   "com.yoco.ono.android:datecsAndroid:" + ONO_SDK_VERSION,
// ]

/**
 *
 * @param {import("@expo/config-types").ExpoConfig} config
 * @param {"default" | "device"} buildType
 */
const androidPlugin = (config) => {
  return withProjectBuildGradle(config, (config) => {
    const allProjectsRepositoriesPattern =
      /allprojects\s*{(?:\s|\S)*?repositories(?:\s|\S){\s/;
    const yocoDependenciesUrlString =
      "maven { url 'https://yocotechnologies.jfrog.io/artifactory/public/' }\n";

    if (!config.modResults.contents.includes(yocoDependenciesUrlString)) {
      config.modResults.contents = config.modResults.contents.replace(
        allProjectsRepositoriesPattern,
        (match) => `${match}${" ".repeat(2 * 4)}${yocoDependenciesUrlString}\n`
      );
    }

    return config;
  });
};

const withYocoSDK = (config) => {
  return withPlugins(config, [androidPlugin]);
};

module.exports = withYocoSDK;
