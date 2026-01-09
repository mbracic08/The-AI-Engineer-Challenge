"use client";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-24 h-24 text-2xl",
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 48,
  };

  const sizeValue = size === "sm" ? iconSizes.sm : size === "md" ? iconSizes.md : iconSizes.lg;

  return (
    <div className={`${sizes[size]} rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Brain icon with spark/lightning */}
      <svg 
        className="relative z-10 text-white" 
        width={sizeValue}
        height={sizeValue}
        viewBox="0 0 24 24" 
        fill="none"
        stroke="currentColor"
        strokeWidth={size === "lg" ? 1.5 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Brain outline */}
        <path d="M12 2C8 2 6 4 6 8c0 2 1 3 2 4v2c0 2 2 4 4 4s4-2 4-4v-2c1-1 2-2 2-4 0-4-2-6-6-6z" />
        <path d="M8 10c-1 0-2 1-2 2s1 2 2 2" />
        <path d="M16 10c1 0 2 1 2 2s-1 2-2 2" />
        <path d="M9 14h6" />
        <path d="M10 16h4" />
        
        {/* Spark/lightning inside brain */}
        <path 
          d="M12 8l-2 4h3l-1 3 2-4h-3l1-3z" 
          fill="currentColor"
          opacity="0.8"
          className="group-hover:opacity-100 transition-opacity"
        />
      </svg>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Pulsing glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/0 to-blue-400/0 group-hover:from-purple-400/20 group-hover:to-blue-400/20 transition-all duration-500 animate-pulse"></div>
    </div>
  );
}
