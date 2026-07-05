import { supabase } from './supabaseClient';

// Total published report count
export async function getTotalReports() {
  const { count } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');
  return count || 0;
}

// Count of reports per issue category, joined with the label/description,
// sorted highest first. Used for the "Issue frequency" section.
export async function getCategoryStats() {
  const { data: categories } = await supabase.from('issue_categories').select('*');
  const total = await getTotalReports();

  const stats = await Promise.all(
    (categories || []).map(async (cat) => {
      const { count } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
        .eq('issue_category', cat.id);
      return {
        ...cat,
        count: count || 0,
        pct: total > 0 ? Math.round(((count || 0) / total) * 100) : 0,
      };
    })
  );

  return stats.sort((a, b) => b.count - a.count);
}

// Most recent N published reports, for the live ticker / feed.
export async function getRecentReports(limit = 10) {
  const { data } = await supabase
    .from('reports')
    .select('id, vehicle_make, vehicle_model, vehicle_year, city, state, issue_category, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

// Report counts grouped by state, for the map.
export async function getStateCounts() {
  const { data } = await supabase
    .from('reports')
    .select('state')
    .eq('status', 'published');

  const counts = {};
  (data || []).forEach((r) => {
    counts[r.state] = (counts[r.state] || 0) + 1;
  });
  return counts;
}

// Recent forum threads with reply counts, for the homepage preview + forum index.
export async function getRecentThreads(limit = 10) {
  const { data } = await supabase
    .from('forum_threads')
    .select('id, title, category_id, created_at, linked_issue_category')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}
