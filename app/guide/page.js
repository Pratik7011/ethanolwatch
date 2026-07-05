import SiteHeader from '../components/SiteHeader';

const SECTIONS = [
  {
    title: 'What is ethanol blending?',
    body: "Ethanol-blended petrol mixes regular petrol with ethanol, usually produced from sugarcane or grain. India's fuel policy has moved from E10 (10% ethanol) toward E20 (20% ethanol) at most pumps as part of a push to cut oil imports and emissions.",
  },
  {
    title: 'Which parts are actually vulnerable?',
    body: 'Ethanol is more corrosive to certain rubber and plastic components than pure petrol, and it holds more moisture. Older fuel lines, carburetor seals (common in older two-wheelers), and some fuel pump gaskets not designed for higher ethanol content are the parts most commonly affected. Vehicles built or updated for E20 compatibility use ethanol-resistant materials in these components.',
  },
  {
    title: 'Is my vehicle flex-fuel (FFV) rated?',
    body: "Check your owner's manual or fuel filler cap sticker. Manufacturers selling FFV-rated models in India label them explicitly. If yours isn't rated for E20, it may still run on it, but the manufacturer's warranty terms around fuel-related wear may not apply.",
  },
  {
    title: 'Maintenance tips',
    body: 'Owners commonly report fewer issues when fuel filters and fuel-line seals are checked at shorter intervals than the standard schedule, and when the tank isn\u2019t left near-empty for long periods (ethanol\u2019s moisture affinity is more of a problem in mostly-empty tanks).',
  },
  {
    title: 'Methodology',
    body: 'Every statistic on this site comes from structured reports submitted directly by vehicle owners through the Report page — nothing is estimated, scraped, or purchased. Reports are self-selected (people experiencing problems are more likely to report than people who aren\u2019t), so treat the percentages as "share of reports," not "share of all vehicles on E20."',
  },
];

export default function GuidePage() {
  return (
    <>
      <SiteHeader />
      <main className="wrap" style={{ padding: '48px 32px 80px', maxWidth: 720 }}>
        <div className="eyebrow"><span className="dotmark"></span>Guide</div>
        <h1 style={{ fontSize: 32, margin: '12px 0 24px' }}>Ethanol blending, explained</h1>
        {SECTIONS.map((s) => (
          <div key={s.title} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 18, marginBottom: 8 }}>{s.title}</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 15 }}>{s.body}</p>
          </div>
        ))}
      </main>
    </>
  );
}
