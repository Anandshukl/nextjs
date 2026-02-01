import Link from "next/link";
import { AuthNav } from "../components/AuthNav";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-950 border-b border-gold/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gold">Cultural Hub</Link>
          <AuthNav currentPage="dashboard" />
        </div>
      </nav>

      {/* Dashboard Content */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gold">Your Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-800 border border-gold/20 rounded-lg p-6 hover:border-gold/50 transition">
            <h3 className="text-xl font-bold text-gold mb-3">User Profile</h3>
            <p className="text-slate-300 mb-4">View and edit your profile information</p>
            <Link href="/profile" className="inline-block bg-gold text-slate-900 px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition">
              View Profile
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-800 border border-gold/20 rounded-lg p-6 hover:border-gold/50 transition">
            <h3 className="text-xl font-bold text-gold mb-3">My Posts</h3>
            <p className="text-slate-300 mb-4">Manage your cultural content and blogs</p>
            <Link href="/dashboard/posts" className="inline-block bg-gold text-slate-900 px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition">
              View Posts
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-800 border border-gold/20 rounded-lg p-6 hover:border-gold/50 transition">
            <h3 className="text-xl font-bold text-gold mb-3">Settings</h3>
            <p className="text-slate-300 mb-4">Configure your preferences</p>
            <Link href="/dashboard/settings" className="inline-block bg-gold text-slate-900 px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition">
              Go to Settings
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mt-12">
          <div className="bg-slate-800 border border-gold/20 rounded-lg p-6 text-center">
            <p className="text-4xl font-bold text-gold">12</p>
            <p className="text-slate-300 mt-2">Posts Created</p>
          </div>
          <div className="bg-slate-800 border border-gold/20 rounded-lg p-6 text-center">
            <p className="text-4xl font-bold text-gold">156</p>
            <p className="text-slate-300 mt-2">Followers</p>
          </div>
          <div className="bg-slate-800 border border-gold/20 rounded-lg p-6 text-center">
            <p className="text-4xl font-bold text-gold">8</p>
            <p className="text-slate-300 mt-2">Communities Joined</p>
          </div>
        </div>
      </section>
    </div>
  );
}
