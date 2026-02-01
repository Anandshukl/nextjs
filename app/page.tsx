import Link from "next/link";
import { AuthNav } from "./components/AuthNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-950 border-b border-gold/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gold">Cultural Hub</h1>
          <AuthNav currentPage="home" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 text-gold">Welcome to Our Platform</h2>
        <p className="text-xl text-slate-300 mb-8">Explore culture, connect with community, and share your stories</p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard" className="bg-gold text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition">
            Get Started
          </Link>
          <Link href="/community" className="border-2 border-gold text-gold px-8 py-3 rounded-lg font-semibold hover:bg-gold/10 transition">
            Join Community
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-800/50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold mb-12 text-center text-gold">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Cultural Blog", "User Dashboard", "Community Forum"].map((feature, i) => (
              <div key={i} className="bg-slate-900 p-6 rounded-lg border border-gold/20 hover:border-gold/50 transition">
                <h4 className="text-xl font-semibold text-gold mb-3">{feature}</h4>
                <p className="text-slate-300">Discover and share cultural content with our thriving community.</p>
              </div>
            ))}
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
