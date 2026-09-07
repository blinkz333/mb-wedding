import { useState, useEffect } from "react";
import "./App.css";
import coupleImg from "./assets/imgs/couple-circle.webp";
import scheduleImg from "./assets/imgs/schedule.jpg";

// Auto-import every image dropped into src/assets/gallery/
const galleryModules = import.meta.glob(
  "./assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, import: "default" },
);
const GALLERY_IMAGES = Object.keys(galleryModules)
  .sort()
  .map((k) => galleryModules[k]);
// Fallback so the section still looks alive before photos are added
const GALLERY = GALLERY_IMAGES.length
  ? GALLERY_IMAGES
  : [coupleImg, scheduleImg, coupleImg, scheduleImg];

// ─── Wedding Configuration ──────────────────────────────────
const WEDDING_DATE = new Date("2026-11-14T13:29:00");
const BRIDE_TH = "นางสาว ณัฐภัสสร เอี่ยมละออ";
const GROOM_TH = "นาย สุทธิพงษ์ ตั้งประเสริฐพานิช";
const BRIDE_EN = "Natphatson";
const GROOM_EN = "Sutthipong";
const VENUE_NAME = "NT Grand Ballroom";
const VENUE_ADDRESS = "99 ถ.แจ้งวัฒนะ ทุ่งสองห้อง หลักสี่ กรุงเทพมหานคร 10210";
const MAPS_DIRECTION = "https://maps.app.goo.gl/TH6jPpHhj3kuEHXW6";
const MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.5039!2d100.5658761!3d13.8821799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e283203f6584e9%3A0x739ac935a9dba39c!2sNT%20Grand%20Ballroom!5e0!3m2!1sth!2sth!4v1749553040000!5m2!1sth!2sth";
const HASHTAG = "#BMWeddingday";
const DRESS_CODE = ["#7A1228", "#C4907A", "#8B7355"];
const SCHEDULE = [
  { time: "13.29 น.", event: "พิธีแห่ขันหมาก" },
  { time: "14.09 น.", event: "พิธีหมั้น" },
  { time: "18.09 น.", event: "ฉลองมงคลสมรส\n(โต๊ะจีน)" },
  { time: "21.00 น.", event: "After Party" },
];

