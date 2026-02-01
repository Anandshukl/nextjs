'use client';

import Link from "next/link";
import { useState } from "react";
import { authAPI } from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const response = await authAPI.login(email, password);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        window.location.href = '/profile';
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-950 border-b border-gold/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gold">Cultural Hub</Link>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-gold transition">Home</Link>
            <Link href="/dashboard" className="hover:text-gold transition">Dashboard</Link>
            <Link href="/community" className="hover:text-gold transition">Community</Link>
            <Link href="/blog" className="hover:text-gold transition">Blog</Link>
            <Link href="/login" className="text-gold font-semibold">Login</Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <section className="max-w-md mx-auto px-6 py-20">
        <div className="bg-slate-800 border border-gold/20 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gold mb-8 text-center">Login</h1>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-slate-300 mb-2 font-semibold">Email</label>
              <input 
                type="email" 
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-slate-700 border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-gold transition disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-slate-300 mb-2 font-semibold">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-slate-700 border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-gold transition disabled:opacity-50"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-slate-900 px-4 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">Don't have an account? <Link href="/signup" className="text-gold font-semibold hover:text-yellow-400">Sign up</Link></p>
          </div>

          <div className="mt-8 p-4 bg-slate-900/50 border border-gold/20 rounded-lg">
            <p className="text-sm text-slate-400 text-center">Demo: Try user@example.com / password123</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-gold/20 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400">
          <p>&copy; 2026 Cultural Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
