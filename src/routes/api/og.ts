import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { calcRpgAttributes } from "@entities/github-stats";
import { getJobClass, getJobKey } from "@shared/constants/jobs";
import i18next from "@shared/i18n";
import type { GithubStats } from "@shared/api/github";
import { buildOgSvg, buildCampfireSvg } from "@shared/lib/og-image";
import type { OgImageType } from "@shared/lib/og-image";

// ─── Sprite asset key → file path mapping ───
const SPRITE_FILES: Record<string, string> = {
  novice: "novice/novice-1.png",
  bard: "bard/bard-1.png",
  paladin: "paladin/paladin-1.png",
  summoner: "summoner/summoner-1.png",
  knight: "knight/knight-1.png",
  ranger: "ranger/ranger-1.png",
  rogue: "rogue/rogue-1.png",
};

// ─── Sitting/back sprite mappings for campfire ───
const SPRITE_SITTING_FILES: Record<string, string> = {
  novice: "novice/novice-2.png",
  bard: "bard/bard-2.png",
  paladin: "paladin/paladin-2.png",
  summoner: "summoner/summoner-2.png",
  knight: "knight/knight-2.png",
  ranger: "ranger/ranger-2.png",
  rogue: "rogue/rogue-2.png",
};

const SPRITE_BACK_FILES: Record<string, string> = {
  novice: "novice/novice-3.png",
  bard: "bard/bard-3.png",
  paladin: "paladin/paladin-3.png",
  summoner: "summoner/summoner-3.png",
  knight: "knight/knight-3.png",
  ranger: "ranger/ranger-3.png",
  rogue: "rogue/rogue-3.png",
};

// ─── Lazy singletons ───
let fontBase64Cache: string | null = null;

async function getFontBase64(): Promise<string> {
  if (fontBase64Cache) return fontBase64Cache;
  const res = await fetch(
    "https://cdn.jsdelivr.net/npm/galmuri@latest/dist/Galmuri9.ttf",
  );
  const buf = Buffer.from(await res.arrayBuffer());
  fontBase64Cache = buf.toString("base64");
  return fontBase64Cache;
}

