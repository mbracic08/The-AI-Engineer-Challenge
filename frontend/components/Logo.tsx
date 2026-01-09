"use client";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-2xl",
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  const sizeValue = size === "sm" ? iconSizes.sm : size === "md" ? iconSizes.md : size === "lg" ? iconSizes.lg : iconSizes.xl;

  return (
    <div className={`${sizes[size]} rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Brain held gently by hands */}
      <svg 
        className="relative z-10 text-white" 
        width={sizeValue}
        height={sizeValue}
        viewBox="0 0 24 24" 
        fill="none"
        stroke="currentColor"
        strokeWidth={size === "lg" || size === "xl" ? 1.2 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Brain - larger, filling most of the space */}
        <path 
          d="M9.5 3A7.5 7.5 0 0 0 2 10.5c0 1.2.4 2.4 1.2 3.4v1c0 1.5 1.2 2.7 2.7 2.7.7 0 1.4-.3 1.8-.8l.4-.7c.2-.4.7-.7 1.2-.7s1 .3 1.2.7l.4.7c.4.5 1.1.8 1.8.8 1.5 0 2.7-1.2 2.7-2.7v-1c.8-1 1.2-2.2 1.2-3.4A7.5 7.5 0 0 0 14.5 3c-1.1 0-2.1.4-2.8 1.1C11 3.4 10 3 8.9 3z" 
          fill="currentColor"
          opacity="0.95"
        />
        
        {/* Brain details - subtle texture */}
        <circle cx="9" cy="9" r="0.6" fill="white" opacity="0.4" />
        <circle cx="15" cy="9" r="0.6" fill="white" opacity="0.4" />
        <circle cx="11" cy="11.5" r="0.5" fill="white" opacity="0.3" />
        <circle cx="13" cy="11.5" r="0.5" fill="white" opacity="0.3" />
        
        {/* Left hand - gently supporting from left side */}
        <path 
          d="M3 16.5c0-1 .5-2 1.5-2.5.8-.4 1.8-.4 2.5 0 .5.3.8.8.8 1.3v1.5c0 .8-.6 1.5-1.4 1.5-.4 0-.8-.2-1-.5l-.3-.4c-.2-.3-.5-.5-.9-.5s-.7.2-.9.5l-.3.4c-.2.3-.6.5-1 .5-.8 0-1.4-.7-1.4-1.5v-1.5z" 
          fill="currentColor"
          opacity="0.85"
        />
        {/* Left hand fingers */}
        <path d="M4 15.5l-.5 1.5" strokeWidth="1.2" opacity="0.7" />
        <path d="M5 15l-.3 1.8" strokeWidth="1" opacity="0.6" />
        
        {/* Right hand - gently supporting from right side */}
        <path 
          d="M21 16.5c0-1-.5-2-1.5-2.5-.8-.4-1.8-.4-2.5 0-.5.3-.8.8-.8 1.3v1.5c0 .8.6 1.5 1.4 1.5.4 0 .8-.2 1-.5l.3-.4c.2-.3.5-.5.9-.5s.7.2.9.5l.3.4c.2.3.6.5 1 .5.8 0 1.4-.7 1.4-1.5v-1.5z" 
          fill="currentColor"
          opacity="0.85"
        />
        {/* Right hand fingers */}
        <path d="M20 15.5l.5 1.5" strokeWidth="1.2" opacity="0.7" />
        <path d="M19 15l.3 1.8" strokeWidth="1" opacity="0.6" />
      </svg>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Pulsing glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/0 to-blue-400/0 group-hover:from-purple-400/20 group-hover:to-blue-400/20 transition-all duration-500 animate-pulse"></div>
    </div>
  );
}
