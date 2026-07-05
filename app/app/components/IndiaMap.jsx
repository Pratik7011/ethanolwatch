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
          d="M128 8 L155 6 L172 18 L168 30 L185 34 L198 46 L210 52 L222 78 L232 100
             L226 118 L236 138 L228 158 L232 178 L220 196 L224 214 L206 224 L208 244
             L192 258 L186 280 L172 296 L158 306 L150 296 L152 278 L138 268 L132 250
             L118 242 L110 224 L96 214 L90 196 L78 182 L74 162 L64 148 L60 128
             L70 110 L66 92 L78 76 L76 58 L92 46 L96 30 L112 22 Z"
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
