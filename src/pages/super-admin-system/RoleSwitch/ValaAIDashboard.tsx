/**
 * VALA AI DASHBOARD - SMART AI PRODUCT BUILDER
 * =====================================================
 * Production-grade AI builder with:
 * - Thinking/reasoning indicator
 * - Live HTML preview rendering (srcdoc, no sandbox issues)
 * - Version history & rollback
 * - Regenerate responses
 * - Real code extraction & preview
 * - Streaming chat with SSE
 * - Working voice input via Web Speech API
 * - File tree view
 * LOCKED DARK THEME
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Undo2, Redo2, Eye, Code2,
  Smartphone, Monitor, Tablet, RefreshCw,
  Sparkles, User, Copy, ThumbsUp, ThumbsDown,
  Loader2, Paperclip, Mic, MicOff,
  PanelLeftClose, PanelLeftOpen, Globe, CheckCircle,
  Layers, Database, GitBranch, Workflow, Clock, Zap,
  Activity, Package, Volume2, VolumeX, History,
  Brain, RotateCcw, Image, FolderTree, FileCode, FileJson,
  ChevronRight, ChevronDown, Trash2, Plus
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
  red: '#ef4444',
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
}

interface HistorySnapshot {
  id: string;
  timestamp: Date;
  prompt: string;
  messages: ChatMessage[];
  generatedCode: string;
  previewHtml: string;
  metrics: BuildMetrics;
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

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  language?: string;
  children?: FileNode[];
}

type PreviewMode = 'preview' | 'code' | 'files';
type DeviceMode = 'desktop' | 'tablet' | 'mobile';

// ===== EXTRACT CODE BLOCKS =====
function extractCodeBlocks(markdown: string): { language: string; code: string; filename?: string }[] {
  const blocks: { language: string; code: string; filename?: string }[] = [];
  const regex = /```(\w+)?(?:\s+([^\n]+))?\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      filename: match[2]?.trim(),
      code: match[3].trim(),
    });
  }
  return blocks;
}

// ===== BUILD FILE TREE FROM CONTENT =====
function buildFileTree(content: string, codeBlocks: { language: string; code: string; filename?: string }[]): FileNode[] {
  const langToExt: Record<string, string> = {
    tsx: '.tsx', jsx: '.jsx', typescript: '.ts', javascript: '.js',
    sql: '.sql', css: '.css', json: '.json', html: '.html',
  };

  const root: FileNode[] = [
    { name: 'src', type: 'folder', children: [
      { name: 'components', type: 'folder', children: [] },
      { name: 'pages', type: 'folder', children: [] },
      { name: 'hooks', type: 'folder', children: [] },
      { name: 'lib', type: 'folder', children: [] },
    ]},
    { name: 'database', type: 'folder', children: [] },
    { name: 'api', type: 'folder', children: [] },
  ];

  codeBlocks.forEach((block, i) => {
    const ext = langToExt[block.language] || '.txt';
    const name = block.filename || `${block.language}_${i + 1}${ext}`;

    if (block.language === 'sql') {
      root[1].children?.push({ name, type: 'file', language: block.language });
    } else if (['tsx', 'jsx'].includes(block.language)) {
      const isPage = block.code.includes('export default') || block.code.includes('Page');
      if (isPage) {
        root[0].children?.[1].children?.push({ name, type: 'file', language: block.language });
      } else {
        root[0].children?.[0].children?.push({ name, type: 'file', language: block.language });
      }
    } else {
      root[2].children?.push({ name, type: 'file', language: block.language });
    }
  });

  // Remove empty folders
  return root.filter(n => n.type === 'file' || (n.children && n.children.length > 0));
}

// ===== GENERATE LIVE PREVIEW HTML =====
function generatePreviewHtml(content: string, metrics: BuildMetrics): string {
  const codeBlocks = extractCodeBlocks(content);
  const hasReactCode = codeBlocks.some(b => ['tsx', 'jsx', 'typescript', 'javascript'].includes(b.language));
  const hasSql = codeBlocks.some(b => b.language === 'sql');

  const screenMatches = content.match(/\|\s*\d+\s*\|([^|]+)\|/g) || [];
  const screens = screenMatches.map(m => {
    const parts = m.split('|').filter(Boolean);
    return parts[1]?.trim() || '';
  }).filter(s => s && !s.includes('---') && !s.includes('#'));

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
  .stat { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 16px; text-align: center; }
  .stat-value { font-size: 28px; font-weight: 700; }
  .stat-label { font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 13px; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .section-title::before { content: ''; width: 3px; height: 14px; background: #8b5cf6; border-radius: 2px; }
  .screen-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
  .screen-card { background: #18181b; border: 1px solid #27272a; border-radius: 10px; padding: 14px; transition: all 0.2s; cursor: pointer; }
  .screen-card:hover { border-color: #8b5cf6; transform: translateY(-2px); }
  .screen-card h3 { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .screen-card p { font-size: 11px; color: #71717a; }
  .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; padding: 2px 8px; border-radius: 6px; font-weight: 500; }
  .badge-green { background: rgba(34,197,94,0.15); color: #4ade80; }
  .badge-purple { background: rgba(139,92,246,0.15); color: #a78bfa; }
  .code-block { background: #111113; border: 1px solid #27272a; border-radius: 10px; padding: 16px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 11px; line-height: 1.6; overflow-x: auto; color: #e6edf3; margin-top: 8px; white-space: pre-wrap; word-break: break-all; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #27272a; display: flex; align-items: center; justify-content: space-between; }
  .footer-text { font-size: 11px; color: #52525b; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .animate-in { animation: fadeIn 0.3s ease forwards; }
</style>
</head>
<body>
  <div class="header animate-in">
    <div class="header-icon">🚀</div>
    <div>
      <h1>Generated Application</h1>
      <p>Built by VALA AI Engine • ${new Date().toLocaleTimeString()}</p>
    </div>
  </div>

  <div class="stats">
    <div class="stat animate-in" style="animation-delay:0.1s">
      <div class="stat-value" style="color:#8b5cf6">${metrics.screens}</div>
      <div class="stat-label">Screens</div>
    </div>
    <div class="stat animate-in" style="animation-delay:0.15s">
      <div class="stat-value" style="color:#06b6d4">${metrics.apis}</div>
      <div class="stat-label">API Endpoints</div>
    </div>
    <div class="stat animate-in" style="animation-delay:0.2s">
      <div class="stat-value" style="color:#22c55e">${metrics.dbTables}</div>
      <div class="stat-label">DB Tables</div>
    </div>
    <div class="stat animate-in" style="animation-delay:0.25s">
      <div class="stat-value" style="color:#f59e0b">${metrics.flows}</div>
      <div class="stat-label">User Flows</div>
    </div>
  </div>

  ${screens.length > 0 ? `
  <div class="section animate-in" style="animation-delay:0.3s">
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
  <div class="section animate-in" style="animation-delay:0.4s">
    <div class="section-title">Component Code</div>
    <div class="code-block">${codeBlocks.filter(b => ['tsx', 'jsx', 'typescript', 'javascript'].includes(b.language)).slice(0, 1).map(b =>
      b.code.replace(/</g, '&lt;').replace(/>/g, '&gt;').split('\n').slice(0, 25).join('\n') + (b.code.split('\n').length > 25 ? '\n// ... more code' : '')
    ).join('')}</div>
  </div>` : ''}

  ${hasSql ? `
  <div class="section animate-in" style="animation-delay:0.5s">
    <div class="section-title">Database Schema</div>
    <div class="code-block">${codeBlocks.filter(b => b.language === 'sql').slice(0, 1).map(b =>
      b.code.replace(/</g, '&lt;').replace(/>/g, '&gt;').split('\n').slice(0, 20).join('\n') + (b.code.split('\n').length > 20 ? '\n-- ... more tables' : '')
    ).join('')}</div>
  </div>` : ''}

  <div class="footer animate-in" style="animation-delay:0.6s">
    <span class="footer-text">VALA AI Engine v2.1 • Parallel Pipeline</span>
    <span class="badge badge-purple">⚡ Production Ready</span>
  </div>
</body>
</html>`;
}

// ===== SSE STREAMING (BUG-FIXED) =====
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
  try {
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

      const lines = buffer.split("\n");
      // Keep the last potentially incomplete line in buffer
      buffer = lines.pop() || "";

      for (const rawLine of lines) {
        const line = rawLine.replace(/\r$/, "");
        if (!line || line.startsWith(":") || !line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") { onDone(); return; }
        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          // Skip malformed JSON lines (don't re-buffer — that causes infinite loops)
        }
      }
    }

    // Flush remaining buffer
    if (buffer.trim()) {
      const line = buffer.replace(/\r$/, "");
      if (line.startsWith("data: ") && line.slice(6).trim() !== "[DONE]") {
        try {
          const parsed = JSON.parse(line.slice(6).trim());
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch { /* skip */ }
      }
    }
    onDone();
  } catch (e) {
    if ((e as Error).name === 'AbortError') return;
    onError((e as Error).message || 'Connection failed');
  }
}

