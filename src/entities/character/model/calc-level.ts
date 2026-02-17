const LEVEL_THRESHOLDS = [
  1_000_000, // Level 5
  200_000, // Level 4
  50_000, // Level 3
  10_000, // Level 2
] as const;

/** Ordered ascending: [Lv.1→2, Lv.2→3, Lv.3→4, Lv.4→5] */
const THRESHOLDS_ASC = [...LEVEL_THRESHOLDS].reverse();

export function calcLevel(bytes: number): number {
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (bytes >= LEVEL_THRESHOLDS[i]) {
      return 5 - i;
    }
  }
  return 1;
}

export interface LevelProgress {
  /** Current level (1-5) */
  level: number;
  /** Bytes earned within the current level bracket */
  current: number;
  /** Total bytes needed for the current level bracket (0 if max level) */
  required: number;
  /** 0-1 progress ratio within current bracket */
  ratio: number;
  /** true if already at max level */
  isMax: boolean;
}

export function calcLevelProgress(bytes: number): LevelProgress {
  const level = calcLevel(bytes);

  if (level >= 5) {
    return { level: 5, current: bytes, required: 0, ratio: 1, isMax: true };
  }

  const currentThreshold = level >= 2 ? THRESHOLDS_ASC[level - 2] : 0;
  const nextThreshold = THRESHOLDS_ASC[level - 1];

  const current = bytes - currentThreshold;
  const required = nextThreshold - currentThreshold;
  const ratio = required > 0 ? Math.min(current / required, 1) : 1;

  return { level, current, required, ratio, isMax: false };
}
