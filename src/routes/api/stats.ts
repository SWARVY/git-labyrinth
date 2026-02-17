import { createFileRoute } from "@tanstack/react-router";
import { createServerSupabaseClient } from "@shared/api/supabase";
import { getGithubStats } from "~/entities/github-stats";

export const Route = createFileRoute("/api/stats")({
  server: {
    handlers: {
      GET: async () => {
        const supabase = (await createServerSupabaseClient())!;

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        // getUser() validates auth; getSession() needed only for provider_token
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const providerToken = session?.provider_token;
        if (!providerToken) {
          return new Response(
            JSON.stringify({ error: "GitHub token expired. Please re-login." }),
            {
              status: 401,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        try {
          const stats = await getGithubStats(user.id, providerToken);

          return new Response(JSON.stringify(stats), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch stats";
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
