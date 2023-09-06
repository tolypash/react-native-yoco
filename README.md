
![yoco-react-native-banner](https://github.com/tolypash/react-native-yoco/assets/22174779/1fac2b8c-7750-4a27-a64b-238634747092)

# React Native Yoco
The Yoco SDK allows app developers to integrate with Yoco card machines to accept in-person payments from within their application. The most common scenario is to accept Yoco payments from within your Point of Sale application.

This react native module is a wrapper around the native Yoco SDKs for iOS and Android, powered by **Expo Modules**.

# Limitations

- Android only (iOS coming soon)

# Requirements

- Please see the [Yoco documentation](https://developer.yoco.com/) for the latest requirements.
- This is an Expo Module, therefore you need to install Expo in your project. Please see the [Expo documentation](https://docs.expo.dev/bare/installing-expo-modules/) for more information on this.

# Installation

- Install the package from npm:

```bash
npx expo install react-native-yoco
```

- Run prebuild script:

```bash
npx expo prebuild
```

- If device to be installed is Yoco device, additional dependencies are needed. If you are not installing it on a special Yoco device, please ignore this and the rest of the steps. Install expo-gradle-ext-vars:

```bash
npx expo install expo-gradle-ext-vars
```

- Add the plugin to your app.json with `yocoDevice` set to `true`.
NOTE: the plugin will automatically be added as a plain string. Remove it and replace it with this:

```json
"plugins": [
      [
        "expo-gradle-ext-vars",
        {
          "yocoDevice": true
        }
      ],
]
```

# License

MIT license. For more information, see the LICENSE file.
