import { createIsomorphicFn } from "@tanstack/react-start";
import { createServerClient as createClient } from "@supabase/ssr";

export const createServerSupabaseClient = createIsomorphicFn().server(async () => {
  const { getCookies, setCookie, deleteCookie } = await import("@tanstack/react-start/server");

  return createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY, {
    cookies: {
      getAll() {
        const cookies = getCookies();
        return Object.entries(cookies).map(([name, value]) => ({
          name,
          value,
        }));
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          if (value === "") {
            deleteCookie(name, options);
          } else {
            setCookie(name, value, options);
          }
        }
      },
    },
  });
});
