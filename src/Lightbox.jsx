import { useEffect, useState } from "react";
import BusyNotice from "./BusyNotice.jsx";

// items: string[] | { full }[]   index: number   onChange(i) / onClose()
export default function Lightbox({ items, index, onChange, onClose }) {
  const count = items.length;
  const step = (d) => onChange((index + d + count) % count);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (count > 1 && e.key === "ArrowLeft")
        onChange((index + count - 1) % count);
      else if (count > 1 && e.key === "ArrowRight")
        onChange((index + 1) % count);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, count, onChange, onClose]);

  const cur = items[index];
  const full = typeof cur === "string" ? cur : cur.full || cur.thumb;
  const thumb = typeof cur === "string" ? cur : cur.thumb;
  const download = typeof cur === "string" ? null : cur.download;

  // Try the preview, then its alternate URL, and only then fall back to the small thumb.
  const alt = typeof cur === "string" ? null : cur.alt;
  const sources = [full, alt, thumb].filter((s, i, arr) => s && arr.indexOf(s) === i);
  const [fail, setFail] = useState({ key: null, n: 0 });
  const tried = fail.key === full ? fail.n : 0;
  const src = sources[Math.min(tried, sources.length - 1)];

  // Which src has finished loading (drives the skeleton → photo fade)
  const [loadedSrc, setLoadedSrc] = useState(null);
  const ready = loadedSrc === src;

  // All sources (even the thumb) failed → show the "busy" notice with a retry button
  const [dead, setDead] = useState(null);
  const [nonce, setNonce] = useState(0);
  const failedAll = dead === src;
  const retryPhoto = () => {
    setDead(null);
    setFail({ key: null, n: 0 });
    setNonce((n) => n + 1);
  };

  return (
    <div
      className="gm-lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="gm-lightbox-close"
        aria-label="ปิด"
        onClick={onClose}
      >
        ×
      </button>
      {count > 1 && (
        <>
          <button
            type="button"
            className="gm-lightbox-nav gm-lightbox-prev"
            aria-label="รูปก่อนหน้า"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            className="gm-lightbox-nav gm-lightbox-next"
            aria-label="รูปถัดไป"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
          >
            ›
          </button>
          <span className="gm-lightbox-count">
            {index + 1} / {count}
          </span>
        </>
      )}
      {/* shimmer placeholder while the photo loads */}
      {!ready && !failedAll && (
        <div className="gm-lb-skel skeleton" aria-hidden="true" />
      )}
      {failedAll && <BusyNotice dark onRetry={retryPhoto} />}
      <img
        key={`${src}-${nonce}`}
        src={src}
        alt=""
        className={`gm-lb-img${ready ? " is-ready" : ""}`}
        ref={(el) => {
          if (el && !ready && el.complete && el.naturalWidth) setLoadedSrc(src);
        }}
        onLoad={() => setLoadedSrc(src)}
        onClick={(e) => e.stopPropagation()}
        referrerPolicy="no-referrer"
        onError={() =>
          tried < sources.length - 1
            ? setFail({ key: full, n: tried + 1 })
            : setDead(src)
        }
      />
      {download && (
        <a
          className="gm-lightbox-orig"
          href={download}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="gm-dl-arrow" aria-hidden="true">↓</span> DOWNLOAD
        </a>
      )}
    </div>
  );
}
