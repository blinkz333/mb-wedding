// Friendly message shown when photos can't be loaded (e.g. many visitors at once).
export default function BusyNotice({ onRetry, dark = false }) {
  return (
    <div className={`busy-notice${dark ? " busy-notice--dark" : ""}`} role="status">
      <p className="busy-notice-title">ขณะนี้มีผู้เข้าชมจำนวนมาก</p>
      <p className="busy-notice-sub">โปรดรอสักครู่</p>
      <button
        type="button"
        className="busy-notice-btn"
        onClick={(e) => {
          e.stopPropagation();
          onRetry();
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M17.65 6.35A7.96 7.96 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z" />
        </svg>
        รีเฟรช
      </button>
    </div>
  );
}
