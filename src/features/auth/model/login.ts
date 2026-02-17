import { createBrowserClient } from "@shared/api/supabase";

const AUTH_RETURN_PATH_KEY = "auth_return_path";

export async function loginWithGithub() {
  const currentPath = window.location.pathname;
  if (currentPath !== "/") {
    localStorage.setItem(AUTH_RETURN_PATH_KEY, currentPath);
  }

  const supabase = createBrowserClient();
  const redirectTo = `${window.location.origin}/api/auth/callback`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo },
  });

  if (error) {
    throw error;
  }
}

export function consumeReturnPath(): string {
  const saved = localStorage.getItem(AUTH_RETURN_PATH_KEY);
  if (saved) {
    localStorage.removeItem(AUTH_RETURN_PATH_KEY);
  }
  return saved ?? "/dashboard";
}
