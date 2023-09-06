import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to ReactNativeYoco.web.ts
// and on native platforms to ReactNativeYoco.ts
import ReactNativeYocoModule from "./ReactNativeYocoModule";
import {
  ChangeEventPayload,
  ChargeParams,
  ConfigureParams,
  PaymentResult as PaymentResult,
  GetPaymentResultParams,
  QueryTransactionsParams,
  QueryTransactionsResult,
  RefundParams,
  RefundResult,
} from "./ReactNativeYoco.types";
import {
  PaymentType,
  ResultCodes,
  SupportedCurrency,
} from "./ReactNativeYocoEnums";

/**
 * Initialises Yoco SDK
 * @returns {void}
 * @throws {Error}
 */
export function initialise() {
  return ReactNativeYocoModule.initialise();
}

/**
 * Configures Yoco SDK
 * @param params Configuration parameters
 * @returns {void}
 * @throws {Error}
 */
export function configure(params: ConfigureParams) {
  return ReactNativeYocoModule.configure(params.secret);
}

/**
 * Get device type
 * @returns {string}
 */
export function getDeviceType() {
  return ReactNativeYocoModule.getDeviceType();
}

/**
 * Pairs Yoco terminal
 * @returns {ResultCodes}
 * @throws {Error} with ResultCodes as message
 */
export async function pairTerminal() {
  return await ReactNativeYocoModule.pairTerminal();
}

/**
 * Making a payment
 * @param params
 * @returns {Promise<ChargeResult>}
 */
export async function charge(params: ChargeParams): Promise<PaymentResult> {
  return await ReactNativeYocoModule.charge(
    params.amountInCents,
    params.paymentType,
    params.currency,
    params.tipInCents,
    params.paymentParameters
  );
}

export async function getPaymentResult(
  params: GetPaymentResultParams
): Promise<PaymentResult> {
  return await ReactNativeYocoModule.getPaymentResult(
    params.transactionId,
    params.showResult || false
  );
}

/** @TODO Implement */
export async function refund(
  _params: RefundParams
): Promise<RefundResult | undefined> {
  throw new Error("Not implemented");
}

export async function queryTransactions(
  params: QueryTransactionsParams
): Promise<QueryTransactionsResult> {
  return await ReactNativeYocoModule.queryTransactions(params.receiptNumber);
}

const emitter = new EventEmitter(
  ReactNativeYocoModule ?? NativeModulesProxy.ReactNativeYoco
);

export function addChangeListener(
  listener: (event: ChangeEventPayload) => void
): Subscription {
  return emitter.addListener<ChangeEventPayload>("onChange", listener);
}

export {
  ChangeEventPayload,
  ConfigureParams,
  PaymentType,
  SupportedCurrency,
  ChargeParams,
  PaymentResult,
  ResultCodes,
  QueryTransactionsParams,
  QueryTransactionsResult,
  RefundParams,
  RefundResult,
};
