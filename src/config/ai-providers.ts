export type AIProviderId = 'openai' | 'claude' | 'gemini' | 'deepseek' | 'mistral' | 'local';

export type AIProviderCapability = 'reasoning' | 'architecture' | 'ui' | 'optimization' | 'fallback' | 'offline';

export interface AIProviderConfig {
  id: AIProviderId;
  name: string;
  envKey: string;
  apiKey: string;
  enabled: boolean;
  priority: number;
  capabilities: AIProviderCapability[];
  mode: 'cloud' | 'local';
}

const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env || {};

const readKey = (key: string) => env[key] || '';

export const AI_PROVIDER_KEYS = {
  OPENAI_API_KEY: readKey('VITE_OPENAI_API_KEY'),
  CLAUDE_API_KEY: readKey('VITE_CLAUDE_API_KEY'),
  GEMINI_API_KEY: readKey('VITE_GEMINI_API_KEY'),
  DEEPSEEK_API_KEY: readKey('VITE_DEEPSEEK_API_KEY'),
  MISTRAL_API_KEY: readKey('VITE_MISTRAL_API_KEY'),
  LOCAL_LLM_ENDPOINT: readKey('VITE_LOCAL_LLM_ENDPOINT'),
};

export const AI_PROVIDER_CONFIGS: AIProviderConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI GPT',
    envKey: 'VITE_OPENAI_API_KEY',
    apiKey: readKey('VITE_OPENAI_API_KEY'),
    enabled: Boolean(readKey('VITE_OPENAI_API_KEY')),
    priority: 1,
    capabilities: ['reasoning', 'architecture'],
    mode: 'cloud',
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    envKey: 'VITE_CLAUDE_API_KEY',
    apiKey: readKey('VITE_CLAUDE_API_KEY'),
    enabled: Boolean(readKey('VITE_CLAUDE_API_KEY')),
    priority: 2,
    capabilities: ['architecture', 'reasoning'],
    mode: 'cloud',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    envKey: 'VITE_GEMINI_API_KEY',
    apiKey: readKey('VITE_GEMINI_API_KEY'),
    enabled: Boolean(readKey('VITE_GEMINI_API_KEY')),
    priority: 3,
    capabilities: ['ui', 'reasoning'],
    mode: 'cloud',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    envKey: 'VITE_DEEPSEEK_API_KEY',
    apiKey: readKey('VITE_DEEPSEEK_API_KEY'),
    enabled: Boolean(readKey('VITE_DEEPSEEK_API_KEY')),
    priority: 4,
    capabilities: ['optimization', 'fallback'],
    mode: 'cloud',
  },
  {
    id: 'mistral',
    name: 'Mistral',
    envKey: 'VITE_MISTRAL_API_KEY',
    apiKey: readKey('VITE_MISTRAL_API_KEY'),
    enabled: Boolean(readKey('VITE_MISTRAL_API_KEY')),
    priority: 5,
    capabilities: ['fallback'],
    mode: 'cloud',
  },
  {
    id: 'local',
    name: 'Local LLM',
    envKey: 'VITE_LOCAL_LLM_ENDPOINT',
    apiKey: readKey('VITE_LOCAL_LLM_ENDPOINT'),
    enabled: Boolean(readKey('VITE_LOCAL_LLM_ENDPOINT')),
    priority: 6,
    capabilities: ['offline', 'fallback'],
    mode: 'local',
  },
];

export function getEnabledAIProviders() {
  return AI_PROVIDER_CONFIGS.filter((provider) => provider.enabled).sort((left, right) => left.priority - right.priority);
}

export function getProviderByCapability(capability: AIProviderCapability) {
  return getEnabledAIProviders().find((provider) => provider.capabilities.includes(capability)) || null;
}

export function getProviderFallbackChain() {
  const enabled = getEnabledAIProviders();
  return enabled.length > 0 ? enabled : AI_PROVIDER_CONFIGS.filter((provider) => provider.id === 'local' || provider.id === 'mistral');
}

export function getAIProviderHealthSummary() {
  const enabled = getEnabledAIProviders();
  return {
    total: AI_PROVIDER_CONFIGS.length,
    enabled: enabled.length,
    fallbackMode: enabled.length === 0,
    providers: AI_PROVIDER_CONFIGS.map((provider) => ({
      id: provider.id,
      name: provider.name,
      enabled: provider.enabled,
      mode: provider.mode,
      capabilities: provider.capabilities,
    })),
  };
}