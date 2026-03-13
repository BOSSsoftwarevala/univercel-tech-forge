/**
 * DEVELOPER AI CHAT - LIVE STREAMING
 * Budget-friendly AI using mix model approach
 * Simple queries = Flash Lite, Complex = Flash
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, Code2, Bug, Zap, Lightbulb, 
  Copy, Check, Sparkles, RefreshCw, MessageSquare,
  Shield, Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const quickActions = [
  { label: 'Bug Fix', icon: Bug, prompt: 'Help me fix this bug: ', complexity: 'simple' },
  { label: 'Code Review', icon: Code2, prompt: 'Review this code for quality: ', complexity: 'complex' },
  { label: 'Optimize', icon: Zap, prompt: 'Optimize this code: ', complexity: 'complex' },
  { label: 'Explain', icon: Lightbulb, prompt: 'Explain this concept: ', complexity: 'simple' },
  { label: 'Security Check', icon: Shield, prompt: 'Check security of: ', complexity: 'complex' },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dev-ai-chat`;

const DevAIChatLive: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Namaste developer! 🙏 Main tumhara AI coding assistant hoon. Code help, bug fix, optimization - kuch bhi pucho. Cost-effective AI use hota hai, toh freely pucho!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const detectComplexity = (text: string): 'simple' | 'complex' => {
    const complexKeywords = ['review', 'optimize', 'refactor', 'architecture', 'security', 'performance', 'design pattern', 'algorithm', 'debug complex', 'explain in detail'];
    return complexKeywords.some(k => text.toLowerCase().includes(k)) ? 'complex' : 'simple';
  };

  const handleSend = async (overrideInput?: string) => {
    const text = overrideInput || input;
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const complexity = detectComplexity(text);
    let assistantSoFar = '';

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && prev.length > 1 && prev[prev.length - 2]?.content === text) {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          complexity,
        }),
      });

      if (resp.status === 429) { toast.error('Rate limit hit. Thoda wait karo.'); setIsLoading(false); return; }
      if (resp.status === 402) { toast.error('AI credits khatam. Admin se baat karo.'); setIsLoading(false); return; }
      if (!resp.ok || !resp.body) throw new Error('Stream failed');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let done = false;

      while (!done) {
        const { done: rd, value } = await reader.read();
        if (rd) break;
        buffer += decoder.decode(value, { stream: true });

        let nlIdx: number;
        while ((nlIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, nlIdx);
          buffer = buffer.slice(nlIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch { buffer = line + '\n' + buffer; break; }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error('AI se connect nahi ho paya');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    toast.success('Copied!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Brain className="w-7 h-7 text-violet-400" />
            AI Coding Assistant
          </h1>
          <p className="text-slate-400 mt-1">Budget-friendly AI — pucho freely, cost optimized hai</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-xs">
            <Sparkles className="w-3 h-3 mr-1" /> Live AI
          </Badge>
          <Badge variant="outline" className="text-slate-400 border-slate-600 text-[10px]">
            Mix Model: Lite + Flash
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-3">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Button key={i} size="sm" variant="outline"
              onClick={() => { setInput(action.prompt); inputRef.current?.focus(); }}
              className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 text-xs">
              <Icon className="w-3.5 h-3.5 mr-1.5" />{action.label}
            </Button>
          );
        })}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-slate-900/30 rounded-xl border border-slate-700/50 mb-3">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-cyan-500/15 border border-cyan-500/30'
                  : 'bg-violet-500/10 border border-violet-500/20'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-violet-400" />
                    <span className="text-[10px] text-violet-400 font-medium">Vala AI</span>
                  </div>
                )}
                <div className="prose prose-sm prose-invert max-w-none text-sm text-slate-200">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                {msg.role === 'assistant' && (
                  <button onClick={() => handleCopy(msg.content, idx)}
                    className="mt-2 flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 transition-colors">
                    {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedIdx === idx ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <div className="flex items-center gap-3">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <RefreshCw className="w-4 h-4 text-violet-400" />
                </motion.div>
                <span className="text-sm text-slate-400">AI soch raha hai...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
          }}
          placeholder="Kuch bhi pucho — code help, bug fix, optimization..."
          rows={2}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900/50 border border-violet-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors resize-none text-sm"
        />
        <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()}
          className="bg-violet-600 hover:bg-violet-500 h-auto px-6">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default DevAIChatLive;
