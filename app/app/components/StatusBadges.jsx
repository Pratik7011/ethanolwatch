// Deliberately restrained — only "severe" leans toward warning color.
// Most badges stay neutral so the site doesn't read as alarmist.
const SEVERITY = {
  mild: { label: 'Mild', bg: 'var(--teal-soft)', fg: 'var(--teal-deep)' },
  moderate: { label: 'Moderate', bg: '#FBF0DE', fg: '#8A5A1E' },
  severe: { label: 'Severe', bg: '#F5E1DD', fg: '#A33F2B' },
};

const CONFIDENCE = {
  owner_suspected: { label: 'Owner suspected', bg: 'var(--card)', fg: 'var(--ink-soft)', border: true },
  mechanic_suggested: { label: 'Mechanic suggested', bg: 'var(--card)', fg: 'var(--ink-soft)', border: true },
  service_center_diagnosed: { label: 'Service centre diagnosed', bg: 'var(--teal-soft)', fg: 'var(--teal-deep)' },
  unknown: { label: 'Cause unknown', bg: 'var(--card)', fg: 'var(--ink-faint)', border: true },
};

function Badge({ config }) {
  if (!config) return null;
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 11.5,
        fontWeight: 600,
        padding: '3px 9px',
        borderRadius: 5,
        background: config.bg,
        color: config.fg,
        border: config.border ? '1px solid var(--line)' : 'none',
      }}
    >
      {config.label}
    </span>
  );
}

export function SeverityBadge({ level }) {
  return <Badge config={SEVERITY[level]} />;
}

export function ConfidenceBadge({ level }) {
  return <Badge config={CONFIDENCE[level]} />;
}
