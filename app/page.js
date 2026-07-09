import SiteHeader from './components/SiteHeader';
import LiveTicker from './components/LiveTicker';
import IndiaMap from './components/IndiaMap';
import Link from 'next/link';
import {
  getCategoryStats,
  getRecentReports,
  getStateCounts,
  getTotalReports,
  getRecentThreads,
} from '../lib/queries';

const MIN_REPORTS_FOR_PERCENTAGES = 50;

export const revalidate = 60;

export default async function HomePage() {
  const [categoryStats, recentReports, stateCounts, totalCount, threads] = await Promise.all([
    getCategoryStats(),
    getRecentReports(6),
    getStateCounts(),
    getTotalReports(),
    getRecentThreads(3),
  ]);

  return (
    <>
      <LiveTicker initialReports={recentReports} totalCount={totalCount} />
      <SiteHeader />

      <div className="band band-hero">
        <main className="wrap">
          <section className="hero">
            <div className="hero-top">
              <div>
                <div className="eyebrow">
                  <span className="dotmark"></span>India · E20 fuel tracker · Est. 2026
                </div>
                <h1>An independent record of what E20 fuel is doing to Indian vehicles.</h1>
                <p className="lead">
                  Structured, owner-submitted reports on mileage, engine wear, and fuel-system
                  failures — organised so patterns are visible, not anecdotal.
                </p>
                <div className="hero-ctas">
                  <Link href="/report" className="btn btn-fill">Report your issue</Link>
                  <Link href="/data" className="btn btn-line">Explore the data</Link>
                </div>
              </div>
              <IndiaMap stateCounts={stateCounts} totalCount={totalCount} />
            </div>
          </section>
        </main>
      </div>

      <div className="band band-card">
        <div className="wrap">
          <section className="block" style={{ paddingTop: 40, paddingBottom: 40 }}>
            <div className="how-it-works-grid">
              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}><span className="dotmark"></span>01</div>
                <h3 style={{ fontSize: 16, marginBottom: 6 }}>Report your experience</h3>
                <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
                  Two minutes, structured fields — vehicle, city, what happened. No account needed.
                </p>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}><span className="dotmark"></span>02</div>
                <h3 style={{ fontSize: 16, marginBottom: 6 }}>It joins the public record</h3>
                <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
                  Every submission is anonymized and added to the live map and category data instantly.
                </p>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}><span className="dotmark"></span>03</div>
                <h3 style={{ fontSize: 16, marginBottom: 6 }}>Patterns become visible</h3>
                <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
                  As reports accumulate, real patterns — by vehicle, region, and issue type — emerge from the noise.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="band band-paper">
        <div className="wrap">
          <section className="block">
            <div className="section-head">
              <div className="eyebrow"><span className="dotmark"></span>Findings to date</div>
              <h2>Issue frequency by category</h2>
              <p>Owner-reported issues, by category. Not a diagnosis of cause.</p>
            </div>
            {totalCount < MIN_REPORTS_FOR_PERCENTAGES && (
              <div className="form-msg" style={{ background: 'var(--teal-soft)', color: 'var(--teal-deep)', marginBottom: 16 }}>
                <strong>Early data collection phase.</strong> We're building India's independent
                record of owner-reported E20 experiences. Findings become statistically meaningful
                as more verified reports come in — for now we show raw counts, not percentages.
              </div>
            )}
            <div className="data-list">
              {categoryStats.length === 0 && (
                <div className="data-row"><p>No reports yet — be the first to submit one.</p></div>
              )}
              {categoryStats.map((cat) => (
                <div className="data-row" key={cat.id}>
                  <div>
                    <h3>{cat.label}</h3>
                    <p>{cat.description}</p>
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
                      <span className="pct">{cat.count} report{cat.count === 1 ? '' : 's'}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="band band-card">
        <div className="wrap">
          <section className="block">
            <div className="section-head">
              <div className="eyebrow"><span className="dotmark"></span>Discussion</div>
              <h2>Recent forum activity</h2>
              <p>Organised by vehicle brand and issue type.</p>
            </div>
            <div className="forum-list">
              {threads.length === 0 && (
                <div className="forum-row"><span className="forum-title">No threads yet — start the first discussion.</span></div>
              )}
              {threads.map((t) => (
                <Link href={`/forum/${t.id}`} className="forum-row" key={t.id}>
                  <span className="dotmark"></span>
                  <span className="forum-title">{t.title}</span>
                  <span className="forum-tag">{t.category_id.replace('_', ' ')}</span>
                  <span className="forum-meta">{new Date(t.created_at).toLocaleDateString()}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="band band-navy">
        <div className="wrap">
          <section className="cta-band">
            <h2>Add your report to the record — it takes about two minutes.</h2>
            <Link href="/report" className="btn btn-fill">Report your issue</Link>
          </section>
        </div>
      </div>

      <div className="band band-card">
        <footer className="wrap">
          <span>EthanolWatch — independent community record.</span>
          <span className="mono">DATA · EVIDENCE · TRANSPARENCY</span>
        </footer>
      </div>
    </>
  );
}
