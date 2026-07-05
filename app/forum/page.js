import SiteHeader from '../components/SiteHeader';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export const revalidate = 30;

const CATEGORIES = [
  { id: 'by_brand', label: 'By Vehicle Brand' },
  { id: 'mileage_performance', label: 'Mileage & Performance' },
  { id: 'engine_fuel_system', label: 'Engine & Fuel System' },
  { id: 'general_policy', label: 'General & Policy' },
];

export default async function ForumPage({ searchParams }) {
  const activeCategory = searchParams?.category;

  let query = supabase
    .from('forum_threads')
    .select('id, title, category_id, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(30);

  if (activeCategory) query = query.eq('category_id', activeCategory);

  const { data: threads } = await query;

  return (
    <>
      <SiteHeader />
      <main className="wrap" style={{ padding: '48px 32px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
          <div>
            <div className="eyebrow"><span className="dotmark"></span>Discussion</div>
            <h1 style={{ fontSize: 30, marginTop: 10 }}>Forum</h1>
          </div>
          <Link href="/forum/new" className="btn btn-fill">Start a thread</Link>
        </div>

        <div className="forum-cats">
          <Link href="/forum" className={`forum-cat-pill ${!activeCategory ? 'active' : ''}`}>All</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={`/forum?category=${c.id}`} className={`forum-cat-pill ${activeCategory === c.id ? 'active' : ''}`}>
              {c.label}
            </Link>
          ))}
        </div>

        <div className="forum-list">
          {(!threads || threads.length === 0) && (
            <div className="forum-row"><span className="forum-title">No threads here yet — be the first to post.</span></div>
          )}
          {threads?.map((t) => (
            <Link href={`/forum/${t.id}`} className="forum-row" key={t.id}>
              <span className="dotmark"></span>
              <span className="forum-title">{t.title}</span>
              <span className="forum-tag">{t.category_id.replace(/_/g, ' ')}</span>
              <span className="forum-meta">{new Date(t.created_at).toLocaleDateString()}</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
