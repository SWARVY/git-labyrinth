import type { GithubStats } from "@shared/api/github";

export interface RpgAttributes {
  vit: number; // Vitality — Streak
  cha: number; // Charisma — Followers
  wis: number; // Wisdom — Account Age (days)
  str: number; // Strength — Total Contributions
  agi: number; // Agility — Contributed Repos
}

export interface RpgAttributesMeta {
  attributes: RpgAttributes;
  /** Current streak days (raw) */
  currentStreak: number;
  /** Longest streak days (raw) */
  longestStreak: number;
  /** Account age in days */
  accountAgeDays: number;
  /** Whether the streak is currently active (kindled) or broken (hollow) */
  isKindled: boolean;
}

// Each attribute is scaled 0–100 for consistent radar chart display
// The raw thresholds define what "100" means for each stat

/** VIT: Current streak, max at 365 days */
function calcVit(currentStreak: number): number {
  return Math.min(Math.round((currentStreak / 365) * 100), 100);
}

/** CHA: Followers, max at 1000 */
function calcCha(followers: number): number {
  return Math.min(Math.round((followers / 1000) * 100), 100);
}

/** WIS: Account age, max at 3650 days (10 years) */
function calcWis(ageDays: number): number {
  return Math.min(Math.round((ageDays / 3650) * 100), 100);
}

/** STR: Total contributions (past year), max at 5000 */
function calcStr(totalContributions: number): number {
  return Math.min(Math.round((totalContributions / 5000) * 100), 100);
}

/** AGI: Contributed repos, max at 50 */
function calcAgi(contributedRepos: number): number {
  return Math.min(Math.round((contributedRepos / 50) * 100), 100);
}

export function calcRpgAttributes(stats: GithubStats): RpgAttributesMeta {
  const accountAgeDays = Math.floor(
    (Date.now() - new Date(stats.createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );

  const attributes: RpgAttributes = {
    vit: calcVit(stats.currentStreak),
    cha: calcCha(stats.followers),
    wis: calcWis(accountAgeDays),
    str: calcStr(stats.totalContributions),
    agi: calcAgi(stats.contributedRepos),
  };

  return {
    attributes,
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    accountAgeDays,
    isKindled: stats.currentStreak >= 1,
  };
}
