import { Suspense } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query-5';

import {
  characterCollectionQueryOptions,
  calcLevelProgress,
  type UserCharacter,
} from '@entities/character';
import { useTranslation } from 'react-i18next';
import { getJobClass, getJobKey, getJobSprites } from '@shared/constants/jobs';
import { CampfireCanvas } from '@shared/ui';
import { StatsBoard } from '@widgets/stats-dashboard';
import { CharacterCollection } from '@widgets/character-collection';
import { SyncButton } from '@features/sync-characters';

function formatDashboardBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)}MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)}KB`;
  return `${bytes}B`;
}

/**
 * Campfire seat config
 *   pose "sitting" = side view, "back" = back view
 *   flipX flips the sprite horizontally to face the fire
 */
interface SeatConfig {
  pose: 'sitting' | 'back';
  flipX: boolean;
  x: number;
  y: number;
}

const SEATS: SeatConfig[] = [
  // top-left — sitting side, flip to face right
  { pose: 'sitting', flipX: true, x: -90, y: -35 },
  // top-right — sitting side, no flip (faces left)
  { pose: 'sitting', flipX: false, x: 90, y: -35 },
  // bottom-left — sitting back, no flip (faces right)
  { pose: 'back', flipX: false, x: -90, y: 35 },
  // bottom-right — sitting back, flip to face left
  { pose: 'back', flipX: true, x: 90, y: 35 },
];

function CampfireScene({
  characters,
}: {
  characters: UserCharacter[];
  equippedCharId: string | null;
}) {
  const { t } = useTranslation();
  const seated = characters
    .filter((c) => !c.isLocked)
    .toSorted((a, b) => b.level - a.level)
    .slice(0, 4);

  return (
    <section
      className="relative flex flex-col items-center py-8"
      aria-label="Campfire"
    >
      {/* Outer ambient glow — explicit gradient size, fades before container edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-[fireGlowOuter_2s_ease-in-out_infinite]"
        style={{
          background:
            'radial-gradient(350px 220px at center, rgba(245,158,11,0.30) 0%, rgba(239,68,68,0.08) 40%, rgba(245,158,11,0) 100%)',
        }}
      />

      {/* Campfire cluster — all positioned relative to bonfire center */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{ width: '320px', height: '240px' }}
      >
        {/* Inner core glow — explicit gradient size */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-[fireGlowInner_1.5s_ease-in-out_infinite]"
          style={{
            background:
              'radial-gradient(70px 55px at center, rgba(251,191,36,0.50) 0%, rgba(245,158,11,0.15) 60%, rgba(245,158,11,0) 100%)',
          }}
        />

        {/* Bonfire center */}
        <CampfireCanvas width={100} height={100} />

        {/* Seated heroes around the fire */}
        {seated.map((c, i) => {
          const seat = SEATS[i];
          const sprites = getJobSprites(c.language);
          const job = getJobClass(c.language);
          const jobKey = getJobKey(c.language);
          const spriteSrc =
            seat.pose === 'sitting' ? sprites.sitting : sprites.back;
          return (
            <div
              key={c.id}
              className="group absolute left-1/2 top-1/2"
              style={{
                transform: `translate(calc(-50% + ${seat.x}px), calc(-50% + ${seat.y}px))`,
              }}
            >
              <img
                src={spriteSrc}
                alt={t(`jobs.${jobKey}.name`)}
                className="h-24 w-24 object-contain"
                style={{
                  imageRendering: 'pixelated',
                  transform: seat.flipX ? 'scaleX(-1)' : undefined,
                }}
              />
              {/* Tooltip on hover */}
              <div
                role="tooltip"
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-5 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <div className="flex items-center gap-1 whitespace-nowrap border border-primary/30 bg-card px-2 py-0.5 font-pixel text-[8px] text-primary shadow-md">
                  <span>
                    {t(`jobs.${jobKey}.name`)}
                    <span className={job.color}>&lt;{c.language}&gt;</span>
                  </span>
                  <span>Lv.{c.level}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function EquippedDetail({ character }: { character: UserCharacter | null }) {
  const { t } = useTranslation();

  if (!character) {
    return (
      <aside
        className="flex h-full flex-col items-center justify-center border-2 border-secondary border-t-primary/30 bg-card/50 p-6"
        style={{ boxShadow: 'inset 0 1px 8px rgba(0,0,0,0.3)' }}
        aria-label="Equipped character"
      >
        <p className="font-pixel text-xs text-muted-foreground">EMPTY SLOT</p>
        <p className="mt-2 font-mono text-[10px] text-muted-foreground">
          &gt; 캐릭터를 장착해주세요
        </p>
      </aside>
    );
  }

  const job = getJobClass(character.language);
  const jobKey = getJobKey(character.language);
  const sprites = getJobSprites(character.language);
  const progress = calcLevelProgress(character.totalBytes);

  return (
    <aside
      className="flex h-full flex-col border-2 border-secondary border-t-primary/30 bg-card/50 p-5"
      style={{ boxShadow: 'inset 0 1px 8px rgba(0,0,0,0.3)' }}
      aria-label="Equipped character"
    >
      {/* Character image — large, centered */}
      <figure className="mb-3 flex items-center justify-center border-2 border-black bg-secondary py-4">
        <img
          src={sprites.standing}
          alt={t(`jobs.${jobKey}.name`)}
          className="h-32 w-32 object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
      </figure>

      {/* Job name + level */}
      <div className="flex items-baseline justify-between">
        <span className={`font-pixel text-base ${job.color}`}>
          {t(`jobs.${jobKey}.name`)}
        </span>
        <span className="font-pixel text-xs text-primary">
          Lv.{character.level}
        </span>
      </div>

      {/* Weapon */}
      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
        {t(`jobs.${jobKey}.weapon`)}
      </p>

      {/* EXP bar — shows progress within current level bracket */}
      <div className="mt-3">
        <div className="mb-1 flex justify-between">
          <span className="font-pixel text-[9px] text-muted-foreground">
            EXP
          </span>
          <span className="font-mono text-[9px] text-primary">
            {progress.isMax
              ? 'MAX'
              : `${formatDashboardBytes(character.totalBytes)} / ${formatDashboardBytes(character.totalBytes + (progress.required - progress.current))}`}
          </span>
        </div>
        <div
          className="h-3 w-full border-2 border-black bg-secondary"
          role="progressbar"
          aria-valuenow={Math.round(progress.ratio * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Experience"
        >
          <div
            className={`h-full transition-all ${progress.isMax ? 'bg-amber-400' : 'bg-primary'}`}
            style={{ width: `${progress.ratio * 100}%` }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="mt-auto pt-3 font-mono text-[9px] leading-tight text-muted-foreground/60">
        {t(`jobs.${jobKey}.description`)}
      </p>
    </aside>
  );
}

export function DashboardPage() {
  return (
    <main className="dungeon-bg relative mx-auto max-w-5xl select-none px-4 py-6">
      {/* Header */}
      <header className="mb-6 flex items-end justify-between pb-3">
        <div>
          <h1
            className="section-title font-pixel text-xl text-primary"
            style={{
              textShadow: '0 0 6px rgba(245, 158, 11, 0.3)',
            }}
          >
            <span className="text-primary/40">◆</span>
            <span>Dungeon Camp</span>
            <span className="text-primary/40">◆</span>
          </h1>
        </div>
        <SyncButton />
      </header>

      {/* Campfire scene */}
      <Suspense
        clientOnly
        fallback={
          <div className="flex flex-col items-stretch gap-4 lg:flex-row">
            <div className="lg:flex-3">
              <div className="relative flex flex-col items-center py-8">
                <div
                  className="relative z-10 flex items-center justify-center"
                  style={{ width: '320px', height: '240px' }}
                >
                  <CampfireCanvas width={100} height={100} />
                </div>
              </div>
            </div>
            <div className="lg:flex-1">
              <div
                className="flex h-full flex-col border-2 border-secondary border-t-primary/30 bg-card/50 p-5"
                style={{ boxShadow: 'inset 0 1px 8px rgba(0,0,0,0.3)' }}
              >
                <div className="mb-3 h-40 w-full animate-pulse border-2 border-black bg-muted" />
                <div className="mb-1 h-4 w-20 animate-pulse bg-muted" />
                <div className="mb-3 h-3 w-16 animate-pulse bg-muted" />
                <div className="h-3 w-full animate-pulse border-2 border-black bg-muted" />
              </div>
            </div>
          </div>
        }
      >
        <SuspenseQuery {...characterCollectionQueryOptions}>
          {({ data }) => (
            <div className="flex flex-col items-stretch gap-4 lg:flex-row">
              {/* Campfire — 3/4 width on desktop */}
              <div className="lg:flex-3">
                <CampfireScene
                  characters={data.characters}
                  equippedCharId={data.equippedCharId}
                />
              </div>
              {/* Equipped character — 1/4 width on desktop */}
              <div className="lg:flex-1">
                <EquippedDetail
                  character={
                    data.characters.find((c) => c.id === data.equippedCharId) ??
                    null
                  }
                />
              </div>
            </div>
          )}
        </SuspenseQuery>
      </Suspense>

      {/* Stats */}
      <section className="mt-8" aria-labelledby="stats-heading">
        <h2
          id="stats-heading"
          className="section-title mb-4 font-pixel text-sm text-primary"
          style={{ textShadow: '0 0 6px rgba(245, 158, 11, 0.3)' }}
        >
          <span className="text-primary/40">◆</span>
          <span>Status</span>
          <span className="text-primary/40">◆</span>
        </h2>
        <StatsBoard />
      </section>

      {/* Collection */}
      <section className="mt-8" aria-labelledby="collection-heading">
        <h2
          id="collection-heading"
          className="section-title mb-4 font-pixel text-sm text-primary"
          style={{ textShadow: '0 0 6px rgba(245, 158, 11, 0.3)' }}
        >
          <span className="text-primary/40">◆</span>
          <span>Collection</span>
          <span className="text-primary/40">◆</span>
        </h2>
        <CharacterCollection />
      </section>
    </main>
  );
}
