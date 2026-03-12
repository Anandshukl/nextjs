import React from "react";

export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-800 border border-gold/20 rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
}
