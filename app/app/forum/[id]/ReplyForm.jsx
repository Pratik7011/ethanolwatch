'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function ReplyForm({ threadId }) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setStatus('submitting');

    let { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) { setStatus('error'); return; }
      user = data.user;
    }

    const { error } = await supabase.from('forum_replies').insert({
      thread_id: threadId, user_id: user.id, body,
    });

    if (error) {
      setStatus('error');
    } else {
      setBody('');
      setStatus(null);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <div className="form-row">
        <label>Add a reply</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share what you know…" />
      </div>
      <button type="submit" className="btn btn-fill" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Posting…' : 'Post reply'}
      </button>
      {status === 'error' && <div className="form-msg error" style={{ marginTop: 12 }}>Something went wrong — try again.</div>}
    </form>
  );
}
