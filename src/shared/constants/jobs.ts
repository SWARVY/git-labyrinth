import novice1 from '@shared/assets/novice/novice-1.png';
import novice2 from '@shared/assets/novice/novice-2.png';
import novice3 from '@shared/assets/novice/novice-3.png';
import bard1 from '@shared/assets/bard/bard-1.png';
import bard2 from '@shared/assets/bard/bard-2.png';
import bard3 from '@shared/assets/bard/bard-3.png';
import paladin1 from '@shared/assets/paladin/paladin-1.png';
import paladin2 from '@shared/assets/paladin/paladin-2.png';
import paladin3 from '@shared/assets/paladin/paladin-3.png';
import summoner1 from '@shared/assets/summoner/summoner-1.png';
import summoner2 from '@shared/assets/summoner/summoner-2.png';
import summoner3 from '@shared/assets/summoner/summoner-3.png';
import knight1 from '@shared/assets/knight/knight-1.png';
import knight2 from '@shared/assets/knight/knight-2.png';
import knight3 from '@shared/assets/knight/knight-3.png';
import ranger1 from '@shared/assets/ranger/ranger-1.png';
import ranger2 from '@shared/assets/ranger/ranger-2.png';
import ranger3 from '@shared/assets/ranger/ranger-3.png';
import rogue1 from '@shared/assets/rogue/rogue-1.png';
import rogue2 from '@shared/assets/rogue/rogue-2.png';
import rogue3 from '@shared/assets/rogue/rogue-3.png';
import berserker1 from '@shared/assets/berserker/berserker-1.png';
import berserker2 from '@shared/assets/berserker/berserker-2.png';
import berserker3 from '@shared/assets/berserker/berserker-3.png';
import spellsword1 from '@shared/assets/spellsword/spellsword-1.png';
import spellsword2 from '@shared/assets/spellsword/spellsword-2.png';
import spellsword3 from '@shared/assets/spellsword/spellsword-3.png';
import necromancer1 from '@shared/assets/necromancer/necromancer-1.png';
import necromancer2 from '@shared/assets/necromancer/necromancer-2.png';
import necromancer3 from '@shared/assets/necromancer/necromancer-3.png';
import alchemist1 from '@shared/assets/alchemist/alchemist-1.png';
import alchemist2 from '@shared/assets/alchemist/alchemist-2.png';
import alchemist3 from '@shared/assets/alchemist/alchemist-3.png';
import monk1 from '@shared/assets/monk/monk-1.png';
import monk2 from '@shared/assets/monk/monk-2.png';
import monk3 from '@shared/assets/monk/monk-3.png';
import blacksmith1 from '@shared/assets/blacksmith/blacksmith-1.png';
import blacksmith2 from '@shared/assets/blacksmith/blacksmith-2.png';
import blacksmith3 from '@shared/assets/blacksmith/blacksmith-3.png';

export interface JobClass {
  /** Tailwind text color class */
  color: string;
  /** Asset folder key — maps to shared/assets/<assetKey>/ */
  assetKey: string;
}

export const JOB_CLASSES: Record<string, JobClass> = {
  python: { color: 'text-blue-400', assetKey: 'summoner' },
  javascript: { color: 'text-yellow-400', assetKey: 'bard' },
  typescript: { color: 'text-blue-600', assetKey: 'paladin' },
  java: { color: 'text-orange-600', assetKey: 'knight' },
  kotlin: { color: 'text-purple-500', assetKey: 'ranger' },
  swift: { color: 'text-orange-500', assetKey: 'rogue' },
  'c++': { color: 'text-blue-800', assetKey: 'berserker' },
  csharp: { color: 'text-green-600', assetKey: 'spellsword' },
  go: { color: 'text-cyan-500', assetKey: 'monk' },
  rust: { color: 'text-orange-800', assetKey: 'blacksmith' },
  php: { color: 'text-indigo-400', assetKey: 'necromancer' },
  ruby: { color: 'text-red-600', assetKey: 'alchemist' },
  novice: { color: 'text-gray-400', assetKey: 'novice' },
  default: { color: 'text-slate-400', assetKey: 'novice' },
};

/** Sprite set for a job: standing, sitting side, sitting back */
export interface JobSprites {
  standing: string;
  sitting: string;
  back: string;
}

const SPRITE_REGISTRY: Record<string, JobSprites> = {
  novice: { standing: novice1, sitting: novice2, back: novice3 },
  bard: { standing: bard1, sitting: bard2, back: bard3 },
  paladin: { standing: paladin1, sitting: paladin2, back: paladin3 },
  summoner: { standing: summoner1, sitting: summoner2, back: summoner3 },
  knight: { standing: knight1, sitting: knight2, back: knight3 },
  ranger: { standing: ranger1, sitting: ranger2, back: ranger3 },
  rogue: { standing: rogue1, sitting: rogue2, back: rogue3 },
  berserker: { standing: berserker1, sitting: berserker2, back: berserker3 },
  spellsword: {
    standing: spellsword1,
    sitting: spellsword2,
    back: spellsword3,
  },
  necromancer: {
    standing: necromancer1,
    sitting: necromancer2,
    back: necromancer3,
  },
  alchemist: { standing: alchemist1, sitting: alchemist2, back: alchemist3 },
  monk: { standing: monk1, sitting: monk2, back: monk3 },
  blacksmith: {
    standing: blacksmith1,
    sitting: blacksmith2,
    back: blacksmith3,
  },
};

const DEFAULT_SPRITES = SPRITE_REGISTRY.novice;

function normalizeLanguage(language: string): string {
  const lower = language.toLowerCase();
  if (lower === 'c#') return 'csharp';
  return lower;
}

export function getJobKey(language: string): string {
  const key = normalizeLanguage(language);
  return JOB_CLASSES[key] ? key : 'default';
}

export function getJobClass(language: string): JobClass {
  return JOB_CLASSES[getJobKey(language)];
}

export function getJobSprites(language: string): JobSprites {
  const job = getJobClass(language);
  return SPRITE_REGISTRY[job.assetKey] ?? DEFAULT_SPRITES;
}

const DISPLAY_NAME_MAP: Record<string, string> = {
  csharp: 'c#',
};

/** Returns a human-readable display name for a language key. */
export function getLanguageDisplayName(language: string): string {
  const key = normalizeLanguage(language);
  return DISPLAY_NAME_MAP[key] ?? language;
}
