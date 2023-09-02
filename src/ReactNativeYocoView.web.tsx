import * as React from 'react';

import { ReactNativeYocoViewProps } from './ReactNativeYoco.types';

export default function ReactNativeYocoView(props: ReactNativeYocoViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
