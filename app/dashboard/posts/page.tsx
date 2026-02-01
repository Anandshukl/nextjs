import Link from "next/link";
import { AuthNav } from "../../components/AuthNav";

export default function Posts() {
  const posts = [
    { id: 1, title: "The Beauty of Indian Classical Dance", date: "Jan 20, 2026", category: "Dance" },
    { id: 2, title: "Festival Celebrations Around the World", date: "Jan 15, 2026", category: "Festivals" },
    { id: 3, title: "Preserving Heritage Languages", date: "Jan 10, 2026", category: "Language" },
  ];

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

        <h1 className="text-4xl font-bold mb-8 text-gold">My Posts</h1>

        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-slate-800 border border-gold/20 rounded-lg p-6 hover:border-gold/50 transition">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gold mb-2">{post.title}</h2>
                  <p className="text-slate-400 text-sm mb-3">Published on {post.date}</p>
                  <span className="inline-block bg-gold/20 text-gold px-3 py-1 rounded-full text-sm">{post.category}</span>
                </div>
                <div className="flex gap-2">
                  <button className="bg-gold text-slate-900 px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition">
                    Edit
                  </button>
                  <button className="border-2 border-red-500 text-red-500 px-4 py-2 rounded font-semibold hover:bg-red-500/10 transition">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-12 bg-gold text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition">
          + Create New Post
        </button>
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
