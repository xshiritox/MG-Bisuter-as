/// <reference types="vite/client" />

// Type definitions for Vite's import.meta.env
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Ensure this file is treated as a module
export {}
