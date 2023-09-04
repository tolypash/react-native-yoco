import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Button,
  Image,
  TextInput,
  Text,
  View,
  ScrollView,
} from "react-native";

import * as ReactNativeYoco from "react-native-yoco";

const LOGO_DIMENSIONS = { width: 651, height: 286 };

export default function App() {
  const [secret, setSecret] = useState("");

  const [pairTerminalLoading, setPairTerminalLoading] = useState(false);

  const [amountInCentsText, setAmountInCentsText] = useState("");
  const [tipInCentsText, setTipInCentsText] = useState("");

  const [chargeLoading, setChargeLoading] = useState(false);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollContainer}
    >
      <SafeAreaView style={styles.container}>
        <Image
          source={require("./assets/yoco-logo.png")}
          style={{
            width: LOGO_DIMENSIONS.width / 4,
            height: LOGO_DIMENSIONS.height / 4,
            marginTop: 20,
          }}
        />

        <Text style={{ marginBottom: 20 }}>React Native</Text>

        <Button
          title="Initialise SDK"
          onPress={() => {
            ReactNativeYoco.initialise();
          }}
        />

        <View
          style={{
            width: "100%",
            borderColor: "lightgray",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            alignItems: "center",
            marginVertical: 10,
            paddingVertical: 10,
          }}
        >
          <TextInput
            placeholder="Input Secret"
            style={{
              width: "90%",
            }}
            value={secret}
            onChangeText={setSecret}
          />

          <Button
            title="Configure"
            onPress={() => {
              ReactNativeYoco.configure({ secret });
            }}
          />
        </View>

        <Button
          title={"Pair terminal" + (pairTerminalLoading ? " (loading...)" : "")}
          disabled={pairTerminalLoading}
          onPress={async () => {
            try {
              setPairTerminalLoading(true);
              const result = await ReactNativeYoco.pairTerminal();
              console.log(result);
            } catch (e) {
              console.error(e);
            } finally {
              setPairTerminalLoading(false);
            }
          }}
        />

        <View
          style={{
            width: "100%",
            borderColor: "lightgray",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            alignItems: "center",
            marginVertical: 10,
            paddingVertical: 10,
          }}
        >
          <TextInput
            placeholder="Input Amount (in Cents)"
            style={{
              width: "90%",
            }}
            value={amountInCentsText}
            onChangeText={setAmountInCentsText}
          />

          <TextInput
            placeholder="Input Tip Amount (in Cents) (optional)"
            style={{
              width: "90%",
              marginVertical: 10,
            }}
            value={tipInCentsText}
            onChangeText={setTipInCentsText}
          />

          <Button
            title={"Charge" + (chargeLoading ? " (loading...)" : "")}
            disabled={chargeLoading}
            onPress={async () => {
              try {
                setChargeLoading(true);

                const amountInCents = Number(amountInCentsText);

                if (isNaN(amountInCents)) {
                  throw new Error("Invalid amount");
                }

                const tipInCents = Number(tipInCentsText);

                if (isNaN(tipInCents)) {
                  throw new Error("Invalid tip amount");
                }

                await ReactNativeYoco.charge({
                  amountInCents,
                  currency: ReactNativeYoco.SupportedCurrency.ZAR,
                  paymentType: ReactNativeYoco.PaymentType.CARD,
                  tipInCents,
                });
              } catch (e) {
                console.error(e);
              } finally {
                setChargeLoading(false);
              }
            }}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
});
