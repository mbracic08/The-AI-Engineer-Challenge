"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import QuickPrompts from "@/components/QuickPrompts";
import Toast from "@/components/Toast";
import DarkModeToggle from "@/components/DarkModeToggle";
import ScrollToBottom from "@/components/ScrollToBottom";
import AnimatedBackground from "@/components/AnimatedBackground";
import Logo from "@/components/Logo";
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
  const abortControllerRef = useRef<AbortController | null>(null);

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

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setToast("Generation stopped");
  };

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

    // Create assistant message placeholder for streaming
    const assistantMessageId = generateMessageId();
    const assistantMessage: Message = {
      role: "assistant",
      content: "",
      timestamp: new Date(),
      id: assistantMessageId,
    };
    
    // Set messages with user message and empty assistant placeholder in one update
    setMessages([...messagesToSend, assistantMessage]);
    setIsLoading(true);
    setError(null);

    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // Try streaming first, fallback to regular endpoint if it fails
      try {
        const response = await fetch(`${apiUrl}/api/chat/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Streaming failed with status ${response.status}`);
        }

        if (!response.body) {
          throw new Error("Response body is null");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Check if request was aborted
          if (abortController.signal.aborted) {
            reader.cancel();
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.trim() && line.startsWith("data: ")) {
              try {
                const jsonStr = line.slice(6).trim();
                if (!jsonStr) continue;
                
                const data = JSON.parse(jsonStr);
                if (data.token) {
                  accumulatedContent += data.token;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: accumulatedContent }
                        : msg
                    )
                  );
                } else if (data.done) {
                  // Streaming complete
                  return;
                } else if (data.error) {
                  throw new Error(data.error);
                }
              } catch (e) {
                // Skip invalid JSON - might be partial data
                if (line.trim().length > 10 && !(e instanceof SyntaxError)) {
                  console.warn("Failed to parse SSE data:", line, e);
                }
              }
            }
          }
        }
      } catch (streamError) {
        // Check if request was aborted
        if (abortController.signal.aborted) {
          return;
        }
        
        // Fallback to regular endpoint if streaming fails
        console.warn("Streaming failed, falling back to regular endpoint:", streamError);
        const response = await fetch(`${apiUrl}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: data.reply }
              : msg
          )
        );
      }
    } catch (err) {
      // Don't show error if request was aborted
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, keep the partial message
        return;
      }
      
      // Remove the placeholder message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to get response. Please make sure the backend is running on http://localhost:8000";
      setError(errorMessage);
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
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
    <div className="flex flex-col h-screen relative">
      <AnimatedBackground />
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-md border-b border-gray-200/60 dark:border-gray-800/60 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="lg" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 tracking-tight">
                  Mental Coach
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
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
        <div className="max-w-5xl mx-auto px-6 py-8">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 animate-fade-in">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl max-w-2xl border border-gray-200/60 dark:border-gray-800/60">
                <div className="mx-auto mb-8 flex justify-center">
                  <Logo size="xl" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 tracking-tight">
                  Welcome to Mental Coach!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-lg">
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
      <footer className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/60 dark:border-gray-800/60 sticky bottom-0 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </div>
            {isLoading && (
              <button
                onClick={handleStopGeneration}
                className="px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl 
                           transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                           dark:focus:ring-offset-gray-900 flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
