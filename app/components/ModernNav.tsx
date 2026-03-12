"use client";

import Link from "next/link";
import { HiOutlineMenu } from "react-icons/hi";
import { useState } from "react";

export default function ModernNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gold">Cultural Hub</Link>

        <div className="hidden md:flex gap-6 items-center">
          <Link href="/blog" className="hover:text-gold transition">Blog</Link>
          <Link href="/community" className="hover:text-gold transition">Community</Link>
          <Link href="/dashboard" className="hover:text-gold transition">Dashboard</Link>
          <Link href="/login" className="border px-3 py-1 rounded hover:bg-gold/10">Login</Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded bg-slate-800/30"
          aria-label="menu"
        >
          <HiOutlineMenu size={20} />
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4 space-y-2">
          <Link href="/blog" className="block">Blog</Link>
          <Link href="/community" className="block">Community</Link>
          <Link href="/dashboard" className="block">Dashboard</Link>
          <Link href="/login" className="block">Login</Link>
        </div>
      )}
    </nav>
  );
}
