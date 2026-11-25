import { useEffect, useState } from "react";

// Wedding-day album data.
// Each photo is { thumb, full?, download? }:
//   thumb    – small image for the grid (served from /public/album/thumbs)
//   full     – larger preview for the lightbox (Drive-resized); falls back to thumb
//   download – direct download link of the full-resolution file
//
// Sources, first match wins:
//   1. ALBUM_MANIFEST_URL – JSON list produced by scripts/build-manifest.mjs
//   2. Photos dropped into src/assets/album/ (bundled – fine for a few dozen)
//   3. Mockup placeholders, so the layout can be reviewed before real photos exist

export const ALBUM_MANIFEST_URL = "/album/manifest.json";
// Optional link to a whole-folder download (adds a DOWNLOAD ALL button). "" to hide.
export const ALBUM_ORIGINALS_URL = "";

const bundled = import.meta.glob(
  "./assets/album/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, import: "default" },
);
const BUNDLED = Object.keys(bundled)
  .sort()
  .map((k) => ({ thumb: bundled[k], full: bundled[k] }));

const MOCK_TONES = [
  ["#7A1228", "#C4907A"],
  ["#C9A470", "#EDE8DC"],
  ["#8B7355", "#F5F1E8"],
  ["#A09488", "#EDE8DC"],
  ["#5E0D1E", "#C9A470"],
];
const mockPhoto = (n) => {
  const [a, b] = MOCK_TONES[n % MOCK_TONES.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="1200" height="1500" fill="url(#g)"/><text x="600" y="720" font-family="Georgia,serif" font-size="220" font-style="italic" fill="#fff" fill-opacity=".85" text-anchor="middle">${n + 1}</text><text x="600" y="820" font-family="Arial,sans-serif" font-size="44" letter-spacing="14" fill="#fff" fill-opacity=".7" text-anchor="middle">MOCKUP</text></svg>`;
  const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return { thumb: url, full: url };
};

export const LOCAL_ALBUM = BUNDLED.length
  ? BUNDLED
  : Array.from({ length: 120 }, (_, i) => mockPhoto(i));

// Returns the album list: local/mock first, replaced by the manifest once loaded.
export function useAlbum() {
  const [photos, setPhotos] = useState(LOCAL_ALBUM);
  useEffect(() => {
    if (!ALBUM_MANIFEST_URL) return;
    let off = false;
    fetch(ALBUM_MANIFEST_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((list) => {
        if (!off && Array.isArray(list) && list.length) setPhotos(list);
      })
      .catch(() => {});
    return () => {
      off = true;
    };
  }, []);
  return photos;
}
