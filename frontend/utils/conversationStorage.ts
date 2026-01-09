export interface Conversation {
  id: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp?: Date;
    id?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = "mental_coach_conversations";
const CURRENT_CONVERSATION_KEY = "mental_coach_current_conversation";

export function saveConversation(conversation: Conversation): void {
  try {
    const conversations = getConversations();
    const index = conversations.findIndex(c => c.id === conversation.id);
    
    if (index >= 0) {
      conversations[index] = conversation;
    } else {
      conversations.push(conversation);
    }
    
    // Keep only last 50 conversations
    const sorted = conversations
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  } catch (error) {
    console.error("Error saving conversation:", error);
  }
}

export function getConversations(): Conversation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const conversations = JSON.parse(data);
    return conversations.map((conv: any) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map((msg: any) => ({
        ...msg,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined,
      })),
    }));
  } catch (error) {
    console.error("Error loading conversations:", error);
    return [];
  }
}

export function deleteConversation(id: string): void {
  try {
    const conversations = getConversations();
    const filtered = conversations.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting conversation:", error);
  }
}

export function getCurrentConversationId(): string | null {
  try {
    return localStorage.getItem(CURRENT_CONVERSATION_KEY);
  } catch (error) {
    return null;
  }
}

export function setCurrentConversationId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(CURRENT_CONVERSATION_KEY, id);
    } else {
      localStorage.removeItem(CURRENT_CONVERSATION_KEY);
    }
  } catch (error) {
    console.error("Error setting current conversation:", error);
  }
}

export function exportConversation(conversation: Conversation, format: "txt" | "md" | "json" = "md"): void {
  let content = "";
  let filename = `conversation-${conversation.id.substring(0, 8)}.${format}`;

  if (format === "json") {
    content = JSON.stringify(conversation, null, 2);
  } else if (format === "md") {
    content = `# Conversation\n\n`;
    content += `**Created:** ${conversation.createdAt.toLocaleString()}\n`;
    content += `**Updated:** ${conversation.updatedAt.toLocaleString()}\n\n`;
    content += `---\n\n`;
    
    conversation.messages.forEach((msg) => {
      const role = msg.role === "user" ? "You" : "AI";
      content += `## ${role}\n\n${msg.content}\n\n---\n\n`;
    });
  } else {
    content = `Conversation\n`;
    content += `Created: ${conversation.createdAt.toLocaleString()}\n`;
    content += `Updated: ${conversation.updatedAt.toLocaleString()}\n\n`;
    content += `${"=".repeat(50)}\n\n`;
    
    conversation.messages.forEach((msg) => {
      const role = msg.role === "user" ? "You" : "AI";
      content += `${role}:\n${msg.content}\n\n${"-".repeat(50)}\n\n`;
    });
  }

  const blob = new Blob([content], { type: format === "json" ? "application/json" : "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
