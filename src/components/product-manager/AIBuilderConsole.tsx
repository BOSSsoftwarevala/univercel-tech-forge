import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Upload, ScanLine, Cpu, GitBranch, Bug,
  Wrench, Lock, Unlock, Rocket, MessageSquare, ChevronDown
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import CommandInput from './CommandInput';
import UploadInterface from './UploadInterface';
import ProjectScanner from './ProjectScanner';
import FrameworkDetection from './FrameworkDetection';
import DependencyViewer from './DependencyViewer';
import BuildLogsViewer from './BuildLogsViewer';

type ActiveTool =
  | 'command'
  | 'upload'
  | 'scanner'
  | 'frameworks'
  | 'dependencies'
  | 'logs'
  | 'repair'
  | 'lock';

interface ConsoleMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
}

const TOOL_BUTTONS = [
  { id: 'upload' as ActiveTool, label: 'Upload', icon: Upload, color: 'text-blue-400' },
  { id: 'scanner' as ActiveTool, label: 'Scan', icon: ScanLine, color: 'text-violet-400' },
  { id: 'frameworks' as ActiveTool, label: 'Frameworks', icon: Cpu, color: 'text-cyan-400' },
  { id: 'dependencies' as ActiveTool, label: 'Dependencies', icon: GitBranch, color: 'text-amber-400' },
  { id: 'logs' as ActiveTool, label: 'Logs', icon: MessageSquare, color: 'text-emerald-400' },
  { id: 'repair' as ActiveTool, label: 'Auto-Repair', icon: Wrench, color: 'text-orange-400' },
  { id: 'lock' as ActiveTool, label: 'Lock/Unlock', icon: Lock, color: 'text-red-400' },
];

const INITIAL_MESSAGES: ConsoleMessage[] = [
  {
    id: '1',
    type: 'system',
    content: 'AI Builder Console initialized. Ready for commands.',
    timestamp: new Date().toLocaleTimeString(),
  },
  {
    id: '2',
    type: 'ai',
    content: 'Hello! I\'m your AI Product Builder assistant. I can help you scan projects, detect frameworks, manage dependencies, run security audits, and deploy your software. What would you like to do?',
    timestamp: new Date().toLocaleTimeString(),
  },
];

const AI_RESPONSES: Record<string, string> = {
  default: 'I\'ve processed your command. Analyzing the project structure and preparing the results...',
  scan: 'Starting comprehensive project scan. Analyzing directory structure, detecting frameworks, checking dependencies, and running security audit...',
  deploy: 'Initiating deployment pipeline. Running pre-deployment checks: build verification, environment validation, server capacity check...',
  fix: 'Analyzing detected issues. Preparing auto-repair suggestions for identified problems...',
  upload: 'Ready to receive your files. You can drag & drop or click to browse. Supported formats: ZIP, APK, web builds.',
};

