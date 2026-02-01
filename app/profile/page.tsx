'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthNav } from "../components/AuthNav";
import { userAPI } from "../lib/api";

interface UserData {
  id?: number;
  name: string;
  email: string;
  bio: string;
  interests: string[];
  posts: number;
  followers: number;
  following: number;
  communities: number;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (!token) {
            window.location.href = '/login';
            return;
          }

          const profile = await userAPI.getProfile();
          setUserData(profile);
          setEditFormData(profile);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
        if (typeof window !== 'undefined') {
          setTimeout(() => window.location.href = '/login', 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editFormData) {
      const interests = e.target.value.split(',').map(i => i.trim());
      setEditFormData({
        ...editFormData,
        interests
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!editFormData) return;
    
    setSaveLoading(true);
    setError("");
    try {
      const updated = await userAPI.updateProfile({
        name: editFormData.name,
        bio: editFormData.bio,
        interests: editFormData.interests
      });
      setUserData(updated);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <p className="text-lg text-slate-400">Loading profile...</p>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-400 mb-4">{error}</p>
          <p className="text-slate-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <p className="text-lg text-slate-400">Loading profile...</p>
      </div>
    );
  }

  const initials = userData.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-950 border-b border-gold/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gold">Cultural Hub</Link>
          <AuthNav currentPage="profile" />
        </div>
      </nav>

      {/* Profile Header */}
      <section className="bg-gradient-to-r from-gold/20 to-slate-800/50 py-12 border-b border-gold/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 bg-gold/20 rounded-full border-4 border-gold flex items-center justify-center">
              <span className="text-5xl font-bold text-gold">{initials}</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gold mb-2">{userData.name}</h1>
              <p className="text-slate-300 text-lg mb-2">{userData.email}</p>
              <p className="text-slate-400">{userData.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isEditing ? (
          // Edit Profile Modal
          <div className="bg-slate-800 border border-gold/20 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gold mb-6">Edit Profile</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 mb-2 font-semibold">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData?.name || ''}
                  onChange={handleEditChange}
                  disabled={saveLoading}
                  className="w-full bg-slate-700 border border-gold/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2 font-semibold">Bio</label>
                <textarea
                  name="bio"
                  value={editFormData?.bio || ''}
                  onChange={handleEditChange}
                  rows={3}
                  disabled={saveLoading}
                  className="w-full bg-slate-700 border border-gold/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition resize-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2 font-semibold">Interests (comma-separated)</label>
                <input
                  type="text"
                  value={editFormData?.interests.join(', ') || ''}
                  onChange={handleInterestChange}
                  disabled={saveLoading}
                  className="w-full bg-slate-700 border border-gold/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition disabled:opacity-50"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saveLoading}
                  className="flex-1 bg-gold text-slate-900 px-4 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={saveLoading}
                  className="flex-1 border-2 border-slate-400 text-slate-300 px-4 py-3 rounded-lg font-semibold hover:bg-slate-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio Section */}
              <div className="bg-slate-800 border border-gold/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gold mb-4">About Me</h2>
                <p className="text-slate-300 leading-relaxed">{userData.bio}</p>
              </div>

              {/* Featured Posts */}
              <div className="bg-slate-800 border border-gold/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gold mb-4">Featured Posts</h2>
                <div className="space-y-4">
                  {userData.posts > 0 ? (
                    <>
                      <div className="border-l-4 border-gold pl-4 py-2 hover:bg-slate-700/50 transition p-2">
                        <h3 className="font-semibold text-gold cursor-pointer hover:text-yellow-400">Your First Post</h3>
                        <p className="text-sm text-slate-400">Posted recently</p>
                      </div>
                      <div className="border-l-4 border-gold pl-4 py-2 hover:bg-slate-700/50 transition p-2">
                        <h3 className="font-semibold text-gold cursor-pointer hover:text-yellow-400">Cultural Insights</h3>
                        <p className="text-sm text-slate-400">Posted recently</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-400">No posts yet. Start sharing your cultural stories!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-slate-800 border border-gold/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gold mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Posts</span>
                    <span className="text-gold font-bold">{userData.posts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Followers</span>
                    <span className="text-gold font-bold">{userData.followers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Following</span>
                    <span className="text-gold font-bold">{userData.following}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Communities</span>
                    <span className="text-gold font-bold">{userData.communities}</span>
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div className="bg-slate-800 border border-gold/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gold mb-4">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {userData.interests.map((interest, index) => (
                    <span key={index} className="bg-gold/20 text-gold px-3 py-1 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gold text-slate-900 px-4 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full border-2 border-red-500 text-red-500 px-4 py-3 rounded-lg font-semibold hover:bg-red-500/10 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
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
