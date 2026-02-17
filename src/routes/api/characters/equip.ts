import { createFileRoute } from "@tanstack/react-router";
import { createServerSupabaseClient } from "@shared/api/supabase";

export const Route = createFileRoute("/api/characters/equip")({
  server: {
    handlers: {
      PATCH: async ({ request }) => {
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

        const body = await request.json().catch(() => null);
        const characterId = body?.characterId;

        if (!characterId) {
          return new Response(
            JSON.stringify({ error: "characterId is required" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        // Verify the character exists, belongs to user, and is not locked
        const { data: character } = await supabase
          .from("user_characters")
          .select("id, is_locked")
          .eq("id", characterId)
          .eq("user_id", user.id)
          .single();

        if (!character) {
          return new Response(
            JSON.stringify({ error: "Character not found" }),
            {
              status: 404,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        if (character.is_locked) {
          return new Response(
            JSON.stringify({ error: "Cannot equip a locked character" }),
            {
              status: 403,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        await supabase.from("profiles").upsert(
          {
            user_id: user.id,
            equipped_char_id: characterId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
