import { queryOptions } from "@tanstack/react-query";
import { fetchJson } from "@shared/lib/api-client";

import { CharacterCollectionSchema } from "./schema";

export const characterCollectionQueryOptions = queryOptions({
  queryKey: ["characters"],
  queryFn: () => fetchJson("/api/characters", CharacterCollectionSchema),
  staleTime: 60 * 60 * 1000,
});
