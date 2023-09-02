import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ReactNativeYoco.web.ts
// and on native platforms to ReactNativeYoco.ts
import ReactNativeYocoModule from './ReactNativeYocoModule';
import ReactNativeYocoView from './ReactNativeYocoView';
import { ChangeEventPayload, ReactNativeYocoViewProps } from './ReactNativeYoco.types';

// Get the native constant value.
export const PI = ReactNativeYocoModule.PI;

export function hello(): string {
  return ReactNativeYocoModule.hello();
}

export async function setValueAsync(value: string) {
  return await ReactNativeYocoModule.setValueAsync(value);
}

const emitter = new EventEmitter(ReactNativeYocoModule ?? NativeModulesProxy.ReactNativeYoco);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ReactNativeYocoView, ReactNativeYocoViewProps, ChangeEventPayload };
