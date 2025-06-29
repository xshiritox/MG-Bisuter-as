// This file provides type definitions for DOM APIs that might be missing or incomplete

// Extend the global Window interface
declare global {
  interface Window {
    // Add any missing window properties here
    open: (url?: string, target?: string, features?: string) => Window | null;
    scrollTo: (options?: ScrollToOptions) => void;
    addEventListener: <K extends keyof WindowEventMap>(
      type: K,
      listener: (this: Window, ev: WindowEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ) => void;
    removeEventListener: <K extends keyof WindowEventMap>(
      type: K,
      listener: (this: Window, ev: WindowEventMap[K]) => any,
      options?: boolean | EventListenerOptions
    ) => void;
  }

  // Add any other missing DOM type definitions here
  interface HTMLElement {
    // Add any missing HTMLElement properties/methods here
  }

  interface Document {
    // Add any missing Document properties/methods here
    getElementById(elementId: string): HTMLElement | null;
  }
}

// This ensures this file is treated as a module
export {};
