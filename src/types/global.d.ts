// Global TypeScript definitions for the application

// Extend the Window interface to include any custom properties
interface Window {
  // Add any custom window properties here if needed
  __APP__: {
    version: string;
    // Add other global app properties here
  };
}

// Global type extensions
declare global {
  // Add any global type extensions here
  
  // Example: Add custom properties to the Window interface
  interface Window {
    // Add any custom window properties here
  }
  
  // Example: Add custom properties to the Document interface
  interface Document {
    // Add any custom document properties here
  }
  
  // Example: Add custom properties to the Navigator interface
  interface Navigator {
    // Add any custom navigator properties here
  }
}

// This ensures this file is treated as a module
export {};
