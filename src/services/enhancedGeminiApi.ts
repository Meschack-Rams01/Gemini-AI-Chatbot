import type { GeminiResponse, ConversationHistory } from '../types';

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1/models';
const GEMINI_API_URL = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent`;
const GEMINI_STREAM_URL = `${GEMINI_API_BASE}/${GEMINI_MODEL}:streamGenerateContent?alt=sse`;

export class EnhancedGeminiApiService {
  private apiKey: string;
  private conversationHistory: ConversationHistory[] = [];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  updateApiKey(newApiKey: string) {
    this.apiKey = newApiKey;
  }

  addToHistory(role: 'user' | 'model', text: string) {
    this.conversationHistory.push({
      role,
      parts: [{ text }]
    });
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory() {
    return [...this.conversationHistory];
  }

  async generateResponse(message: string, useHistory: boolean = true): Promise<string> {
    try {
      // Add user message to history
      this.addToHistory('user', message);

      const contents = useHistory ? this.conversationHistory : [
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];

      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const responseText = data.candidates[0].content.parts[0].text;
        // Add AI response to history
        this.addToHistory('model', responseText);
        return responseText;
      } else {
        throw new Error('No response generated');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to get response from Gemini API');
    }
  }

  async *generateStreamResponse(message: string, useHistory: boolean = true): AsyncGenerator<string, void, unknown> {
    try {
      // Add user message to history
      this.addToHistory('user', message);

      const contents = useHistory ? this.conversationHistory.slice(0, -1) : [];
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await fetch(`${GEMINI_STREAM_URL}&key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream available');
      }

      const decoder = new TextDecoder();
      let fullResponse = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.slice(6);
                if (jsonStr.trim() === '[DONE]') continue;
                
                const data = JSON.parse(jsonStr);
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                  const text = data.candidates[0].content.parts[0].text;
                  fullResponse += text;
                  yield text;
                }
              } catch {
                // Skip invalid JSON lines
                continue;
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Add complete response to history
      if (fullResponse) {
        this.addToHistory('model', fullResponse);
      }

    } catch (error) {
      console.error('Error in stream response:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to get stream response from Gemini API');
    }
  }

  exportConversation(): string {
    return JSON.stringify(this.conversationHistory, null, 2);
  }

  importConversation(data: string): boolean {
    try {
      const history = JSON.parse(data);
      if (Array.isArray(history)) {
        this.conversationHistory = history;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
