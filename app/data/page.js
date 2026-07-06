import SiteHeader from '../components/SiteHeader';
import IndiaMap from '../components/IndiaMap';
import { getCategoryStats, getStateCounts, getTotalReports, getAllReports } from '../../lib/queries';
import { SeverityBadge, ConfidenceBadge } from '../components/StatusBadges';

const MIN_REPORTS_FOR_PERCENTAGES = 50;

const CATEGORY_LABELS = {
  mileage_drop: 'Mileage drop',
  engine_knocking: 'Engine knocking',
  fuel_pump: 'Fuel pump failure',
  seal_wear: 'Seal wear',
  warning_light: 'Warning light',
  corrosion: 'Corrosion',
  hard_start: 'Hard starting',
  other: 'Other',
};

const CONFIDENCE_LABELS = {
  owner_suspected: 'Owner suspected',
  mechanic_suggested: 'Mechanic suggested',
  service_center_diagnosed: 'Service centre diagnosed',
  unknown: 'Cause unknown',
};

export const revalidate = 60;

export default async function DataPage() {
  const [categoryStats, stateCounts, totalCount, allReports] = await Promise.all([
    getCategoryStats(),
    getStateCounts(),
    getTotalReports(),
    getAllReports(50),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="wrap" style={{ padding: '48px 32px 80px' }}>
        <div className="eyebrow"><span className="dotmark"></span>Data</div>
        <h1 style={{ fontSize: 32, margin: '12px 0 8px' }}>The full record</h1>
        <p className="lead" style={{ marginBottom: 32 }}>
          Every number here comes directly from submitted reports — nothing is estimated or
          extrapolated. {totalCount} reports collected so far.
        </p>

        <div style={{ marginBottom: 40 }}>
          <IndiaMap stateCounts={stateCounts} totalCount={totalCount} />
        </div>

        <h2 style={{ fontSize: 22, marginBottom: 16 }}>Issue frequency</h2>
        {totalCount < MIN_REPORTS_FOR_PERCENTAGES && (
          <div className="form-msg" style={{ background: 'var(--teal-soft)', color: 'var(--teal-deep)', marginBottom: 16 }}>
            <strong>Early data collection phase.</strong> Percentages become meaningful once we
            have a larger sample — below {MIN_REPORTS_FOR_PERCENTAGES} total reports, we show raw
            counts instead.
          </div>
        )}
        <div className="data-list" style={{ marginBottom: 40 }}>
          {categoryStats.map((cat) => (
            <div className="data-row" key={cat.id}>
              <div>
                <h3>{cat.label}</h3>
                <p>{cat.count} reports</p>
              </div>
              {totalCount >= MIN_REPORTS_FOR_PERCENTAGES ? (
                <>
                  <div style={{ height: 7, background: 'var(--line)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${cat.pct}%`, background: 'var(--teal)', borderRadius: 4 }} />
                  </div>
                  <span className="pct">{cat.pct}%</span>
                </>
              ) : (
                <>
                  <div></div>
                  <span className="pct">{cat.count}</span>
                </>
              )}
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, marginBottom: 16 }}>By state</h2>
        <div className="data-list">
          {Object.entries(stateCounts).sort((a, b) => b[1] - a[1]).map(([state, count]) => (
            <div className="data-row" key={state} style={{ gridTemplateColumns: '1fr 60px' }}>
              <h3 style={{ fontWeight: 600 }}>{state}</h3>
              <span className="pct">{count}</span>
            </div>
          ))}
          {Object.keys(stateCounts).length === 0 && (
            <div className="data-row"><p>No reports yet.</p></div>
          )}
        </div>

        <h2 style={{ fontSize: 22, margin: '40px 0 16px' }}>Individual reports</h2>
        <p className="lead" style={{ marginBottom: 20, maxWidth: 600 }}>
          Every submission, anonymized — no names, no contact details, just what was reported.
        </p>
        <div className="forum-list">
          {allReports.length === 0 && (
            <div className="forum-row"><span className="forum-title">No reports yet.</span></div>
          )}
          {allReports.map((r) => (
            <div key={r.id} className="forum-row" style={{ flexWrap: 'wrap', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div className="forum-title">
                  {r.vehicle_make} {r.vehicle_model} {r.vehicle_year ? `· ${r.vehicle_year}` : ''}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 6 }}>
                  <span className="hint">{r.city}, {r.state}{r.odometer_km ? ` · ${r.odometer_km.toLocaleString()} km` : ''}</span>
                  <SeverityBadge level={r.severity} />
                  {r.ethanol_confidence && <ConfidenceBadge level={r.ethanol_confidence} />}
                </div>
                {r.description && (
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6, maxWidth: 500 }}>
                    {r.description}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'flex-start' }}>
                {(r.issue_categories || []).map((c) => (
                  <span className="forum-tag" key={c}>{CATEGORY_LABELS[c] || c}</span>
                ))}
              </div>
              <span className="forum-meta" style={{ width: 90 }}>
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
