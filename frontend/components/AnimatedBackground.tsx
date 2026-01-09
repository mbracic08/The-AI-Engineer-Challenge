"use client";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950"></div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-purple-100/40 to-indigo-100/40 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-indigo-900/10 animate-gradient-shift"></div>
      
      {/* Geometric pattern - diagonal lines */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 10px, rgb(59, 130, 246) 10px, rgb(59, 130, 246) 20px),
            repeating-linear-gradient(-45deg, transparent, transparent 10px, rgb(99, 102, 241) 10px, rgb(99, 102, 241) 20px)
          `,
        }}
      ></div>
      
      {/* Hexagon pattern overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(0.5) rotate(0)">
            <polygon points="24.8,22 37.3,14.2 37.3,7.1 24.8,0 12.3,7.1 12.3,14.2" fill="none" stroke="rgb(59, 130, 246)" strokeWidth="1"/>
            <polygon points="24.8,43.4 37.3,35.6 37.3,28.5 24.8,21.4 12.3,28.5 12.3,35.6" fill="none" stroke="rgb(99, 102, 241)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>
      
      {/* Circuit-like lines pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="2" fill="rgb(59, 130, 246)" />
            <circle cx="75" cy="25" r="2" fill="rgb(99, 102, 241)" />
            <circle cx="50" cy="50" r="2" fill="rgb(139, 92, 246)" />
            <circle cx="25" cy="75" r="2" fill="rgb(59, 130, 246)" />
            <circle cx="75" cy="75" r="2" fill="rgb(99, 102, 241)" />
            <line x1="25" y1="25" x2="50" y2="50" stroke="rgb(59, 130, 246)" strokeWidth="0.5" />
            <line x1="75" y1="25" x2="50" y2="50" stroke="rgb(99, 102, 241)" strokeWidth="0.5" />
            <line x1="25" y1="75" x2="50" y2="50" stroke="rgb(139, 92, 246)" strokeWidth="0.5" />
            <line x1="75" y1="75" x2="50" y2="50" stroke="rgb(99, 102, 241)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>
      
      {/* Floating blobs with more subtle effect */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300/30 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-300/30 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-300/30 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] dark:opacity-30"></div>
    </div>
  );
}
