import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables with fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('xyzcompany')
);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Local State Store with LocalStorage Persistence
 * Serves as an immediate, high-fidelity mock-to-Supabase bridge so the app is
 * completely interactive and stateful out of the box.
 */
export class LocalDataStore {
  private static getKey(entity: string): string {
    return `hirepath_${entity}`;
  }

  static get<T>(entity: string, defaultData: T): T {
    try {
      const saved = localStorage.getItem(this.getKey(entity));
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn(`Error reading ${entity} from localStorage:`, e);
    }
    // initialize storage with defaultData
    this.set(entity, defaultData);
    return defaultData;
  }

  static set<T>(entity: string, data: T): void {
    try {
      localStorage.setItem(this.getKey(entity), JSON.stringify(data));
    } catch (e) {
      console.warn(`Error saving ${entity} to localStorage:`, e);
    }
  }

  static resetAll(): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('hirepath_'));
    keys.forEach(k => localStorage.removeItem(k));
  }
}
