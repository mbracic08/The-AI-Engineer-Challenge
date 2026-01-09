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
  const strokeWidth = size === "sm" ? 1.2 : size === "md" ? 1.5 : size === "lg" ? 1.8 : 2;

  return (
    <div className={`${sizes[size]} rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Detailed brain icon - more realistic appearance */}
      <svg 
        className="relative z-10 text-white" 
        width={sizeValue}
        height={sizeValue}
        viewBox="0 0 24 24" 
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Brain outline with detailed structure */}
        <path d="M9.5 2A7.5 7.5 0 0 0 2 9.5c0 1.5.5 3 1.5 4.2v1.3c0 1.8 1.5 3.3 3.3 3.3.9 0 1.7-.4 2.2-1l.5-.8c.3-.5.9-.8 1.5-.8s1.2.3 1.5.8l.5.8c.5.6 1.3 1 2.2 1 1.8 0 3.3-1.5 3.3-3.3v-1.3c1-1.2 1.5-2.7 1.5-4.2A7.5 7.5 0 0 0 14.5 2c-1.3 0-2.5.5-3.4 1.3C10.2 2.5 9 2 7.7 2z" />
        
        {/* Brain hemispheres division line */}
        <path d="M12 3v14" strokeWidth={strokeWidth * 0.6} opacity="0.6" strokeDasharray="1,1" />
        
        {/* Gyri (brain folds) - left hemisphere */}
        <path d="M6 8c1 0.5 2 1 3 1.5" strokeWidth={strokeWidth * 0.5} opacity="0.7" />
        <path d="M7 11c1.5 0.5 2.5 1 3.5 1.5" strokeWidth={strokeWidth * 0.5} opacity="0.7" />
        <path d="M6.5 14c1 0.3 2 0.8 3 1" strokeWidth={strokeWidth * 0.5} opacity="0.6" />
        <path d="M5 6.5c1.5 0.8 2.5 1.5 3.5 2.5" strokeWidth={strokeWidth * 0.4} opacity="0.6" />
        
        {/* Gyri (brain folds) - right hemisphere */}
        <path d="M18 8c-1 0.5-2 1-3 1.5" strokeWidth={strokeWidth * 0.5} opacity="0.7" />
        <path d="M17 11c-1.5 0.5-2.5 1-3.5 1.5" strokeWidth={strokeWidth * 0.5} opacity="0.7" />
        <path d="M17.5 14c-1 0.3-2 0.8-3 1" strokeWidth={strokeWidth * 0.5} opacity="0.6" />
        <path d="M19 6.5c-1.5 0.8-2.5 1.5-3.5 2.5" strokeWidth={strokeWidth * 0.4} opacity="0.6" />
        
        {/* Additional brain texture details */}
        <path d="M8.5 5c0.8 0.5 1.5 1 2 1.8" strokeWidth={strokeWidth * 0.4} opacity="0.5" />
        <path d="M15.5 5c-0.8 0.5-1.5 1-2 1.8" strokeWidth={strokeWidth * 0.4} opacity="0.5" />
        <path d="M9.5 13c0.5 0.3 1 0.6 1.5 0.9" strokeWidth={strokeWidth * 0.4} opacity="0.5" />
        <path d="M14.5 13c-0.5 0.3-1 0.6-1.5 0.9" strokeWidth={strokeWidth * 0.4} opacity="0.5" />
      </svg>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Pulsing glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/0 to-blue-400/0 group-hover:from-purple-400/20 group-hover:to-blue-400/20 transition-all duration-500 animate-pulse"></div>
    </div>
  );
}