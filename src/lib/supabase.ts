import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables or stored client config
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const getSupabaseConfig = () => {
  const localUrl = localStorage.getItem('sanwariya_supabase_url');
  const localKey = localStorage.getItem('sanwariya_supabase_anon_key');
  
  const url = (localUrl && localUrl.trim()) || envUrl;
  const key = (localKey && localKey.trim()) || envKey;
  
  return {
    url,
    key,
    isConfigured: Boolean(url && key && url.startsWith('http'))
  };
};

let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;
  
  if (!cachedClient) {
    try {
      cachedClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
    } catch (e) {
      console.warn("Failed to initialize Supabase client:", e);
      return null;
    }
  }
  return cachedClient;
};

export const resetSupabaseClient = () => {
  cachedClient = null;
};
