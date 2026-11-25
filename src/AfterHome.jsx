import { useEffect, useState } from "react";
import { useAlbum, ALBUM_ORIGINALS_URL } from "./albumData.js";
import SkeletonImg from "./SkeletonImg.jsx";
import BusyNotice from "./BusyNotice.jsx";

// Post-wedding landing page. The original invitation page lives at #/invite.
export default function AfterHome({
  brideEn,
  groomEn,
  dateText,
  venue,
  hashtag,
  slides,
  gameUrl,
}) {
  const { photos: album, error: albumError, retry: retryAlbum } = useAlbum();
  const PREVIEW = (album || []).slice(0, 10);

  // Pre-wedding slideshow in the hero circle
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      if (!document.hidden) setSlide((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="wc after">
      <header className="bp-header">
        <div className="bp-left">
          <div className="bp-field">
            <span className="bp-label">STATUS</span>
            <span className="bp-value">ARRIVED</span>
          </div>
          <div className="bp-sep" />
          <div className="bp-field">
            <span className="bp-label">FLIGHT</span>
            <span className="bp-value">14112026</span>
          </div>
        </div>
      </header>

      <section className="after-hero">
        <p className="after-kicker">THANK YOU FOR CELEBRATING WITH US</p>
        <div className="after-photo" aria-label="Pre-wedding photos">
          {slides.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={i === 0 ? `${brideEn} & ${groomEn}` : ""}
              className={i === slide ? "is-active" : ""}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          ))}
        </div>
        {slides.length > 1 && (
          <div className="after-dots" aria-hidden="true">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                tabIndex={-1}
                className={i === slide ? "is-active" : ""}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
        )}
        <div className="after-names">
          <span className="script-name">{brideEn}</span>
          <span className="script-name">&amp; {groomEn}</span>
        </div>
        <p className="after-date">{dateText}</p>
        <p className="after-venue">{venue}</p>
        <p className="after-thanks">
          ขอบคุณทุกคนที่มาร่วมเป็นส่วนหนึ่งของวันสำคัญของเรา
          <br />
          ความรักและกำลังใจจากทุกคนมีความหมายกับเรามาก
        </p>
        <p className="after-hashtag">{hashtag}</p>
      </section>

      <section className="album after-album">
        <h2 className="sec-title is-visible reveal">ALBUM</h2>
        <p className="gallery-sub is-visible reveal">Wedding Day</p>
        {albumError && <BusyNotice onRetry={retryAlbum} />}
        <div className="album-grid album-grid--preview">
          {album === null &&
            Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="album-item skeleton" aria-hidden="true" />
            ))}
          {PREVIEW.map((p, i) => (
            <a key={i} href="#/album" className="album-item skeleton" aria-label="เปิดอัลบั้ม" data-start-music>
              <SkeletonImg src={p.thumb} alt="" loading="lazy" decoding="async" />
            </a>
          ))}
        </div>
        <div className="album-actions">
          <a href="#/album" className="cal-btn album-cta" data-start-music>
            VIEW ALL PHOTOS
          </a>
          {ALBUM_ORIGINALS_URL && (
            <a
              href={ALBUM_ORIGINALS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="dir-btn"
            >
              DOWNLOAD ORIGINALS
            </a>
          )}
        </div>
      </section>

      <section className="after-links">
        <a href={gameUrl} target="_blank" rel="noopener noreferrer" className="after-link">
          PLAY OUR GAME
        </a>
        <a href="#/invite" className="after-link">
          VIEW INVITATION
        </a>
      </section>

      <footer className="wc-footer">
        <p className="footer-tag">with love</p>
        <p className="footer-names">
          {brideEn} &amp; {groomEn}
        </p>
      </footer>
    </div>
  );
}
