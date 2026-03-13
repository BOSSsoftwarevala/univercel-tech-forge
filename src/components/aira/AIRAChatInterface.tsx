/**
 * AIRA CHAT — Voice-First CEO Communication Interface
 * ====================================================
 * - ElevenLabs TTS: AIRA speaks every response automatically
 * - Audio-only by default (Boss's privacy protected)
 * - Visual access only when Boss explicitly allows it
 * - Content filter on all messages
 * - Relaxing, professional female voice
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Mic, MicOff, Bot, User, Loader2,
  CheckCheck, Clock, Sparkles, Volume2, VolumeX,
  Languages, Eye, EyeOff, Square, Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import AIRAVoiceOrb from "./AIRAVoiceOrb";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  status: "sending" | "sent" | "delivered" | "read";
  language?: string;
  isSpoken?: boolean;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/aira-chat`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;

const QUICK_PROMPTS = [
  "📊 Revenue report & finance split",
  "💰 Pending payments follow-up",
  "🛒 Recent orders status",
  "🔧 Delegate task to VALA AI",
  "📈 SEO status for products",
  "⚡ System health summary",
  "🔒 Security status",
  "📋 Show my 40/28/20/12 split",
];

// AIRA uses Sarah voice — warm, professional female
const AIRA_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah

export default function AIRAChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Good day, Boss. I'm **AIRA**, your executive intelligence advisor & manager.\n\nI'm monitoring all **37 modules** and managing your operations:\n\n🎯 **Task Delegation** — Tell me to assign work to VALA AI\n💰 **Payment Follow-up** — I'll chase pending payments automatically\n📊 **Finance Split** — 40% Marketing | 28% Govt | 20% Office | 12% You\n🛒 **Order Management** — I connect with customers on new orders\n📈 **SEO Management** — Auto-optimize your product listings\n\nI'm in **audio-only mode** 🎧 — Say \"you can see\" to enable screen access.\n\nHow can I assist you today?",
      timestamp: new Date(),
      status: "read",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedLang, setDetectedLang] = useState("en");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [canSeeScreen, setCanSeeScreen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── TTS: Speak AIRA's response ───
  const speakText = useCallback(async (text: string) => {
    if (!text || text.trim().length < 3) return;

    // Clean markdown for speech
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/```[\s\S]*?```/g, 'code block omitted')
      .replace(/`[^`]+`/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[|─═┤├┼┐┌└┘]/g, '')
      .substring(0, 4000);

    if (cleanText.trim().length < 3) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (abortRef.current) abortRef.current.abort();

    setIsLoadingVoice(true);
    abortRef.current = new AbortController();

    try {
      const response = await fetch(TTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          text: cleanText,
          voiceId: AIRA_VOICE_ID,
          stability: 0.6,
          similarityBoost: 0.8,
          style: 0.4,
          speed: 0.95,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        // Fallback to browser TTS
        speakWithBrowser(cleanText);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        speakWithBrowser(cleanText);
      };

      await audio.play();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('AIRA voice error:', err);
      speakWithBrowser(cleanText);
    } finally {
      setIsLoadingVoice(false);
    }
  }, []);

  // Browser TTS fallback
  const speakWithBrowser = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.substring(0, 2000));
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 0.9;
    // Try to find a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => 
      v.name.toLowerCase().includes('female') || 
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('victoria') ||
      v.name.toLowerCase().includes('karen')
    );
    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (abortRef.current) abortRef.current.abort();
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsLoadingVoice(false);
  }, []);

  // ─── Visual access control ───
  const checkVisualCommand = useCallback((text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('you can see') || lower.includes('tum dekh sakti ho') || lower.includes('screen dekho')) {
      setCanSeeScreen(true);
      toast.success('AIRA can now see your screen activity');
    } else if (lower.includes('stop watching') || lower.includes('stop seeing') || lower.includes('mat dekho') || lower.includes("don't see") || lower.includes('screen band')) {
      setCanSeeScreen(false);
      toast.info('AIRA is now in audio-only mode');
    }
  }, []);

  const sendMessage = useCallback(async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText || isStreaming) return;
    setInput("");

    // Check visual access commands
    checkVisualCommand(msgText);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: msgText,
      timestamp: new Date(),
      status: "sending",
    };

    setMessages(prev => [...prev, userMsg]);

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
        if (errData.blocked) {
          toast.error(errData.error || 'Message blocked');
          setIsStreaming(false);
          return;
        }
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

      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: "read" } : m));

      // Auto-speak AIRA's response
      if (autoSpeak && assistantSoFar.trim()) {
        setTimeout(() => speakText(assistantSoFar), 300);
      }

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
  }, [input, isStreaming, messages, autoSpeak, speakText, checkVisualCommand]);

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
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-800" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            AIRA
            {isSpeaking && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                <Volume2 className="w-3.5 h-3.5 text-violet-400" />
              </motion.div>
            )}
          </h3>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1.5">
            <Headphones className="w-3 h-3" />
            {canSeeScreen ? 'Screen access ON' : 'Audio-only mode'} • 37 modules
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Visual Access Toggle */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-700/50 border border-slate-600/50">
            {canSeeScreen ? (
              <Eye className="w-3 h-3 text-amber-400" />
            ) : (
              <EyeOff className="w-3 h-3 text-slate-500" />
            )}
            <span className="text-[9px] text-slate-400">Vision</span>
            <Switch
              checked={canSeeScreen}
              onCheckedChange={(v) => {
                setCanSeeScreen(v);
                toast(v ? '👁️ AIRA can now see your screen' : '🔒 AIRA is in audio-only mode');
              }}
              className="scale-75"
            />
          </div>

          {/* Auto-speak Toggle */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-700/50 border border-slate-600/50">
            {autoSpeak ? (
              <Volume2 className="w-3 h-3 text-violet-400" />
            ) : (
              <VolumeX className="w-3 h-3 text-slate-500" />
            )}
            <span className="text-[9px] text-slate-400">Voice</span>
            <Switch
              checked={autoSpeak}
              onCheckedChange={setAutoSpeak}
              className="scale-75"
            />
          </div>

          <Badge variant="outline" className="text-[9px] border-violet-500/50 text-violet-400 gap-1">
            <Sparkles className="w-3 h-3" />
            Senior AI
          </Badge>
        </div>
      </div>

      {/* Messages */}
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
                  <div className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user" ? "bg-indigo-500/20" : "bg-violet-500/20"
                    }`}>
                      {msg.role === "user"
                        ? <User className="w-3 h-3 text-indigo-400" />
                        : <Bot className="w-3 h-3 text-violet-400" />
                      }
                    </div>

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
                      <div className={`flex items-center gap-1.5 mt-1 ${msg.role === "user" ? "justify-end" : ""}`}>
                        <span className="text-[9px] text-slate-500">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {msg.role === "user" && statusIcon(msg.status)}
                        {msg.role === "assistant" && msg.id !== "welcome" && (
                          <button
                            onClick={() => speakText(msg.content)}
                            className="text-slate-500 hover:text-violet-400 transition-colors ml-1"
                            title="Listen again"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        )}
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

      {/* Speaking indicator */}
      {(isSpeaking || isLoadingVoice) && (
        <div className="px-4 py-2 border-t border-violet-500/20 bg-violet-500/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLoadingVoice ? (
              <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
            ) : (
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
              >
                <Volume2 className="w-4 h-4 text-violet-400" />
              </motion.div>
            )}
            <span className="text-xs text-violet-300">
              {isLoadingVoice ? 'Preparing voice...' : 'AIRA is speaking...'}
            </span>
            {/* Audio wave visualization */}
            {isSpeaking && (
              <div className="flex items-center gap-0.5 ml-2">
                {[1,2,3,4,5].map(i => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-violet-400 rounded-full"
                    animate={{ height: [4, 12 + Math.random() * 8, 4] }}
                    transition={{ repeat: Infinity, duration: 0.4 + i * 0.1, delay: i * 0.05 }}
                  />
                ))}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={stopSpeaking}
            className="h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Square className="w-3 h-3 mr-1" />
            <span className="text-xs">Stop</span>
          </Button>
        </div>
      )}

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
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={canSeeScreen ? "Message AIRA (she can see your screen)..." : "Message AIRA (audio-only mode)..."}
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

      {/* Floating Voice Orb */}
      <AIRAVoiceOrb
        isSpeaking={isSpeaking}
        isLoadingVoice={isLoadingVoice}
        autoSpeak={autoSpeak}
        onToggleAutoSpeak={() => setAutoSpeak(prev => !prev)}
        onStopSpeaking={stopSpeaking}
      />
    </div>
  );
}
