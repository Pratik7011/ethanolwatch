'use client';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const INDIA_TOPO_JSON =
  'https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json';

function normalize(name) {
  if (!name) return '';
  const map = {
    'orissa': 'odisha',
    'uttaranchal': 'uttarakhand',
    'nct of delhi': 'delhi',
    'pondicherry': 'puducherry',
  };
  const lower = name.trim().toLowerCase();
  return map[lower] || lower;
}

export default function IndiaMap({ stateCounts, totalCount }) {
  const normalizedCounts = {};
  Object.entries(stateCounts || {}).forEach(([state, count]) => {
    normalizedCounts[normalize(state)] = count;
  });
  const maxCount = Math.max(1, ...Object.values(normalizedCounts));

  return (
    <div className="mapcard">
      <div className="mapcard-head">
        <span className="t">Reports by state</span>
        <span className="live-chip">
          <span className="citypulse"></span>
          {totalCount} total
        </span>
      </div>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 900, center: [82, 22] }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={INDIA_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.NAME_1 || geo.properties.name || geo.properties.st_nm;
              const count = normalizedCounts[normalize(name)] || 0;
              const intensity = count / maxCount;
              const fillColor =
                count > 0
                  ? `color-mix(in srgb, var(--teal) ${20 + intensity * 70}%, var(--card))`
                  : 'var(--card)';
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: fillColor, stroke: 'var(--line)', strokeWidth: 0.5, outline: 'none' },
                    hover: { fill: fillColor, stroke: 'var(--teal-deep)', strokeWidth: 0.8, outline: 'none' },
                    pressed: { fill: fillColor, stroke: 'var(--teal-deep)', strokeWidth: 0.8, outline: 'none' },
                  }}
                >
                  <title>{name}: {count} report{count === 1 ? '' : 's'}</title>
                </Geography>
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {totalCount === 0 && (
        <div className="hint" style={{ textAlign: 'center', marginTop: 8 }}>No reports yet</div>
      )}
    </div>
  );
}
