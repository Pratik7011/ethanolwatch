'use client';
import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function SiteHeader() {
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  }

  return (
    <header>
      <div className="nav">
        <Link href="/" className="logo">
          <Logo /> Ethanol<span style={{ color: 'var(--teal)' }}>Watch</span>
        </Link>
        <nav className="navlinks">
          <Link href="/report">Report</Link>
          <Link href="/forum">Forum</Link>
          <Link href="/data">Data</Link>
          <Link href="/guide">Guide</Link>
        </nav>
        <div className="nav-right">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {dark ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            )}
          </button>
          <Link href="/report" className="navcta">Report an issue</Link>
        </div>
      </div>
    </header>
  );
}
