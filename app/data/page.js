import SiteHeader from '../components/SiteHeader';
import IndiaMap from '../components/IndiaMap';
import { getCategoryStats, getStateCounts, getTotalReports } from '../../lib/queries';

export const revalidate = 60;

export default async function DataPage() {
  const [categoryStats, stateCounts, totalCount] = await Promise.all([
    getCategoryStats(),
    getStateCounts(),
    getTotalReports(),
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
        <div className="data-list" style={{ marginBottom: 40 }}>
          {categoryStats.map((cat) => (
            <div className="data-row" key={cat.id}>
              <div>
                <h3>{cat.label}</h3>
                <p>{cat.count} reports</p>
              </div>
              <div style={{ height: 7, background: 'var(--line)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${cat.pct}%`, background: 'var(--teal)', borderRadius: 4 }} />
              </div>
              <span className="pct">{cat.pct}%</span>
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
      </main>
    </>
  );
}
