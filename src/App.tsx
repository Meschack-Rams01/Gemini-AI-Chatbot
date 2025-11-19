import React, { useState } from 'react';
import { Chat } from './components/Chat';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setIsApiKeySet(true);
    }
  };

  const resetApiKey = () => {
    setApiKey('');
    setIsApiKeySet(false);
  };

  if (!isApiKeySet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Gemini AI Chatbot
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Enter your Gemini API key to start chatting
          </p>
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Chatting
            </button>
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>How to get your API key:</strong>
            </p>
            <ol className="text-sm text-blue-700 mt-2 space-y-1">
              <li>1. Visit <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="underline">aistudio.google.com</a></li>
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
    <div className="relative">
      <Chat apiKey={apiKey} />
      <button
        onClick={resetApiKey}
        className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
      >
        Change API Key
      </button>
    </div>
  );
}

export default App;
