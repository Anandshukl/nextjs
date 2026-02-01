import Link from "next/link";
import { AuthNav } from "../components/AuthNav";

export default function Community() {
  const communities = [
    { name: "Indian Culture", members: 2340, description: "Explore Indian traditions and heritage" },
    { name: "Asian Cuisines", members: 1820, description: "Discover authentic Asian recipes" },
    { name: "Folk Arts", members: 956, description: "Traditional art forms and crafts" },
    { name: "Music & Dance", members: 1450, description: "Share performances and learn together" },
    { name: "Literature", members: 1123, description: "Stories, poetry, and written works" },
    { name: "Festivals", members: 1678, description: "Celebrate cultural festivals worldwide" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-950 border-b border-gold/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gold">Cultural Hub</Link>
          <AuthNav currentPage="community" />
        </div>
      </nav>

      {/* Community Header */}
      <section className="bg-slate-800/50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gold mb-4">Our Communities</h1>
          <p className="text-slate-300 text-lg">Join communities and connect with culture enthusiasts worldwide</p>
        </div>
      </section>

      {/* Communities Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community, index) => (
            <div key={index} className="bg-slate-800 border border-gold/20 rounded-lg p-6 hover:border-gold/50 transition transform hover:scale-105">
              <h3 className="text-xl font-bold text-gold mb-2">{community.name}</h3>
              <p className="text-slate-300 mb-4">{community.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">{community.members} members</span>
                <button className="bg-gold text-slate-900 px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition text-sm">
                  Join
                </button>
              </div>
            </div>
          ))}
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
