/** @TODO componentize each section and repetitions */

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
  Platform,
  TouchableOpacity,
} from "react-native";
import JSONTree from "react-native-json-tree";
import config from "./config.json";
import * as Clipboard from "expo-clipboard";
import * as Location from "expo-location";

import * as ReactNativeYoco from "react-native-yoco";

const LOGO_DIMENSIONS = { width: 651, height: 286 };

export default function App() {
  const [secret, setSecret] = useState(config?.secret || "");

  const [pairTerminalLoading, setPairTerminalLoading] = useState(false);

  const [amountInCentsText, setAmountInCentsText] = useState("");
  const [tipInCentsText, setTipInCentsText] = useState("");

  const [chargeResult, setChargeResult] =
    useState<ReactNativeYoco.PaymentResult>();
  const [chargeLoading, setChargeLoading] = useState(false);

  const [paymentResultTransactionIdText, setPaymentResultTransactionIdText] =
    useState("");
  const [paymentResult, setPaymentResult] =
    useState<ReactNativeYoco.PaymentResult>();
  const [paymentResultLoading, setPaymentResultLoading] = useState(false);

  const [queryTransactionsParams, setQueryTransactionsParams] =
    useState<ReactNativeYoco.QueryTransactionsParams>({ receiptNumber: "" });
  const [queryTransactionsResult, setQueryTransactionsResult] =
    useState<ReactNativeYoco.QueryTransactionsResult>();
  const [queryTransactionsLoading, setQueryTransactionsLoading] =
    useState(false);

  const [refundTransactionIdText, setRefundTransactionIdText] = useState("");
  const [refundAmountText, setRefundAmountText] = useState("");
  const [refundResult, setRefundResult] =
    useState<ReactNativeYoco.PaymentResult>();
  const [refundLoading, setRefundLoading] = useState(false);

  function copyData(data: object) {
    Clipboard.setStringAsync(JSON.stringify(data, null, 2));
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollContainer}
      contentContainerStyle={{ paddingBottom: 500 }}
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
              setQueryTransactionsLoading(false);
              setQueryTransactionsResult(undefined);
            }}
          />

          <Button
            title="Request permissions"
            onPress={async () => {
              if (Platform.OS === "android") {
                // await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
                // await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
                await Location.requestForegroundPermissionsAsync();
                await Location.requestBackgroundPermissionsAsync();

                console.log(await Location.getForegroundPermissionsAsync());
                console.log(await Location.getBackgroundPermissionsAsync());
              } else if (Platform.OS === "ios") {
                await Location.requestForegroundPermissionsAsync();
                await Location.requestBackgroundPermissionsAsync();
              }
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

          <View style={styles.resultContainer}>
            <View style={styles.flex}>
              <JSONTree data={chargeResult || {}} />
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyData(chargeResult!)}
              disabled={!chargeResult}
            >
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
          </View>

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

                setChargeResult(res);
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
            rowGap: 10,
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

          <View style={styles.resultContainer}>
            <View style={styles.flex}>
              <JSONTree data={paymentResult || {}} />
            </View>

            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyData(paymentResult!)}
              disabled={!paymentResult}
            >
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
          </View>

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
            placeholder="Input Receipt Number"
            style={{
              width: "90%",
              marginVertical: 10,
            }}
            value={queryTransactionsParams.receiptNumber}
            onChangeText={(text) => {
              setQueryTransactionsParams({
                ...queryTransactionsParams,
                receiptNumber: text,
              });
            }}
          />

          <View style={styles.resultContainer}>
            <View style={styles.flex}>
              <JSONTree data={queryTransactionsResult || {}} />
            </View>

            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyData(queryTransactionsResult!)}
              disabled={!queryTransactionsResult}
            >
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
          </View>

          <Button
            title={
              "Query transactions" +
              (queryTransactionsLoading ? " (loading...)" : "")
            }
            disabled={queryTransactionsLoading}
            onPress={async () => {
              try {
                setQueryTransactionsLoading(true);

                const res = await ReactNativeYoco.queryTransactions(
                  queryTransactionsParams
                );

                console.log(res);

                setQueryTransactionsResult(res);
              } catch (e) {
                console.error(e);
              } finally {
                setQueryTransactionsLoading(false);
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
            rowGap: 10,
          }}
        >
          <TextInput
            placeholder="Input Transaction ID"
            style={{
              width: "90%",
              marginVertical: 10,
            }}
            value={refundTransactionIdText}
            onChangeText={setRefundTransactionIdText}
          />

          <TextInput
            placeholder="Input Refund amount in cents"
            style={{
              width: "90%",
              marginVertical: 10,
            }}
            value={refundAmountText}
            onChangeText={setRefundAmountText}
          />

          <View style={styles.resultContainer}>
            <View style={styles.flex}>
              <JSONTree data={refundResult || {}} />
            </View>

            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyData(refundResult!)}
              disabled={!refundResult}
            >
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
          </View>

          <Button
            title={"Refund" + (refundLoading ? " (loading...)" : "")}
            onPress={async () => {
              try {
                setRefundLoading(true);

                const refundAmount = Number(refundAmountText);

                if (isNaN(refundAmount)) {
                  throw new Error("Invalid refund amount");
                }

                const res = await ReactNativeYoco.refund({
                  transactionId: refundTransactionIdText,
                  amountInCents: refundAmount,
                });

                console.log(res);

                setRefundResult(res);
              } catch (e) {
                console.error(e);
              } finally {
                setRefundLoading(false);
              }
            }}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContainer: {
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  resultContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  copyButton: {
    position: "absolute",
    right: 0,
    width: 64,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "limegreen",
    overflow: "hidden",
  },
  copyText: {
    color: "white",
  },
});
