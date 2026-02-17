import * as v from "valibot";

export const UserCharacterSchema = v.object({
  id: v.string(),
  language: v.string(),
  level: v.number(),
  totalBytes: v.number(),
  isLocked: v.boolean(),
});

export type UserCharacter = v.InferOutput<typeof UserCharacterSchema>;

export const CharacterCollectionSchema = v.object({
  characters: v.array(UserCharacterSchema),
  equippedCharId: v.nullable(v.string()),
});

export type CharacterCollection = v.InferOutput<typeof CharacterCollectionSchema>;
