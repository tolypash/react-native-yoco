import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ReactNativeYocoViewProps } from './ReactNativeYoco.types';

const NativeView: React.ComponentType<ReactNativeYocoViewProps> =
  requireNativeViewManager('ReactNativeYoco');

export default function ReactNativeYocoView(props: ReactNativeYocoViewProps) {
  return <NativeView {...props} />;
}
