import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import subsetFont from "subset-font";

const OUT_DIR = join(process.cwd(), "src", "shared", "assets", "og");

// Characters that appear in OG image SVGs
// ── Static labels ──
const STATIC_EN =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const PUNCTUATION = "@.─ -()/:,+#\u2007"; // figure space U+2007

// ── English job names & weapons ──
const EN_JOBS = [
  "Summoner",
  "Bard",
  "Paladin",
  "Knight",
  "Ranger",
  "Rogue",
  "Berserker",
  "Spellsword",
  "Monk",
  "Blacksmith",
  "Necromancer",
  "Alchemist",
  "Novice",
  "Adventurer",
  "Staff of Pythons",
  "Electric Lute",
  "Shield of Interface",
  "Greatsword",
  "Composite Bow",
  "Twin Daggers",
  "Giant Axe",
  "Runeblade",
  "Iron Fists",
  "Forge Hammer",
  "Bone Scythe",
  "Philosopher Stone",
  "Wooden Stick",
  "Rusty Sword",
];

// ── Korean job names & weapons ──
const KO_JOBS = [
  "소환사",
  "음유시인",
  "성기사",
  "기사",
  "레인저",
  "도적",
  "광전사",
  "마검사",
  "수도승",
  "대장장이",
  "강령술사",
  "연금술사",
  "초보자",
  "모험가",
  "파이썬의 지팡이",
  "번개의 류트",
  "인터페이스의 방패",
  "대검",
  "복합 활",
  "쌍단검",
  "거대한 도끼",
  "룬블레이드",
  "철권",
  "단조 망치",
  "뼈 낫",
  "현자의 돌",
  "나무 막대",
  "녹슨 검",
];

// ── Korean fallback text ──
const KO_FALLBACK = [
  "아직 등록되지 않은 모험가입니다.",
  "사이트에 방문하여 캐릭터를 생성해 보세요!",
];

// ── OG SVG labels ──
const OG_LABELS = [
  "VIT",
  "CHA",
  "WIS",
  "STR",
  "AGI",
  "ATTRIBUTES",
  "MAIN",
  "STREAK",
  "GIT LABYRINTH",
  "Lv.",
  "labyrinth.forimaginary.dev",
  "This adventurer has not been registered yet.",
  "Visit the site to create your character!",
];

// ── Programming language display names ──
const LANG_NAMES = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "Kotlin",
  "Swift",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
];

// Collect all unique characters
const allText = [
  STATIC_EN,
  PUNCTUATION,
  ...EN_JOBS,
  ...KO_JOBS,
  ...KO_FALLBACK,
  ...OG_LABELS,
  ...LANG_NAMES,
].join("");

const uniqueChars = [...new Set(allText)].join("");

async function main() {
  console.log(`Subsetting font with ${uniqueChars.length} unique characters`);

  // Fetch original font
  const res = await fetch(
    "https://cdn.jsdelivr.net/npm/galmuri@latest/dist/Galmuri9.ttf",
  );
  if (!res.ok) throw new Error(`Failed to fetch font: ${res.status}`);
  const fontBuffer = Buffer.from(await res.arrayBuffer());
  console.log(`Original font: ${(fontBuffer.length / 1024).toFixed(1)}KB`);

  // Subset to WOFF2
  const subset = await subsetFont(fontBuffer, uniqueChars, {
    targetFormat: "woff2",
  });

  await mkdir(OUT_DIR, { recursive: true });
  const outPath = join(OUT_DIR, "Galmuri9-subset.woff2");
  await writeFile(outPath, subset);
  console.log(`Subset font: ${(subset.length / 1024).toFixed(1)}KB → ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
