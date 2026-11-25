import { useEffect, useRef, useState } from "react";

// Put the audio file at public/audio/first-love.mp3
const MUSIC_SRC = "/audio/first-love.mp3";
const VOLUME = 0.5;
// Floating music toggle. Mounted once in <App>, so music keeps playing across pages.
// Browsers block autoplay with sound, so it starts on the visitor's first tap/click.
export default function MusicPlayer() {
  const audio = useRef(null);
  // true only after the visitor pauses the music themselves (this visit only)
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    a.volume = VOLUME;

    // Resolves true when playback started
    const tryPlay = () => {
      if (userPaused.current) return Promise.resolve(false);
      return a.play().then(
        () => true,
        (err) => {
          // NotAllowedError = waiting for a tap; anything else is worth knowing about
          if (err?.name !== "NotAllowedError") console.warn("[music] play failed:", err);
          return false;
        },
      );
    };
    tryPlay(); // works only if the browser allows autoplay

    // Browsers only allow sound after a real tap/click/key press. Keep listening
    // until one of them actually starts the music (a failed attempt must not give up).
    const events = ["pointerup", "touchend", "click", "keydown"];
    const stopListening = () =>
      events.forEach((e) => window.removeEventListener(e, unlock));
    function unlock() {
      tryPlay().then((ok) => ok && stopListening());
    }
    events.forEach((e) => window.addEventListener(e, unlock));

    // Buttons marked data-start-music always start the music when pressed
    const onClick = (e) => {
      if (e.target.closest?.("[data-start-music]")) tryPlay();
    };
    window.addEventListener("click", onClick);

    // Pause while the tab is hidden
    const onVis = () => {
      if (document.hidden) a.pause();
      else tryPlay();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stopListening();
      window.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      userPaused.current = false;
      a.play().catch(() => {});
    } else {
      userPaused.current = true;
      a.pause();
    }
  };

  return (
    <>
      <audio
        ref={audio}
        src={MUSIC_SRC}
        loop
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={(e) => {
          console.warn("[music] audio error", e.currentTarget.error);
          setMissing(true);
        }}
      />
      {!missing && (
        <button
          type="button"
          className={`music-btn${playing ? " is-playing" : ""}`}
          onClick={toggle}
          aria-label={playing ? "ปิดเพลง" : "เปิดเพลง"}
          aria-pressed={playing}
        >
          <span className="music-bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </button>
      )}
    </>
  );
}
