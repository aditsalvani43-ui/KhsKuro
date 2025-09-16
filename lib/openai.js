import OpenAI from 'openai';

export class AIManager {
  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    this.conversationHistory = [];
  }

  async sendMessage(message, options = {}) {
    const {
      model = 'gpt-3.5-turbo',
      temperature = 0.7,
      maxTokens = 150
    } = options;

    try {
      this.conversationHistory.push({
        role: 'user',
        content: message
      });

      const completion = await this.openai.chat.completions.create({
        model: model,
        messages: this.conversationHistory,
        temperature: temperature,
        max_tokens: maxTokens,
      });

      const aiResponse = completion.choices[0].message.content;
      
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      return {
        success: true,
        response: aiResponse,
        usage: completion.usage
      };
    } catch (error) {
      this.conversationHistory.pop(); // Remove failed user message
      return {
        success: false,
        error: error.message
      };
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory() {
    return this.conversationHistory;
  }
  }
