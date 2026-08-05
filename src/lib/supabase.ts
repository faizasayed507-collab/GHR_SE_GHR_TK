import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const rawUrl = (metaEnv.VITE_SUPABASE_URL || '').replace(/^["']|["']$/g, '').trim();
// Strictly sanitize URL to format: https://<project-ref>.supabase.co
const supabaseUrl = rawUrl.replace(/\/+$|\/rest\/v1\/?.*$/g, '');
const supabaseAnonKey = (metaEnv.VITE_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
