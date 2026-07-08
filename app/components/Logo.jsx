export default function Logo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
      <defs>
        <clipPath id="ew-lens">
          <circle cx="30" cy="30" r="18" />
        </clipPath>
      </defs>
      <g clipPath="url(#ew-lens)">
        <rect x="17" y="34" width="7" height="12" fill="var(--ink-faint)" />
        <rect x="26" y="26" width="7" height="20" fill="var(--teal-deep)" />
        <rect x="35" y="18" width="7" height="28" fill="var(--teal)" />
      </g>
      <circle cx="30" cy="30" r="21" fill="none" stroke="var(--navy)" strokeWidth="4" />
      <line x1="45" y1="45" x2="56" y2="56" stroke="var(--navy)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
