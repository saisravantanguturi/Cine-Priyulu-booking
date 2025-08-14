declare global {
  const THREE: any;
  const gsap: any;
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-cone': any;
      'a-animation': any;
      'a-camera-static': any;
    }
  }
}

// This empty export statement is crucial.
// It tells TypeScript to treat this file as a module, allowing it to augment the global scope.
export {};
