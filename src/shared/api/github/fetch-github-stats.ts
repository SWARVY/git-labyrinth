import { Octokit } from "octokit";

import type { GithubStats } from "./schema";

const STATS_QUERY = `
  query ($login: String!) {
    user(login: $login) {
      repositories(
        first: 100
        ownerAffiliations: OWNER
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        nodes {
          stargazerCount
          primaryLanguage { name }
        }
      }
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
        totalPullRequestContributions
        totalIssueContributions
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
        totalRepositoriesWithContributedCommits
      }
      pullRequests(first: 1) {
        totalCount
      }
      issues(first: 1) {
        totalCount
      }
      followers {
        totalCount
      }
      createdAt
    }
  }
`;

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface GraphQLResponse {
  user: {
    repositories: {
      nodes: Array<{
        stargazerCount: number;
        primaryLanguage: { name: string } | null;
      }>;
    };
    contributionsCollection: {
      totalCommitContributions: number;
      restrictedContributionsCount: number;
      totalPullRequestContributions: number;
      totalIssueContributions: number;
      contributionCalendar: {
        weeks: Array<{
          contributionDays: ContributionDay[];
        }>;
      };
      totalRepositoriesWithContributedCommits: number;
    };
    pullRequests: { totalCount: number };
    issues: { totalCount: number };
    followers: { totalCount: number };
    createdAt: string;
  };
}

function calculateStreak(
  weeks: GraphQLResponse["user"]["contributionsCollection"]["contributionCalendar"]["weeks"],
) {
  const days: ContributionDay[] = weeks.flatMap((w) => w.contributionDays);

  // Sort by date descending (most recent first)
  days.sort((a, b) => b.date.localeCompare(a.date));

  const today = new Date().toISOString().slice(0, 10);
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let streakStarted = false;

  for (const day of days) {
    if (!streakStarted) {
      // Allow today or yesterday to have 0 contributions without breaking streak
      if (day.date === today && day.contributionCount === 0) {
        continue;
      }
      streakStarted = true;
    }

    if (day.contributionCount > 0) {
      tempStreak++;
    } else {
      if (streakStarted && currentStreak === 0) {
        currentStreak = tempStreak;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
    }
  }

  // Handle streak that goes to the end
  if (currentStreak === 0) {
    currentStreak = tempStreak;
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { currentStreak, longestStreak };
}

export async function fetchGithubStats(
  accessToken: string,
  login: string,
): Promise<GithubStats> {
  const octokit = new Octokit({ auth: accessToken });

  const { user } = await octokit.graphql<GraphQLResponse>(STATS_QUERY, {
    login,
  });

  const totalStars = user.repositories.nodes.reduce(
    (sum, repo) => sum + repo.stargazerCount,
    0,
  );

  const totalCommits =
    user.contributionsCollection.totalCommitContributions +
    user.contributionsCollection.restrictedContributionsCount;

  const langCount = new Map<string, number>();
  for (const repo of user.repositories.nodes) {
    if (repo.primaryLanguage) {
      const name = repo.primaryLanguage.name;
      langCount.set(name, (langCount.get(name) ?? 0) + 1);
    }
  }

  let topLanguage: string | null = null;
  let maxCount = 0;
  for (const [lang, count] of langCount) {
    if (count > maxCount) {
      maxCount = count;
      topLanguage = lang;
    }
  }

  const { currentStreak, longestStreak } = calculateStreak(
    user.contributionsCollection.contributionCalendar.weeks,
  );

  const totalContributions =
    user.contributionsCollection.totalCommitContributions +
    user.contributionsCollection.restrictedContributionsCount +
    user.contributionsCollection.totalPullRequestContributions +
    user.contributionsCollection.totalIssueContributions;

  return {
    totalStars,
    totalCommits,
    totalPRs: user.pullRequests.totalCount,
    totalIssues: user.issues.totalCount,
    topLanguage,
    currentStreak,
    longestStreak,
    followers: user.followers.totalCount,
    createdAt: user.createdAt,
    totalContributions,
    contributedRepos:
      user.contributionsCollection.totalRepositoriesWithContributedCommits,
  };
}