// ─── Countdown Hook ─────────────────────────────────────────
function useCountdown(target) {
  const calc = () => {
    const diff = Math.max(0, target - Date.now());
    const s = Math.floor(diff / 1000);
    return {
      weeks: Math.floor(s / (7 * 86400)),
      days: Math.floor((s % (7 * 86400)) / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

// ─── ICS Calendar Download ──────────────────────────────────
function downloadICS() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NS Wedding 2026//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "DTSTART;TZID=Asia/Bangkok:20261114T132900",
    "DTEND;TZID=Asia/Bangkok:20261114T210000",
    `SUMMARY:งานแต่งงาน ${BRIDE_EN} & ${GROOM_EN}`,
    `LOCATION:${VENUE_NAME}\\, ${VENUE_ADDRESS}`,
    `DESCRIPTION:We are delighted to invite you to the wedding of ${BRIDE_EN} & ${GROOM_EN}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: "NS-Wedding-2026.ics",
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── SVG: Compass Rose ──────────────────────────────────────
function CompassRose() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="compass-rose"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <circle
        cx="50"
        cy="50"
        r="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.4"
        strokeDasharray="2 4"
      />
      {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map((a) => {
        const rad = (a * Math.PI) / 180;
        const x1 = 50 + 46 * Math.cos(rad),
          y1 = 50 + 46 * Math.sin(rad);
        const x2 = 50 - 46 * Math.cos(rad),
          y2 = 50 - 46 * Math.sin(rad);
        return (
          <line
            key={a}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth={a % 45 === 0 ? "0.7" : "0.3"}
          />
        );
      })}
      {/* North arrow (filled) */}
      <polygon points="50,4 46.5,30 50,24 53.5,30" fill="currentColor" />
      {/* S/E/W (outline) */}
      <polygon
        points="50,96 46.5,70 50,76 53.5,70"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <polygon
        points="96,50 70,46.5 76,50 70,53.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <polygon
        points="4,50 30,46.5 24,50 30,53.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <circle
        cx="50"
        cy="50"
        r="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="50" cy="50" r="2" fill="currentColor" />
      <text
        x="50"
        y="17"
        textAnchor="middle"
        fontSize="7"
        fill="currentColor"
        fontFamily="serif"
        letterSpacing="1"
      >
        N
      </text>
      <text
        x="50"
        y="97"
        textAnchor="middle"
        fontSize="6"
        fill="currentColor"
        fontFamily="serif"
      >
        S
      </text>
      <text
        x="94"
        y="53"
        textAnchor="middle"
        fontSize="6"
        fill="currentColor"
        fontFamily="serif"
      >
        E
      </text>
      <text
        x="6"
        y="53"
        textAnchor="middle"
        fontSize="6"
        fill="currentColor"
        fontFamily="serif"
      >
        W
      </text>
    </svg>
  );
}

// ─── SVG: NS Monogram ────────────────────────────────────────
function NSMonogram({ size = 70, primaryColor = "#C9A470", className = "" }) {
  return (
    <svg
      viewBox="0 0 90 100"
      width={size}
      height={size}
      className={`ns-monogram ${className}`}
      aria-hidden="true"
    >
      {/* N */}
      <text
        x="2"
        y="82"
        fontSize="76"
        fontFamily="'Playfair Display', serif"
        fontWeight="400"
        fill={primaryColor}
        fontStyle="italic"
        opacity="0.95"
      >
        N
      </text>
      {/* S – overlapping right side */}
      <text
        x="38"
        y="88"
        fontSize="76"
        fontFamily="'Playfair Display', serif"
        fontWeight="400"
        fill={primaryColor}
        fontStyle="italic"
        opacity="0.95"
      >
        S
      </text>
    </svg>
  );
}

// ─── SVG: Thailand Stamp ─────────────────────────────────────
function ThailandStamp() {
  return (
    <svg
      viewBox="0 0 160 160"
      className="stamp-svg"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="80"
        cy="80"
        r="74"
        fill="none"
        stroke="#7A1228"
        strokeWidth="2.5"
        strokeDasharray="6 4"
      />
      <circle
        cx="80"
        cy="80"
        r="65"
        fill="none"
        stroke="#7A1228"
        strokeWidth="1.2"
      />
      <defs>
        {/* counterclockwise = top half of circle, text reads left→right along the top */}
        <path id="topCircle" d="M 15,80 A 65,65 0 0,0 145,80" />
        {/* clockwise = bottom half of circle, text reads left→right along the bottom */}
        <path id="botCircle" d="M 15,80 A 65,65 0 0,1 145,80" />
      </defs>
      <text
        fontSize="11"
        fill="#7A1228"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="600"
        letterSpacing="3"
      >
        <textPath href="#topCircle" startOffset="12%">
          THAILAND — TH
        </textPath>
      </text>
      <text
        fontSize="10"
        fill="#7A1228"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="500"
        letterSpacing="2"
      >
        <textPath href="#botCircle" startOffset="10%">
          LOVE IS IN THE AIR
        </textPath>
      </text>
      {/* Airplane */}
      <text x="80" y="90" textAnchor="middle" fontSize="32" fill="#7A1228">
        ✈
      </text>
    </svg>
  );
}

// ─── SVG: Airmail Stamp ──────────────────────────────────────
function AirmailStamp() {
  return (
    <svg
      viewBox="0 0 200 140"
      className="stamp-svg stamp-airmail-svg"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="194"
        height="134"
        rx="4"
        fill="none"
        stroke="#A09488"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      <rect
        x="12"
        y="12"
        width="176"
        height="116"
        rx="3"
        fill="none"
        stroke="#A09488"
        strokeWidth="1"
      />
      {/* Globe */}
      <circle
        cx="100"
        cy="65"
        r="35"
        fill="none"
        stroke="#A09488"
        strokeWidth="1.5"
      />
      <ellipse
        cx="100"
        cy="65"
        rx="18"
        ry="35"
        fill="none"
        stroke="#A09488"
        strokeWidth="1"
      />
      <line x1="65" y1="65" x2="135" y2="65" stroke="#A09488" strokeWidth="1" />
      <ellipse
        cx="100"
        cy="65"
        rx="35"
        ry="12"
        fill="none"
        stroke="#A09488"
        strokeWidth="1"
      />
      {/* Wavy lines */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M 20 ${108 + i * 8} Q 55 ${105 + i * 8} 90 ${108 + i * 8} Q 130 ${111 + i * 8} 165 ${108 + i * 8} Q 185 ${106 + i * 8} 195 ${108 + i * 8}`}
          stroke="#A09488"
          strokeWidth="1.2"
          fill="none"
        />
      ))}
    </svg>
  );
}

