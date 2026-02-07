import { createClient } from '@supabase/supabase-js';
import { config } from './config';

export function createSupabaseClient() {
  const { url, anonKey } = config.supabase;
  if (!url || !anonKey || url.includes('your-project') || anonKey.includes('your-anon')) {
    return null;
  }
  return createClient(url, anonKey);
}
