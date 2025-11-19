export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
  error?: boolean;
}

export interface ConversationHistory {
  role: 'user' | 'model';
  parts: Array<{
    text: string;
  }>;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason?: string;
    safetyRatings?: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  promptFeedback?: {
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  };
}

export interface ChatSettings {
  darkMode: boolean;
  streamingEnabled: boolean;
  conversationHistory: boolean;
  autoSave: boolean;
}

export interface SavedConversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}
