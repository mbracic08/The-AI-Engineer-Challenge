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
      
      {/* Brain held gently by hands - realistic design with sparkles */}
      <svg 
        className="relative z-10" 
        width={sizeValue}
        height={sizeValue}
        viewBox="0 0 24 24" 
        fill="none"
        stroke="none"
      >
        {/* Sparkles around the brain - four-pointed stars */}
        <g opacity="0.7">
          {/* Yellow sparkles */}
          <path 
            d="M7 5l0.5 1 1-0.5-1-0.5-0.5 1z M5 8l0.5 1 1-0.5-1-0.5-0.5 1z M19 5l0.5 1 1-0.5-1-0.5-0.5 1z M19 8l0.5 1 1-0.5-1-0.5-0.5 1z"
            fill="#fbbf24"
            transform="translate(0, 0) scale(0.4)"
          />
          {/* Blue sparkles */}
          <path 
            d="M6 11l0.5 1 1-0.5-1-0.5-0.5 1z M18 11l0.5 1 1-0.5-1-0.5-0.5 1z M12 4l0.5 1 1-0.5-1-0.5-0.5 1z"
            fill="#60a5fa"
            transform="translate(0, 0) scale(0.4)"
          />
          {/* Pink sparkles */}
          <path 
            d="M10 5l0.5 1 1-0.5-1-0.5-0.5 1z M14 5l0.5 1 1-0.5-1-0.5-0.5 1z M8 9l0.5 1 1-0.5-1-0.5-0.5 1z M16 9l0.5 1 1-0.5-1-0.5-0.5 1z"
            fill="#f472b6"
            transform="translate(0, 0) scale(0.3)"
            opacity="0.6"
          />
        </g>

        {/* Light blue dots scattered around */}
        <g opacity="0.4">
          <circle cx="5" cy="6" r="0.8" fill="#93c5fd" />
          <circle cx="19" cy="6" r="0.8" fill="#93c5fd" />
          <circle cx="8" cy="4" r="0.6" fill="#93c5fd" />
          <circle cx="16" cy="4" r="0.6" fill="#93c5fd" />
          <circle cx="6" cy="10" r="0.7" fill="#93c5fd" />
          <circle cx="18" cy="10" r="0.7" fill="#93c5fd" />
        </g>

        {/* Realistic brain - pinkish-peach color with detailed structure */}
        <path 
          d="M12 4c-2.5 0-4.5 1.5-5.5 3.5-0.5 1-0.8 2.2-0.8 3.5 0 0.8 0.2 1.5 0.5 2.2 0.3 0.5 0.7 1 1.2 1.3 0.3 0.2 0.6 0.3 1 0.3 0.2 0 0.4-0.1 0.6-0.2 0.2-0.1 0.4-0.3 0.5-0.5 0.1-0.1 0.2-0.3 0.3-0.4 0.1 0.1 0.2 0.3 0.3 0.4 0.1 0.2 0.3 0.4 0.5 0.5 0.2 0.1 0.4 0.2 0.6 0.2 0.4 0 0.7-0.1 1-0.3 0.5-0.3 0.9-0.8 1.2-1.3 0.3-0.7 0.5-1.4 0.5-2.2 0-1.3-0.3-2.5-0.8-3.5C16.5 5.5 14.5 4 12 4z"
          fill="#ffb3ba"
          stroke="#ff9aa2"
          strokeWidth="0.5"
        />
        
        {/* Brain gyri and sulci - detailed texture */}
        <path d="M8.5 6.5c0.5 0.3 1 0.8 1.5 1.2" stroke="#ff9aa2" strokeWidth="0.3" fill="none" />
        <path d="M15.5 6.5c-0.5 0.3-1 0.8-1.5 1.2" stroke="#ff9aa2" strokeWidth="0.3" fill="none" />
        <path d="M9 8.5c0.3 0.4 0.7 0.8 1.2 1.1" stroke="#ff9aa2" strokeWidth="0.3" fill="none" />
        <path d="M15 8.5c-0.3 0.4-0.7 0.8-1.2 1.1" stroke="#ff9aa2" strokeWidth="0.3" fill="none" />
        <path d="M10.5 10c0.2 0.3 0.5 0.6 0.8 0.9" stroke="#ff9aa2" strokeWidth="0.25" fill="none" />
        <path d="M13.5 10c-0.2 0.3-0.5 0.6-0.8 0.9" stroke="#ff9aa2" strokeWidth="0.25" fill="none" />
        
        {/* Brain hemispheres division */}
        <path d="M12 4.5v8" stroke="#ff9aa2" strokeWidth="0.4" strokeDasharray="1,1" opacity="0.5" />

        {/* Two hands cupping from below - warm peach/orange color */}
        {/* Left hand */}
        <path 
          d="M5 18c0-1.5 0.8-2.5 2-3 0.8-0.4 1.8-0.4 2.5 0 0.5 0.3 1 0.8 1.2 1.4 0.1 0.3 0.2 0.6 0.2 0.9v1.2c0 1-0.8 1.8-1.8 1.8-0.5 0-1-0.2-1.3-0.6l-0.4-0.6c-0.2-0.4-0.6-0.6-1-0.6s-0.8 0.2-1 0.6l-0.4 0.6c-0.3 0.4-0.8 0.6-1.3 0.6-1 0-1.8-0.8-1.8-1.8v-1.2c0-0.3 0.1-0.6 0.2-0.9 0.2-0.6 0.7-1.1 1.2-1.4 0.7-0.4 1.7-0.4 2.5 0 1.2 0.5 2 1.5 2 3z"
          fill="#ffcc99"
          stroke="#ffb366"
          strokeWidth="0.3"
        />
        {/* Left hand fingers/thumbs */}
        <path d="M4.5 17l-0.8 2" stroke="#ffb366" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M6 16.5l-0.5 2.2" stroke="#ffb366" strokeWidth="0.7" strokeLinecap="round" />
        <circle cx="4.8" cy="17.5" r="0.4" fill="#ffb366" opacity="0.6" />
        <circle cx="6.2" cy="17" r="0.35" fill="#ffb366" opacity="0.6" />

        {/* Right hand */}
        <path 
          d="M19 18c0-1.5-0.8-2.5-2-3-0.8-0.4-1.8-0.4-2.5 0-0.5 0.3-1 0.8-1.2 1.4-0.1 0.3-0.2 0.6-0.2 0.9v1.2c0 1 0.8 1.8 1.8 1.8 0.5 0 1-0.2 1.3-0.6l0.4-0.6c0.2-0.4 0.6-0.6 1-0.6s0.8 0.2 1 0.6l0.4 0.6c0.3 0.4 0.8 0.6 1.3 0.6 1 0 1.8-0.8 1.8-1.8v-1.2c0-0.3-0.1-0.6-0.2-0.9-0.2-0.6-0.7-1.1-1.2-1.4-0.7-0.4-1.7-0.4-2.5 0-1.2 0.5-2 1.5-2 3z"
          fill="#ffcc99"
          stroke="#ffb366"
          strokeWidth="0.3"
        />
        {/* Right hand fingers/thumbs */}
        <path d="M19.5 17l0.8 2" stroke="#ffb366" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M18 16.5l0.5 2.2" stroke="#ffb366" strokeWidth="0.7" strokeLinecap="round" />
        <circle cx="19.2" cy="17.5" r="0.4" fill="#ffb366" opacity="0.6" />
        <circle cx="17.8" cy="17" r="0.35" fill="#ffb366" opacity="0.6" />
      </svg>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Pulsing glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/0 to-blue-400/0 group-hover:from-purple-400/20 group-hover:to-blue-400/20 transition-all duration-500 animate-pulse"></div>
    </div>
  );
}