// ===== FILE TREE COMPONENT =====
const FileTreeNode = ({ node, depth = 0 }: { node: FileNode; depth?: number }) => {
  const [open, setOpen] = useState(true);
  const iconColor = node.language === 'tsx' ? '#06b6d4' : node.language === 'sql' ? '#22c55e' : node.language === 'css' ? '#f59e0b' : '#a1a1aa';

  if (node.type === 'folder') {
    return (
      <div>
        <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 w-full px-2 py-1 text-xs hover:bg-white/5 rounded" style={{ paddingLeft: `${depth * 12 + 8}px`, color: C.text }}>
          {open ? <ChevronDown className="w-3 h-3 shrink-0" style={{ color: C.textDim }} /> : <ChevronRight className="w-3 h-3 shrink-0" style={{ color: C.textDim }} />}
          <FolderTree className="w-3.5 h-3.5 shrink-0" style={{ color: C.amber }} />
          <span>{node.name}</span>
        </button>
        {open && node.children?.map((child, i) => <FileTreeNode key={i} node={child} depth={depth + 1} />)}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 text-xs hover:bg-white/5 rounded cursor-pointer" style={{ paddingLeft: `${depth * 12 + 20}px`, color: C.textMuted }}>
      <FileCode className="w-3.5 h-3.5 shrink-0" style={{ color: iconColor }} />
      <span className="truncate">{node.name}</span>
    </div>
  );
};

// ===== MAIN COMPONENT =====
const ValaAIDashboard = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1', role: 'assistant',
      content: "# 👋 Welcome to VALA AI Engine v2.1\n\nI'm your autonomous product builder. Describe any software and I'll generate **production-ready** architecture:\n\n- 🖥️ **Screens** — Full UI components with responsive design\n- 🔌 **APIs** — REST endpoints with validation\n- 🗄️ **Database** — Schema, tables, RLS policies\n- 🔄 **Flows** — User workflows & state machines\n\n> Try: *\"Create a hospital management system with patient registration, doctor dashboard, billing, and lab reports\"*\n\n💡 **Features:** Live preview, version history, rollback, file tree, regenerate & voice input!",
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
  const [codeBlocks, setCodeBlocks] = useState<{ language: string; code: string; filename?: string }[]>([]);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState<string | null>(null);
  const startTimeRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null);

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
    } catch { toast.error('Voice output unavailable'); } finally { setTtsLoading(null); }
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

  // ===== PIPELINE (tied to actual streaming progress) =====
  const advancePipeline = useCallback((content: string) => {
    setPipeline(prev => {
      const next = [...prev];
      // Step 1-2: Always done once streaming starts
      next[0] = { ...next[0], status: 'done', duration: 0.8 };
      next[1] = { ...next[1], status: 'done', duration: 1.0 };
      // Step 3: Features mapped when we see tables
      if (content.includes('|') && content.includes('Screen')) {
        next[2] = { ...next[2], status: 'done', duration: 1.2 };
        next[3] = { ...next[3], status: 'running' };
      }
      // Step 4: Screens generated when we see component code
      if (content.includes('```tsx') || content.includes('```jsx')) {
        next[3] = { ...next[3], status: 'done', duration: 2.0 };
        next[4] = { ...next[4], status: 'running' };
      }
      // Step 5: APIs planned
      if (content.includes('API') || content.includes('endpoint') || content.includes('GET') || content.includes('POST')) {
        next[4] = { ...next[4], status: 'done', duration: 1.5 };
        next[5] = { ...next[5], status: 'running' };
      }
      // Step 6: Database designed
      if (content.includes('```sql') || content.includes('CREATE TABLE')) {
        next[5] = { ...next[5], status: 'done', duration: 1.8 };
        next[6] = { ...next[6], status: 'running' };
      }
      // Step 7: Flows built
      if (content.includes('Flow') || content.includes('User Flow') || content.includes('workflow')) {
        next[6] = { ...next[6], status: 'done', duration: 1.3 };
        next[7] = { ...next[7], status: 'running' };
      }
      return next;
    });
  }, []);

  const finishPipeline = useCallback(() => {
    setPipeline(prev => prev.map(s => ({ ...s, status: 'done' as const, duration: s.duration || 1.0 })));
    setBuildTime(Math.round((Date.now() - startTimeRef.current) / 1000));
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
  const saveSnapshot = useCallback((prompt: string, msgs: ChatMessage[], code: string, html: string, m: BuildMetrics) => {
    const snapshot: HistorySnapshot = {
      id: Date.now().toString(),
      timestamp: new Date(),
      prompt, messages: msgs,
      generatedCode: code, previewHtml: html, metrics: m,
    };
    setHistory(prev => [...prev, snapshot]);
    setCurrentHistoryIndex(prev => prev + 1);
  }, []);

  // ===== ROLLBACK =====
  const rollbackTo = useCallback((index: number) => {
    if (index < 0 || index >= history.length) return;
    const snap = history[index];
    setMessages(snap.messages);
    setGeneratedCode(snap.generatedCode);
    setPreviewHtml(snap.previewHtml);
    setMetrics(snap.metrics);
    setCodeBlocks(extractCodeBlocks(snap.messages.filter(m => m.role === 'assistant').pop()?.content || ''));
    setCurrentHistoryIndex(index);
    toast.success(`Rolled back to v${index + 1}`);
    setShowHistory(false);
  }, [history]);

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
    startTimeRef.current = Date.now();

    // Reset pipeline
    setPipeline(prev => prev.map(s => ({ ...s, status: 'idle' as const, duration: undefined })));

    const assistantId = (Date.now() + 1).toString();
    let assistantContent = '';
    const abortController = new AbortController();
    abortRef.current = abortController;

    await streamValaAI({
      messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
      signal: abortController.signal,
      onDelta: (chunk) => {
        if (isThinking) setIsThinking(false);
        assistantContent += chunk;

        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && last.id === assistantId) {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
          }
          return [...prev, { id: assistantId, role: 'assistant', content: assistantContent, timestamp: new Date() }];
        });

        // Advance pipeline based on actual content
        advancePipeline(assistantContent);

        // Live-update metrics & preview
        const m = extractMetrics(assistantContent);
        if (m.screens > 0 || m.apis > 0 || m.dbTables > 0) {
          setMetrics(m);
          setPreviewHtml(generatePreviewHtml(assistantContent, m));
        }

        // Extract code blocks live
        const blocks = extractCodeBlocks(assistantContent);
        if (blocks.length > 0) {
          setCodeBlocks(blocks);
          setGeneratedCode(blocks.map(b => `// === ${b.language.toUpperCase()} ===\n${b.code}`).join('\n\n'));
          setFileTree(buildFileTree(assistantContent, blocks));
        }
      },
      onDone: () => {
        setIsGenerating(false);
        setIsThinking(false);
        finishPipeline();

        const finalMetrics = extractMetrics(assistantContent);
        if (finalMetrics.screens > 0 || finalMetrics.apis > 0 || finalMetrics.dbTables > 0) setMetrics(finalMetrics);

        const finalBlocks = extractCodeBlocks(assistantContent);
        const finalCode = finalBlocks.length > 0 ? finalBlocks.map(b => `// === ${b.language.toUpperCase()} ===\n${b.code}`).join('\n\n') : generatedCode;
        setGeneratedCode(finalCode);
        setCodeBlocks(finalBlocks);
        setFileTree(buildFileTree(assistantContent, finalBlocks));

        const finalHtml = generatePreviewHtml(assistantContent, finalMetrics.screens > 0 ? finalMetrics : metrics);
        setPreviewHtml(finalHtml);

        saveSnapshot(text, [...updatedMessages, { id: assistantId, role: 'assistant', content: assistantContent, timestamp: new Date() }], finalCode, finalHtml, finalMetrics);
        toast.success('Build complete!');
      },
      onError: (err) => {
        setIsGenerating(false);
        setIsThinking(false);
        toast.error(err);
        setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: `⚠️ Error: ${err}\n\nPlease try again.`, timestamp: new Date() }]);
      },
    });
  }, [input, isGenerating, messages, advancePipeline, finishPipeline, extractMetrics, saveSnapshot, generatedCode, metrics, isThinking]);

  // ===== REGENERATE =====
  const regenerateLastResponse = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;
    setMessages(prev => {
      let idx = -1;
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].role === 'assistant' && prev[i].id !== '1') { idx = i; break; }
      }
      return idx > 0 ? prev.slice(0, idx) : prev;
    });
    setTimeout(() => sendMessage(lastUserMsg.content), 100);
  }, [messages, sendMessage]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setIsGenerating(false);
    setIsThinking(false);
    finishPipeline();
    toast.info("Generation stopped");
  }, [finishPipeline]);

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const handleClearChat = useCallback(() => {
    setMessages([{
      id: '1', role: 'assistant',
      content: "# 👋 Chat cleared\n\nReady for a new build. Describe what you want to create!",
      timestamp: new Date(),
    }]);
    setPreviewHtml('');
    setGeneratedCode('// VALA AI Engine — Send a prompt to generate code');
    setCodeBlocks([]);
    setFileTree([]);
    setMetrics({ screens: 0, apis: 0, dbTables: 0, flows: 0 });
    setBuildTime(null);
    setPipeline(prev => prev.map(s => ({ ...s, status: 'idle' as const, duration: undefined })));
    toast.success('Chat cleared');
  }, []);

  // ===== VOICE INPUT (FIXED - uses Web Speech API directly) =====
  const toggleVoiceInput = useCallback(() => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      if (event.error !== 'aborted') toast.error("Voice recognition failed");
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      toast.success("Voice captured!");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    toast.info("🎤 Listening... Click again to stop");
  }, [isRecording]);

  const getDeviceWidth = () => {
    switch (deviceMode) { case 'mobile': return '375px'; case 'tablet': return '768px'; default: return '100%'; }
  };

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
                  {isGenerating && <span className="text-[9px] px-1.5 py-0.5 rounded-full animate-pulse" style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa' }}>Building...</span>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={handleUndo} disabled={!canUndo} className="p-1 rounded hover:bg-white/5 disabled:opacity-20" style={{ color: C.textDim }} title="Undo"><Undo2 className="w-3.5 h-3.5" /></button>
                  <button onClick={handleRedo} disabled={!canRedo} className="p-1 rounded hover:bg-white/5 disabled:opacity-20" style={{ color: C.textDim }} title="Redo"><Redo2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setShowHistory(!showHistory)} className="p-1 rounded hover:bg-white/5" style={{ color: showHistory ? C.accent : C.textDim }} title="History"><History className="w-3.5 h-3.5" /></button>
                  <button onClick={handleClearChat} className="p-1 rounded hover:bg-white/5" style={{ color: C.textDim }} title="Clear chat"><Trash2 className="w-3.5 h-3.5" /></button>
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
                      <div className="text-[10px] font-semibold px-2 py-1 mb-1" style={{ color: C.textMuted }}>VERSION HISTORY ({history.length})</div>
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
                            <div className="text-[10px]" style={{ color: C.textDim }}>{snap.timestamp.toLocaleTimeString()} • v{idx + 1} • {snap.metrics.screens}s {snap.metrics.apis}a {snap.metrics.dbTables}t</div>
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
                          <div className="text-sm leading-relaxed rounded-lg px-3 py-2" style={{ background: '#18181b', color: C.text }}>{msg.content}</div>
                        )}
                        {msg.role === 'assistant' && !isGenerating && msg.id !== '1' && (
                          <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { navigator.clipboard.writeText(msg.content); toast.success('Copied!'); }} className="p-1 rounded hover:bg-white/5" style={{ color: C.textDim }}><Copy className="w-3.5 h-3.5" /></button>
                            <button onClick={() => speakMessage(msg.id, msg.content)} className="p-1 rounded hover:bg-white/5" style={{ color: playingMsgId === msg.id ? C.accent : C.textDim }}>
                              {ttsLoading === msg.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : playingMsgId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                            </button>
                            <button className="p-1 rounded hover:bg-white/5" style={{ color: C.textDim }}><ThumbsUp className="w-3.5 h-3.5" /></button>
                            <button className="p-1 rounded hover:bg-white/5" style={{ color: C.textDim }}><ThumbsDown className="w-3.5 h-3.5" /></button>
                            <button onClick={regenerateLastResponse} className="p-1 rounded hover:bg-white/5 flex items-center gap-1" style={{ color: C.textDim }} title="Regenerate">
                              <RefreshCw className="w-3.5 h-3.5" /><span className="text-[10px]">Regenerate</span>
                            </button>
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
                        <div className="rounded-lg px-3 py-2.5" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.1)' }}>
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
                    <button onClick={handleStop} className="ml-auto text-xs px-2.5 py-1 rounded-md font-medium transition-colors" style={{ color: C.red, background: 'rgba(239,68,68,0.1)', border: `1px solid rgba(239,68,68,0.2)` }}>Stop</button>
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
                    disabled={isGenerating}
                  />
                  <div className="flex items-center justify-between px-3 py-2" style={{ borderTop: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-md hover:bg-white/5" style={{ color: C.textDim }} title="Attach file"><Paperclip className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-md hover:bg-white/5" style={{ color: C.textDim }} title="Add image"><Image className="w-4 h-4" /></button>
                      <button onClick={toggleVoiceInput} className={cn("p-1.5 rounded-md transition-colors", isRecording ? "bg-red-500/20" : "hover:bg-white/5")} style={{ color: isRecording ? '#ef4444' : C.textDim }} title="Voice input">
                        {isRecording ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      {input.trim() && <span className="text-[10px]" style={{ color: C.textDim }}>{input.length} chars</span>}
                      <button onClick={() => sendMessage()} disabled={!input.trim() || isGenerating} className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed" style={{ background: input.trim() ? C.accent : 'transparent', color: '#fff' }}>
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Toggle */}
        {!showSidebar && (
          <button onClick={() => setShowSidebar(true)} className="fixed left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-lg" style={{ background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textDim }}>
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}

        {/* ===== RIGHT: PREVIEW + PIPELINE ===== */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#111113' }}>
          {/* Preview Toolbar */}
          <div className="flex items-center justify-between px-4 h-10 shrink-0" style={{ borderBottom: `1px solid ${C.border}`, background: C.bgSidebar }}>
            <div className="flex items-center gap-1">
              <button onClick={() => setPreviewMode('preview')} className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors" style={{ background: previewMode === 'preview' ? 'rgba(255,255,255,0.08)' : 'transparent', color: previewMode === 'preview' ? C.text : C.textDim }}>
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button onClick={() => setPreviewMode('code')} className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors" style={{ background: previewMode === 'code' ? 'rgba(255,255,255,0.08)' : 'transparent', color: previewMode === 'code' ? C.text : C.textDim }}>
                <Code2 className="w-3.5 h-3.5" /> Code
              </button>
              <button onClick={() => setPreviewMode('files')} className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors" style={{ background: previewMode === 'files' ? 'rgba(255,255,255,0.08)' : 'transparent', color: previewMode === 'files' ? C.text : C.textDim }}>
                <FolderTree className="w-3.5 h-3.5" /> Files
              </button>
            </div>
            <div className="flex items-center gap-1">
              {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as [DeviceMode, React.ElementType][]).map(([mode, Icon]) => (
                <button key={mode} onClick={() => setDeviceMode(mode)} className="p-1.5 rounded-md transition-colors" style={{ background: deviceMode === mode ? 'rgba(255,255,255,0.08)' : 'transparent', color: deviceMode === mode ? C.text : C.textDim }}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPreviewHtml(prev => prev)} className="p-1.5 rounded-md hover:bg-white/5" style={{ color: C.textDim }} title="Refresh"><RefreshCw className="w-3.5 h-3.5" /></button>
              {history.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>v{currentHistoryIndex + 1}</span>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Preview/Code/Files */}
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
                  {/* BUG FIX: Use srcdoc instead of contentDocument.write — avoids sandbox cross-origin issues */}
                  {previewHtml ? (
                    <iframe
                      srcDoc={previewHtml}
                      className="w-full bg-black"
                      style={{ height: 'calc(100% - 36px)', border: 'none' }}
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
              ) : previewMode === 'code' ? (
                <div className="w-full h-full rounded-lg overflow-hidden flex flex-col" style={{ background: '#0d1117', border: `1px solid ${C.border}` }}>
                  {codeBlocks.length > 0 && (
                    <div className="flex items-center gap-0 overflow-x-auto shrink-0" style={{ borderBottom: '1px solid #21262d' }}>
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
                          {block.filename || `${block.language.toUpperCase()}`}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ borderBottom: '1px solid #21262d' }}>
                    <span className="text-xs font-medium" style={{ color: '#8b949e' }}>
                      {codeBlocks.length > 0 ? `${codeBlocks[activeCodeTab]?.language || 'code'} • ${codeBlocks[activeCodeTab]?.code.split('\n').length || 0} lines` : 'Generated Code'}
                    </span>
                    <button onClick={() => { navigator.clipboard.writeText(codeBlocks[activeCodeTab]?.code || generatedCode); toast.success('Code copied!'); }} className="p-1 rounded hover:bg-white/5" style={{ color: '#8b949e' }}><Copy className="w-3.5 h-3.5" /></button>
                  </div>
                  <ScrollArea className="flex-1">
                    <pre className="p-4 text-xs leading-6 font-mono" style={{ color: '#e6edf3' }}>
                      <code>{codeBlocks[activeCodeTab]?.code || generatedCode}</code>
                    </pre>
                  </ScrollArea>
                </div>
              ) : (
                /* Files View */
                <div className="w-full h-full rounded-lg overflow-hidden flex flex-col" style={{ background: '#0d1117', border: `1px solid ${C.border}` }}>
                  <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ borderBottom: '1px solid #21262d' }}>
                    <span className="text-xs font-medium" style={{ color: '#8b949e' }}>
                      PROJECT FILES • {codeBlocks.length} files generated
                    </span>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="py-2">
                      {fileTree.length > 0 ? (
                        fileTree.map((node, i) => <FileTreeNode key={i} node={node} />)
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <FolderTree className="w-10 h-10 mb-3" style={{ color: C.textDim }} />
                          <p className="text-sm" style={{ color: C.textMuted }}>No files generated yet</p>
                          <p className="text-xs mt-1" style={{ color: C.textDim }}>Send a build prompt to generate project files</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>

            {/* Pipeline Sidebar */}
            <div className="w-56 shrink-0 flex flex-col" style={{ borderLeft: `1px solid ${C.border}`, background: C.bgSidebar }}>
              <div className="px-3 py-2 text-xs font-semibold flex items-center justify-between shrink-0" style={{ color: C.textMuted, borderBottom: `1px solid ${C.border}` }}>
                <span>AI PIPELINE</span>
                {completedSteps > 0 && <span className="text-[10px]" style={{ color: C.green }}>{completedSteps}/{pipeline.length}</span>}
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {pipeline.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-all" style={{
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
                <div className="p-3 space-y-2 shrink-0" style={{ borderTop: `1px solid ${C.border}` }}>
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
