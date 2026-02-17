import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CharacterCollection } from "@entities/character";

export function useEquipCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (characterId: string) => {
      const res = await fetch("/api/characters/equip", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(body.error ?? "Failed to equip character");
      }

      return characterId;
    },
    onSuccess: (equippedId) => {
      queryClient.setQueryData<CharacterCollection>(["characters"], (old) => {
        if (!old) return old;
        return { ...old, equippedCharId: equippedId };
      });
    },
  });
}
