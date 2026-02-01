import Link from "next/link";
import { AuthNav } from "../components/AuthNav";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "The Beauty of Indian Classical Dance",
      author: "Priya Sharma",
      date: "Jan 15, 2026",
      excerpt: "Explore the rich traditions and intricate movements of Bharatanatyam dance.",
      category: "Dance",
    },
    {
      id: 2,
      title: "Asian Cuisine: A Culinary Journey",
      author: "Raj Patel",
      date: "Jan 12, 2026",
      excerpt: "Discover the flavors and cooking techniques from across Asia.",
      category: "Cuisine",
    },
    {
      id: 3,
      title: "Traditional Textile Arts",
      author: "Meera Singh",
      date: "Jan 10, 2026",
      excerpt: "Learn about ancient weaving techniques and their cultural significance.",
      category: "Art",
    },
    {
      id: 4,
      title: "Festival Celebrations Around the World",
      author: "Anil Kumar",
      date: "Jan 8, 2026",
      excerpt: "Celebrate cultural diversity through festivals and traditions.",
      category: "Festivals",
    },
    {
      id: 5,
      title: "Preserving Heritage Languages",
      author: "Sarah Ahmed",
      date: "Jan 5, 2026",
      excerpt: "The importance of keeping ancient languages alive in modern times.",
      category: "Language",
    },
    {
      id: 6,
      title: "Modern Art Meets Traditional Culture",
      author: "Alex Chen",
      date: "Jan 1, 2026",
      excerpt: "How contemporary artists blend traditional and modern elements.",
      category: "Art",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-950 border-b border-gold/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gold">Cultural Hub</Link>
          <AuthNav currentPage="blog" />
        </div>
      </nav>

      {/* Header Section */}
      <section className="bg-slate-800/50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gold mb-4">Cultural Blog</h1>
          <p className="text-slate-300 text-lg">Discover stories, insights, and perspectives from around the world</p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-slate-800 border border-gold/20 rounded-lg overflow-hidden hover:border-gold/50 hover:shadow-lg hover:shadow-gold/20 transition transform hover:scale-105"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-block bg-gold/20 text-gold px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gold mb-3 line-clamp-2">{post.title}</h2>
                <p className="text-slate-300 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="border-t border-gold/20 pt-4">
                  <p className="text-sm text-slate-400 mb-2">By <span className="text-gold">{post.author}</span></p>
                  <p className="text-xs text-slate-500 mb-4">{post.date}</p>
                  <button className="w-full bg-gold text-slate-900 px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition">
                    Read More
                  </button>
                </div>
              </div>
            </article>
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
