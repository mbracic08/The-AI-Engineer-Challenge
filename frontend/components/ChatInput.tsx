"use client";

import { useState, KeyboardEvent } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
          disabled={disabled}
          rows={1}
          className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl 
                     bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     resize-none overflow-y-auto max-h-32
                     transition-all duration-200 shadow-sm hover:shadow-md"
          style={{
            minHeight: "52px",
          }}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!input.trim() || disabled}
        className="px-7 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                   disabled:from-gray-300 disabled:to-gray-400
                   text-white font-semibold rounded-2xl 
                   transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                   disabled:cursor-not-allowed disabled:shadow-none
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   dark:focus:ring-offset-gray-800"
      >
        <span className="flex items-center gap-2">
          Send
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>
    </div>
  );
}
