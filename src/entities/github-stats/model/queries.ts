import { queryOptions } from "@tanstack/react-query";
import { fetchJson } from "@shared/lib/api-client";
import { GithubStatsSchema } from "@shared/api/github";

export const githubStatsQueryOptions = queryOptions({
  queryKey: ["github-stats"],
  queryFn: () => fetchJson("/api/stats", GithubStatsSchema),
  staleTime: 60 * 60 * 1000,
  retry: 1,
});
