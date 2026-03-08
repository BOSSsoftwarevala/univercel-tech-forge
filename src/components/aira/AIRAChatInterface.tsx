/**
 * AIRA CHAT — WhatsApp-style CEO Communication Interface
 * Features: streaming AI, language detection, voice (future), image sharing (future)
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Mic, Image, Globe2, Bot, User, Loader2,
  CheckCheck, Clock, Sparkles, Volume2, Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  status: "sending" | "sent" | "delivered" | "read";
  language?: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/aira-chat`;

const QUICK_PROMPTS = [
  "System health summary",
  "Revenue report today",
  "Any critical alerts?",
  "Marketplace activity",
  "Pending approvals",
  "Security status",
];

export default function AIRAChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Good day, CEO. I'm **AIRA**, your executive intelligence advisor.\n\nI'm monitoring all **37 modules** across the Software Vala ecosystem. How can I assist you?",
      timestamp: new Date(),
      status: "read",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedLang, setDetectedLang] = useState("en");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText || isStreaming) return;
    setInput("");

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: msgText,
      timestamp: new Date(),
      status: "sending",
    };

    setMessages(prev => [...prev, userMsg]);

    // Update status to sent
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: "sent" } : m));
    }, 300);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: "delivered" } : m));
    }, 600);

    setIsStreaming(true);

    const historyMessages = [...messages.filter(m => m.id !== "welcome"), userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    let assistantSoFar = "";
    const assistantId = `a-${Date.now()}`;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: historyMessages }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({ error: "Connection failed" }));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.id === assistantId) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, {
                  id: assistantId,
                  role: "assistant" as const,
                  content: assistantSoFar,
                  timestamp: new Date(),
                  status: "read" as const,
                }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
            }
          } catch {}
        }
      }

      // Mark user msg as read
      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: "read" } : m));

    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `⚠️ ${err instanceof Error ? err.message : "Connection error. Please try again."}`,
        timestamp: new Date(),
        status: "read",
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const statusIcon = (status: string) => {
    if (status === "sending") return <Clock className="w-3 h-3 text-slate-500" />;
    if (status === "sent") return <CheckCheck className="w-3 h-3 text-slate-500" />;
    if (status === "delivered") return <CheckCheck className="w-3 h-3 text-slate-400" />;
    return <CheckCheck className="w-3 h-3 text-violet-400" />;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[700px] rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900/80">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-800" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">AIRA</h3>
          <p className="text-[10px] text-emerald-400">Online • Monitoring 37 modules</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-[9px] border-slate-600 text-slate-400 gap-1">
            <Languages className="w-3 h-3" />
            Auto-detect
          </Badge>
          <Badge variant="outline" className="text-[9px] border-violet-500/50 text-violet-400 gap-1">
            <Sparkles className="w-3 h-3" />
            AI Streaming
          </Badge>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 py-3">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] ${msg.role === "user" ? "order-1" : ""}`}>
                  {/* Avatar */}
                  <div className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user"
                        ? "bg-indigo-500/20"
                        : "bg-violet-500/20"
                    }`}>
                      {msg.role === "user"
                        ? <User className="w-3 h-3 text-indigo-400" />
                        : <Bot className="w-3 h-3 text-violet-400" />
                      }
                    </div>

                    {/* Bubble */}
                    <div className={`rounded-2xl px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-indigo-600/80 text-white rounded-br-md"
                        : "bg-slate-800/80 text-slate-200 rounded-bl-md border border-slate-700/50"
                    }`}>
                      <div className="text-sm leading-relaxed prose prose-sm prose-invert max-w-none
                        [&>p]:mb-1.5 [&>ul]:mb-1.5 [&>ol]:mb-1.5 [&>h1]:text-base [&>h2]:text-sm [&>h3]:text-sm
                        [&>*:last-child]:mb-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${msg.role === "user" ? "justify-end" : ""}`}>
                        <span className="text-[9px] text-slate-500">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {msg.role === "user" && statusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 px-4 py-2">
              <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
              <span className="text-xs text-slate-500">AIRA is thinking...</span>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      {messages.length <= 2 && !isStreaming && (
        <div className="px-4 py-2 border-t border-slate-800/50">
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800/60 text-slate-400 
                  hover:bg-violet-500/20 hover:text-violet-300 border border-slate-700/50 
                  hover:border-violet-500/30 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-3 py-2.5 border-t border-slate-700/50 bg-slate-800/50">
        <div className="flex items-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-500 hover:text-violet-400 flex-shrink-0"
            title="Voice message (coming soon)"
            disabled
          >
            <Mic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-500 hover:text-violet-400 flex-shrink-0"
            title="Share image (coming soon)"
            disabled
          >
            <Image className="w-4 h-4" />
          </Button>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message AIRA..."
              rows={1}
              className="w-full resize-none bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-2.5
                text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50
                focus:ring-1 focus:ring-violet-500/20 max-h-32 overflow-y-auto"
              style={{ minHeight: "40px" }}
              disabled={isStreaming}
            />
          </div>

          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isStreaming}
            size="icon"
            className="h-9 w-9 bg-violet-600 hover:bg-violet-500 text-white rounded-full flex-shrink-0 
              disabled:opacity-30 disabled:bg-slate-700 transition-all"
          >
            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
