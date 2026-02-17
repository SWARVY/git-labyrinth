import { createBrowserClient as createClient } from "@supabase/ssr";

export function createBrowserClient() {
  return createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);
}
