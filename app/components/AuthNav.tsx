'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

export function AuthNav({ currentPage }: { currentPage: string }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      window.location.href = '/login';
    }
  };

  return (
    <div className="flex gap-6 items-center">
      <Link href="/" className={currentPage === 'home' ? 'text-gold font-semibold' : 'hover:text-gold transition'}>
        Home
      </Link>
      <Link href="/dashboard" className={currentPage === 'dashboard' ? 'text-gold font-semibold' : 'hover:text-gold transition'}>
        Dashboard
      </Link>
      <Link href="/community" className={currentPage === 'community' ? 'text-gold font-semibold' : 'hover:text-gold transition'}>
        Community
      </Link>
      <Link href="/blog" className={currentPage === 'blog' ? 'text-gold font-semibold' : 'hover:text-gold transition'}>
        Blog
      </Link>
      
      {isLoggedIn ? (
        <>
          <Link href="/profile" className={currentPage === 'profile' ? 'text-gold font-semibold' : 'hover:text-gold transition'}>
            Profile
          </Link>
          <button 
            onClick={handleLogout}
            className="text-slate-300 hover:text-gold transition bg-slate-700 px-3 py-1 rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className={currentPage === 'login' ? 'text-gold font-semibold' : 'hover:text-gold transition'}>
            Login
          </Link>
          <Link href="/signup" className={currentPage === 'signup' ? 'text-gold font-semibold' : 'hover:text-gold transition'}>
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
}
