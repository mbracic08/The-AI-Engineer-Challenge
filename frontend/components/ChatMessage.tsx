"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatTime } from "@/utils/formatTime";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  id?: string;
}

interface ChatMessageProps {
  message: Message;
  onCopy?: (text: string) => void;
  onRegenerate?: () => void;
  onEdit?: (id: string, newContent: string) => void;
  onDelete?: (id: string) => void;
  isLast?: boolean;
  canRegenerate?: boolean;
}

export default function ChatMessage({ 
  message, 
  onCopy, 
  onRegenerate,
  onEdit,
  onDelete,
  isLast = false,
  canRegenerate = false
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onCopy?.(message.content);
  };

  const handleEdit = () => {
    if (isEditing && editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id || "", editContent.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete?.(message.id || "");
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <div 
      className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
          <span className="text-white text-sm font-semibold">AI</span>
        </div>
      )}
      
      <div className="flex flex-col gap-1 max-w-[75%]">
        <div
          className={`relative rounded-2xl px-5 py-3.5 shadow-lg transition-all duration-200 hover:shadow-xl ${
            isUser
              ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-md"
              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-md"
          }`}
        >
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleEdit();
                }
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setEditContent(message.content);
                }
              }}
              autoFocus
              className="w-full bg-transparent border-none outline-none resize-none text-[15px] leading-relaxed"
              rows={Math.min(editContent.split("\n").length, 10)}
            />
          ) : (
            <div className="leading-relaxed text-[15px]">
              {isUser ? (
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-sm dark:prose-invert max-w-none
                    prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2
                    prose-li:my-1 prose-code:text-blue-600 dark:prose-code:text-blue-400
                    prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:text-gray-800 dark:prose-pre:text-gray-200
                    prose-a:text-blue-600 dark:prose-a:text-blue-400"
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
          )}

          {/* Action buttons */}
          {(isHovered || showDeleteConfirm) && (
            <div className={`absolute ${isUser ? "-left-20" : "-right-20"} top-0 flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in`}>
              {!isEditing && (
                <>
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Copy message"
                  >
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  
                  {isUser && message.id && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Edit message"
                      >
                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={handleDelete}
                        className={`p-2 rounded transition-colors ${showDeleteConfirm ? "bg-red-100 dark:bg-red-900/30" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        title={showDeleteConfirm ? "Click again to confirm" : "Delete message"}
                      >
                        <svg className={`w-4 h-4 ${showDeleteConfirm ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                  
                  {!isUser && isLast && canRegenerate && onRegenerate && (
                    <button
                      onClick={onRegenerate}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Regenerate response"
                    >
                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        
        {message.timestamp && (
          <span className={`text-xs text-gray-500 dark:text-gray-400 ${isUser ? "text-right" : "text-left"}`}>
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-md">
          <span className="text-white text-xs font-semibold">You</span>
        </div>
      )}
    </div>
  );
}
