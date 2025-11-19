import React, { useState, useEffect } from 'react';
import { EnhancedChat } from './components/EnhancedChat';
import { SettingsPanel } from './components/SettingsPanel';
import { ConversationManager } from './components/ConversationManager';
import { StorageService } from './services/storageService';
import type { ChatSettings } from './types';

function EnhancedApp() {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>(StorageService.getSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [showConversations, setShowConversations] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved API key on startup
    const savedApiKey = StorageService.getApiKey();
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsApiKeySet(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      StorageService.saveApiKey(apiKey.trim());
      setIsApiKeySet(true);
    }
  };

  const resetApiKey = () => {
    setApiKey('');
    setIsApiKeySet(false);
    StorageService.clearApiKey();
  };

  const updateSettings = (newSettings: ChatSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const toggleDarkMode = () => {
    const newSettings = { ...settings, darkMode: !settings.darkMode };
    updateSettings(newSettings);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isApiKeySet) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Enhanced Gemini AI Chatbot
            </h1>
          <button
            onClick={toggleDarkMode}
            className="relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-2 text-white shadow-lg transition-all duration-300 hover:from-blue-400 hover:via-indigo-500 hover:to-purple-500 hover:-translate-y-0.5"
              title="Toggle dark mode"
            >
              {settings.darkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            Enter your Gemini API key to start chatting with enhanced features
          </p>
          
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 py-3 px-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-400 hover:via-indigo-500 hover:to-purple-500 hover:-translate-y-0.5"
            >
              Start Enhanced Chatting
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              Enhanced Features:
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
              <li>• Conversation history & context</li>
              <li>• Streaming responses</li>
              <li>• Save & load conversations</li>
              <li>• Dark mode support</li>
              <li>• Message actions (copy, regenerate)</li>
              <li>• Auto-save functionality</li>
            </ul>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
              How to get your API key:
            </p>
            <ol className="text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1">
              <li>1. Visit <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 dark:text-blue-400">aistudio.google.com</a></li>
              <li>2. Sign in with your Google account</li>
              <li>3. Click "Get API key" and create a new key</li>
              <li>4. Copy and paste it above</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen transition-colors ${settings.darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <EnhancedChat 
          apiKey={apiKey} 
          settings={settings}
          onSettingsChange={updateSettings}
        />
        
        {/* Header Controls */}
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <button
            onClick={() => setShowConversations(!showConversations)}
            className="flex items-center space-x-1 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-emerald-400 hover:to-green-500 hover:-translate-y-0.5"
            title="Manage conversations"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span>Conversations</span>
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-400 hover:to-pink-500 hover:-translate-y-0.5"
            title="Settings"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span>Settings</span>
          </button>
          
          <button
            onClick={resetApiKey}
            className="flex items-center space-x-1 rounded-full bg-gradient-to-r from-rose-500 to-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-rose-400 hover:to-red-500 hover:-translate-y-0.5"
            title="Change API key"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
            </svg>
            <span>Change Key</span>
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel
            settings={settings}
            onSettingsChange={updateSettings}
            onClose={() => setShowSettings(false)}
          />
        )}

        {/* Conversation Manager */}
        {showConversations && (
          <ConversationManager
            onClose={() => setShowConversations(false)}
          />
        )}
      </div>
    </div>
  );
}

export default EnhancedApp;