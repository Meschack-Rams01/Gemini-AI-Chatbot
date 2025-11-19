import React, { useState, useRef, useEffect } from 'react';
import { EnhancedMessage } from './EnhancedMessage';
import { EnhancedChatInput } from './EnhancedChatInput';
import { EnhancedGeminiApiService } from '../services/enhancedGeminiApi';
import { StorageService } from '../services/storageService';
import type { Message as MessageType, ChatSettings } from '../types';

interface EnhancedChatProps {
  apiKey: string;
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
}

export const EnhancedChat: React.FC<EnhancedChatProps> = ({ 
  apiKey, 
  settings, 
  onSettingsChange 
}) => {
  // Currently unused, but kept for future settings-related behavior
  void onSettingsChange;

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const geminiService = useRef(new EnhancedGeminiApiService(apiKey));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load saved conversation on mount
    if (settings.autoSave) {
      const savedMessages = StorageService.getCurrentConversation();
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
      }
    }
  }, [settings.autoSave]);

  useEffect(() => {
    // Auto-save current conversation
    if (settings.autoSave && messages.length > 0) {
      StorageService.saveCurrentConversation(messages);
    }
  }, [messages, settings.autoSave]);

  useEffect(() => {
    // Update API key in service
    geminiService.current.updateApiKey(apiKey);
  }, [apiKey]);

  const handleSendMessage = async (text: string) => {
    const userMessage: MessageType = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (settings.streamingEnabled) {
        // Streaming response
        const aiMessageId = (Date.now() + 1).toString();
        const aiMessage: MessageType = {
          id: aiMessageId,
          text: '',
          isUser: false,
          timestamp: new Date(),
          isStreaming: true,
        };

        setMessages(prev => [...prev, aiMessage]);
        setStreamingMessageId(aiMessageId);

        let fullResponse = '';
        const stream = geminiService.current.generateStreamResponse(text, settings.conversationHistory);

        for await (const chunk of stream) {
          fullResponse += chunk;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, text: fullResponse }
                : msg
            )
          );
        }

        // Mark streaming as complete
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
        setStreamingMessageId(null);

      } else {
        // Regular response
        const response = await geminiService.current.generateResponse(text, settings.conversationHistory);
        const aiMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          text: response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
        error: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      setStreamingMessageId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateMessage = async (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    const previousUserMessage = messages[messageIndex - 1];
    if (!previousUserMessage.isUser) return;

    // Remove the message to regenerate and all messages after it
    const updatedMessages = messages.slice(0, messageIndex);
    setMessages(updatedMessages);

    // Clear conversation history up to this point
    geminiService.current.clearHistory();
    
    // Rebuild conversation history
    for (let i = 0; i < updatedMessages.length; i += 2) {
      if (updatedMessages[i] && updatedMessages[i].isUser) {
        geminiService.current.addToHistory('user', updatedMessages[i].text);
      }
      if (updatedMessages[i + 1] && !updatedMessages[i + 1].isUser) {
        geminiService.current.addToHistory('model', updatedMessages[i + 1].text);
      }
    }

    // Regenerate response
    await handleSendMessage(previousUserMessage.text);
  };

  const handleCopyMessage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    geminiService.current.clearHistory();
    StorageService.clearCurrentConversation();
  };

  const saveConversation = () => {
    if (messages.length === 0) return;

    const title = messages[0]?.text.slice(0, 50) + (messages[0]?.text.length > 50 ? '...' : '') || 'New Conversation';
    const conversation = {
      id: Date.now().toString(),
      title,
      messages,
      timestamp: new Date(),
    };

    StorageService.saveConversation(conversation);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors pt-20 sm:pt-24">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3 transition-colors">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Enhanced Gemini AI Chatbot
          </h1>
          <div className="flex items-center space-x-2">
            {messages.length > 0 && (
              <>
                <button
                  onClick={saveConversation}
                  className="rounded-full bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-sky-400 hover:to-blue-500 hover:-translate-y-0.5"
                  title="Save conversation"
                >
                  Save
                </button>
                <button
                  onClick={clearConversation}
                  className="rounded-full bg-gradient-to-r from-slate-500 to-gray-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-slate-400 hover:to-gray-600 hover:-translate-y-0.5"
                  title="Clear conversation"
                >
                  Clear
                </button>
              </>
            )}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {messages.length} messages
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-lg mb-2">Start a conversation with Enhanced Gemini AI!</p>
              <p className="text-sm">
                Features: {settings.streamingEnabled ? 'Streaming' : 'Standard'} responses, 
                {settings.conversationHistory ? ' Context aware' : ' No context'}, 
                {settings.darkMode ? ' Dark mode' : ' Light mode'}
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <EnhancedMessage 
              key={message.id} 
              message={message}
              onRegenerate={handleRegenerateMessage}
              onCopy={handleCopyMessage}
              isStreaming={streamingMessageId === message.id}
            />
          ))
        )}
        
        {isLoading && !streamingMessageId && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <EnhancedChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading}
        settings={settings}
      />
    </div>
  );
};