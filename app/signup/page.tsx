'use client';

import Link from "next/link";
import { useState } from "react";
import { authAPI } from "../lib/api";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error("All fields are required");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const response = await authAPI.register(formData.name, formData.email, formData.password);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        window.location.href = '/profile';
      }
    } catch (err: any) {
      setError(err.message || "Signup failed");
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
            <Link href="/signup" className="text-gold font-semibold">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Signup Form */}
      <section className="max-w-md mx-auto px-6 py-20">
        <div className="bg-slate-800 border border-gold/20 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gold mb-8 text-center">Create Account</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-slate-300 mb-2 font-semibold">Full Name</label>
              <input 
                type="text" 
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-slate-700 border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-gold transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2 font-semibold">Email</label>
              <input 
                type="email" 
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-slate-700 border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-gold transition disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-slate-300 mb-2 font-semibold">Password</label>
              <input 
                type="password" 
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-slate-700 border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-gold transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2 font-semibold">Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">Already have an account? <Link href="/login" className="text-gold font-semibold hover:text-yellow-400">Login</Link></p>
          </div>

          <div className="mt-8 p-4 bg-slate-900/50 border border-gold/20 rounded-lg">
            <p className="text-sm text-slate-400 text-center">Create a real account with your information</p>
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
