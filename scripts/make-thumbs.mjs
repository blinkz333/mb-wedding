// Resize every photo in the source folder into small WebP thumbnails.
//   node scripts/make-thumbs.mjs [sourceDir]
// Default source: D:\mb_wedding_pic     Output: public/album/thumbs/
// Safe to re-run: thumbnails that already exist are skipped.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = process.argv[2] || "D:\\mb_wedding_pic";
const OUT = path.join(ROOT, "public", "album", "thumbs");
const SIZE = 400; // shorter side, px (grid cells are square, shown with object-fit: cover)
const QUALITY = 72;
const CONCURRENCY = 4;

const isImage = (f) => /\.(jpe?g|png|webp)$/i.test(f);

await fs.mkdir(OUT, { recursive: true });
const files = (await fs.readdir(SRC)).filter(isImage).sort();
console.log(`${files.length} photos in ${SRC}`);

let done = 0;
let skipped = 0;
const failed = [];

async function one(file) {
  const base = path.parse(file).name;
  const out = path.join(OUT, `${base}.webp`);
  try {
    await fs.access(out);
    skipped++;
    return;
  } catch {
    /* not generated yet */
  }
  try {
    await sharp(path.join(SRC, file), { failOn: "none" })
      .rotate() // respect EXIF orientation
      .resize({ width: SIZE, height: SIZE, fit: "outside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(out);
    done++;
  } catch (e) {
    failed.push(`${file}: ${e.message}`);
  }
}

let next = 0;
async function worker() {
  while (next < files.length) {
    const f = files[next++];
    await one(f);
    const n = done + skipped + failed.length;
    if (n % 100 === 0) console.log(`  ${n}/${files.length}`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`\nCreated ${done}, skipped ${skipped}, failed ${failed.length}`);
failed.forEach((l) => console.log("  FAILED", l));
