import { createIsomorphicFn } from "@tanstack/react-start";
import { createServerSupabaseClient } from "@shared/api/supabase";
import { fetchLanguageBytes } from "@shared/api/github";
import { JOB_CLASSES } from "@shared/constants/jobs";

import { calcLevel } from "./calc-level";
import type { CharacterCollection } from "./schema";

/** All known job language keys except 'default' */
const ALL_JOB_KEYS = Object.keys(JOB_CLASSES).filter((k) => k !== "default");

export const syncCharacters = createIsomorphicFn().server(
  async (userId: string, accessToken: string): Promise<CharacterCollection> => {
    const supabase = (await createServerSupabaseClient())!;

    const { data: userData } = await supabase.auth.getUser();
    const login = userData.user?.user_metadata.user_name;
    if (!login) throw new Error("GitHub username not found");

    const langBytes = await fetchLanguageBytes(accessToken, login);
    const totalBytes = Object.values(langBytes).reduce((s, b) => s + b, 0);
    const now = new Date().toISOString();

    // Normalize langBytes keys to match JOB_CLASSES keys
    const normalizedBytes = new Map<string, number>();
    for (const [lang, bytes] of Object.entries(langBytes)) {
      const key = lang.toLowerCase() === "c#" ? "csharp" : lang.toLowerCase();
      normalizedBytes.set(key, (normalizedBytes.get(key) ?? 0) + bytes);
    }

    const hasActivity = totalBytes > 0;

    // Build upsert rows for ALL job keys
    const upsertRows = ALL_JOB_KEYS.map((key) => {
      const bytes = normalizedBytes.get(key) ?? 0;
      const isNovice = key === "novice";

      let isLocked: boolean;
      let level: number;

      if (isNovice) {
        // Novice: unlocked only when no activity at all
        isLocked = hasActivity;
        level = 1;
      } else {
        // Language job: unlocked if user has bytes for it
        isLocked = bytes === 0;
        level = bytes > 0 ? calcLevel(bytes) : 1;
      }

      return {
        user_id: userId,
        language: key,
        level,
        total_bytes: bytes,
        is_locked: isLocked,
        updated_at: now,
      };
    });

    await supabase.from("user_characters").upsert(upsertRows, { onConflict: "user_id,language" });

    // Handle equipped character
    const { data: profile } = await supabase
      .from("profiles")
      .select("equipped_char_id")
      .eq("user_id", userId)
      .single();

    let shouldAutoEquip = !profile?.equipped_char_id;

    if (profile?.equipped_char_id) {
      // Check if currently equipped character is now locked
      const { data: equipped } = await supabase
        .from("user_characters")
        .select("is_locked")
        .eq("id", profile.equipped_char_id)
        .single();

      if (equipped?.is_locked) {
        shouldAutoEquip = true;
      }
    }

    if (shouldAutoEquip) {
      const { data: best } = await supabase
        .from("user_characters")
        .select("id")
        .eq("user_id", userId)
        .eq("is_locked", false)
        .order("level", { ascending: false })
        .order("total_bytes", { ascending: false })
        .limit(1)
        .single();

      if (best) {
        await supabase.from("profiles").upsert(
          {
            user_id: userId,
            equipped_char_id: best.id,
            updated_at: now,
          },
          { onConflict: "user_id" },
        );
      }
    }

    // Return updated collection
    const { data: characters } = await supabase
      .from("user_characters")
      .select("id, language, level, total_bytes, is_locked")
      .eq("user_id", userId)
      .order("is_locked", { ascending: true })
      .order("level", { ascending: false })
      .order("total_bytes", { ascending: false });

    const { data: finalProfile } = await supabase
      .from("profiles")
      .select("equipped_char_id")
      .eq("user_id", userId)
      .single();

    return {
      characters: (characters ?? []).map((c) => ({
        id: c.id,
        language: c.language,
        level: c.level,
        totalBytes: c.total_bytes,
        isLocked: c.is_locked,
      })),
      equippedCharId: finalProfile?.equipped_char_id ?? null,
    };
  },
);
