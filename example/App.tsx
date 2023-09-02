import { StyleSheet, Text, View } from 'react-native';

import * as ReactNativeYoco from 'react-native-yoco';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ReactNativeYoco.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
