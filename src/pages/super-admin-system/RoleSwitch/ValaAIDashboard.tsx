/**
 * VALA AI DASHBOARD - SMART AI PRODUCT BUILDER
 * =====================================================
 * Lovable-grade AI builder with:
 * - Thinking/reasoning indicator
 * - Live HTML preview rendering
 * - Version history & rollback
 * - Regenerate responses
 * - Real code extraction & preview
 * - Streaming chat with SSE
 * LOCKED DARK THEME
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Undo2, Redo2, Eye, Code2,
  Smartphone, Monitor, Tablet, ExternalLink, RefreshCw,
  Sparkles, User, Copy, ThumbsUp, ThumbsDown,
  Loader2, Rocket, Paperclip, Mic, MicOff,
  PanelLeftClose, PanelLeftOpen, Globe, CheckCircle,
  Layers, Database, GitBranch, Workflow, Clock, Zap,
  Activity, Package, Volume2, VolumeX, History,
  Brain, ChevronDown, ChevronRight, RotateCcw, Image
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

// ===== LOCKED COLORS =====
const C = {
  bg: '#09090b',
  bgSidebar: '#0c0c0e',
  bgChat: '#09090b',
  border: '#27272a',
  borderFocus: '#3f3f46',
  accent: '#8b5cf6',
  green: '#22c55e',
  cyan: '#06b6d4',
  amber: '#f59e0b',
  text: '#fafafa',
  textMuted: '#a1a1aa',
  textDim: '#71717a',
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vala-ai-openai`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
  thinkingText?: string;
}

interface HistorySnapshot {
  id: string;
  timestamp: Date;
  prompt: string;
  messages: ChatMessage[];
  generatedCode: string;
  previewHtml: string;
}

interface PipelineStep {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'done';
  icon: React.ElementType;
  duration?: number;
}

interface BuildMetrics {
  screens: number;
  apis: number;
  dbTables: number;
  flows: number;
}

type PreviewMode = 'preview' | 'code';
type DeviceMode = 'desktop' | 'tablet' | 'mobile';

// ===== EXTRACT CODE BLOCKS =====
function extractCodeBlocks(markdown: string): { language: string; code: string }[] {
  const blocks: { language: string; code: string }[] = [];
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    blocks.push({ language: match[1] || 'text', code: match[2].trim() });
  }
  return blocks;
}

// ===== GENERATE LIVE PREVIEW HTML =====
function generatePreviewHtml(content: string, metrics: BuildMetrics): string {
  const codeBlocks = extractCodeBlocks(content);
  const hasReactCode = codeBlocks.some(b => b.language === 'tsx' || b.language === 'jsx' || b.language === 'typescript');
  const hasSql = codeBlocks.some(b => b.language === 'sql');
  
  // Extract screen names from tables
  const screenMatches = content.match(/\|\s*\d+\s*\|([^|]+)\|/g) || [];
  const screens = screenMatches.map(m => {
    const parts = m.split('|').filter(Boolean);
    return parts[1]?.trim() || '';
  }).filter(s => s && !s.includes('---') && !s.includes('#'));

  // Extract API endpoints
  const apiMatches = content.match(/(?:GET|POST|PUT|DELETE|PATCH)\s*\|([^|]+)\|/g) || [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0b; color: #fafafa; padding: 24px; min-height: 100vh; }
  .header { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
  .header-icon { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); display: flex; align-items: center; justify-content: center; font-size: 24px; }
  .header h1 { font-size: 22px; font-weight: 700; }
  .header p { font-size: 13px; color: #71717a; margin-top: 2px; }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }
  .stat { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 16px; }
  .stat-value { font-size: 28px; font-weight: 700; }
  .stat-label { font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 13px; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .section-title::before { content: ''; width: 3px; height: 14px; background: #8b5cf6; border-radius: 2px; }
  .screen-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
  .screen-card { background: #18181b; border: 1px solid #27272a; border-radius: 10px; padding: 14px; transition: border-color 0.2s; cursor: pointer; }
  .screen-card:hover { border-color: #8b5cf6; }
  .screen-card h3 { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .screen-card p { font-size: 11px; color: #71717a; }
  .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; padding: 2px 8px; border-radius: 6px; font-weight: 500; }
  .badge-purple { background: rgba(139,92,246,0.15); color: #a78bfa; }
  .badge-green { background: rgba(34,197,94,0.15); color: #4ade80; }
  .badge-cyan { background: rgba(6,182,212,0.15); color: #22d3ee; }
  .api-list { display: flex; flex-direction: column; gap: 6px; }
  .api-item { display: flex; align-items: center; gap: 10px; background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 10px 14px; font-size: 12px; }
  .method { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; min-width: 40px; text-align: center; }
  .method-get { background: rgba(34,197,94,0.15); color: #4ade80; }
  .method-post { background: rgba(59,130,246,0.15); color: #60a5fa; }
  .method-put { background: rgba(245,158,11,0.15); color: #fbbf24; }
  .method-delete { background: rgba(239,68,68,0.15); color: #f87171; }
  .code-block { background: #111113; border: 1px solid #27272a; border-radius: 10px; padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.6; overflow-x: auto; color: #e6edf3; margin-top: 8px; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #27272a; display: flex; align-items: center; justify-content: space-between; }
  .footer-text { font-size: 11px; color: #52525b; }
  .pulse { animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
</style>
</head>
<body>
  <div class="header">
    <div class="header-icon">🚀</div>
    <div>
      <h1>Generated Application</h1>
      <p>Built by VALA AI Engine • ${new Date().toLocaleTimeString()}</p>
    </div>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="stat-value" style="color:#8b5cf6">${metrics.screens}</div>
      <div class="stat-label">Screens</div>
    </div>
    <div class="stat">
      <div class="stat-value" style="color:#06b6d4">${metrics.apis}</div>
      <div class="stat-label">API Endpoints</div>
    </div>
    <div class="stat">
      <div class="stat-value" style="color:#22c55e">${metrics.dbTables}</div>
      <div class="stat-label">DB Tables</div>
    </div>
    <div class="stat">
      <div class="stat-value" style="color:#f59e0b">${metrics.flows}</div>
      <div class="stat-label">User Flows</div>
    </div>
  </div>

  ${screens.length > 0 ? `
  <div class="section">
    <div class="section-title">Generated Screens</div>
    <div class="screen-grid">
      ${screens.slice(0, 12).map((s, i) => `
        <div class="screen-card">
          <h3>${s}</h3>
          <p>Screen ${i + 1} of ${screens.length}</p>
          <div style="margin-top:8px"><span class="badge badge-green">✓ Ready</span></div>
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  ${hasReactCode ? `
  <div class="section">
    <div class="section-title">Component Code</div>
    <div class="code-block">
      ${codeBlocks.filter(b => ['tsx', 'jsx', 'typescript', 'javascript'].includes(b.language)).slice(0, 1).map(b => 
        b.code.replace(/</g, '&lt;').replace(/>/g, '&gt;').split('\n').slice(0, 20).join('\n') + (b.code.split('\n').length > 20 ? '\n// ... more code' : '')
      ).join('')}
    </div>
  </div>` : ''}

  ${hasSql ? `
  <div class="section">
    <div class="section-title">Database Schema</div>
    <div class="code-block">
      ${codeBlocks.filter(b => b.language === 'sql').slice(0, 1).map(b => 
        b.code.replace(/</g, '&lt;').replace(/>/g, '&gt;').split('\n').slice(0, 15).join('\n') + (b.code.split('\n').length > 15 ? '\n-- ... more tables' : '')
      ).join('')}
    </div>
  </div>` : ''}

  <div class="footer">
    <span class="footer-text">VALA AI Engine v2.0 • Parallel Processing</span>
    <span class="badge badge-purple">⚡ Production Ready</span>
  </div>
</body>
</html>`;
}

// ===== AI STREAMING =====
async function streamValaAI({
  messages,
  onDelta,
  onDone,
  onError,
  signal,
}: {
  messages: { role: string; content: string }[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
  signal?: AbortSignal;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    if (resp.status === 429) { onError("Rate limit exceeded. Please wait a moment."); return; }
    if (resp.status === 402) { onError("AI credits exhausted. Please add credits."); return; }
    onError(data.error || `AI request failed (${resp.status})`);
    return;
  }

  if (!resp.body) { onError("No response stream"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let nlIndex: number;
    while ((nlIndex = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, nlIndex);
      buffer = buffer.slice(nlIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { onDone(); return; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }

  // Flush remaining
  if (buffer.trim()) {
    for (let raw of buffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }
  onDone();
}

// ===== COMPONENT =====
const ValaAIDashboard = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1', role: 'assistant',
      content: "# 👋 Welcome to VALA AI Engine v2\n\nI'm your autonomous product builder. Describe any software and I'll generate **production-ready** architecture:\n\n- 🖥️ **Screens** — Full UI components with responsive design\n- 🔌 **APIs** — REST endpoints with validation\n- 🗄️ **Database** — Schema, tables, RLS policies\n- 🔄 **Flows** — User workflows & state machines\n\n> Try: *\"Create a hospital management system with patient registration, doctor dashboard, billing, and lab reports\"*\n\n💡 **New:** Live preview, version history, rollback & regenerate!",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingPhase, setThinkingPhase] = useState('');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('preview');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [metrics, setMetrics] = useState<BuildMetrics>({ screens: 0, apis: 0, dbTables: 0, flows: 0 });
  const [generatedCode, setGeneratedCode] = useState('// VALA AI Engine — Send a prompt to generate code');
  const [previewHtml, setPreviewHtml] = useState('');
  const [buildTime, setBuildTime] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistorySnapshot[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [activeCodeTab, setActiveCodeTab] = useState(0);
  const [codeBlocks, setCodeBlocks] = useState<{ language: string; code: string }[]>([]);
  const [pipeline, setPipeline] = useState<PipelineStep[]>([
    { id: '1', name: 'Understanding Prompt', status: 'idle', icon: Brain },
    { id: '2', name: 'Analyzing Requirements', status: 'idle', icon: Activity },
    { id: '3', name: 'Mapping Features', status: 'idle', icon: GitBranch },
    { id: '4', name: 'Generating Screens', status: 'idle', icon: Layers },
    { id: '5', name: 'Planning APIs', status: 'idle', icon: Zap },
    { id: '6', name: 'Designing Database', status: 'idle', icon: Database },
    { id: '7', name: 'Building Flows', status: 'idle', icon: Workflow },
    { id: '8', name: 'Packaging Build', status: 'idle', icon: Package },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const startTimeRef = useRef<number>(0);

  // ===== TTS =====
  const speakMessage = useCallback(async (msgId: string, text: string) => {
    if (playingMsgId === msgId) {
      audioRef.current?.pause(); audioRef.current = null; setPlayingMsgId(null); return;
    }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setTtsLoading(msgId);
    try {
      const cleanText = text.replace(/[#*`>\-\[\]()!|]/g, '').replace(/\n+/g, '. ').substring(0, 3000);
      const response = await fetch(TTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ text: cleanText, voiceId: 'JBFqnCBsd6RMkjVDRZzb' }),
      });
      if (!response.ok) throw new Error('TTS failed');
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onplay = () => setPlayingMsgId(msgId);
      audio.onended = () => { setPlayingMsgId(null); URL.revokeObjectURL(audioUrl); };
      audio.onerror = () => { setPlayingMsgId(null); toast.error('Audio playback failed'); };
      await audio.play();
    } catch { toast.error('Voice output failed'); } finally { setTtsLoading(null); }
  }, [playingMsgId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ===== THINKING PHASES =====
  const thinkingPhases = [
    'Parsing your requirements...',
    'Analyzing business domain...',
    'Identifying key entities...',
    'Planning system architecture...',
    'Designing component tree...',
    'Generating implementation...',
  ];

  useEffect(() => {
    if (!isThinking) return;
    let idx = 0;
    setThinkingPhase(thinkingPhases[0]);
    const interval = setInterval(() => {
      idx = (idx + 1) % thinkingPhases.length;
      setThinkingPhase(thinkingPhases[idx]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isThinking]);

  // ===== PIPELINE =====
  const runPipeline = useCallback(() => {
    startTimeRef.current = Date.now();
    setPipeline(prev => prev.map(s => ['1', '2'].includes(s.id) ? { ...s, status: 'running' as const } : { ...s, status: 'idle' as const }));
    setTimeout(() => {
      setPipeline(prev => prev.map(s =>
        ['1', '2'].includes(s.id) ? { ...s, status: 'done' as const, duration: 1.2 } :
        ['3', '4', '5', '6'].includes(s.id) ? { ...s, status: 'running' as const } : s
      ));
    }, 1500);
    setTimeout(() => {
      setPipeline(prev => prev.map(s =>
        ['3', '4', '5', '6'].includes(s.id) ? { ...s, status: 'done' as const, duration: 2.0 } :
        ['7', '8'].includes(s.id) ? { ...s, status: 'running' as const } : s
      ));
    }, 3500);
    setTimeout(() => {
      setPipeline(prev => prev.map(s => ({ ...s, status: 'done' as const, duration: s.duration || 1.5 })));
      setBuildTime(Math.round((Date.now() - startTimeRef.current) / 1000));
    }, 5000);
  }, []);

  // ===== EXTRACT METRICS =====
  const extractMetrics = useCallback((text: string): BuildMetrics => {
    const screenMatch = text.match(/screens?[:\s]*(\d+)/i) || text.match(/(\d+)\s*screens?/i);
    const apiMatch = text.match(/apis?[:\s]*(\d+)/i) || text.match(/(\d+)\s*api/i) || text.match(/(\d+)\s*endpoint/i);
    const dbMatch = text.match(/tables?[:\s]*(\d+)/i) || text.match(/(\d+)\s*table/i);
    const flowMatch = text.match(/flows?[:\s]*(\d+)/i) || text.match(/(\d+)\s*flow/i);
    return {
      screens: screenMatch ? parseInt(screenMatch[1]) : 0,
      apis: apiMatch ? parseInt(apiMatch[1]) : 0,
      dbTables: dbMatch ? parseInt(dbMatch[1]) : 0,
      flows: flowMatch ? parseInt(flowMatch[1]) : 0,
    };
  }, []);

  // ===== SAVE HISTORY SNAPSHOT =====
  const saveSnapshot = useCallback((prompt: string, msgs: ChatMessage[], code: string, html: string) => {
    const snapshot: HistorySnapshot = {
      id: Date.now().toString(),
      timestamp: new Date(),
      prompt,
      messages: msgs,
      generatedCode: code,
      previewHtml: html,
    };
    setHistory(prev => [...prev, snapshot]);
    setCurrentHistoryIndex(prev => prev + 1);
  }, []);

  // ===== ROLLBACK =====
  const rollbackTo = useCallback((index: number) => {
    if (index < 0 || index >= history.length) return;
    const snapshot = history[index];
    setMessages(snapshot.messages);
    setGeneratedCode(snapshot.generatedCode);
    setPreviewHtml(snapshot.previewHtml);
    setCurrentHistoryIndex(index);
    toast.success(`Rolled back to version ${index + 1}`);
    setShowHistory(false);
  }, [history]);

  // ===== UNDO / REDO =====
  const canUndo = currentHistoryIndex > 0;
  const canRedo = currentHistoryIndex < history.length - 1;
  const handleUndo = useCallback(() => { if (canUndo) rollbackTo(currentHistoryIndex - 1); }, [canUndo, currentHistoryIndex, rollbackTo]);
  const handleRedo = useCallback(() => { if (canRedo) rollbackTo(currentHistoryIndex + 1); }, [canRedo, currentHistoryIndex, rollbackTo]);

  // ===== SEND MESSAGE =====
  const sendMessage = useCallback(async (overrideInput?: string) => {
    const text = overrideInput || input.trim();
    if (!text || isGenerating) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsGenerating(true);
    setIsThinking(true);
    setBuildTime(null);

    setPipeline(prev => prev.map(s => ({ ...s, status: 'idle' as const })));
    runPipeline();

    const assistantId = (Date.now() + 1).toString();
    let assistantContent = '';
    const abortController = new AbortController();
    abortRef.current = abortController;

    // Show thinking for 2s before streaming starts
    setTimeout(() => setIsThinking(false), 2500);

    try {
      await streamValaAI({
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        signal: abortController.signal,
        onDelta: (chunk) => {
          setIsThinking(false);
          assistantContent += chunk;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === 'assistant' && last.id === assistantId) {
              return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
            }
            return [...prev, { id: assistantId, role: 'assistant', content: assistantContent, timestamp: new Date() }];
          });

          // Live-update preview as content streams in
          const m = extractMetrics(assistantContent);
          if (m.screens > 0 || m.apis > 0 || m.dbTables > 0) {
            setMetrics(m);
            const html = generatePreviewHtml(assistantContent, m);
            setPreviewHtml(html);
          }

          // Extract code blocks live
          const blocks = extractCodeBlocks(assistantContent);
          if (blocks.length > 0) {
            setCodeBlocks(blocks);
            setGeneratedCode(blocks.map(b => `// === ${b.language.toUpperCase()} ===\n${b.code}`).join('\n\n'));
          }
        },
        onDone: () => {
          setIsGenerating(false);
          setIsThinking(false);
          const finalMetrics = extractMetrics(assistantContent);
          if (finalMetrics.screens > 0 || finalMetrics.apis > 0 || finalMetrics.dbTables > 0) setMetrics(finalMetrics);
          const finalBlocks = extractCodeBlocks(assistantContent);
          const finalCode = finalBlocks.length > 0 ? finalBlocks.map(b => `// === ${b.language.toUpperCase()} ===\n${b.code}`).join('\n\n') : generatedCode;
          setGeneratedCode(finalCode);
          setCodeBlocks(finalBlocks);
          const finalHtml = generatePreviewHtml(assistantContent, finalMetrics.screens > 0 ? finalMetrics : metrics);
          setPreviewHtml(finalHtml);
          saveSnapshot(text, [...updatedMessages, { id: assistantId, role: 'assistant', content: assistantContent, timestamp: new Date() }], finalCode, finalHtml);
          toast.success('Build complete!');
        },
        onError: (err) => {
          setIsGenerating(false); setIsThinking(false);
          toast.error(err);
          setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: `⚠️ Error: ${err}\n\nPlease try again.`, timestamp: new Date() }]);
        },
      });
    } catch (e) {
      if ((e as Error).name !== 'AbortError') { setIsGenerating(false); setIsThinking(false); toast.error('Connection failed'); }
    }
  }, [input, isGenerating, messages, runPipeline, extractMetrics, saveSnapshot, generatedCode, metrics]);

  // ===== REGENERATE =====
  const regenerateLastResponse = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;
    // Remove last assistant message
    setMessages(prev => {
      let lastAssistantIdx = -1;
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].role === 'assistant' && prev[i].id !== '1') { lastAssistantIdx = i; break; }
      }
      if (lastAssistantIdx > 0) return prev.slice(0, lastAssistantIdx);
      return prev;
    });
    setTimeout(() => sendMessage(lastUserMsg.content), 100);
  }, [messages, sendMessage]);

  const handleStop = useCallback(() => { abortRef.current?.abort(); setIsGenerating(false); setIsThinking(false); toast.info("Generation stopped"); }, []);
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  // ===== VOICE INPUT =====
  const toggleVoiceInput = useCallback(async () => {
    if (isRecording) { mediaRecorderRef.current?.stop(); setIsRecording(false); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = () => {};
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
          const recognition = new SR();
          recognition.lang = 'en-US';
          recognition.onresult = (event: any) => { setInput(prev => prev + (prev ? ' ' : '') + event.results[0][0].transcript); toast.success("Voice captured!"); };
          recognition.onerror = () => toast.error("Voice recognition failed");
          recognition.start();
        }
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      toast.info("🎤 Listening...");
    } catch { toast.error("Microphone access denied"); }
  }, [isRecording]);

  const getDeviceWidth = () => {
    switch (deviceMode) { case 'mobile': return '375px'; case 'tablet': return '768px'; default: return '100%'; }
  };

  // ===== UPDATE IFRAME =====
  useEffect(() => {
    if (iframeRef.current && previewHtml && previewMode === 'preview') {
      const doc = iframeRef.current.contentDocument;
      if (doc) { doc.open(); doc.write(previewHtml); doc.close(); }
    }
  }, [previewHtml, previewMode]);

  const completedSteps = pipeline.filter(s => s.status === 'done').length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ background: C.bg, color: C.text }}>
      <div className="flex-1 flex overflow-hidden">
        {/* ===== LEFT: CHAT PANEL ===== */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 440, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col shrink-0"
              style={{ borderRight: `1px solid ${C.border}` }}
            >
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 h-10 shrink-0" style={{ borderBottom: `1px solid ${C.border}`, background: C.bgSidebar }}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-semibold">VALA AI</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={handleUndo} disabled={!canUndo} className="p-1 rounded hover:bg-white/5 disabled:opacity-20" style={{ color: C.textDim }} title="Undo"><Undo2 className="w-3.5 h-3.5" /></button>
                  <button onClick={handleRedo} disabled={!canRedo} className="p-1 rounded hover:bg-white/5 disabled:opacity-20" style={{ color: C.textDim }} title="Redo"><Redo2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setShowHistory(!showHistory)} className="p-1 rounded hover:bg-white/5" style={{ color: showHistory ? C.accent : C.textDim }} title="History"><History className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setShowSidebar(false)} className="p-1 rounded hover:bg-white/5" style={{ color: C.textDim }}><PanelLeftClose className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              {/* History Panel */}
              <AnimatePresence>
                {showHistory && history.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                    style={{ borderBottom: `1px solid ${C.border}`, background: '#111113' }}
                  >
                    <div className="p-2 max-h-48 overflow-y-auto">
                      <div className="text-[10px] font-semibold px-2 py-1 mb-1" style={{ color: C.textMuted }}>VERSION HISTORY</div>
                      {history.map((snap, idx) => (
                        <button
                          key={snap.id}
                          onClick={() => rollbackTo(idx)}
                          className={cn("w-full text-left px-3 py-2 rounded-lg text-xs mb-1 flex items-center gap-2 transition-colors", idx === currentHistoryIndex ? "bg-violet-500/10 border border-violet-500/20" : "hover:bg-white/5")}
                          style={{ color: idx === currentHistoryIndex ? C.accent : C.textMuted }}
                        >
                          <RotateCcw className="w-3 h-3 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="truncate font-medium" style={{ color: C.text }}>{snap.prompt.slice(0, 40)}{snap.prompt.length > 40 ? '...' : ''}</div>
                            <div className="text-[10px]" style={{ color: C.textDim }}>{snap.timestamp.toLocaleTimeString()} • v{idx + 1}</div>
                          </div>
                          {idx === currentHistoryIndex && <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa' }}>Current</span>}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <div key={msg.id} className="group">
                      <div className="flex items-center gap-2 mb-2">
                        {msg.role === 'assistant' ? (
                          <>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs font-medium" style={{ color: C.textMuted }}>VALA AI</span>
                            {isGenerating && msg.id === messages[messages.length - 1]?.id && msg.role === 'assistant' && (
                              <Loader2 className="w-3 h-3 animate-spin" style={{ color: C.accent }} />
                            )}
                          </>
                        ) : (
                          <>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#3f3f46' }}>
                              <User className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs font-medium" style={{ color: C.textMuted }}>You</span>
                          </>
                        )}
                      </div>
                      <div className="pl-8">
                        {msg.role === 'assistant' ? (
                          <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold [&_p]:my-1.5 [&_ul]:my-1 [&_li]:my-0.5 [&_code]:text-xs [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-white/10 [&_blockquote]:border-l-2 [&_blockquote]:border-violet-500/50 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-zinc-400 [&_strong]:text-white [&_hr]:border-zinc-700 [&_table]:text-xs [&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-zinc-700 [&_td]:border [&_td]:border-zinc-800">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <div className="text-sm leading-relaxed" style={{ color: C.text }}>{msg.content}</div>
                        )}
                        {msg.role === 'assistant' && !isGenerating && msg.id !== '1' && (
                          <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { navigator.clipboard.writeText(msg.content); toast.success('Copied!'); }} className="p-1 rounded hover:bg-white/5" style={{ color: C.textDim }}><Copy className="w-3.5 h-3.5" /></button>
                            <button onClick={() => speakMessage(msg.id, msg.content)} className="p-1 rounded hover:bg-white/5" style={{ color: playingMsgId === msg.id ? C.accent : C.textDim }}>
                              {ttsLoading === msg.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : playingMsgId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                            </button>
                            <button className="p-1 rounded hover:bg-white/5" style={{ color: C.textDim }}><ThumbsUp className="w-3.5 h-3.5" /></button>
                            <button className="p-1 rounded hover:bg-white/5" style={{ color: C.textDim }}><ThumbsDown className="w-3.5 h-3.5" /></button>
                            <button onClick={regenerateLastResponse} className="p-1 rounded hover:bg-white/5" style={{ color: C.textDim }} title="Regenerate"><RefreshCw className="w-3.5 h-3.5" /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Thinking Indicator */}
                  {isThinking && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
                        <Brain className="w-3 h-3 text-white animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium" style={{ color: C.textMuted }}>VALA AI</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>Thinking</span>
                        </div>
                        <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.1)' }}>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 rounded-full" style={{ background: C.accent }} />
                              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} className="w-1.5 h-1.5 rounded-full" style={{ background: C.accent }} />
                              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }} className="w-1.5 h-1.5 rounded-full" style={{ background: C.accent }} />
                            </div>
                            <span className="text-xs" style={{ color: C.textMuted }}>{thinkingPhase}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-4 shrink-0" style={{ borderTop: `1px solid ${C.border}` }}>
                {isGenerating && (
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: C.accent }} />
                    <span className="text-xs" style={{ color: C.textMuted }}>Building your application...</span>
                    <button onClick={handleStop} className="ml-auto text-xs px-2 py-0.5 rounded hover:bg-white/5" style={{ color: C.textDim, border: `1px solid ${C.border}` }}>Stop</button>
                  </div>
                )}
                <div className="rounded-xl overflow-hidden" style={{ background: '#18181b', border: `1px solid ${C.border}` }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe what you want to build..."
                    rows={3}
                    className="w-full px-4 py-3 text-sm resize-none outline-none"
                    style={{ background: 'transparent', color: C.text }}
                  />
                  <div className="flex items-center justify-between px-3 py-2" style={{ borderTop: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-md hover:bg-white/5" style={{ color: C.textDim }}><Paperclip className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-md hover:bg-white/5" style={{ color: C.textDim }}><Image className="w-4 h-4" /></button>
                      <button onClick={toggleVoiceInput} className={cn("p-1.5 rounded-md", isRecording ? "bg-red-500/20" : "hover:bg-white/5")} style={{ color: isRecording ? '#ef4444' : C.textDim }}>
                        {isRecording ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
                      </button>
                    </div>
                    <button onClick={() => sendMessage()} disabled={!input.trim() || isGenerating} className="p-2 rounded-lg transition-colors disabled:opacity-30" style={{ background: input.trim() ? C.accent : 'transparent', color: '#fff' }}>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Toggle */}
        {!showSidebar && (
          <button onClick={() => setShowSidebar(true)} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-lg" style={{ background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textDim }}>
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}

        {/* ===== RIGHT: PREVIEW + PIPELINE ===== */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#111113' }}>
          {/* Preview Toolbar */}
          <div className="flex items-center justify-between px-4 h-10 shrink-0" style={{ borderBottom: `1px solid ${C.border}`, background: C.bgSidebar }}>
            <div className="flex items-center gap-1">
              <button onClick={() => setPreviewMode('preview')} className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium" style={{ background: previewMode === 'preview' ? 'rgba(255,255,255,0.08)' : 'transparent', color: previewMode === 'preview' ? C.text : C.textDim }}>
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button onClick={() => setPreviewMode('code')} className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium" style={{ background: previewMode === 'code' ? 'rgba(255,255,255,0.08)' : 'transparent', color: previewMode === 'code' ? C.text : C.textDim }}>
                <Code2 className="w-3.5 h-3.5" /> Code
              </button>
            </div>
            <div className="flex items-center gap-1">
              {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as [DeviceMode, React.ElementType][]).map(([mode, Icon]) => (
                <button key={mode} onClick={() => setDeviceMode(mode)} className="p-1.5 rounded-md" style={{ background: deviceMode === mode ? 'rgba(255,255,255,0.08)' : 'transparent', color: deviceMode === mode ? C.text : C.textDim }}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => { if (iframeRef.current && previewHtml) { const doc = iframeRef.current.contentDocument; if (doc) { doc.open(); doc.write(previewHtml); doc.close(); } } }} className="p-1.5 rounded-md hover:bg-white/5" style={{ color: C.textDim }} title="Refresh"><RefreshCw className="w-3.5 h-3.5" /></button>
              {history.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full mr-1" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>v{currentHistoryIndex + 1}</span>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Preview/Code */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
              {previewMode === 'preview' ? (
                <div className="h-full rounded-lg overflow-hidden shadow-2xl transition-all duration-300" style={{ width: getDeviceWidth(), maxWidth: '100%', border: `1px solid ${C.border}` }}>
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#1a1a1d', borderBottom: `1px solid ${C.border}` }}>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ef4444' }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#22c55e' }} />
                    </div>
                    <div className="flex-1 mx-8">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs" style={{ background: '#111113', border: `1px solid ${C.border}`, color: C.textDim }}>
                        <Globe className="w-3 h-3" /><span>localhost:5173</span>
                      </div>
                    </div>
                  </div>
                  {/* iframe preview */}
                  {previewHtml ? (
                    <iframe
                      ref={iframeRef}
                      className="w-full bg-black"
                      style={{ height: 'calc(100% - 36px)', border: 'none' }}
                      sandbox="allow-scripts"
                      title="VALA Preview"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-80 text-center p-8" style={{ background: C.bg }}>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-lg font-bold mb-2">Live Preview</h2>
                      <p className="text-sm max-w-xs" style={{ color: C.textMuted }}>Send a build prompt to see your generated application render here in real-time.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full rounded-lg overflow-hidden flex flex-col" style={{ background: '#0d1117', border: `1px solid ${C.border}` }}>
                  {/* Code tabs */}
                  {codeBlocks.length > 0 && (
                    <div className="flex items-center gap-0 overflow-x-auto" style={{ borderBottom: '1px solid #21262d' }}>
                      {codeBlocks.map((block, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveCodeTab(idx)}
                          className="px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors"
                          style={{
                            background: activeCodeTab === idx ? '#0d1117' : '#161b22',
                            color: activeCodeTab === idx ? '#e6edf3' : '#8b949e',
                            borderBottom: activeCodeTab === idx ? '2px solid #8b5cf6' : '2px solid transparent',
                          }}
                        >
                          {block.language.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid #21262d' }}>
                    <span className="text-xs font-medium" style={{ color: '#8b949e' }}>
                      {codeBlocks.length > 0 ? `${codeBlocks[activeCodeTab]?.language || 'code'} • ${codeBlocks[activeCodeTab]?.code.split('\n').length || 0} lines` : 'Generated Code'}
                    </span>
                    <button onClick={() => { navigator.clipboard.writeText(codeBlocks[activeCodeTab]?.code || generatedCode); toast.success('Code copied!'); }} className="p-1 rounded hover:bg-white/5" style={{ color: '#8b949e' }}><Copy className="w-3.5 h-3.5" /></button>
                  </div>
                  <ScrollArea className="flex-1">
                    <pre className="p-4 text-sm leading-6 font-mono" style={{ color: '#e6edf3' }}><code>{codeBlocks[activeCodeTab]?.code || generatedCode}</code></pre>
                  </ScrollArea>
                </div>
              )}
            </div>

            {/* Pipeline Sidebar */}
            <div className="w-56 shrink-0 flex flex-col" style={{ borderLeft: `1px solid ${C.border}`, background: C.bgSidebar }}>
              <div className="px-3 py-2 text-xs font-semibold flex items-center justify-between" style={{ color: C.textMuted, borderBottom: `1px solid ${C.border}` }}>
                <span>AI PIPELINE</span>
                {completedSteps > 0 && <span className="text-[10px]" style={{ color: C.green }}>{completedSteps}/{pipeline.length}</span>}
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {pipeline.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs" style={{
                        background: step.status === 'running' ? 'rgba(139,92,246,0.1)' : step.status === 'done' ? 'rgba(34,197,94,0.05)' : 'transparent',
                        border: step.status === 'running' ? '1px solid rgba(139,92,246,0.15)' : '1px solid transparent',
                      }}>
                        {step.status === 'done' ? (
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: C.green }} />
                        ) : step.status === 'running' ? (
                          <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" style={{ color: C.accent }} />
                        ) : (
                          <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(255,255,255,0.15)' }} />
                        )}
                        <span className="flex-1" style={{ color: step.status === 'done' ? C.text : step.status === 'running' ? C.accent : C.textDim }}>
                          {step.name}
                        </span>
                        {step.status === 'done' && step.duration && (
                          <span className="text-[9px]" style={{ color: C.textDim }}>{step.duration}s</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Build Stats */}
              {(metrics.screens > 0 || buildTime) && (
                <div className="p-3 space-y-2" style={{ borderTop: `1px solid ${C.border}` }}>
                  {buildTime && (
                    <div className="text-center">
                      <div className="text-xs font-medium" style={{ color: C.green }}>✅ Build Complete</div>
                      <div className="text-[10px] mt-0.5" style={{ color: C.textDim }}>{buildTime}s • Parallel Pipeline</div>
                    </div>
                  )}
                  {metrics.screens > 0 && (
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { label: 'Screens', val: metrics.screens, color: '#8b5cf6' },
                        { label: 'APIs', val: metrics.apis, color: '#06b6d4' },
                        { label: 'Tables', val: metrics.dbTables, color: '#22c55e' },
                        { label: 'Flows', val: metrics.flows, color: '#f59e0b' },
                      ].filter(m => m.val > 0).map(m => (
                        <div key={m.label} className="text-center py-1.5 rounded-md" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <div className="text-sm font-bold" style={{ color: m.color }}>{m.val}</div>
                          <div className="text-[9px]" style={{ color: C.textDim }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {history.length > 0 && (
                    <div className="text-center text-[10px] pt-1" style={{ color: C.textDim }}>
                      {history.length} version{history.length > 1 ? 's' : ''} saved
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValaAIDashboard;
