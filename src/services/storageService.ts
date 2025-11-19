import type { SavedConversation, ChatSettings, Message } from '../types';

const STORAGE_KEYS = {
  API_KEY: 'gemini_api_key',
  SETTINGS: 'chat_settings',
  CONVERSATIONS: 'saved_conversations',
  CURRENT_CONVERSATION: 'current_conversation'
} as const;

export class StorageService {
  // API Key management
  static saveApiKey(apiKey: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    } catch (error) {
      console.error('Failed to save API key:', error);
    }
  }

  static getApiKey(): string | null {
    try {
      const storedKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
      return storedKey ?? null;
    } catch (error) {
      console.error('Failed to retrieve API key:', error);
      return null;
    }
  }

  static clearApiKey(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
    } catch (error) {
      console.error('Failed to clear API key:', error);
    }
  }

  // Settings management
  static saveSettings(settings: ChatSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  static getSettings(): ChatSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to retrieve settings:', error);
    }
    
    // Return default settings
    return {
      darkMode: false,
      streamingEnabled: true,
      conversationHistory: true,
      autoSave: true
    };
  }

  // Conversation management
  static saveConversation(conversation: SavedConversation): void {
    try {
      const conversations = this.getSavedConversations();
      const existingIndex = conversations.findIndex(c => c.id === conversation.id);
      
      if (existingIndex >= 0) {
        conversations[existingIndex] = conversation;
      } else {
        conversations.push(conversation);
      }
      
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }

  static getSavedConversations(): SavedConversation[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (stored) {
        const conversations = JSON.parse(stored) as SavedConversation[];
        // Convert timestamp strings back to Date objects
        return conversations.map((conv) => ({
          ...conv,
          timestamp: new Date(conv.timestamp),
          messages: conv.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
      }
    } catch (error) {
      console.error('Failed to retrieve saved conversations:', error);
    }
    return [];
  }

  static deleteConversation(id: string): void {
    try {
      const conversations = this.getSavedConversations();
      const filtered = conversations.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  }

  static clearAllConversations(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    } catch (error) {
      console.error('Failed to clear conversations:', error);
    }
  }

  // Current conversation auto-save
  static saveCurrentConversation(messages: Message[]): void {
    try {
      if (this.getSettings().autoSave) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_CONVERSATION, JSON.stringify(messages));
      }
    } catch (error) {
      console.error('Failed to auto-save current conversation:', error);
    }
  }

  static getCurrentConversation(): Message[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_CONVERSATION);
      if (stored) {
        const messages = JSON.parse(stored) as Message[];
        // Convert timestamp strings back to Date objects
        return messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to retrieve current conversation:', error);
    }
    return [];
  }

  static clearCurrentConversation(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CONVERSATION);
    } catch (error) {
      console.error('Failed to clear current conversation:', error);
    }
  }

  // Utility methods
  static exportAllData(): string {
    try {
      const data = {
        settings: this.getSettings(),
        conversations: this.getSavedConversations(),
        currentConversation: this.getCurrentConversation()
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return '';
    }
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      
      if (data.conversations && Array.isArray(data.conversations)) {
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(data.conversations));
      }
      
      if (data.currentConversation && Array.isArray(data.currentConversation)) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_CONVERSATION, JSON.stringify(data.currentConversation));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  static getStorageUsage(): { used: number; available: number } {
    try {
      let used = 0;
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          const value = localStorage.getItem(key);
          used += (value?.length ?? 0) + key.length;
        }
      }
      
      // Estimate available space (most browsers have ~5-10MB limit)
      const estimated = 5 * 1024 * 1024; // 5MB estimate
      return {
        used,
        available: Math.max(0, estimated - used)
      };
    } catch (error) {
      console.error('Failed to calculate storage usage:', error);
      return { used: 0, available: 0 };
    }
  }
}
