import React, { useEffect, useState } from "react";
import ModernNav from "../components/ModernNav";
import PostCard from "../components/PostCard";
import { apiCall } from "../lib/api";

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState<any | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/posts');
      setPosts(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const handleCreate = async () => {
    try {
      await apiCall('/posts', { method: 'POST', body: JSON.stringify({ title, content }) });
      setTitle(''); setContent('');
      await loadPosts();
    } catch (err: any) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    try { await apiCall(`/posts/${id}`, { method: 'DELETE' }); await loadPosts(); } catch (err) { console.error(err); }
  };

  const startEdit = (post: any) => { setEditing(post); setTitle(post.title); setContent(post.content); };

  const handleSaveEdit = async () => {
    if (!editing) return;
    try {
      await apiCall(`/posts/${editing.id}`, { method: 'PUT', body: JSON.stringify({ title, content }) });
      setEditing(null); setTitle(''); setContent(''); await loadPosts();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <ModernNav />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gold">Cultural Blog</h1>
        </div>

        <div className="bg-slate-800 border border-gold/20 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gold mb-3">{editing ? 'Edit Post' : 'Create Post'}</h3>
          <input className="w-full mb-3 p-2 rounded bg-slate-700" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="w-full mb-3 p-2 rounded bg-slate-700 h-40" placeholder="Content (markdown)" value={content} onChange={e=>setContent(e.target.value)} />
          {editing ? (
            <div className="flex gap-2">
              <button onClick={handleSaveEdit} className="bg-gold text-slate-900 px-3 py-1 rounded">Save</button>
              <button onClick={()=>{setEditing(null); setTitle(''); setContent('');}} className="border px-3 py-1 rounded">Cancel</button>
            </div>
          ) : (
            <button onClick={handleCreate} className="bg-gold text-slate-900 px-3 py-1 rounded">Create Post</button>
          )}
        </div>

        {loading ? <div className="text-slate-400">Loading posts...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p:any)=> (
              <div key={p.id} className="space-y-3">
                <PostCard post={p} />
                <div className="flex gap-2">
                  <button onClick={()=>startEdit(p)} className="px-2 py-1 border rounded">Edit</button>
                  <button onClick={()=>handleDelete(p.id)} className="px-2 py-1 border rounded text-red-400">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
