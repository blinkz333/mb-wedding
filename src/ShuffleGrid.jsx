import { useEffect, useRef, useState } from "react";
import SkeletonImg from "./SkeletonImg.jsx";

const MIN_MS = 5000; // each tile swaps its photo every 5–7 s, independently
const MAX_MS = 7000;
const FX_COUNT = 3; // number of different swap animations (see .tile-fx-* in CSS)
const SWAP_MS = 1100; // keep in sync with the CSS animation length

const rand = (min, max) => min + Math.random() * (max - min);

function sample(pool, n) {
  const idx = new Set();
  while (idx.size < Math.min(n, pool.length)) {
    idx.add(Math.floor(Math.random() * pool.length));
  }
  return [...idx].map((i) => pool[i]);
}

function Tile({ initial, pickNew, release, canSwap }) {
  const [front, setFront] = useState(initial);
  const [back, setBack] = useState(null);
  const [fx, setFx] = useState(0);
  const frontRef = useRef(initial);

  useEffect(() => {
    if (!canSwap) return;
    let alive = true;
    let timer;

    const schedule = (first) => {
      // first swap starts at a random moment so tiles never change together
      timer = setTimeout(swap, first ? rand(1500, MAX_MS) : rand(MIN_MS, MAX_MS));
    };

    const swap = () => {
      if (!alive) return;
      if (document.hidden) return schedule(false);
      const next = pickNew();
      if (!next) return schedule(false);
      const img = new Image();
      img.onload = () => {
        if (!alive) return release(next);
        setFx(Math.floor(Math.random() * FX_COUNT));
        setBack(next);
        timer = setTimeout(() => {
          if (!alive) return;
          release(frontRef.current);
          frontRef.current = next;
          setFront(next);
          setBack(null);
          schedule(false);
        }, SWAP_MS);
      };
      img.onerror = () => {
        release(next);
        if (alive) schedule(false);
      };
      img.src = next.thumb;
    };

    schedule(true);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [canSwap, pickNew, release]);

  return (
    <a
      href="#/album"
      className="album-item skeleton"
      aria-label="เปิดอัลบั้ม"
      data-start-music
    >
      <SkeletonImg src={front.thumb} alt="" loading="lazy" decoding="async" />
      {back && (
        <img
          key={back.thumb}
          className={`tile-in tile-fx-${fx}`}
          src={back.thumb}
          alt=""
        />
      )}
    </a>
  );
}

// Renders `count` grid tiles (as a fragment, inside an .album-grid) that show random
// photos from the album and swap them one at a time.
export default function ShuffleGrid({ photos, count = 10 }) {
  const [state] = useState(() => {
    const initial = sample(photos, count);
    return { initial, shown: new Set(initial.map((p) => p.thumb)) };
  });
  const { initial, shown } = state;
  const canSwap = photos.length > count;

  // stable callbacks so tiles don't restart their timers on re-render
  // (the album list never changes while mounted – a reload remounts this component)
  const [api] = useState(() => ({
    pickNew() {
      const pool = photos;
      for (let i = 0; i < 30; i++) {
        const p = pool[Math.floor(Math.random() * pool.length)];
        if (!shown.has(p.thumb)) {
          shown.add(p.thumb);
          return p;
        }
      }
      return null;
    },
    release(p) {
      if (p) shown.delete(p.thumb);
    },
  }));

  return initial.map((p) => (
    <Tile
      key={p.thumb}
      initial={p}
      pickNew={api.pickNew}
      release={api.release}
      canSwap={canSwap}
    />
  ));
}
