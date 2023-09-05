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
import JSONTree from "react-native-json-tree";

import * as ReactNativeYoco from "react-native-yoco";
import { ChargeResult, PaymentResult } from "react-native-yoco";

const LOGO_DIMENSIONS = { width: 651, height: 286 };

/** INPUT SECRET HERE */
const SECRET = "s-4t2idmgln278hop005ltoks63eo";

export default function App() {
  const [secret, setSecret] = useState(SECRET);

  const [pairTerminalLoading, setPairTerminalLoading] = useState(false);

  const [amountInCentsText, setAmountInCentsText] = useState("");
  const [tipInCentsText, setTipInCentsText] = useState("");

  const [chargeResult, setChargeResult] = useState<ChargeResult>();
  const [chargeLoading, setChargeLoading] = useState(false);

  const [paymentResultTransactionIdText, setPaymentResultTransactionIdText] =
    useState("");
  const [paymentResult, setPaymentResult] = useState<PaymentResult>();
  const [paymentResultLoading, setPaymentResultLoading] = useState(false);

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

        <View style={{ rowGap: 10 }}>
          <Button
            title="Initialise SDK"
            onPress={() => {
              ReactNativeYoco.initialise();

              setPairTerminalLoading(false);
              setPaymentResultLoading(false);
              setPaymentResult(undefined);
              setChargeLoading(false);
              setChargeResult(undefined);
            }}
          />

          <Button
            title="Get device type"
            onPress={() => {
              const deviceType = ReactNativeYoco.getDeviceType();
              console.log(deviceType);
              alert(deviceType);
            }}
          />
        </View>

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
              const res = ReactNativeYoco.configure({ secret });
              console.log(res);
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
            rowGap: 10,
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

          <JSONTree data={chargeResult || {}} />

          <Button
            title={"Charge" + (chargeLoading ? " (loading...)" : "")}
            disabled={chargeLoading}
            onPress={async () => {
              try {
                setChargeLoading(true);

                const amountInCents = Number(amountInCentsText);

                if (!amountInCentsText || isNaN(amountInCents)) {
                  throw new Error("Invalid amount");
                }

                const tipInCents = Number(tipInCentsText);

                if (isNaN(tipInCents)) {
                  throw new Error("Invalid tip amount");
                }

                const res = await ReactNativeYoco.charge({
                  amountInCents,
                  currency: ReactNativeYoco.SupportedCurrency.ZAR,
                  paymentType: ReactNativeYoco.PaymentType.CARD,
                  tipInCents: tipInCentsText === "" ? undefined : tipInCents,
                });

                console.log(res);

                setChargeResult(res)
              } catch (e) {
                console.error(e);
              } finally {
                setChargeLoading(false);
              }
            }}
          />
        </View>

        <View
          style={{
            width: "100%",
            borderColor: "lightgray",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            alignItems: "center",
            marginVertical: 10,
            paddingVertical: 10,
            rowGap: 10
          }}
        >
          <TextInput
            placeholder="Input Transaction ID"
            style={{
              width: "90%",
              marginVertical: 10,
            }}
            value={paymentResultTransactionIdText}
            onChangeText={setPaymentResultTransactionIdText}
          />

          <JSONTree data={paymentResult || {}} />

          <Button
            title={
              "Get payment result" +
              (paymentResultLoading ? " (loading...)" : "")
            }
            disabled={paymentResultLoading}
            onPress={async () => {
              try {
                setPaymentResultLoading(true);

                const res = await ReactNativeYoco.getPaymentResult({
                  transactionId: paymentResultTransactionIdText,
                });

                console.log(res);

                setPaymentResult(res);
              } catch (e) {
                console.error(e);
              } finally {
                setPaymentResultLoading(false);
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
