"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import QuickPrompts from "@/components/QuickPrompts";
import Toast from "@/components/Toast";
import DarkModeToggle from "@/components/DarkModeToggle";
import ScrollToBottom from "@/components/ScrollToBottom";
import { 
  saveConversation, 
  getCurrentConversationId, 
  setCurrentConversationId,
  exportConversation,
  type Conversation 
} from "@/utils/conversationStorage";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  id?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [conversationId, setConversationIdState] = useState<string>(() => {
    const existing = getCurrentConversationId();
    return existing || `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const lastUserMessageRef = useRef<string>("");

  // Initialize conversation ID
  useEffect(() => {
    setCurrentConversationId(conversationId);
  }, [conversationId]);

  // Save conversation to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      const conv: Conversation = {
        id: conversationId,
        messages: messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp || new Date(),
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      saveConversation(conv);
    }
  }, [messages, conversationId]);

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 200);
      }
    };

    const main = mainRef.current;
    if (main) {
      main.addEventListener("scroll", handleScroll);
      return () => main.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const generateMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleSendMessage = async (message: string, isRegenerate = false) => {
    if (!message.trim() || isLoading) return;

    let messagesToSend = [...messages];
    if (isRegenerate && messagesToSend.length > 0) {
      // Remove last assistant message if regenerating
      const lastIndex = messagesToSend.length - 1;
      if (messagesToSend[lastIndex]?.role === "assistant") {
        messagesToSend = messagesToSend.slice(0, -1);
      }
    } else {
      // Add user message
      const userMessage: Message = { 
        role: "user", 
        content: message,
        timestamp: new Date(),
        id: generateMessageId(),
      };
      messagesToSend.push(userMessage);
      lastUserMessageRef.current = message;
    }

    setMessages(messagesToSend);
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
        id: generateMessageId(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to get response. Please make sure the backend is running on http://localhost:8000";
      setError(errorMessage);
      console.error("Error sending message:", err);
      // Restore previous messages if error
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConversation = () => {
    if (confirm("Are you sure you want to clear this conversation? This action cannot be undone.")) {
      setMessages([]);
      setError(null);
      const newId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setConversationIdState(newId);
      setCurrentConversationId(newId);
    }
  };

  const handleCopy = (text: string) => {
    setToast("Copied to clipboard!");
  };

  const handleRegenerate = () => {
    if (lastUserMessageRef.current) {
      handleSendMessage(lastUserMessageRef.current, true);
    }
  };

  const handleEditMessage = (id: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, content: newContent } : msg
      )
    );
    setToast("Message updated!");
  };

  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => {
      const index = prev.findIndex((msg) => msg.id === id);
      if (index >= 0) {
        // If we deleted a user message, also remove the following assistant message if any
        if (prev[index].role === "user" && index < prev.length - 1 && prev[index + 1].role === "assistant") {
          return prev.filter((msg, i) => i !== index && i !== index + 1);
        }
        return prev.filter((msg) => msg.id !== id);
      }
      return prev;
    });
    setToast("Message deleted!");
  };

  const handleExportConversation = (format: "txt" | "md" | "json" = "md") => {
    if (messages.length === 0) {
      setToast("No conversation to export!");
      return;
    }

    const conv: Conversation = {
      id: conversationId,
      messages: messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp || new Date(),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    exportConversation(conv, format);
    setToast(`Exported as ${format.toUpperCase()}!`);
  };

  const lastMessage = messages[messages.length - 1];
  const canRegenerate = !isLoading && lastMessage?.role === "assistant" && messages.length > 1;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center shadow-md">
                <span className="text-xl">💭</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                  Mental Coach
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                  Your supportive AI companion
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <>
                  <div className="relative group">
                    <button
                      onClick={() => handleExportConversation("md")}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="Export conversation"
                    >
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={handleClearConversation}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Clear conversation"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-fade-in">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl max-w-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-4xl">💭</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  Welcome to Mental Coach!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  I'm your supportive AI companion. Start a conversation and I'll help you with stress management, motivation, building habits, and growing your confidence.
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  <button
                    onClick={() => handleSendMessage("How can I reduce stress in my daily life?")}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium transition-colors"
                  >
                    Stress Relief
                  </button>
                  <button
                    onClick={() => handleSendMessage("I need motivation to achieve my goals")}
                    disabled={isLoading}
                    className="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium transition-colors"
                  >
                    Motivation
                  </button>
                  <button
                    onClick={() => handleSendMessage("Help me build better habits")}
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium transition-colors"
                  >
                    Habits
                  </button>
                  <button
                    onClick={() => handleSendMessage("How can I boost my self-confidence?")}
                    disabled={isLoading}
                    className="px-4 py-2 bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-100 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium transition-colors"
                  >
                    Confidence
                  </button>
                </div>
                <QuickPrompts onSelectPrompt={handleSendMessage} disabled={isLoading} />
              </div>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id || index}
                message={message}
                onCopy={handleCopy}
                onRegenerate={index === messages.length - 1 ? handleRegenerate : undefined}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                isLast={index === messages.length - 1}
                canRegenerate={canRegenerate}
              />
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start animate-fade-in">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-semibold">AI</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-md px-6 py-4 shadow-lg border border-gray-100 dark:border-gray-700 max-w-[75%]">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                    <div className="w-2.5 h-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  ⚠️ {error}
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Scroll to Bottom Button */}
      <ScrollToBottom onClick={scrollToBottom} show={showScrollButton} />

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Input Area */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </footer>
    </div>
  );
}
