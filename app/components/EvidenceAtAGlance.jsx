import EvidenceBadge from './EvidenceBadge';

// Drop this near the top of any controversial article. Each prop is a short
// string or array of strings — keep entries to one sentence each.
export default function EvidenceAtAGlance({ established = [], disputed = [], ownerReports = [], unknown = [] }) {
  const Row = ({ type, label, items }) =>
    items.length > 0 && (
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <EvidenceBadge type={type}>{label}</EvidenceBadge>
        </div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: 'var(--ink-soft)' }}>
          {items.map((item, i) => (
            <li key={i} style={{ marginBottom: 4 }}>{item}</li>
          ))}
        </ul>
      </div>
    );

  return (
    <div
      style={{
        border: '1px solid var(--line)',
        borderRadius: 12,
        background: 'var(--card)',
        padding: '20px 24px',
        margin: '24px 0 32px',
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>Evidence at a glance</div>
      <Row type="fact" label="WHAT'S ESTABLISHED" items={established} />
      <Row type="industry" label="WHAT'S DISPUTED" items={disputed} />
      <Row type="owner_report" label="WHAT OWNERS REPORT" items={ownerReports} />
      <Row type="limited_evidence" label="WHAT REMAINS UNKNOWN" items={unknown} />
    </div>
  );
}
