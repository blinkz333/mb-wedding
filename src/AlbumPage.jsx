import { useEffect, useRef, useState } from "react";
import Lightbox from "./Lightbox.jsx";
import { useAlbum, ALBUM_ORIGINALS_URL } from "./albumData.js";

const BATCH = 60; // photos rendered per scroll step (keeps 1000+ photos smooth)

export default function AlbumPage() {
  const photos = useAlbum();
  const [shown, setShown] = useState(BATCH);
  const [open, setOpen] = useState(null); // index | null
  const sentinel = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Album · Wedding Day";
  }, []);

  // Infinite scroll: reveal the next batch when the sentinel nears the viewport
  const total = photos.length;
  useEffect(() => {
    const el = sentinel.current;
    if (!el || shown >= total) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShown((n) => Math.min(n + BATCH, total)),
      { rootMargin: "800px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [shown, total]);

  return (
    <div className="album-page">
      <header className="album-page-bar">
        <a href="#/" className="album-back">
          ← BACK
        </a>
        <span className="album-page-count">{total} PHOTOS</span>
      </header>

      <section className="album album--page">
        <h1 className="sec-title is-visible reveal">ALBUM</h1>
        <p className="gallery-sub is-visible reveal">Wedding Day</p>

        <div className="album-grid">
          {photos.slice(0, shown).map((p, i) => (
            <button
              key={i}
              type="button"
              className="album-item"
              onClick={() => setOpen(i)}
              aria-label={`ดูรูปที่ ${i + 1} ขนาดเต็ม`}
            >
              <img src={p.thumb} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>

        {shown < total && <div ref={sentinel} className="album-sentinel" />}

        {ALBUM_ORIGINALS_URL && (
          <div className="album-actions">
            <a
              href={ALBUM_ORIGINALS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="dir-btn"
            >
              DOWNLOAD ORIGINALS
            </a>
          </div>
        )}
      </section>

      {open !== null && (
        <Lightbox
          items={photos}
          index={open}
          onChange={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}
