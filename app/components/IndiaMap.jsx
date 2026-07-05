// Static approximate coordinates on a 300x320 viewBox outline of India.
// Not survey-accurate — good enough for a "where are reports coming from" glance.
const STATE_COORDS = {
  'Maharashtra': { x: 130, y: 190 },
  'Delhi': { x: 145, y: 90 },
  'Karnataka': { x: 125, y: 235 },
  'Tamil Nadu': { x: 140, y: 270 },
  'Uttar Pradesh': { x: 165, y: 100 },
  'Gujarat': { x: 90, y: 165 },
  'Rajasthan': { x: 110, y: 120 },
  'West Bengal': { x: 210, y: 170 },
  'Telangana': { x: 150, y: 215 },
  'Kerala': { x: 120, y: 285 },
  'Punjab': { x: 125, y: 65 },
  'Madhya Pradesh': { x: 150, y: 155 },
  'Haryana': { x: 135, y: 80 },
  'Bihar': { x: 195, y: 130 },
  'Other': { x: 170, y: 200 },
};

export default function IndiaMap({ stateCounts, totalCount }) {
  const entries = Object.entries(stateCounts || {});
  const maxCount = Math.max(1, ...entries.map(([, c]) => c));

  return (
    <div className="mapcard">
      <div className="mapcard-head">
        <span className="t">Reports by state</span>
        <span className="live-chip">
          <span className="citypulse"></span>
          {totalCount} total
        </span>
      </div>
      <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
        <path
          d="M110 20 L160 15 L190 40 L210 70 L225 110 L215 150 L230 180 L210 220 L195 260 L170 290 L140 300 L120 275 L100 240 L85 200 L70 165 L60 120 L75 80 L90 50 Z"
          fill="none"
          strokeWidth="1.4"
          style={{ stroke: 'var(--line)' }}
        />
        {entries.length === 0 && (
          <text x="150" y="160" textAnchor="middle" fontSize="11" fill="var(--ink-faint)">
            No reports yet
          </text>
        )}
        {entries.map(([state, count]) => {
          const coord = STATE_COORDS[state] || STATE_COORDS['Other'];
          const r = 3 + (count / maxCount) * 7;
          return (
            <g key={state}>
              <circle
                cx={coord.x}
                cy={coord.y}
                r={r + 2}
                fill="none"
                stroke="var(--teal)"
                strokeWidth="1"
                opacity="0.7"
                style={{ animation: 'mapPulse 2.4s ease-out infinite' }}
              />
              <circle cx={coord.x} cy={coord.y} r={r} fill="var(--teal)" />
            </g>
          );
        })}
      </svg>
      <style>{`
        @keyframes mapPulse{0%{opacity:.7;transform-origin:center;transform:scale(0.3);}100%{opacity:0;transform:scale(3);}}
      `}</style>
    </div>
  );
}
