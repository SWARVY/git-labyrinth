import { readdir, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ASSETS_DIR = join(process.cwd(), "src", "shared", "assets");
const OUT_DIR = join(ASSETS_DIR, "og");

const JOB_DIRS = [
  "alchemist",
  "bard",
  "berserker",
  "blacksmith",
  "knight",
  "monk",
  "necromancer",
  "novice",
  "paladin",
  "ranger",
  "rogue",
  "spellsword",
  "summoner",
];

// Rendered at 72-115px in SVG; 128px gives good pixel-art crispness
const SPRITE_SIZE = 128;
const BONFIRE_SIZE = 128;

async function optimizeSprite(
  inputPath: string,
  outputPath: string,
  size: number,
) {
  await sharp(inputPath)
    .resize(size, size, { kernel: "nearest" })
    .png({ palette: true, effort: 10 })
    .toFile(outputPath);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const dir of JOB_DIRS) {
    const jobDir = join(ASSETS_DIR, dir);
    const outJobDir = join(OUT_DIR, dir);
    await mkdir(outJobDir, { recursive: true });

    const files = await readdir(jobDir);
    const pngs = files.filter((f) => f.endsWith(".png"));

    for (const png of pngs) {
      const inputPath = join(jobDir, png);
      const outputPath = join(outJobDir, png);

      await optimizeSprite(inputPath, outputPath, SPRITE_SIZE);

      const origSize = (await stat(inputPath)).size;
      const optSize = (await stat(outputPath)).size;
      totalOriginal += origSize;
      totalOptimized += optSize;

      console.log(
        `${dir}/${png}: ${(origSize / 1024).toFixed(1)}KB → ${(optSize / 1024).toFixed(1)}KB`,
      );
    }
  }

  // Optimize bonfire
  const bonfireIn = join(ASSETS_DIR, "bonfire.png");
  const bonfireOut = join(OUT_DIR, "bonfire.png");
  await optimizeSprite(bonfireIn, bonfireOut, BONFIRE_SIZE);

  const origSize = (await stat(bonfireIn)).size;
  const optSize = (await stat(bonfireOut)).size;
  totalOriginal += origSize;
  totalOptimized += optSize;
  console.log(
    `bonfire.png: ${(origSize / 1024).toFixed(1)}KB → ${(optSize / 1024).toFixed(1)}KB`,
  );

  console.log(
    `\nTotal: ${(totalOriginal / 1024).toFixed(1)}KB → ${(totalOptimized / 1024).toFixed(1)}KB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}% reduction)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
