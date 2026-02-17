import { useMemo } from "react";
import { tv } from "tailwind-variants";
import { useTranslation } from "react-i18next";
import { Button } from "@shared/ui";
import { getJobClass, getJobKey, getJobSprites } from "@shared/constants/jobs";
import { calcLevelProgress } from "@entities/character";
import type { UserCharacter } from "@entities/character";

function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)}MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)}KB`;
  return `${bytes}B`;
}

const cardStyle = tv({
  base: "relative select-none border-4 border-black bg-card p-4 ring-4 ring-secondary ring-inset transition-all",
  variants: {
    locked: {
      true: "opacity-50 pointer-events-none",
    },
    equipped: {
      true: "border-primary",
    },
    interactive: {
      true: "hover:scale-105 hover:border-primary/50 cursor-pointer",
    },
  },
});

const badgeStyle = tv({
  base: "absolute top-1 right-1 z-10 px-2 py-0.5 font-pixel text-[10px]",
  variants: {
    type: {
      locked: "border-2 border-black bg-secondary text-muted-foreground",
      equipped: "border-2 border-black bg-primary text-primary-foreground",
    },
  },
});

interface CharacterCardProps {
  character: UserCharacter;
  isEquipped: boolean;
  onEquip: (id: string) => void;
  isEquipping: boolean;
}

export function CharacterCard({
  character,
  isEquipped,
  onEquip,
  isEquipping,
}: CharacterCardProps) {
  const { t } = useTranslation();
  const job = getJobClass(character.language);
  const jobKey = getJobKey(character.language);
  const sprites = getJobSprites(character.language);

  const progress = useMemo(
    () => calcLevelProgress(character.totalBytes),
    [character.totalBytes],
  );

  const jobName = t(`jobs.${jobKey}.name`);
  const imageSrc = isEquipped ? sprites.standing : sprites.sitting;
  const imageAlt = isEquipped ? `${jobName} standing` : `${jobName} sitting`;

  return (
    <article
      className={cardStyle({
        locked: character.isLocked,
        equipped: isEquipped,
        interactive: !character.isLocked && !isEquipped,
      })}
    >
      {character.isLocked && (
        <span className={badgeStyle({ type: "locked" })}>
          {character.language === "novice" ? "CLASS CHANGED" : "LOCKED"}
        </span>
      )}
      {isEquipped && (
        <span className={badgeStyle({ type: "equipped" })}>EQUIPPED</span>
      )}

      {/* Character image */}
      <figure className="relative mb-3 flex h-32 w-full items-center justify-center border-2 border-black bg-secondary">
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`h-28 w-28 object-contain ${character.isLocked ? "grayscale" : ""}`}
          style={{ imageRendering: "pixelated" }}
        />
      </figure>

      {/* Job name */}
      <h3 className={`font-pixel text-sm ${job.color}`}>{jobName}</h3>

      {/* Language label */}
      <p className="font-mono text-[10px] text-muted-foreground">
        {character.language === "novice" ? "No Class" : character.language}
      </p>

      {/* Weapon */}
      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
        {t(`jobs.${jobKey}.weapon`)}
      </p>

      {/* Level + EXP gauge */}
      <div className="mt-2">
        <div className="mb-1 flex justify-between">
          <span className="font-pixel text-[10px] text-muted-foreground">
            LV.{character.isLocked ? "—" : character.level}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {character.isLocked
              ? "—"
              : progress.isMax
                ? "MAX"
                : `${formatBytes(character.totalBytes)} / ${formatBytes(character.totalBytes + (progress.required - progress.current))}`}
          </span>
        </div>
        <div
          className="h-3 w-full border-2 border-black bg-secondary"
          role="progressbar"
          aria-valuenow={character.isLocked ? 0 : Math.round(progress.ratio * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`EXP ${Math.round(progress.ratio * 100)}%`}
        >
          {!character.isLocked && (
            <div
              className={`h-full transition-all ${progress.isMax ? "bg-amber-400" : "bg-primary"}`}
              style={{ width: `${progress.ratio * 100}%` }}
            />
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mt-2 font-mono text-[9px] leading-tight text-muted-foreground/70">
        {t(`jobs.${jobKey}.description`)}
      </p>

      {/* Equip button */}
      {!character.isLocked && !isEquipped && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full"
          onClick={() => onEquip(character.id)}
          disabled={isEquipping}
        >
          {t("character.equip")}
        </Button>
      )}
    </article>
  );
}
