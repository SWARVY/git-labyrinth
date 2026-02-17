import { createIsomorphicFn } from "@tanstack/react-start";
import { createServerSupabaseClient } from "@shared/api/supabase";
import { fetchGithubStats } from "@shared/api/github";
import type { GithubStats } from "@shared/api/github";

const CACHE_TTL_MS = 60 * 60 * 1000;

export const getGithubStats = createIsomorphicFn().server(
  async (userId: string, accessToken: string): Promise<GithubStats> => {
    const supabase = (await createServerSupabaseClient())!;

    const { data: cached } = await supabase
      .from("profiles")
      .select("stats_cache, updated_at")
      .eq("user_id", userId)
      .single();

    if (cached?.stats_cache && cached.updated_at) {
      const age = Date.now() - new Date(cached.updated_at).getTime();
      if (age < CACHE_TTL_MS) {
        return cached.stats_cache as GithubStats;
      }
    }

    const { data: userData } = await supabase.auth.getUser();
    const login = userData.user?.user_metadata.user_name;
    if (!login) throw new Error("GitHub username not found");

    let stats: GithubStats;
    try {
      stats = await fetchGithubStats(accessToken, login);
    } catch {
      if (cached?.stats_cache) {
        return cached.stats_cache as GithubStats;
      }
      throw new Error("Failed to fetch GitHub stats");
    }

    await supabase.from("profiles").upsert(
      {
        user_id: userId,
        stats_cache: stats as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    return stats;
  },
);
