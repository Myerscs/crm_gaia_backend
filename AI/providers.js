import { API_KEY_CLAUDE, API_KEY_DEEPSEEK } from '../config/config.js';

export const AI_PROVIDERS = {
  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    headers: {
      Authorization: `Bearer ${API_KEY_DEEPSEEK}`,
      'Content-Type': 'application/json'
    },
    formatPayload: (messages, options) => ({
      model: options.model || 'deepseek-v4-flash',
      messages,
      web_search: options.webSearch || false,
      max_tokens: options.tokens || 1500,
      temperature: options.temperature || 0.1,
      top_p: options.topP || 0.05,
      response_format:{
        'type': 'json_object'
     },
    }),
    extractResponse: (data) => data.choices?.[0]?.message?.content
  },

  claude: {
    url: 'https://api.anthropic.com/v1/messages',
    headers: {
      'x-api-key': API_KEY_CLAUDE,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    formatPayload: (messages, options) => ({
      model: options.model ?? 'claude-opus-4-5',
      max_tokens: options.tokens || 1500,
      messages: messages.filter(m => m.role !== 'system').map((m, i) => ({
        role: i === 0 ? 'user' : (['user', 'assistant'].includes(m.role) ? m.role : 'user'),
        content: m.content
      })),
       system: messages?.find(m => m.role === 'system').content.trim(),
       tools: options.tools || [],
      }),
     extractResponse: (data) => {
    if (!Array.isArray(data.content)) return null;    
    const textContent = data.content.find(item => item.type === 'text');
    return textContent?.text || null;
  }
  }
};