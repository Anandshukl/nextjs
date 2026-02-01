'use client';

import Link from "next/link";
import { AuthNav } from "../../components/AuthNav";
import { useState, useEffect } from "react";

export default function Settings() {
  const [theme, setTheme] = useState("dark");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [showPosts, setShowPosts] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      const savedEmailNotifications = localStorage.getItem('emailNotifications') !== 'false';
      const savedCommentNotifications = localStorage.getItem('commentNotifications') !== 'false';
      const savedPublicProfile = localStorage.getItem('publicProfile') !== 'false';
      const savedShowPosts = localStorage.getItem('showPosts') !== 'false';

      setTheme(savedTheme);
      setEmailNotifications(savedEmailNotifications);
      setCommentNotifications(savedCommentNotifications);
      setPublicProfile(savedPublicProfile);
      setShowPosts(savedShowPosts);

      // Apply theme
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (selectedTheme: string) => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      if (selectedTheme === 'light') {
        html.classList.add('light-theme');
      } else {
        html.classList.remove('light-theme');
      }
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    }
  };

  const handleSaveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('emailNotifications', emailNotifications.toString());
      localStorage.setItem('commentNotifications', commentNotifications.toString());
      localStorage.setItem('publicProfile', publicProfile.toString());
      localStorage.setItem('showPosts', showPosts.toString());
      localStorage.setItem('theme', theme);
      
      alert('Settings saved successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-950 border-b border-gold/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gold">Cultural Hub</Link>
          <AuthNav currentPage="dashboard" />
        </div>
      </nav>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/dashboard" className="text-gold hover:text-yellow-400 transition mb-4 inline-block">
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-gold">Settings</h1>

        <div className="space-y-8 max-w-2xl">
          {/* Privacy Settings */}
          <div className="bg-slate-800 border border-gold/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gold mb-4">Privacy Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 font-semibold">Public Profile</p>
                  <p className="text-slate-400 text-sm">Allow others to see your profile</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={publicProfile}
                  onChange={(e) => setPublicProfile(e.target.checked)}
                  className="w-6 h-6 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 font-semibold">Show Posts</p>
                  <p className="text-slate-400 text-sm">Display your posts publicly</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={showPosts}
                  onChange={(e) => setShowPosts(e.target.checked)}
                  className="w-6 h-6 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-slate-800 border border-gold/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 font-semibold">Email Notifications</p>
                  <p className="text-slate-400 text-sm">Get updates via email</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-6 h-6 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 font-semibold">Comments</p>
                  <p className="text-slate-400 text-sm">Notify on new comments</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={commentNotifications}
                  onChange={(e) => setCommentNotifications(e.target.checked)}
                  className="w-6 h-6 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-slate-800 border border-gold/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gold mb-4">Theme</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="theme" 
                  value="dark" 
                  checked={theme === "dark"}
                  onChange={() => handleThemeChange("dark")}
                  id="dark"
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="dark" className="text-slate-300 cursor-pointer">Dark (Default)</label>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="theme" 
                  value="light" 
                  checked={theme === "light"}
                  onChange={() => handleThemeChange("light")}
                  id="light"
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="light" className="text-slate-300 cursor-pointer">Light</label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button 
            onClick={handleSaveSettings}
            className="w-full bg-gold text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Save Settings
          </button>
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
