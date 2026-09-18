import { createClient } from '@supabase/supabase-js';

// Vite uses import.meta.env instead of process.env to access environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail-safe to ensure the app doesn't run without the required API keys
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.');
}

// Export the initialized client to be used across your application
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
