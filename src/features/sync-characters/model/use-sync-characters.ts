import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJson } from "@shared/lib/api-client";
import { CharacterCollectionSchema } from "@entities/character";

export function useSyncCharacters() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetchJson("/api/characters/sync", CharacterCollectionSchema, {
        method: "POST",
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["characters"], data);
    },
  });
}
