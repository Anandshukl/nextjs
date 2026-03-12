import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function PostCard({ post }: { post: any }) {
  return (
    <div className="bg-slate-800 border border-gold/20 rounded p-4">
      <h2 className="text-xl font-bold text-gold">{post.title}</h2>
      <div className="text-slate-300 mt-2 prose prose-invert max-w-none">
        <ReactMarkdown>{post.content || ''}</ReactMarkdown>
      </div>
      <div className="mt-3 text-sm text-slate-400">By {post.author || post.authorUsername}</div>
    </div>
  );
}