async function getSpriteBase64(assetKey: string): Promise<string> {
  const file = SPRITE_FILES[assetKey] ?? SPRITE_FILES.novice;
  const spritePath = join(process.cwd(), "src", "shared", "assets", file);
  const buf = await readFile(spritePath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

async function getSpritePoseBase64(
  assetKey: string,
  pose: "sitting" | "back",
): Promise<string> {
  const registry =
    pose === "sitting" ? SPRITE_SITTING_FILES : SPRITE_BACK_FILES;
  const file = registry[assetKey] ?? registry.novice;
  const spritePath = join(process.cwd(), "src", "shared", "assets", file);
  const buf = await readFile(spritePath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

let bonfireBase64Cache: string | null = null;
async function getBonfireBase64(): Promise<string> {
  if (bonfireBase64Cache) return bonfireBase64Cache;
  const spritePath = join(
    process.cwd(),
    "src",
    "shared",
    "assets",
    "bonfire.png",
  );
  const buf = await readFile(spritePath);
  bonfireBase64Cache = `data:image/png;base64,${buf.toString("base64")}`;
  return bonfireBase64Cache;
}

// ─── Supabase admin client (service role bypasses RLS) ───
function createAdminClient() {
  const url =
    process.env.VITE_SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Set it as an environment variable.",
    );
  }

  return createClient(url, serviceKey);
}

// ─── Job color → hex mapping ───
const JOB_COLOR_HEX: Record<string, string> = {
  "text-blue-400": "#60a5fa",
  "text-yellow-400": "#facc15",
  "text-blue-600": "#2563eb",
  "text-orange-600": "#ea580c",
  "text-purple-500": "#a855f7",
  "text-orange-500": "#f97316",
  "text-blue-800": "#1e40af",
  "text-green-600": "#16a34a",
  "text-cyan-500": "#06b6d4",
  "text-orange-800": "#9a3412",
  "text-indigo-400": "#818cf8",
  "text-red-600": "#dc2626",
  "text-gray-400": "#9ca3af",
  "text-slate-400": "#94a3b8",
};

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const url = new URL(request.url);
        const userId = url.searchParams.get("userId");
        const ogType = (url.searchParams.get("type") ?? "a") as OgImageType;
        const lang = url.searchParams.get("lang") ?? "en";
        const t = i18next.getFixedT(lang);

        if (!userId) {
          return new Response(
            JSON.stringify({ error: "userId query parameter required" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        try {
          const supabase = await createAdminClient();

          // Fetch profile (equipped character + cached stats)
          const { data: profile } = await supabase
            .from("profiles")
            .select("equipped_char_id, stats_cache")
            .eq("user_id", userId)
            .single();

          if (!profile?.equipped_char_id) {
            return new Response(
              JSON.stringify({ error: "No equipped character found" }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }

          if (!profile.stats_cache) {
            return new Response(
              JSON.stringify({
                error:
                  "No stats cache found. Visit the dashboard first to generate stats.",
              }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }

          // Fetch username from auth.users
          const { data: authUser } =
            await supabase.auth.admin.getUserById(userId);
          const username =
            authUser?.user?.user_metadata?.user_name ??
            authUser?.user?.email ??
            "unknown";

          const stats = profile.stats_cache as GithubStats;
          const fontBase64 = await getFontBase64();

          // ─── Type B: Campfire ───
          if (ogType === "b") {
            // Fetch up to 4 unlocked characters sorted by level desc
            const { data: allChars } = await supabase
              .from("user_characters")
              .select("language, level, is_locked")
              .eq("user_id", userId)
              .eq("is_locked", false)
              .order("level", { ascending: false })
              .limit(4);

            const seated = allChars ?? [];

            // Campfire seat positions (matching dashboard layout)
            const SEATS = [
              { pose: "sitting" as const, flipX: true, x: -75, y: -30 },
              { pose: "sitting" as const, flipX: false, x: 75, y: -30 },
              { pose: "back" as const, flipX: false, x: -75, y: 30 },
              { pose: "back" as const, flipX: true, x: 75, y: 30 },
            ];

            // Load all sprites + bonfire in parallel
            const spritePromises = seated.map((c, i) => {
              const seat = SEATS[i];
              const job = getJobClass(c.language);
              return getSpritePoseBase64(job.assetKey, seat.pose);
            });

            const [bonfireBase64, ...spriteResults] = await Promise.all([
              getBonfireBase64(),
              ...spritePromises,
            ]);

            const characters = seated.map((c, i) => ({
              spriteBase64: spriteResults[i],
              level: c.level,
              jobName: t(`jobs.${getJobKey(c.language)}.name`),
              flipX: SEATS[i].flipX,
              pose: SEATS[i].pose,
              x: SEATS[i].x,
              y: SEATS[i].y,
            }));

            const svg = buildCampfireSvg({
              username,
              fontBase64,
              bonfireBase64,
              characters,
            });

            return new Response(svg, {
              status: 200,
              headers: {
                "Content-Type": "image/svg+xml",
                "Cache-Control": "public, max-age=3600, s-maxage=3600",
              },
            });
          }

          // ─── Type A: Character status card (default) ───
          // Fetch equipped character
          const { data: character } = await supabase
            .from("user_characters")
            .select("language, level, total_bytes")
            .eq("id", profile.equipped_char_id)
            .single();

          if (!character) {
            return new Response(
              JSON.stringify({ error: "Character not found" }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }

          const meta = calcRpgAttributes(stats);
          const job = getJobClass(character.language);
          const jobKey = getJobKey(character.language);
          const jobColorHex = JOB_COLOR_HEX[job.color] ?? "#9ca3af";

          const spriteBase64 = await getSpriteBase64(job.assetKey);

          const svg = buildOgSvg({
            username,
            jobName: t(`jobs.${jobKey}.name`),
            jobColor: jobColorHex,
            weapon: t(`jobs.${jobKey}.weapon`),
            level: character.level,
            language: character.language,
            attributes: meta.attributes,
            currentStreak: meta.currentStreak,
            spriteBase64,
            fontBase64,
          });

          return new Response(svg, {
            status: 200,
            headers: {
              "Content-Type": "image/svg+xml",
              "Cache-Control": "public, max-age=3600, s-maxage=3600",
            },
          });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to generate OG image";
          console.error("[/api/og] Error:", message);
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
