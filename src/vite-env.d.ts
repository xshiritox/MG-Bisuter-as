/// <reference types="vite/client" />

// This file provides type information for Vite's import.meta.env
// and other global types that should be available in your application

// Vite environment variables
declare const __APP_VERSION__: string;

// For CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// For image imports
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
declare module '*.ico';
// Add other static assets if needed

// For Vite's import.meta.env
declare interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  // Add other environment variables here
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global type declarations
declare const __DEV__: boolean;
declare const __PROD__: boolean;
declare const __TEST__: boolean;
