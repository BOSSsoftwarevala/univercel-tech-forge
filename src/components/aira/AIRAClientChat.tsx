/**
 * AIRA Marketplace Chat Widget — Floating assistant for customers
 * Handles demo explanation, payment help, product Q&A
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles, Volume2, HelpCircle, CreditCard, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import airaAvatar from '@/assets/aira-avatar.png';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIRAClientChatProps {
  productId?: string;
  productName?: string;
  conversationType?: 'general' | 'demo' | 'payment' | 'followup';
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/aira-client-chat`;

const QUICK_ACTIONS = [
  { icon: Play, label: 'Explain this product', type: 'demo' as const },
  { icon: CreditCard, label: 'Help with payment', type: 'payment' as const },
  { icon: HelpCircle, label: 'Ask a question', type: 'general' as const },
];

export default function AIRAClientChat({ productId, productName, conversationType = 'general' }: AIRAClientChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeType, setActiveType] = useState(conversationType);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = productName
        ? `Hi! 👋 I'm **AIRA**, your assistant. I can help you with **${productName}**.\n\nWould you like me to:\n- 🎬 Walk you through the demo\n- 💳 Help with payment\n- ❓ Answer your questions`
        : `Hi! 👋 I'm **AIRA**, your Software Vala assistant.\n\nI can help you find the right software, explain demos, and assist with purchases. How can I help?`;
      
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: welcomeMsg,
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, productName]);

  const sendMessage = useCallback(async (text?: string, type?: string) => {
    const msgText = text || input.trim();
    if (!msgText || isStreaming) return;
    setInput('');

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: msgText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    const historyMessages = [...messages.filter(m => m.id !== 'welcome'), userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    let assistantSoFar = '';
    const assistantId = `a-${Date.now()}`;

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: historyMessages,
          productId,
          productName,
          conversationType: type || activeType,
        }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({ error: 'Connection failed' }));
        if (errData.blocked) {
          setMessages(prev => [...prev, {
            id: `err-${Date.now()}`, role: 'assistant', content: errData.error, timestamp: new Date(),
          }]);
          setIsStreaming(false);
          return;
        }
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.id === assistantId) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { id: assistantId, role: 'assistant' as const, content: assistantSoFar, timestamp: new Date() }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`, role: 'assistant',
        content: `I'm sorry, I couldn't process that. Please try again.`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, productId, productName, activeType]);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full overflow-hidden shadow-lg shadow-violet-500/25 flex items-center justify-center hover:shadow-violet-500/40 transition-shadow border-2 border-violet-500/50"
          >
            <img src={airaAvatar} alt="AIRA" className="w-full h-full object-cover" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[560px] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-slate-700/50 flex flex-col bg-slate-900"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-600/90 to-indigo-600/90 border-b border-white/10">
              <div className="relative">
                <img src={airaAvatar} alt="AIRA" className="w-9 h-9 rounded-full object-cover border-2 border-white/30" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-violet-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">AIRA Assistant</h3>
                <p className="text-[10px] text-white/70">Software Vala • Always here to help</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-3 py-2">
              <div className="space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                      msg.role === 'user'
                        ? 'bg-violet-600 text-white rounded-br-sm'
                        : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700/50'
                    }`}>
                      <div className="text-[13px] leading-relaxed prose prose-sm prose-invert max-w-none [&>p]:mb-1 [&>ul]:mb-1 [&>*:last-child]:mb-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 block">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
                  <div className="flex items-center gap-2 px-3 py-2">
                    <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                    <span className="text-xs text-slate-500">AIRA is typing...</span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions (show when few messages) */}
            {messages.length <= 2 && !isStreaming && (
              <div className="px-3 py-2 border-t border-slate-800/50">
                <div className="flex gap-1.5">
                  {QUICK_ACTIONS.map(action => (
                    <button
                      key={action.label}
                      onClick={() => {
                        setActiveType(action.type);
                        sendMessage(action.label, action.type);
                      }}
                      className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800/60 text-slate-400 text-[10px] hover:bg-violet-500/20 hover:text-violet-300 border border-slate-700/50 hover:border-violet-500/30 transition-all"
                    >
                      <action.icon className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-2.5 border-t border-slate-700/50 bg-slate-800/50">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-full px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50"
                  disabled={isStreaming}
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isStreaming}
                  size="icon"
                  className="h-9 w-9 bg-violet-600 hover:bg-violet-500 text-white rounded-full disabled:opacity-30"
                >
                  {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-[9px] text-slate-600 text-center mt-1.5">
                Powered by AIRA • Software Vala
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
