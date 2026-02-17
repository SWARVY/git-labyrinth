import { createFileRoute } from "@tanstack/react-router";
import { createServerSupabaseClient } from "@shared/api/supabase";

export const Route = createFileRoute("/api/characters/")({
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

        const userId = user.id;

        const { data: characters } = await supabase
          .from("user_characters")
          .select("id, language, level, total_bytes, is_locked")
          .eq("user_id", userId)
          .order("is_locked", { ascending: true })
          .order("level", { ascending: false })
          .order("total_bytes", { ascending: false });

        const { data: profile } = await supabase
          .from("profiles")
          .select("equipped_char_id")
          .eq("user_id", userId)
          .single();

        return new Response(
          JSON.stringify({
            characters: (characters ?? []).map((c) => ({
              id: c.id,
              language: c.language,
              level: c.level,
              totalBytes: c.total_bytes,
              isLocked: c.is_locked,
            })),
            equippedCharId: profile?.equipped_char_id ?? null,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      },
    },
  },
});
