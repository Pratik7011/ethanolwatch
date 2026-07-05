'use client';
import { useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import { supabase } from '../../lib/supabaseClient';
 
const CATEGORIES = [
  { id: 'mileage_drop', label: 'Mileage drop' },
  { id: 'engine_knocking', label: 'Engine knocking / rough idle' },
  { id: 'fuel_pump', label: 'Fuel pump failure' },
  { id: 'seal_wear', label: 'Rubber & seal wear' },
  { id: 'warning_light', label: 'Warning lights' },
  { id: 'corrosion', label: 'Corrosion' },
  { id: 'hard_start', label: 'Hard starting' },
  { id: 'other', label: 'Other' },
];
 
const STATES = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat',
  'Rajasthan', 'West Bengal', 'Telangana', 'Kerala', 'Punjab', 'Madhya Pradesh',
  'Haryana', 'Bihar', 'Other',
];
 
export default function ReportPage() {
  const [form, setForm] = useState({
    vehicle_make: '', vehicle_model: '', vehicle_year: '', vehicle_type: 'car',
    fuel_type: 'petrol', city: '', state: 'Maharashtra', issue_category: [],
    severity: 'moderate', onset: 'gradual', odometer_km: '', description: '',
  });
  const [status, setStatus] = useState(null); // null | 'submitting' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
 
  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
 
  function toggleCategory(id) {
    setForm((f) => {
      const has = f.issue_category.includes(id);
      const next = has
        ? f.issue_category.filter((c) => c !== id)
        : [...f.issue_category, id];
      return { ...f, issue_category: next };
    });
  }
 
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.issue_category.length) {
      setStatus('error');
      setErrorMsg('Pick at least one issue category that matches what happened.');
      return;
    }
    setStatus('submitting');
 
    // Reports require a logged-in user (see schema RLS policy). Anonymous
    // sign-in keeps the "two minutes, no signup friction" promise while still
    // giving every report an owner for moderation purposes.
    let { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        setStatus('error');
        setErrorMsg('Could not start a session. Please try again.');
        return;
      }
      user = data.user;
    }
 
    const { error } = await supabase.from('reports').insert({
      user_id: user.id,
      vehicle_make: form.vehicle_make,
      vehicle_model: form.vehicle_model,
      vehicle_year: form.vehicle_year ? parseInt(form.vehicle_year) : null,
      vehicle_type: form.vehicle_type,
      fuel_type: form.fuel_type,
      city: form.city,
      state: form.state,
      issue_category: form.issue_category, // now a text[] array
      severity: form.severity,
      onset: form.onset,
      odometer_km: form.odometer_km ? parseInt(form.odometer_km) : null,
      description: form.description || null,
    });
 
    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
    } else {
      setStatus('success');
    }
  }
 
  return (
    <>
      <SiteHeader />
      <main className="wrap" style={{ padding: '48px 32px 80px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto 28px' }}>
          <div className="eyebrow"><span className="dotmark"></span>Report an issue</div>
          <h1 style={{ fontSize: 32, marginTop: 12 }}>Add your experience to the record</h1>
          <p className="lead">
            Every field below feeds directly into the public data on the homepage. No signup
            needed — this takes about two minutes.
          </p>
        </div>
 
        <div className="form-card">
          {status === 'success' ? (
            <div className="form-msg success">
              Report submitted — thank you. It's now part of the live record on the homepage.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {status === 'error' && <div className="form-msg error">{errorMsg}</div>}
 
              <div className="form-grid">
                <div className="form-row">
                  <label>Vehicle make</label>
                  <input required value={form.vehicle_make} onChange={(e) => update('vehicle_make', e.target.value)} placeholder="e.g. Maruti" />
                </div>
                <div className="form-row">
                  <label>Vehicle model</label>
                  <input required value={form.vehicle_model} onChange={(e) => update('vehicle_model', e.target.value)} placeholder="e.g. Swift" />
                </div>
              </div>
 
              <div className="form-grid">
                <div className="form-row">
                  <label>Year</label>
                  <input type="number" value={form.vehicle_year} onChange={(e) => update('vehicle_year', e.target.value)} placeholder="e.g. 2019" />
                </div>
                <div className="form-row">
                  <label>Vehicle type</label>
                  <select value={form.vehicle_type} onChange={(e) => update('vehicle_type', e.target.value)}>
                    <option value="car">Car</option>
                    <option value="two_wheeler">Two-wheeler</option>
                    <option value="commercial">Commercial</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
 
              <div className="form-grid">
                <div className="form-row">
                  <label>City</label>
                  <input required value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="e.g. Pune" />
                </div>
                <div className="form-row">
                  <label>State</label>
                  <select value={form.state} onChange={(e) => update('state', e.target.value)}>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
 
              <div className="form-row">
                <label>What issue are you seeing? <span className="hint" style={{ fontWeight: 400 }}>(select all that apply)</span></label>
                <div className="chip-group">
                  {CATEGORIES.map((c) => {
                    const checked = form.issue_category.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className={`chip ${checked ? 'selected' : ''}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCategory(c.id)}
                          style={{ margin: 0 }}
                        />
                        {c.label}
                      </label>
                    );
                  })}
                </div>
              </div>
 
              <div className="form-grid">
                <div className="form-row">
                  <label>Severity</label>
                  <select value={form.severity} onChange={(e) => update('severity', e.target.value)}>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Onset</label>
                  <select value={form.onset} onChange={(e) => update('onset', e.target.value)}>
                    <option value="sudden">Sudden</option>
                    <option value="gradual">Gradual</option>
                  </select>
                </div>
              </div>
 
              <div className="form-row">
                <label>Odometer reading when it started (km)</label>
                <input type="number" value={form.odometer_km} onChange={(e) => update('odometer_km', e.target.value)} placeholder="e.g. 41200" />
              </div>
 
              <div className="form-row">
                <label>Anything else worth noting?</label>
                <textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Optional — describe what happened, what a mechanic said, etc." />
                <div className="hint">Photo/video upload can be added once Supabase storage is wired up — see README.</div>
              </div>
 
              <button type="submit" className="btn btn-fill" style={{ width: '100%', justifyContent: 'center' }} disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Submitting…' : 'Submit report'}
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
 
