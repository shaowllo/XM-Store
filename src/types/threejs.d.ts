/* eslint-disable @typescript-eslint/no-empty-object-type */

// Augment React's JSX.IntrinsicElements with Three.js elements.
// Required because React 19 types removed the global JSX namespace,
// so @react-three/fiber's own global augmentation doesn't land.

import "react";
import type { ThreeElements } from "@react-three/fiber";

declare module "react" {
  interface JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    intrinsicElements: ThreeElements;
  }
}

// Also augment the global JSX namespace for any code that still uses it.
declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends ThreeElements {}
  }
}
