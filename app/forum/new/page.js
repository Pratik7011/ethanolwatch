'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from '../../components/SiteHeader';
import { supabase } from '../../../lib/supabaseClient';

const CATEGORIES = [
  { id: 'by_brand', label: 'By Vehicle Brand' },
  { id: 'mileage_performance', label: 'Mileage & Performance' },
  { id: 'engine_fuel_system', label: 'Engine & Fuel System' },
  { id: 'general_policy', label: 'General & Policy' },
];

export default function NewThreadPage() {
  const router = useRouter();
  const [category, setCategory] = useState('by_brand');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');

    let { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        setStatus('error'); setErrorMsg('Could not start a session.'); return;
      }
      user = data.user;
    }

    const { data: thread, error } = await supabase
      .from('forum_threads')
      .insert({ user_id: user.id, category_id: category, title, body })
      .select()
      .single();

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
    } else {
      router.push(`/forum/${thread.id}`);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="wrap" style={{ padding: '48px 32px 80px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto 28px' }}>
          <div className="eyebrow"><span className="dotmark"></span>New thread</div>
          <h1 style={{ fontSize: 30, marginTop: 10 }}>Start a discussion</h1>
        </div>
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {status === 'error' && <div className="form-msg error">{errorMsg}</div>}
            <div className="form-row">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Title</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Swift mileage dropped after switching stations" />
            </div>
            <div className="form-row">
              <label>Your post</label>
              <textarea required value={body} onChange={(e) => setBody(e.target.value)} placeholder="Describe what you're seeing, your vehicle, and any details others might recognize." />
            </div>
            <button type="submit" className="btn btn-fill" style={{ width: '100%', justifyContent: 'center' }} disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Posting…' : 'Post thread'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
