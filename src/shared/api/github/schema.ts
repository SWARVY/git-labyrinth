import * as v from "valibot";

export const GithubStatsSchema = v.object({
  totalStars: v.number(),
  totalCommits: v.number(),
  totalPRs: v.number(),
  totalIssues: v.number(),
  topLanguage: v.nullable(v.string()),
  // RPG expansion
  currentStreak: v.number(),
  longestStreak: v.number(),
  followers: v.number(),
  createdAt: v.string(),
  totalContributions: v.number(),
  contributedRepos: v.number(),
});

export type GithubStats = v.InferOutput<typeof GithubStatsSchema>;

export const LanguageBytesSchema = v.record(v.string(), v.number());

export type LanguageBytes = v.InferOutput<typeof LanguageBytesSchema>;
