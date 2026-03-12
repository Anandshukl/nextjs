export default function LoadingSkeleton({ className = "h-6 w-full bg-slate-700/50 rounded" }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}></div>
  );
}
