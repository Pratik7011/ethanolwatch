export default function Logo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
      <circle cx="32" cy="32" r="30" fill="var(--navy)" />
      <circle cx="32" cy="32" r="21" fill="none" stroke="var(--teal)" strokeWidth="3" />
      <circle cx="32" cy="14" r="5.5" fill="var(--teal-deep)" />
    </svg>
  );
}
