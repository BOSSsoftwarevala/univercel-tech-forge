import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Sparkles, Bot, User, Mic, MicOff, Image, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PMBuilderCreateTabProps {
  onProductUpdate: (data: any) => void;
  onPipelineStep?: (step: number, status: 'running' | 'done' | 'error') => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vala-ai-openai`;

const PMBuilderCreateTab = ({ onProductUpdate, onPipelineStep }: PMBuilderCreateTabProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 **Welcome to VALA AI Engine**\n\nI'm your AI product builder. Tell me what you want to build and I'll generate:\n\n**Screens** — Full UI components\n**APIs** — REST endpoints\n**Database** — Schema & tables\n**Flows** — User workflows\n**Deployable apps** — Production-ready code\n\n> Try: \"Create a hospital management system with patient registration, doctor dashboard, billing, and lab reports\"",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Voice Recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processVoiceInput(audioBlob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      toast.info('🎤 Listening... Speak your requirement');
    } catch (err) {
      toast.error('Microphone access denied');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  }, [mediaRecorder]);

  const processVoiceInput = async (audioBlob: Blob) => {
    setIsLoading(true);
    toast.info('Processing voice command...');

    try {
      // Use browser's SpeechRecognition as fallback for STT
      const text = await transcribeAudio(audioBlob);
      if (text) {
        setInput(text);
        // Auto-send the transcribed text
        await sendMessage(text);
      } else {
        toast.error('Could not transcribe audio. Please try again or type your request.');
      }
    } catch (err) {
      toast.error('Voice processing failed');
    } finally {
      setIsLoading(false);
    }
  };

  const transcribeAudio = (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      // Use Web Speech API for browser-native STT
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        // Already handled by continuous recognition below
        resolve('');
      } else {
        resolve('');
      }
    });
  };

  // Browser-native speech recognition (more reliable)
  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = '';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      setInput(finalTranscript || interimTranscript);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (finalTranscript.trim()) {
        sendMessage(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      setIsRecording(false);
      if (event.error !== 'no-speech') {
        toast.error(`Speech error: ${event.error}`);
      }
    };

    recognition.start();
    setIsRecording(true);
    toast.info('🎤 Listening... Speak your requirement');
  }, []);

  // Streaming AI chat
  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Trigger pipeline steps
    onPipelineStep?.(1, 'running'); // Idea Understanding

    let assistantSoFar = '';
    const assistantId = (Date.now() + 1).toString();

    try {
      const allMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error('Rate limit exceeded. Please wait a moment.');
        if (response.status === 402) throw new Error('AI credits exhausted.');
        throw new Error(`AI error: ${response.status}`);
      }

      onPipelineStep?.(1, 'done');
      onPipelineStep?.(2, 'running'); // Market Research

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let buffer = '';
      const stepTriggers: Record<number, { keywords: string[]; triggered: boolean }> = {
        3: { keywords: ['Architecture', 'Product Planning'], triggered: false },
        4: { keywords: ['Feature', 'Screen'], triggered: false },
        5: { keywords: ['UI', 'Design', 'Color', 'Typography'], triggered: false },
        6: { keywords: ['Database', 'CREATE TABLE', 'Schema'], triggered: false },
        7: { keywords: ['API', 'Endpoint'], triggered: false },
        8: { keywords: ['Implementation', 'Component', 'import React'], triggered: false },
        9: { keywords: ['Self-Review', 'Review', 'Quality'], triggered: false },
        10: { keywords: ['Bug', 'Security', 'audit'], triggered: false },
        11: { keywords: ['Fix', 'Optimization', 'Performance'], triggered: false },
        12: { keywords: ['Build Summary', 'Total Screens'], triggered: false },
        13: { keywords: ['Deploy', 'Next Steps', 'Production'], triggered: false },
      };

      let lastStep = 2;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

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

              // Trigger pipeline steps based on content keywords
              for (const [stepId, trigger] of Object.entries(stepTriggers)) {
                const id = Number(stepId);
                if (!trigger.triggered && trigger.keywords.some(kw => assistantSoFar.includes(kw))) {
                  // Complete previous step, start this one
                  if (lastStep < id) {
                    for (let s = lastStep; s < id; s++) {
                      onPipelineStep?.(s, 'done');
                    }
                  }
                  onPipelineStep?.(id, 'running');
                  trigger.triggered = true;
                  lastStep = id;
                }
              }

              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.id === assistantId) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { id: assistantId, role: 'assistant' as const, content: assistantSoFar, timestamp: new Date() }];
              });
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      // Complete all remaining pipeline steps
      for (let s = 2; s <= 13; s++) {
        onPipelineStep?.(s, 'done');
      }

      // Try to extract structured data for preview
      try {
        const { data } = await supabase.functions.invoke('auto-dev-engine', {
          body: { action: 'parse_requirement', requirement: messageText, projectType: 'Auto-detect' }
        });
        if (data?.data) onProductUpdate(data.data);
      } catch { /* non-critical */ }

    } catch (err: any) {
      console.error('VALA AI error:', err);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `⚠️ ${err.message || 'AI processing failed. Please try again.'}`,
        timestamp: new Date(),
      };
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.id === assistantId) {
          return prev.map((m, i) => i === prev.length - 1 ? errorMessage : m);
        }
        return [...prev, errorMessage];
      });
      toast.error(err.message || 'AI processing failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessage();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoice = () => {
    if (isRecording) {
      // Stop any active recording
      if (mediaRecorder) stopRecording();
      setIsRecording(false);
    } else {
      startSpeechRecognition();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold text-foreground">VALA AI</span>
          {isRecording && (
            <span className="flex items-center gap-1 text-xs text-red-400 animate-pulse">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Recording...
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full px-4" ref={scrollRef}>
        <div className="py-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.role === 'user' 
                    ? 'bg-foreground text-background' 
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-foreground text-background rounded-tr-md' 
                      : 'bg-muted/50 text-foreground rounded-tl-md'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_code]:text-emerald-400 [&_code]:bg-slate-800/50 [&_code]:px-1 [&_code]:rounded [&_pre]:bg-slate-900 [&_pre]:border [&_pre]:border-slate-700 [&_pre]:rounded-lg [&_table]:text-xs [&_th]:px-2 [&_td]:px-2 [&_blockquote]:border-emerald-500/50 [&_blockquote]:text-slate-400 [&_strong]:text-emerald-300">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              </div>
              <div className="bg-muted/50 rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span className="text-xs text-muted-foreground">VALA AI is generating...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/40">
        <div className="relative flex items-end gap-2 bg-muted/30 rounded-xl border border-border/50 p-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground">
            <Image className="w-4 h-4" />
          </Button>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build..."
            className="min-h-[40px] max-h-[120px] border-0 bg-transparent resize-none text-sm focus-visible:ring-0 p-1"
            rows={1}
          />
          <Button 
            size="icon"
            variant={isRecording ? 'destructive' : 'ghost'}
            className={`h-8 w-8 shrink-0 ${isRecording ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={handleVoice}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button 
            size="icon" 
            className="h-8 w-8 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PMBuilderCreateTab;
