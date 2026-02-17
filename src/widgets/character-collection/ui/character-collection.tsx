import { Suspense, ErrorBoundary } from "@suspensive/react";
import { SuspenseQuery } from "@suspensive/react-query-5";

import { characterCollectionQueryOptions } from "@entities/character";
import { useEquipCharacter } from "@features/equip-character";

import { CharacterCard } from "./character-card";

function CollectionSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="border-4 border-black bg-card p-4 ring-4 ring-secondary ring-inset"
        >
          {/* Image area */}
          <div className="mb-3 h-32 w-full animate-pulse border-2 border-black bg-muted" />
          {/* Job name */}
          <div className="mb-1 h-4 w-20 animate-pulse bg-muted" />
          {/* Language */}
          <div className="mb-1 h-3 w-14 animate-pulse bg-muted" />
          {/* Weapon */}
          <div className="mb-2 h-3 w-24 animate-pulse bg-muted" />
          {/* Level gauge */}
          <div className="h-3 w-full animate-pulse border-2 border-black bg-muted" />
        </div>
      ))}
    </div>
  );
}

function CollectionError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div
      role="alert"
      className="border-4 border-destructive bg-destructive/10 p-4 text-center"
    >
      <p className="font-mono text-sm text-destructive">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 font-mono text-xs text-destructive underline"
      >
        다시 시도
      </button>
    </div>
  );
}

function CollectionContent() {
  const { mutate: equip, isPending: isEquipping } = useEquipCharacter();

  return (
    <SuspenseQuery {...characterCollectionQueryOptions}>
      {({ data }) => {
        if (data.characters.length === 0) {
          return (
            <div className="select-none border-4 border-black bg-card p-8 text-center ring-4 ring-secondary ring-inset">
              <p className="font-pixel text-sm text-muted-foreground">
                EMPTY SLOT
              </p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                &gt; "캐릭터 동기화" 버튼을 눌러주세요
              </p>
            </div>
          );
        }

        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {data.characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                isEquipped={character.id === data.equippedCharId}
                onEquip={(id) => equip(id)}
                isEquipping={isEquipping}
              />
            ))}
          </div>
        );
      }}
    </SuspenseQuery>
  );
}

export function CharacterCollection() {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <CollectionError error={error} reset={reset} />
      )}
    >
      <Suspense clientOnly fallback={<CollectionSkeleton />}>
        <CollectionContent />
      </Suspense>
    </ErrorBoundary>
  );
}
