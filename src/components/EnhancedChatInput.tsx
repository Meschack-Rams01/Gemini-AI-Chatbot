import React, { useState, useRef, useEffect } from 'react';
import type { ChatSettings } from '../types';

interface EnhancedChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  settings: ChatSettings;
}

export const EnhancedChatInput: React.FC<EnhancedChatInputProps> = ({
  onSendMessage,
  isLoading,
  settings
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 transition-colors">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-colors"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
            disabled={isLoading}
          />
          
          {/* Character count indicator */}
          {message.length > 0 && (
            <div className="absolute bottom-1 right-2 text-xs text-gray-400 dark:text-gray-500">
              {message.length}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="min-w-[120px] justify-center rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:from-blue-400 hover:via-indigo-500 hover:to-purple-500 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:pointer-events-none disabled:bg-gray-300 dark:disabled:bg-gray-600"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              <span>Send</span>
            </>
          )}
        </button>
      </form>

      {/* Settings indicator */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${settings.streamingEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span>{settings.streamingEnabled ? 'Streaming' : 'Standard'}</span>
          </span>
          
          <span className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${settings.conversationHistory ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
            <span>{settings.conversationHistory ? 'Context' : 'No Context'}</span>
          </span>
          
          <span className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${settings.autoSave ? 'bg-purple-500' : 'bg-gray-400'}`}></div>
            <span>{settings.autoSave ? 'Auto-save' : 'Manual'}</span>
          </span>
        </div>
        
        <div className="text-gray-400 dark:text-gray-500">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};