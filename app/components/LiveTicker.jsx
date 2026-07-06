'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const CATEGORY_LABELS = {
  mileage_drop: 'mileage drop',
  engine_knocking: 'engine knocking',
  fuel_pump: 'fuel pump',
  seal_wear: 'seal wear',
  warning_light: 'warning light',
  corrosion: 'corrosion',
  hard_start: 'hard starting',
  other: 'an issue',
};

export default function LiveTicker({ initialReports, totalCount }) {
  const [reports, setReports] = useState(initialReports || []);

  useEffect(() => {
    // Refresh the ticker every 30s so it feels alive without hammering the DB
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('reports')
        .select('id, vehicle_make, vehicle_model, city, state, issue_categories')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);
      if (data && data.length) setReports(data);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const text =
    reports.length > 0
      ? reports
          .map((r) => {
            const labels = (r.issue_categories || [])
              .map((c) => CATEGORY_LABELS[c])
              .filter(Boolean);
            const issueText = labels.length ? labels.join(' + ') : 'an issue';
            return `New report from ${r.city}, ${r.state} — ${issueText}, ${r.vehicle_make} ${r.vehicle_model}`;
          })
          .join('  ·  ')
      : 'Be the first to submit a report — it takes about two minutes.';

  return (
    <div className="pulse-bar">
      <div className="pulse-inner">
        <span className="livedot"></span>
        <span className="pulse-text">Live &nbsp;·&nbsp; {text}</span>
      </div>
    </div>
  );
}
