// This file contains TypeScript interfaces for our database tables and API responses

export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category?: string;
  stock?: number;
  featured?: boolean;
}

export type CreateProduct = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProduct = Partial<CreateProduct>;

// Auth types
export interface User {
  id: string;
  email: string;
  role?: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Database types for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>> & {
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Storage types
export interface StorageObject {
  id: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  name: string;
  owner: string;
  metadata: Record<string, unknown>;
  bucket_id: string;
  path_tokens: string[];
  version: string;
  owner_id?: string;
}

export interface FileObject {
  name: string;
  bucket_id: string;
  owner: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  path_tokens: string[];
  version: string;
  id: string;
}
