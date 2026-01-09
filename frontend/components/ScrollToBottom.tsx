"use client";

interface ScrollToBottomProps {
  onClick: () => void;
  show: boolean;
}

export default function ScrollToBottom({ onClick, show }: ScrollToBottomProps) {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-28 right-6 z-40 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 
                 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg 
                 flex items-center justify-center transition-all duration-200 
                 hover:scale-110 active:scale-95 animate-fade-in"
      title="Scroll to bottom"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </button>
  );
}
