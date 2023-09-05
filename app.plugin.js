const { withProjectBuildGradle } = require("expo/config-plugins");

/**
 *
 * @param {import("@expo/config-types").ExpoConfig} config
 */
const withYocoSDK = (config) => {
  return withProjectBuildGradle(config, (config) => {
    const pattern = /allprojects\s*{(?:\s|\S)*?repositories(?:\s|\S){\s/;
    const yocoDependenciesUrlString =
      "maven { url 'https://yocotechnologies.jfrog.io/artifactory/public/' }\n";

    config.modResults.contents = config.modResults.contents.replace(
      pattern,
      (match) => `${match}${" ".repeat(2 * 4)}${yocoDependenciesUrlString}\n`
    );

    return config;
  });
};

module.exports = withYocoSDK;
