![yoco-react-native-banner](https://github.com/tolypash/react-native-yoco/assets/22174779/1fac2b8c-7750-4a27-a64b-238634747092)

# React Native Yoco

The Yoco SDK allows app developers to integrate with Yoco card machines to accept in-person payments from within their application. The most common scenario is to accept Yoco payments from within your Point of Sale application.

This react native module is a wrapper around the native Yoco SDKs for iOS and Android, powered by **Expo Modules**.

# Limitations

- Android only (iOS coming soon)
- Printing and handling receipts is not supported yet
- Only works using physical devices (not simulators)

# Requirements

- Please see the [Yoco documentation](https://developer.yoco.com/) for the latest requirements.
- This is an Expo Module, therefore you need to install Expo in your project. Please see the [Expo documentation](https://docs.expo.dev/bare/installing-expo-modules/) for more information on this.

# Installation

- Install the package from npm:

```bash
npx expo install react-native-yoco
```

- YocoSDK requires several permissions for [iOS](https://developer.yoco.com/in-person/ios/getting-started) and [Android](https://developer.yoco.com/in-person/android/initialise-android).
  You can install [react-native-permissions](https://github.com/zoontek/react-native-permissions) and follow docs to setup needed permissions

- Run prebuild script:

```bash
npx expo prebuild
```

- If your app is to be installed on a Yoco device, additional steps are needed. If you are not installing it on a special Yoco device, please ignore this and the rest of the steps. Install expo-gradle-ext-vars:

```bash
npx expo install expo-gradle-ext-vars
```

- Configure the plugin. `expo-gradle-ext-vars` will automatically be added as a plain string from the installation command above. Replace that string with this array:

```json
[
  "expo-gradle-ext-vars",
  {
    "yocoDevice": true,
    "devMode": true
  }
]
```

`yocoDevice` must be set to `true` if you are installing on a [Yoco device](https://www.yoco.com/za/card-machines/)

`devMode` must be set to `true` if you will be running app with `npx expo run:android` (because that includes the dependency `expo-dev-launcher`, and there is a version issue with it).

So your plugins should look something like this (if you have other plugins, they will be there too):

```json
"plugins": [
      "react-native-yoco",
      [
        "expo-gradle-ext-vars",
        {
          "yocoDevice": true,
          "devMode": true
        }
      ],
]
```

## Android

- Assuming you're using latest version of `expo`, there are some issues with dependency versions, therefore you need to add the following in your `app/build.gradle` file, under `android`:

```gradle
  configurations.all {
        resolutionStrategy.dependencySubstitution {
            substitute module('org.bouncycastle:bcprov-jdk15to18:1.70') with module('com.yoco.ono.android:dspreadAndroid:1.23.6')
            substitute module('org.bouncycastle:bcutil-jdk15to18:1.70') with module('com.yoco.ono.android:dspreadAndroid:1.23.6')
        }

        if (rootProject.ext.has("devMode") ? !rootProject.ext.get("devMode") : false) {
            resolutionStrategy {
                force 'io.insert-koin:koin-core:2.0.1'
            }
        }
    }
```

## iOS

- You need to add the following in your Podfile, under ios:

```ruby
  post_install do |installer|
    # This overrides YocoSDK deployment target to make it compatible
    # with expo modules
    installer.pods_project.targets.each do |target|
      if target.name == 'YocoSDK'
        target.build_configurations.each do |config|
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
        end
      end
    end

    # This is needed for Apple Silicon
    # see https://gitlab.com/yoco-public/yoco-sdk-mobile-ios/-/issues/1
    installer.pods_project.build_configurations.each do |config|
      config.build_settings["EXCLUDED_ARCHS[sdk=iphonesimulator*]"] = "arm64"
    end
  end
```

# License

MIT license. For more information, see the LICENSE file.
