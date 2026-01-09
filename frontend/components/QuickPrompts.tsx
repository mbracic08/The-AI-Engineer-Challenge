"use client";

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

const QUICK_PROMPTS = [
  "How can I reduce stress in my daily life?",
  "Help me build better habits",
  "I need motivation to achieve my goals",
  "How can I boost my self-confidence?",
  "What are some mindfulness techniques?",
  "Help me manage work-life balance",
];

export default function QuickPrompts({ onSelectPrompt, disabled }: QuickPromptsProps) {
  return (
    <div className="mt-6 space-y-3">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 text-center">
        Try asking:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {QUICK_PROMPTS.map((prompt, index) => (
          <button
            key={index}
            onClick={() => !disabled && onSelectPrompt(prompt)}
            disabled={disabled}
            className="px-4 py-3 text-left text-sm bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 
                     border border-gray-200 dark:border-gray-700 rounded-xl 
                     transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     text-gray-700 dark:text-gray-300"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
