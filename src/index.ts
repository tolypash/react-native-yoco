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
} from "./ReactNativeYoco.types";
import { PaymentType, SupportedCurrency } from "./ReactNativeYocoEnums";

export function initialise() {
  return ReactNativeYocoModule.initialise();
}

export function configure(params: ConfigureParams) {
  return ReactNativeYocoModule.configure(params.secret);
}

export function getDeviceType() {
  return ReactNativeYocoModule.getDeviceType();
}

export async function pairTerminal() {
  return await ReactNativeYocoModule.pairTerminal();
}

export async function charge(params: ChargeParams) {
  return await ReactNativeYocoModule.charge(
    params.amountInCents,
    params.paymentType,
    params.currency,
    params.tipInCents,
    params.paymentParameters
  );
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
};