// ─── SVG: Arrive Visit Pass (triangle) ──────────────────────
function ArriveStamp() {
  return (
    <svg
      viewBox="0 0 180 160"
      className="stamp-svg"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="90,10 10,148 170,148"
        fill="none"
        stroke="#A09488"
        strokeWidth="2.5"
        strokeDasharray="5 4"
      />
      <polygon
        points="90,24 22,138 158,138"
        fill="none"
        stroke="#A09488"
        strokeWidth="1"
      />
      <text x="90" y="90" textAnchor="middle" fontSize="22" fill="#A09488">
        ✈
      </text>
      <text
        x="90"
        y="112"
        textAnchor="middle"
        fontSize="11"
        fill="#A09488"
        fontFamily="'Montserrat', monospace"
        fontWeight="600"
        letterSpacing="2"
      >
        ARRIVE
      </text>
      <text
        x="90"
        y="130"
        textAnchor="middle"
        fontSize="10"
        fill="#A09488"
        fontFamily="'Montserrat', monospace"
        letterSpacing="1"
      >
        VISIT PASS
      </text>
    </svg>
  );
}

// ─── SVG: HK Stamp ───────────────────────────────────────────
function HKStamp() {
  return (
    <svg
      viewBox="0 0 160 110"
      className="stamp-svg"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="154"
        height="104"
        rx="3"
        fill="none"
        stroke="#A09488"
        strokeWidth="2"
      />
      <text
        x="80"
        y="24"
        textAnchor="middle"
        fontSize="8"
        fill="#A09488"
        fontFamily="monospace"
      >
        VISITOR - Permitted to remain
      </text>
      <text
        x="80"
        y="37"
        textAnchor="middle"
        fontSize="8"
        fill="#A09488"
        fontFamily="monospace"
      >
        for ___ days from date of entry
      </text>
      <text
        x="80"
        y="50"
        textAnchor="middle"
        fontSize="8"
        fill="#A09488"
        fontFamily="monospace"
      >
        IMMIGRATION
      </text>
      <line
        x1="15"
        y1="56"
        x2="145"
        y2="56"
        stroke="#A09488"
        strokeWidth="0.8"
      />
      <text
        x="80"
        y="72"
        textAnchor="middle"
        fontSize="13"
        fill="#A09488"
        fontFamily="monospace"
        fontWeight="bold"
      >
        HONG KONG
      </text>
      <text
        x="80"
        y="87"
        textAnchor="middle"
        fontSize="11"
        fill="#A09488"
        fontFamily="monospace"
      >
        13APR1960
      </text>
      <text
        x="80"
        y="101"
        textAnchor="middle"
        fontSize="8"
        fill="#A09488"
        fontFamily="monospace"
      >
        IMMIGRATION (6957)
      </text>
    </svg>
  );
}

// ─── SVG: Schedule Icons ─────────────────────────────────────
function ScheduleIcon({ index }) {
  const drawings = [
    // พิธีแห่ขันหมาก – fan/tray
    <g key="0">
      <path
        d="M50,30 L30,65 M50,30 L40,68 M50,30 L50,70 M50,30 L60,68 M50,30 L70,65"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse
        cx="50"
        cy="72"
        rx="22"
        ry="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="28"
        y1="72"
        x2="72"
        y2="72"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </g>,
    // พิธีหมั้น – rings
    <g key="1">
      <circle
        cx="40"
        cy="52"
        r="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle
        cx="60"
        cy="52"
        r="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    </g>,
    // โต๊ะจีน – chopsticks/bowl
    <g key="2">
      <ellipse
        cx="50"
        cy="62"
        rx="22"
        ry="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M28,62 Q50,40 72,62"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="38"
        y1="38"
        x2="34"
        y2="28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="35"
        x2="50"
        y2="25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="62"
        y1="38"
        x2="66"
        y2="28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>,
    // After Party – clinking glasses
    <g key="3">
      <path
        d="M38,30 L32,58 L44,58 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="38"
        y1="58"
        x2="38"
        y2="72"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="30"
        y1="72"
        x2="46"
        y2="72"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M62,30 L56,58 L68,58 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="62"
        y1="58"
        x2="62"
        y2="72"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="54"
        y1="72"
        x2="70"
        y2="72"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M44,34 L56,34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>,
  ];
  return (
    <svg viewBox="0 0 100 100" className="sched-icon-svg" aria-hidden="true">
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="#FAF7F2"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      {drawings[index]}
    </svg>
  );
}

// ─── Mobile Nav Icons ────────────────────────────────────────
const IconHome = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V8h14v11z" />
  </svg>
);
const IconLocation = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const IconCamera = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M9 3 7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  </svg>
);

