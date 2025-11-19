import React from 'react';
import type { ChatSettings } from '../types';

interface SettingsPanelProps {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onClose
}) => {
  const handleToggle = (key: keyof ChatSettings) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key]
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Chat Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-800 dark:text:white">
                Dark Mode
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Switch between light and dark themes
              </p>
            </div>
            <button
              onClick={() => handleToggle('darkMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Streaming */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-800 dark:text:white">
                Streaming Responses
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Show responses as they are generated
              </p>
            </div>
            <button
              onClick={() => handleToggle('streamingEnabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.streamingEnabled ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.streamingEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Conversation History */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-800 dark:text:white">
                Conversation Context
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                AI remembers previous messages in the conversation
              </p>
            </div>
            <button
              onClick={() => handleToggle('conversationHistory')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.conversationHistory ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.conversationHistory ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Auto Save */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-800 dark:text:white">
                Auto-save Conversations
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Automatically save your current conversation
              </p>
            </div>
            <button
              onClick={() => handleToggle('autoSave')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoSave ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p><strong>Tip:</strong> Streaming responses provide real-time feedback</p>
            <p><strong>Note:</strong> Context awareness improves conversation quality</p>
            <p><strong>Storage:</strong> Auto-save keeps your conversations safe</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-5 py-2.5 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-400 hover:via-indigo-500 hover:to-purple-500 hover:-translate-y-0.5"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};