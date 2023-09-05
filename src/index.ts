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
  ChargeResult,
  ConfigureParams,
  PaymentResult as PaymentResult,
  GetPaymentResultParams,
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
export async function charge(params: ChargeParams): Promise<ChargeResult> {
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
  return await ReactNativeYocoModule.getPaymentResult(params.transactionId, params.showResult || false);
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
  ChargeParams,
  ConfigureParams,
  PaymentType,
  SupportedCurrency,
  ChargeResult,
  PaymentResult,
  ResultCodes,
};
