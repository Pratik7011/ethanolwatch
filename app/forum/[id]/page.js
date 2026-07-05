import SiteHeader from '../../components/SiteHeader';
import { supabase } from '../../../lib/supabaseClient';
import ReplyForm from './ReplyForm';

export const revalidate = 10;

export default async function ThreadPage({ params }) {
  const { id } = params;

  const { data: thread } = await supabase
    .from('forum_threads')
    .select('*')
    .eq('id', id)
    .single();

  const { data: replies } = await supabase
    .from('forum_replies')
    .select('*')
    .eq('thread_id', id)
    .eq('status', 'published')
    .order('created_at', { ascending: true });

  if (!thread) {
    return (
      <>
        <SiteHeader />
        <main className="wrap" style={{ padding: '48px 32px' }}>Thread not found.</main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="wrap" style={{ padding: '48px 32px 80px', maxWidth: 720 }}>
        <div className="eyebrow"><span className="dotmark"></span>{thread.category_id.replace(/_/g, ' ')}</div>
        <h1 style={{ fontSize: 28, margin: '12px 0 16px' }}>{thread.title}</h1>
        <div className="form-card" style={{ marginBottom: 24 }}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{thread.body}</p>
          <div className="hint" style={{ marginTop: 12 }}>{new Date(thread.created_at).toLocaleString()}</div>
        </div>

        <h2 style={{ fontSize: 18, marginBottom: 14 }}>{replies?.length || 0} replies</h2>
        <div className="forum-list" style={{ marginBottom: 24 }}>
          {(!replies || replies.length === 0) && (
            <div className="forum-row"><span className="forum-title">No replies yet.</span></div>
          )}
          {replies?.map((r) => (
            <div key={r.id} className="forum-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{r.body}</p>
              <span className="forum-meta" style={{ width: 'auto' }}>{new Date(r.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <ReplyForm threadId={thread.id} />
      </main>
    </>
  );
}
