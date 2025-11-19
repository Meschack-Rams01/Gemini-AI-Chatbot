import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import type { SavedConversation } from '../types';

interface ConversationManagerProps {
  onClose: () => void;
}

export const ConversationManager: React.FC<ConversationManagerProps> = ({ onClose }) => {
  const [conversations, setConversations] = useState<SavedConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<SavedConversation | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    const saved = StorageService.getSavedConversations();
    setConversations(saved.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  };

  const handleLoadConversation = (conversation: SavedConversation) => {
    StorageService.saveCurrentConversation(conversation.messages);
    window.location.reload(); // Simple way to reload the chat with new conversation
  };

  const handleDeleteConversation = (id: string) => {
    StorageService.deleteConversation(id);
    loadConversations();
    setShowDeleteConfirm(null);
    if (selectedConversation?.id === id) {
      setSelectedConversation(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all saved conversations? This action cannot be undone.')) {
      StorageService.clearAllConversations();
      loadConversations();
      setSelectedConversation(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getMessagePreview = (conversation: SavedConversation) => {
    const firstUserMessage = conversation.messages.find(msg => msg.isUser);
    if (!firstUserMessage) {
      return 'No messages';
    }

    const preview = firstUserMessage.text.slice(0, 100);
    return preview + (firstUserMessage.text.length > 100 ? '...' : '');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4 h-[80vh] flex transition-colors">
        {/* Sidebar - Conversation List */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Saved Conversations
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">💬</div>
                <p>No saved conversations yet</p>
                <p className="text-xs mt-1">Start chatting and save conversations to see them here</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {conversation.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {getMessagePreview(conversation)}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
                        <span>{formatDate(conversation.timestamp)}</span>
                        <span className="mx-1">•</span>
                        <span>{conversation.messages.length} messages</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {conversations.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleClearAll}
                className="w-full text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition-colors"
              >
                Clear All Conversations
              </button>
            </div>
          )}
        </div>

        {/* Main Content - Conversation Preview */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      {selectedConversation.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(selectedConversation.timestamp)} • {selectedConversation.messages.length} messages
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLoadConversation(selectedConversation)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(selectedConversation.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                        message.isUser
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {message.text}
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">👈</div>
                <p>Select a conversation to preview</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Delete Conversation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete this conversation? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-2 rounded text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConversation(showDeleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};