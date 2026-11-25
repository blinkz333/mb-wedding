// Build public/album/manifest.json from the generated thumbnails.
//   node scripts/build-manifest.mjs
//
// Without Drive settings: every photo only has a thumb (lightbox shows the thumb).
// With DRIVE_API_KEY + DRIVE_FOLDER_ID in .env: files in the public Drive folder are
// matched to thumbs by file name, adding
//   full     → Drive-resized 1600px preview (shown in the lightbox)
//   download → direct download of the original file (the "download" button)
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
try {
  process.loadEnvFile(path.join(ROOT, ".env"));
} catch {
  /* .env is optional when building without Drive */
}

const KEY = process.env.DRIVE_API_KEY;
const FOLDER = process.env.DRIVE_FOLDER_ID;
const THUMBS = path.join(ROOT, "public", "album", "thumbs");
const OUT = path.join(ROOT, "public", "album", "manifest.json");

const thumbFiles = (await fs.readdir(THUMBS)).filter((f) => f.endsWith(".webp")).sort();
if (!thumbFiles.length) throw new Error("No thumbnails found. Run scripts/make-thumbs.mjs first.");

// name (without extension, lowercase) → Drive file id
const drive = new Map();
if (KEY && FOLDER) {
  let pageToken = "";
  let total = 0;
  do {
    const url = new URL("https://www.googleapis.com/drive/v3/files");
    url.searchParams.set("q", `'${FOLDER}' in parents and trashed = false`);
    url.searchParams.set("fields", "nextPageToken, files(id, name)");
    url.searchParams.set("pageSize", "1000");
    url.searchParams.set("key", KEY);
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Drive API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    for (const f of data.files) {
      drive.set(path.parse(f.name).name.toLowerCase(), f.id);
      total++;
    }
    pageToken = data.nextPageToken || "";
  } while (pageToken);
  console.log(`Drive folder lists ${total} files`);
} else {
  console.log("DRIVE_API_KEY / DRIVE_FOLDER_ID not set – building thumb-only manifest");
}

let matched = 0;
const photos = thumbFiles.map((f) => {
  const name = path.parse(f).name;
  const thumb = `/album/thumbs/${encodeURIComponent(f)}`;
  const id = drive.get(name.toLowerCase());
  if (!id) return { thumb, full: thumb };
  matched++;
  return {
    thumb,
    full: `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
    // second way to load the same preview if the first one is refused by the browser
    alt: `https://lh3.googleusercontent.com/d/${id}=w1600`,
    download: `https://drive.google.com/uc?export=download&id=${id}`,
  };
});

await fs.writeFile(OUT, JSON.stringify(photos));
console.log(`Wrote ${photos.length} photos (${matched} linked to Drive) → ${path.relative(ROOT, OUT)}`);
if (KEY && FOLDER && matched < photos.length)
  console.log(`  ${photos.length - matched} thumbs had no matching Drive file (upload may still be running)`);
