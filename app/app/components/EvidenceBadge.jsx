// Evidence-type labels for use in article content — deliberately muted,
// not alarm-colored, since most of these are neutral classifications rather
// than warnings. Only "owner_report" leans warm since it's the least verified.
const TYPES = {
  fact: { label: 'ESTABLISHED FACT', bg: 'var(--teal-soft)', fg: 'var(--teal-deep)' },
  government: { label: 'GOVERNMENT POSITION', bg: 'color-mix(in srgb, var(--navy) 10%, var(--card))', fg: 'var(--navy)' },
  owner_report: { label: 'OWNER REPORT', bg: '#FBF0DE', fg: '#8A5A1E' },
  industry: { label: 'INDUSTRY POSITION', bg: 'color-mix(in srgb, var(--ink-faint) 18%, var(--card))', fg: 'var(--ink-soft)' },
  analysis: { label: 'ETHANOLWATCH ANALYSIS', bg: 'var(--card)', fg: 'var(--ink)' },
  limited_evidence: { label: 'LIMITED EVIDENCE', bg: '#F3E8E4', fg: '#8A4A32' },
};

export default function EvidenceBadge({ type = 'analysis', children }) {
  const style = TYPES[type] || TYPES.analysis;
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: '0.06em',
        padding: '4px 9px',
        borderRadius: 5,
        background: style.bg,
        color: style.fg,
        border: type === 'analysis' ? '1px solid var(--line)' : 'none',
      }}
    >
      {children || style.label}
    </span>
  );
}
