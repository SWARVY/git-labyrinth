import { createBrowserClient } from "@shared/api/supabase";

export async function logout() {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  window.location.href = "/";
}
