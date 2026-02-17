import { createFileRoute } from "@tanstack/react-router";
import { createServerSupabaseClient } from "@shared/api/supabase";

export const Route = createFileRoute("/api/auth/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");

        if (code) {
          const supabase = (await createServerSupabaseClient())!;
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (!error) {
            return new Response(null, {
              status: 302,
              headers: { Location: "/" },
            });
          }
        }

        return new Response(null, {
          status: 302,
          headers: { Location: "/?error=auth" },
        });
      },
    },
  },
});
