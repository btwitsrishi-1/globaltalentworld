"use client";

export function AuroraBg({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
          `,
          animation: 'aurora-shift 15s ease-in-out infinite',
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(ellipse at 60% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 40%),
            radial-gradient(ellipse at 30% 30%, rgba(16, 185, 129, 0.08) 0%, transparent 40%)
          `,
          animation: 'aurora-shift 20s ease-in-out infinite reverse',
        }}
      />
    </div>
  );
}
