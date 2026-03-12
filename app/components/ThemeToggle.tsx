"use client";

import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark'|'light'>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light') return 'light';
      if (saved === 'dark') return 'dark';
    } catch(e) {}
    // fallback to system preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'light' : 'dark');
      }
    };
    try {
      mq.addEventListener('change', handler);
    } catch (_) {
      mq.addListener(handler);
    }
    return () => {
      try { mq.removeEventListener('change', handler); } catch(_) { mq.removeListener(handler); }
    };
  }, []);

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md bg-slate-800/40 hover:bg-slate-800/60 text-gold"
      title="Toggle dark/light theme"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2"></path><path d="M12 21v2"></path><path d="M4.22 4.22l1.42 1.42"></path><path d="M18.36 18.36l1.42 1.42"></path><path d="M1 12h2"></path><path d="M21 12h2"></path><path d="M4.22 19.78l1.42-1.42"></path><path d="M18.36 5.64l1.42-1.42"></path></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      )}
    </button>
  );
}