const AIBuilderConsole: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool | null>(null);
  const [messages, setMessages] = useState<ConsoleMessage[]>(INITIAL_MESSAGES);
  const [isLocked, setIsLocked] = useState(false);

  const handleCommand = (cmd: string) => {
    const userMsg: ConsoleMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: cmd,
      timestamp: new Date().toLocaleTimeString(),
    };

    const lower = cmd.toLowerCase();
    let responseKey = 'default';
    if (lower.includes('scan') || lower.includes('analyze')) responseKey = 'scan';
    if (lower.includes('deploy') || lower.includes('production')) responseKey = 'deploy';
    if (lower.includes('fix') || lower.includes('repair')) responseKey = 'fix';
    if (lower.includes('upload')) responseKey = 'upload';

    const aiMsg: ConsoleMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: AI_RESPONSES[responseKey],
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  const toggleTool = (tool: ActiveTool) => {
    setActiveTool((prev) => (prev === tool ? null : tool));
  };

  const handleToggleLock = () => {
    setIsLocked(!isLocked);
    toast[isLocked ? 'success' : 'warning'](
      isLocked ? 'Source code unlocked' : 'Source code locked',
      { description: isLocked ? 'Editing is now enabled' : 'Code is now in read-only mode' }
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-slate-300">AI Builder Console</span>
        </div>
        <Badge className="ml-1 text-[10px] bg-violet-500/15 text-violet-300 border border-violet-500/25 px-2 py-0">
          GPT-4o Enhanced
        </Badge>
        <div className="flex-1" />
        {/* Lock/Unlock button */}
        <Button
          onClick={handleToggleLock}
          variant="outline"
          size="sm"
          className={cn(
            'h-7 gap-1.5 text-xs border',
            isLocked
              ? 'border-red-500/40 text-red-400 bg-red-500/10 hover:bg-red-500/20'
              : 'border-slate-700 text-slate-400 hover:text-slate-200'
          )}
        >
          {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          {isLocked ? 'Locked' : 'Unlocked'}
        </Button>
        <Button
          size="sm"
          className="h-7 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
          onClick={() => toast.success('Deployment initiated!')}
        >
          <Rocket className="w-3 h-3" />
          Deploy
        </Button>
      </div>

      {/* Tool selector bar */}
      <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-slate-800 overflow-x-auto shrink-0">
        {TOOL_BUTTONS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => toggleTool(tool.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0',
                isActive
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
              )}
            >
              <Icon className={cn('w-3.5 h-3.5', isActive ? tool.color : '')} />
              {tool.label}
              {isActive && <ChevronDown className="w-3 h-3" />}
            </button>
          );
        })}
      </div>

      {/* Tool panel (collapsible) */}
      <AnimatePresence>
        {activeTool && activeTool !== 'command' && (
          <motion.div
            key={activeTool}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-slate-800 shrink-0"
          >
            <div className="p-4">
              {activeTool === 'upload' && (
                <UploadInterface
                  onUpload={(files) => toast.success(`${files.length} file(s) queued for processing`)}
                />
              )}
              {activeTool === 'scanner' && (
                <ProjectScanner />
              )}
              {activeTool === 'frameworks' && (
                <FrameworkDetection />
              )}
              {activeTool === 'dependencies' && (
                <DependencyViewer />
              )}
              {activeTool === 'logs' && (
                <BuildLogsViewer isLive />
              )}
              {activeTool === 'repair' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 font-medium">Auto-Repair Suggestions</p>
                  {[
                    { issue: 'Missing TypeScript strict mode', fix: 'Enable strict mode in tsconfig.json', severity: 'warning' },
                    { issue: '4 outdated packages detected', fix: 'Run: npm update --save', severity: 'info' },
                    { issue: 'Unused imports in 3 files', fix: 'Remove unused imports with ESLint auto-fix', severity: 'info' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                      <Bug className={cn('w-4 h-4 mt-0.5 shrink-0', item.severity === 'warning' ? 'text-amber-400' : 'text-blue-400')} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-300">{item.issue}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{item.fix}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-slate-700 text-slate-400 hover:text-slate-200 shrink-0"
                      >
                        <Wrench className="w-3 h-3 mr-1" />
                        Fix
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {activeTool === 'lock' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 font-medium">Source Code Controls</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Lock Source Code', desc: 'Prevent editing', icon: Lock, action: () => setIsLocked(true) },
                      { label: 'Unlock Source Code', desc: 'Enable editing', icon: Unlock, action: () => setIsLocked(false) },
                      { label: 'View-Only Mode', desc: 'Read-only access', icon: Lock, action: () => toast.info('View-only mode activated') },
                      { label: 'Release Lock', desc: 'Remove all restrictions', icon: Unlock, action: () => { setIsLocked(false); toast.success('All locks removed'); } },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={item.action}
                        className="flex items-start gap-2 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors text-left"
                      >
                        <item.icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-slate-300">{item.label}</p>
                          <p className="text-[10px] text-slate-600">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat messages */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-4 max-w-3xl">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex gap-3',
                  msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                    msg.type === 'ai'
                      ? 'bg-violet-600/20 border border-violet-500/30'
                      : msg.type === 'system'
                      ? 'bg-slate-800 border border-slate-700'
                      : 'bg-slate-700'
                  )}
                >
                  {msg.type === 'ai' && <Sparkles className="w-3.5 h-3.5 text-violet-400" />}
                  {msg.type === 'system' && <span className="text-[8px] text-slate-400">SYS</span>}
                  {msg.type === 'user' && <span className="text-[8px] text-slate-300">YOU</span>}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    'max-w-lg px-4 py-2.5 rounded-xl text-sm leading-relaxed',
                    msg.type === 'ai'
                      ? 'bg-slate-800/60 border border-slate-700/50 text-slate-300'
                      : msg.type === 'system'
                      ? 'bg-slate-900 border border-slate-800 text-slate-500 text-xs'
                      : 'bg-violet-600/20 border border-violet-500/30 text-violet-200'
                  )}
                >
                  {msg.content}
                  <div className="mt-1 text-[10px] opacity-40">{msg.timestamp}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Command input */}
      <div className="px-6 py-4 border-t border-slate-800 shrink-0">
        <CommandInput onCommand={handleCommand} />
      </div>
    </div>
  );
};

export default AIBuilderConsole;
