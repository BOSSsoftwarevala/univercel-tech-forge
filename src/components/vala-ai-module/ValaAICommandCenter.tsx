/**
 * VALA AI ENGINE - LOVABLE-STYLE BUILDER INTERFACE
 * ================================================
 * Split-pane: Left Chat + Right Preview/Code
 * ================================================
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LiveActivityPipeline } from './LiveActivityPipeline';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import {
  Send, Loader2, Bot, User, Sparkles, Code2, Eye,
  PanelLeftClose, PanelLeftOpen, ChevronDown, Globe,
  RefreshCw, Smartphone, Monitor, ExternalLink,
  FolderTree, File, ChevronRight, Copy, Check,
  Plus, Trash2, MessageSquare, Settings2,
  Rocket, Store, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAutoPublish } from '@/hooks/useAutoPublish';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ===== TYPES =====
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type WorkspaceTab = 'preview' | 'code';

type FileNode = {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
};

// ===== MOCK FILE TREE =====
const MOCK_FILES: FileNode[] = [
  {
    name: 'src', type: 'folder', children: [
      {
        name: 'components', type: 'folder', children: [
          { name: 'App.tsx', type: 'file', content: '// App component\nimport React from "react";\n\nconst App = () => {\n  return (\n    <div className="min-h-screen bg-background">\n      <h1>Your App</h1>\n    </div>\n  );\n};\n\nexport default App;' },
          { name: 'Header.tsx', type: 'file', content: '// Header component\nexport const Header = () => {\n  return <header>Header</header>;\n};' },
        ]
      },
      {
        name: 'pages', type: 'folder', children: [
          { name: 'Index.tsx', type: 'file', content: '// Index page\nconst Index = () => <div>Home Page</div>;\nexport default Index;' },
        ]
      },
      { name: 'main.tsx', type: 'file', content: 'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\n\nReactDOM.createRoot(\n  document.getElementById("root")!\n).render(<App />);' },
    ]
  },
  { name: 'package.json', type: 'file', content: '{\n  "name": "vala-project",\n  "version": "1.0.0"\n}' },
  { name: 'index.html', type: 'file', content: '<!DOCTYPE html>\n<html>\n<body>\n  <div id="root"></div>\n</body>\n</html>' },
];

// ===== STREAMING CHAT =====
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vala-ai-builder`;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: { role: string; content: string }[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ messages }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({ error: `Server error ${resp.status}` }));
      if (resp.status === 422 && errorData.blocked) {
        onError(`⚠️ ${errorData.error || 'Message blocked due to inappropriate content.'}`);
        return;
      }
      if (resp.status === 429) {
        onError('Rate limit exceeded. Please wait a moment and try again.');
        return;
      }
      if (resp.status === 402) {
        onError('AI credits exhausted. Please add credits to continue.');
        return;
      }
      onError(errorData.error || `Error ${resp.status}`);
      return;
    }
    
    if (!resp.body) {
      onError('No response stream received');
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = '';
    let streamDone = false;

    while (!streamDone) {
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
        if (jsonStr === '[DONE]') {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + '\n' + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split('\n')) {
        if (!raw) continue;
        if (raw.endsWith('\r')) raw = raw.slice(0, -1);
        if (raw.startsWith(':') || raw.trim() === '') continue;
        if (!raw.startsWith('data: ')) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone();
  } catch (err) {
    onError(err instanceof Error ? err.message : 'Stream failed');
  }
}

// ===== FILE TREE COMPONENT =====
const FileTreeItem: React.FC<{
  node: FileNode;
  depth: number;
  selectedFile: string | null;
  onSelect: (name: string, content: string) => void;
}> = ({ node, depth, selectedFile, onSelect }) => {
  const [expanded, setExpanded] = useState(depth === 0);

  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-1.5 px-2 py-1 text-xs hover:bg-white/5 rounded transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <ChevronRight
            className="w-3 h-3 shrink-0 transition-transform"
            style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', color: 'rgba(255,255,255,0.4)' }}
          />
          <FolderTree className="w-3.5 h-3.5 shrink-0" style={{ color: '#60a5fa' }} />
          <span style={{ color: 'rgba(255,255,255,0.8)' }}>{node.name}</span>
        </button>
        {expanded && node.children?.map((child, i) => (
          <FileTreeItem key={i} node={child} depth={depth + 1} selectedFile={selectedFile} onSelect={onSelect} />
        ))}
      </div>
    );
  }

  const isSelected = selectedFile === node.name;
  return (
    <button
      onClick={() => onSelect(node.name, node.content || '')}
      className="w-full flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors"
      style={{
        paddingLeft: `${depth * 12 + 20}px`,
        background: isSelected ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
        color: isSelected ? '#60a5fa' : 'rgba(255,255,255,0.6)',
      }}
    >
      <File className="w-3.5 h-3.5 shrink-0" style={{ color: node.name.endsWith('.tsx') ? '#06b6d4' : node.name.endsWith('.json') ? '#f59e0b' : 'rgba(255,255,255,0.4)' }} />
      <span className="truncate">{node.name}</span>
    </button>
  );
};

// ===== MAIN COMPONENT =====
const CATEGORIES = [
  'Education', 'Healthcare', 'E-Commerce', 'CRM', 'ERP', 'POS', 'HRM',
  'Finance', 'Real Estate', 'Logistics', 'Restaurant', 'Hotel/Travel',
  'Fitness', 'Insurance', 'Automotive', 'Manufacturing', 'Subscription',
  'Library', 'Events', 'Project Management', 'Beauty/Salon', 'Inventory',
  'Lending', 'General',
];

const ValaAICommandCenter: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm **VALA AI** — your enterprise software builder. Describe what you want to build and I'll generate the full architecture, code, and deployment plan.\n\nTry something like:\n- *\"Build a restaurant POS with table management\"*\n- *\"Create a CRM with lead tracking and analytics\"*\n- *\"Design an inventory management system\"*",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('preview');
  const [showFileTree, setShowFileTree] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [previewHtml, setPreviewHtml] = useState('<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0f172a;color:white;font-family:system-ui;"><div style="text-align:center;"><h1 style="font-size:2rem;margin-bottom:1rem;">🚀 VALA AI Preview</h1><p style="color:rgba(255,255,255,0.6);">Your generated app will appear here</p></div></div>');

  // Auto-publish state
  const { publish, isPublishing, lastResult } = useAutoPublish();
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishForm, setPublishForm] = useState({
    productName: '',
    description: '',
    category: 'General',
    type: 'SaaS',
    price: 249,
    githubRepoUrl: '',
  });
  const hasGeneratedContent = messages.length > 1 && messages.some(m => m.role === 'assistant' && m.content.length > 200);
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    let assistantContent = '';

    const upsertAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last.id.startsWith('stream-')) {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
        }
        return [...prev, { id: `stream-${Date.now()}`, role: 'assistant', content: assistantContent, timestamp: new Date() }];
      });
    };

    await streamChat({
      messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
      onDelta: upsertAssistant,
      onDone: () => setIsStreaming(false),
      onError: (err) => {
        setIsStreaming(false);
        toast.error(err);
      },
    });
  }, [input, isStreaming, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (name: string, content: string) => {
    setSelectedFile(name);
    setFileContent(content);
    setActiveTab('code');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNewChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "New session started! What would you like to build?",
      timestamp: new Date(),
    }]);
  };

  const handlePublishToMarketplace = async () => {
    // Extract features/tech from the AI conversation
    const allAssistantContent = messages
      .filter(m => m.role === 'assistant')
      .map(m => m.content)
      .join('\n');

    const features: string[] = [];
    const techStack: string[] = [];
    
    // Simple extraction from build output
    const featureMatches = allAssistantContent.match(/[-•]\s*\*\*(.+?)\*\*/g);
    if (featureMatches) {
      featureMatches.slice(0, 10).forEach(f => features.push(f.replace(/[-•]\s*\*\*/g, '').replace(/\*\*/g, '')));
    }

    await publish({
      productName: publishForm.productName,
      description: publishForm.description || `${publishForm.productName} - Auto-generated by VALA AI`,
      category: publishForm.category,
      type: publishForm.type,
      price: publishForm.price,
      features,
      techStack,
      githubRepoUrl: publishForm.githubRepoUrl || undefined,
      buildOutput: allAssistantContent.slice(0, 3000),
    });

    setShowPublishDialog(false);
  };

  return (
    <div className="h-full flex overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* ===== LEFT: CHAT PANEL ===== */}
      <div className="flex flex-col" style={{ width: '420px', minWidth: '360px', borderRight: '1px solid rgba(255,255,255,0.08)', background: '#0f0f0f' }}>
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">VALA AI</span>
            <Badge className="text-[10px] px-1.5 py-0" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'none' }}>
              Online
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {hasGeneratedContent && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-[10px] gap-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                onClick={() => setShowPublishDialog(true)}
                disabled={isPublishing}
              >
                {isPublishing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Rocket className="w-3 h-3" />}
                Publish
              </Button>
            )}
            <Button variant="ghost" size="icon" className="w-7 h-7 text-white/40 hover:text-white hover:bg-white/5" onClick={handleNewChat}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className="max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed"
                  style={{
                    background: msg.role === 'user' ? '#2563eb' : 'rgba(255,255,255,0.06)',
                    color: msg.role === 'user' ? '#fff' : 'rgba(255,255,255,0.85)',
                  }}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_pre]:bg-black/40 [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:my-2 [&_h2]:text-base [&_h2]:mt-3 [&_h2]:mb-1 [&_h3]:text-sm [&_h3]:mt-2 [&_h3]:mb-1 [&_strong]:text-white">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <User className="w-4 h-4 text-white/60" />
                  </div>
                )}
              </div>
            ))}
            {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="text-sm text-white/50">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="relative rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to build..."
              rows={3}
              className="w-full bg-transparent text-white text-sm px-4 py-3 resize-none outline-none placeholder:text-white/30"
              disabled={isStreaming}
            />
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-[10px] text-white/20">Shift+Enter for new line</span>
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="h-7 px-3 text-xs gap-1.5 rounded-lg"
                style={{ background: input.trim() ? '#2563eb' : 'rgba(255,255,255,0.06)', color: input.trim() ? '#fff' : 'rgba(255,255,255,0.3)' }}
              >
                {isStreaming ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT: WORKSPACE ===== */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#0a0a0a' }}>
        {/* Workspace Header / Tab Bar */}
        <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#111' }}>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('preview')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              style={{
                background: activeTab === 'preview' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTab === 'preview' ? '#fff' : 'rgba(255,255,255,0.4)',
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              style={{
                background: activeTab === 'code' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTab === 'code' ? '#fff' : 'rgba(255,255,255,0.4)',
              }}
            >
              <Code2 className="w-3.5 h-3.5" />
              Code
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'preview' && (
              <>
                {/* URL Bar */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-md text-xs" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', minWidth: '240px' }}>
                  <Globe className="w-3 h-3 text-white/30" />
                  <span className="text-white/40 truncate">vala-preview.local</span>
                </div>
                <Button variant="ghost" size="icon" className="w-7 h-7 text-white/30 hover:text-white hover:bg-white/5">
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
                <div className="flex items-center gap-0.5 ml-1">
                  <Button variant="ghost" size="icon" className="w-7 h-7 text-white/30 hover:text-white hover:bg-white/5">
                    <Monitor className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-7 h-7 text-white/30 hover:text-white hover:bg-white/5">
                    <Smartphone className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </>
            )}
            {activeTab === 'code' && selectedFile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCode}
                className="h-7 px-2 text-xs gap-1.5 text-white/40 hover:text-white hover:bg-white/5"
              >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </div>
        </div>

        {/* Workspace Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree (Code mode) */}
          {activeTab === 'code' && showFileTree && (
            <div className="w-[200px] overflow-y-auto py-2" style={{ borderRight: '1px solid rgba(255,255,255,0.08)', background: '#0d0d0d' }}>
              <div className="px-3 py-1 mb-1 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Files</span>
                <Button variant="ghost" size="icon" className="w-5 h-5 text-white/20 hover:text-white" onClick={() => setShowFileTree(false)}>
                  <PanelLeftClose className="w-3 h-3" />
                </Button>
              </div>
              {MOCK_FILES.map((node, i) => (
                <FileTreeItem key={i} node={node} depth={0} selectedFile={selectedFile} onSelect={handleFileSelect} />
              ))}
            </div>
          )}

          {/* Main View */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'preview' ? (
              /* Preview iframe */
              <iframe
                srcDoc={previewHtml}
                className="w-full h-full border-0"
                title="VALA Preview"
                sandbox="allow-scripts"
                style={{ background: '#0f172a' }}
              />
            ) : (
              /* Code Editor */
              <div className="h-full flex flex-col">
                {!showFileTree && (
                  <div className="px-2 py-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <Button variant="ghost" size="icon" className="w-6 h-6 text-white/20 hover:text-white" onClick={() => setShowFileTree(true)}>
                      <PanelLeftOpen className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
                {selectedFile ? (
                  <div className="flex-1 flex flex-col">
                    {/* File Tab */}
                    <div className="flex items-center px-4 py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)' }}>
                        <File className="w-3 h-3" style={{ color: '#06b6d4' }} />
                        {selectedFile}
                      </div>
                    </div>
                    {/* Code Content */}
                    <ScrollArea className="flex-1">
                      <pre className="p-4 text-xs leading-relaxed font-mono" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        <code>{fileContent}</code>
                      </pre>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <Code2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.1)' }} />
                      <p className="text-sm text-white/30">Select a file to view code</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== RIGHT: LIVE ACTIVITY PIPELINE ===== */}
      <LiveActivityPipeline isActive={isStreaming} />
      {/* ===== PUBLISH TO MARKETPLACE DIALOG ===== */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent className="bg-[#111] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Store className="w-5 h-5 text-emerald-400" />
              Publish to Marketplace
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs text-white/50 mb-1 block">Product Name *</label>
              <Input
                value={publishForm.productName}
                onChange={e => setPublishForm(prev => ({ ...prev, productName: e.target.value }))}
                placeholder="e.g. Restaurant POS Pro"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1 block">Description</label>
              <Input
                value={publishForm.description}
                onChange={e => setPublishForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief product description"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Category</label>
                <Select
                  value={publishForm.category}
                  onValueChange={v => setPublishForm(prev => ({ ...prev, category: v }))}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    {CATEGORIES.map(c => (
                      <SelectItem key={c} value={c} className="text-white/80 focus:bg-white/10 focus:text-white">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1 block">Type</label>
                <Select
                  value={publishForm.type}
                  onValueChange={v => setPublishForm(prev => ({ ...prev, type: v }))}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    {['SaaS', 'Desktop', 'Mobile', 'Hybrid', 'Offline'].map(t => (
                      <SelectItem key={t} value={t} className="text-white/80 focus:bg-white/10 focus:text-white">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Price (₹)</label>
                <Input
                  type="number"
                  value={publishForm.price}
                  onChange={e => setPublishForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">GitHub Repo URL</label>
                <Input
                  value={publishForm.githubRepoUrl}
                  onChange={e => setPublishForm(prev => ({ ...prev, githubRepoUrl: e.target.value }))}
                  placeholder="https://github.com/..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            {lastResult && (
              <div className={`p-3 rounded-lg text-xs ${lastResult.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {lastResult.success ? (
                  <div className="space-y-1">
                    <p className="font-medium">✅ {lastResult.message}</p>
                    {lastResult.demoDomain && <p>🌐 Domain: {lastResult.demoDomain}</p>}
                    {lastResult.steps?.map((s, i) => (
                      <p key={i} className="text-white/40">{s.status === 'success' ? '✓' : s.status === 'failed' ? '✗' : '○'} {s.step}</p>
                    ))}
                  </div>
                ) : (
                  <p>❌ {lastResult.error}</p>
                )}
              </div>
            )}

            <div className="p-2 rounded-lg text-[10px] text-white/30" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <Package className="w-3 h-3 inline mr-1" />
              Pipeline: Catalog Entry → AI Image → VPS Deploy → Boss Approval
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowPublishDialog(false)}
              className="text-white/50 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePublishToMarketplace}
              disabled={!publishForm.productName || isPublishing}
              className="gap-1.5"
              style={{ background: '#10b981' }}
            >
              {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
              {isPublishing ? 'Publishing...' : 'Submit for Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ValaAICommandCenter;
