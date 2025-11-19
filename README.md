# Gemini AI Chatbot

A modern AI chatbot application built with React, Vite, TypeScript, and Tailwind CSS that integrates with Google's Gemini API.

## Features

- 🤖 Real-time chat with Google's Gemini AI
- 💬 Clean and responsive chat interface
- 🔐 Secure API key input
- ⚡ Fast development with Vite
- 🎨 Beautiful styling with Tailwind CSS
- 📱 Mobile-friendly design
- ⌨️ TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- A Google Gemini API key

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com)
2. Sign in with your Google account
3. Click "Get API key" and create a new key
4. Copy the API key for use in the application

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gemini-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

5. Enter your Gemini API key when prompted to start using the enhanced features

## Usage

1. **Enter API Key**: On first launch, you'll be prompted to enter your Gemini API key
2. **Start Chatting**: Once the key is entered, you can start chatting with the AI
3. **Change API Key**: Click the "Change API Key" button in the top-right corner to use a different key

## Project Structure

```
src/
├── components/
│   ├── Chat.tsx                    # Basic chat component
│   ├── ChatInput.tsx               # Basic message input component
│   ├── Message.tsx                 # Basic individual message component
│   ├── EnhancedChat.tsx            # Enhanced chat component with advanced features
│   ├── EnhancedChatInput.tsx       # Enhanced input with auto-resize and indicators
│   ├── EnhancedMessage.tsx         # Enhanced message with actions and animations
│   ├── SettingsPanel.tsx           # Settings configuration panel
│   └── ConversationManager.tsx     # Conversation history management
├── services/
│   ├── geminiApi.ts                # Basic Gemini API integration
│   ├── enhancedGeminiApi.ts        # Enhanced API with streaming and history
│   └── storageService.ts           # Local storage management service
├── types.ts                        # TypeScript type definitions
├── App.tsx                         # Basic application component
├── EnhancedApp.tsx                 # Enhanced application with full features
├── main.tsx                        # Application entry point
└── index.css                       # Global styles with Tailwind and animations
```

## Enhanced Features

The enhanced version includes:

### 🚀 Advanced Chat Features
- **Streaming Responses**: Real-time message streaming for immediate feedback
- **Conversation Context**: AI remembers previous messages in the conversation
- **Message Actions**: Copy messages and regenerate AI responses
- **Auto-save**: Automatically saves your current conversation
- **Message Timestamps**: Track when each message was sent

### 💾 Conversation Management
- **Save Conversations**: Permanently save important conversations
- **Load Previous Conversations**: Resume any saved conversation
- **Conversation Preview**: See message previews and timestamps
- **Bulk Management**: Clear all conversations at once

### ⚙️ Customizable Settings
- **Dark/Light Mode**: Toggle between themes
- **Streaming Control**: Enable/disable real-time responses
- **Context Control**: Turn conversation memory on/off
- **Auto-save Control**: Manage automatic conversation saving

### 🎨 Enhanced UI/UX
- **Responsive Design**: Works perfectly on all screen sizes
- **Smooth Animations**: Fade-in effects and loading indicators
- **Interactive Elements**: Hover effects and visual feedback
- **Status Indicators**: Visual indicators for all active features
- **Auto-resize Input**: Text area grows with your message

### 🔧 Technical Improvements
- **TypeScript**: Full type safety throughout the application
- **Local Storage**: Persistent data storage in the browser
- **Error Handling**: Comprehensive error management
- **Performance**: Optimized rendering and state management

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Google Gemini API** - AI conversation capabilities

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The application uses Google's Gemini API through the `GeminiApiService` class. The service handles:

- API key management
- Request formatting
- Response parsing
- Error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on the repository.