// ─── Main App ────────────────────────────────────────────────
export default function App() {
  const time = useCountdown(WEDDING_DATE);
  const [activeSection, setActiveSection] = useState("hero");
  const [prevTime, setPrevTime] = useState(time);
  const [flipped, setFlipped] = useState({});
  const [lightbox, setLightbox] = useState(null);

  // Close lightbox on Escape
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => e.key === "Escape" && setLightbox(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  // Active-section tracker
  useEffect(() => {
    const ids = ["hero", "invitation", "schedule", "gallery", "location"];
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  // Scroll-reveal observer
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-visible");
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Countdown flip detector
  useEffect(() => {
    const keys = ["weeks", "days", "hours", "minutes", "seconds"];
    const changed = {};
    keys.forEach((k) => {
      if (time[k] !== prevTime[k]) changed[k] = true;
    });
    if (Object.keys(changed).length) {
      setFlipped(changed);
      setPrevTime(time);
      const t = setTimeout(() => setFlipped({}), 300);
      return () => clearTimeout(t);
    }
  }, [time]);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="wc">
      {/* ══════════ HEADER – Boarding Pass ══════════ */}
      <header className="bp-header">
        <div className="bp-left">
          <div className="bp-field">
            <span className="bp-label">CLASS</span>
            <span className="bp-value">SPECIAL</span>
          </div>
          <div className="bp-sep" />
          <div className="bp-field">
            <span className="bp-label">FLIGHT</span>
            <span className="bp-value">14112026</span>
          </div>
        </div>
        <div className="bp-right">
          <CompassRose />
          <NSMonogram size={52} primaryColor="#C9A470" className="bp-mono" />
        </div>
      </header>

      {/* ══════════ HERO – World Map + Names ══════════ */}
      <section id="hero" className="hero">
        {/* World map watermark */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
          className="world-map"
          alt=""
          aria-hidden="true"
          loading="eager"
        />

        {/* Stamps */}
        <div className="stamp stamp-left">
          <AirmailStamp />
        </div>
        <div className="stamp stamp-th">
          <ThailandStamp />
        </div>
        <div className="stamp stamp-tri">
          <ArriveStamp />
        </div>
        <div className="stamp stamp-hk">
          <HKStamp />
        </div>
        <div className="visa-label">VISA STAMPS</div>

        {/* Calligraphic names */}
        <div className="hero-names">
          <div className="script-name bride-script hero-slide-left">
            {BRIDE_EN}
          </div>
          <div className="script-name groom-script hero-slide-right">
            {GROOM_EN}
          </div>
        </div>
      </section>

      {/* ══════════ BOARDING TEXT ══════════ */}
      <div className="bp-text-bar">
        <h2 className="bp-main-title">FIRST CLASS, BOARDING PASS</h2>
        <p className="bp-sub-title">WELCOME TO THE WEDDING OF</p>
      </div>

      {/* ══════════ INVITATION ══════════ */}
      <section id="invitation" className="invitation">
        <p className="honour-line reveal">
          THE HONOUR OF YOUR PRESENCE IS REQUESTED
        </p>
        <p className="honour-line reveal" style={{ transitionDelay: "0.1s" }}>
          AT THE MARRIAGE CELEBRATION OF
        </p>

        <div className="couple-photo reveal" style={{ transitionDelay: "0.2s" }}>
          <img
            src={coupleImg}
            alt={`${BRIDE_TH} & ${GROOM_TH}`}
            loading="lazy"
          />
        </div>

        <div className="couple-row reveal" style={{ transitionDelay: "0.3s" }}>
          <div className="person-card">
            <span className="role-script">Bride</span>
            <span className="person-th">{BRIDE_TH}</span>
          </div>
          <div className="person-card">
            <span className="role-script">Groom</span>
            <span className="person-th">{GROOM_TH}</span>
          </div>
        </div>

        <div
          className="inv-mono-wrap reveal"
          style={{ transitionDelay: "0.3s" }}
        >
          <NSMonogram size={96} primaryColor="#B8A08C" />
        </div>

        <p
          className="celebrate-line reveal"
          style={{ transitionDelay: "0.1s" }}
        >
          LET&apos;S CELEBRATE TOGETHER ON
        </p>
        <p
          className="celebrate-line reveal"
          style={{ transitionDelay: "0.2s" }}
        >
          OUR SPECIAL DAY ON
        </p>

        <p
          className="wedding-date-big reveal"
          style={{ transitionDelay: "0.3s" }}
        >
          <span>14</span>
          <span className="date-mon">NOV</span>
          <span>26</span>
        </p>

        <div className="countdown reveal" style={{ transitionDelay: "0.4s" }}>
          {[
            { v: time.weeks, k: "weeks", l: "WEEKS" },
            { v: time.days, k: "days", l: "DAYS" },
            { v: time.hours, k: "hours", l: "HOURS" },
            { v: time.minutes, k: "minutes", l: "MIN" },
            { v: time.seconds, k: "seconds", l: "SEC" },
          ].map(({ v, l, k }) => (
            <div key={l} className="cd-item">
              <span className={`cd-val${flipped[k] ? " cd-flip" : ""}`}>
                {String(v).padStart(2, "0")}
              </span>
              <span className="cd-lbl">{l}</span>
            </div>
          ))}
        </div>

        <button
          className="cal-btn reveal"
          style={{ transitionDelay: "0.5s" }}
          onClick={downloadICS}
          type="button"
        >
          ADD TO CALENDAR
        </button>
      </section>

      {/* ══════════ SCHEDULE ══════════ */}
      <section id="schedule" className="schedule">
        <h2 className="sec-title reveal">SCHEDULE</h2>

        <div className="schedule-photo reveal">
          <img src={scheduleImg} alt="Save the date" loading="lazy" />
        </div>

        <div className="timeline">
          {SCHEDULE.map((item, i) => (
            <div key={i} className="tl-item tl-above">
              <div className="tl-time-top">{item.time}</div>
              <div className="tl-icon">
                <ScheduleIcon index={i} />
              </div>
              <div className="tl-event">{item.event}</div>
            </div>
          ))}
        </div>

        {/* Flight path line */}
        <div className="flight-row">
          <span className="flight-plane">✈</span>
          <div className="flight-line" />
          <span className="flight-pin">
            <IconPin />
          </span>
        </div>

        {/* Hashtag + Dress Code */}
        <div className="extras-row">
          <div className="extras-hashtag">
            <p className="extras-lbl">HASHTAG</p>
            <div className="hashtag-box">{HASHTAG}</div>
          </div>
          <div className="extras-dress">
            <p className="extras-lbl">DRESS CODE :</p>
            <div className="color-dots">
              {DRESS_CODE.map((c) => (
                <span
                  key={c}
                  className="color-dot"
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ GALLERY ══════════ */}
      <section id="gallery" className="gallery">
        <h2 className="sec-title reveal">GALLERY</h2>
        <p className="gallery-sub reveal">Pre-Wedding</p>

        <div className="gallery-marquee reveal">
          {[
            GALLERY.filter((_, i) => i % 2 === 0),
            GALLERY.filter((_, i) => i % 2 === 1),
          ].map((row, r) => (
            <div
              key={r}
              className={`gm-row ${r === 0 ? "gm-row--ltr" : "gm-row--rtl"}`}
            >
              {[...row, ...row].map((src, i) => (
                <button
                  key={i}
                  type="button"
                  className="gm-item"
                  onClick={() => setLightbox(src)}
                  aria-label="ดูรูปขนาดเต็ม"
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          ))}
        </div>
      </section>

      {lightbox && (
        <div
          className="gm-lightbox"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="gm-lightbox-close"
            aria-label="ปิด"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <img src={lightbox} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* ══════════ LOCATION ══════════ */}
      <section id="location" className="location">
        <div className="venue-header reveal">
          <IconPin />
          <p className="venue-sub">The Venue</p>
          <h2 className="venue-name">{VENUE_NAME}</h2>
        </div>

        <div className="map-wrap">
          <iframe
            src={MAPS_EMBED}
            title={VENUE_NAME}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="location-footer">
          <p className="addr">
            <IconPin />
            <span>{VENUE_ADDRESS}</span>
          </p>
          <a
            href={MAPS_DIRECTION}
            target="_blank"
            rel="noopener noreferrer"
            className="dir-btn"
          >
            DIRECTION
          </a>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="wc-footer">
        <p className="footer-tag">made with ❤︎ for</p>
        <p className="footer-names">
          {BRIDE_EN} &amp; {GROOM_EN}
        </p>
      </footer>

      {/* ══════════ MOBILE BOTTOM NAV ══════════ */}
      <nav className="bottom-nav" aria-label="เมนูหลัก">
        {[
          { id: "hero", Icon: IconHome, label: "Home" },
          { id: "schedule", Icon: IconCalendar, label: "Program" },
          { id: "gallery", Icon: IconCamera, label: "Gallery" },
          { id: "location", Icon: IconLocation, label: "Location" },
        ].map(({ id, Icon, label }) => (
          <button
            key={id}
            className={`bnav-btn ${activeSection === id || (id === "invitation" && activeSection === "invitation") ? "bnav-active" : ""}`}
            onClick={() => scrollTo(id)}
            type="button"
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
