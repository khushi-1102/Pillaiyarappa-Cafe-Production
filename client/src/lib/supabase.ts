// Supabase Cloud Client with Graceful Offline & Local Store Fallback

export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env?.VITE_SUPABASE_URL || '';
  const key = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';
  return Boolean(url && key && url.includes('supabase.co'));
};

export const getSupabaseConfig = () => {
  return {
    url: import.meta.env?.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env?.VITE_SUPABASE_ANON_KEY || '',
    isConfigured: isSupabaseConfigured(),
  };
};
