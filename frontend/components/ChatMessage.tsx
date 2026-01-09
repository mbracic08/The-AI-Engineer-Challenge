"use client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
          <span className="text-white text-sm font-semibold">AI</span>
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-5 py-3.5 shadow-lg transition-all duration-200 hover:shadow-xl ${
          isUser
            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-md"
            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-md"
        }`}
      >
        <div className="whitespace-pre-wrap break-words leading-relaxed text-[15px]">{message.content}</div>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-md">
          <span className="text-white text-xs font-semibold">You</span>
        </div>
      )}
    </div>
  );
}
