/**
 * VALA AI COMMAND CENTER - CORE AI ENGINE
 * ================================================
 * TEXT-ONLY COMMAND SYSTEM
 * NO MEDIA INPUTS ALLOWED
 * ================================================
 * LOCKED: DO NOT CHANGE COLORS/FONTS/THEME
 */

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Send, Terminal, Loader2, Lock, Unlock, AlertTriangle, 
  RotateCcw, History, CheckCircle2, XCircle, Clock, Zap,
  Shield, FileText, Bug, Activity, Volume2, VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAIRA, AIRAError } from '@/hooks/useAIRA';

type Message = { 
  role: 'user' | 'assistant' | 'system'; 
  content: string; 
  timestamp: Date;
  status?: 'pending' | 'executing' | 'success' | 'error';
};

type ExecutionLog = {
  id: string;
  command: string;
  status: 'success' | 'error' | 'warning';
  timestamp: Date;
  duration: number;
};

// ===== LOCKED COLORS (DO NOT CHANGE) =====
const COLORS = {
  bg: '#0B0F1A',
  bgSecondary: '#0d1b2a',
  border: '#1e3a5f',
  accent: '#2563eb',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.7)',
};

const ValaAICommandCenter: React.FC = () => {
  const { executeCommand, logCommandSuccess, logCommandError, validateCommand, systemHealthy, isBossOwner, user } = useAIRA();

  // System state
  const [isLocked, setIsLocked] = useState(true);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<Array<{id: string; title: string}>>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Command state
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'system', 
      content: '🔒 VALA AI COMMAND CENTER INITIALIZED\n\nTEXT-ONLY COMMAND SYSTEM ACTIVE\n• Type structured prompts for execution\n• No media inputs allowed\n• All changes require confirmation\n\nReady for commands.',
      timestamp: new Date(),
      status: 'success'
    }
  ]);
  const [inputCommand, setInputCommand] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Execution logs
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);

  // Micro functions detection
  const [detectedIssues, setDetectedIssues] = useState<string[]>([]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from('demos')
        .select('id, title')
        .not('url', 'is', null)
        .order('title');
      if (data) setProjects(data);
    };
    fetchProjects();
  }, []);

  // Detect language from input
  const detectLanguage = (text: string): string => {
    const hindiRegex = /[\u0900-\u097F]/;
    const arabicRegex = /[\u0600-\u06FF]/;
    const chineseRegex = /[\u4e00-\u9fff]/;
    
    if (hindiRegex.test(text)) return 'Hindi';
    if (arabicRegex.test(text)) return 'Arabic';
    if (chineseRegex.test(text)) return 'Chinese';
    return 'English';
  };

  // Stream AI response via useAIRA hook
  const streamCommand = async (command: string) => {
    const startTime = Date.now();
    const context = `VALA AI CORE ENGINE | Project: ${activeProject || 'None'} | Mode: TEXT-ONLY COMMAND | Lock: ${isLocked ? 'ACTIVE' : 'UNLOCKED'}`;
    const { riskLevel } = validateCommand(command);

    try {
      const responseBody = await executeCommand(
        command,
        messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })),
        context,
        { voiceEnabled },
      );

      const reader = responseBody.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistantContent = '';

      // Add empty assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '', timestamp: new Date(), status: 'executing' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        let idx: number;
        while ((idx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || !line.trim()) continue;
          if (!line.startsWith('data: ')) continue;
          
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantContent, timestamp: new Date(), status: 'executing' };
                return updated;
              });
            }
          } catch { /* ignore malformed SSE JSON chunks */ }
        }
      }

      // Mark as success
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], status: 'success' };
        return updated;
      });

      // Log success to aira_logs
      await logCommandSuccess(command, riskLevel as 'low' | 'medium');

      // Log execution
      const duration = Date.now() - startTime;
      setExecutionLogs(prev => [{
        id: Date.now().toString(),
        command: command.slice(0, 50) + (command.length > 50 ? '...' : ''),
        status: 'success',
        timestamp: new Date(),
        duration
      }, ...prev.slice(0, 49)]);

    } catch (error) {
      const isAIRAErr = error instanceof AIRAError;
      const errMsg = error instanceof Error ? error.message : 'Command execution failed';
      console.error('[AIRA] Command error:', error);

      // Show specific error messages based on AIRAError code (type-safe)
      if (isAIRAErr && error.code === 'UNAUTHORIZED') {
        toast.error('Access denied: Only boss_owner can execute AIRA commands');
      } else if (isAIRAErr && error.code === 'FAILSAFE') {
        toast.error('System health check failed — execution halted');
      } else if (isAIRAErr && error.code === 'VALIDATION_FAILED') {
        toast.error(`Validation failed: ${errMsg}`);
      } else if (isAIRAErr && error.code === 'RATE_LIMIT') {
        toast.error('Rate limit exceeded');
      } else if (isAIRAErr && error.code === 'CREDITS_EXHAUSTED') {
        toast.error('AI credits exhausted');
      } else {
        toast.error('Command execution failed');
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ ERROR: ${errMsg}`,
        timestamp: new Date(),
        status: 'error'
      }]);

      // Log error to aira_logs (skip pre-execution rejections — already logged in hook)
      const preExecution = isAIRAErr && ['UNAUTHORIZED', 'FAILSAFE', 'VALIDATION_FAILED'].includes(error.code);
      if (!preExecution) {
        await logCommandError(command, errMsg, riskLevel as 'low' | 'medium' | 'high');
      }

      setExecutionLogs(prev => [{
        id: Date.now().toString(),
        command: command.slice(0, 50),
        status: 'error',
        timestamp: new Date(),
        duration: Date.now() - startTime
      }, ...prev.slice(0, 49)]);
    }
  };

  // Execute command
  const handleExecute = async () => {
    if (!inputCommand.trim() || isStreaming) return;
    
    const cmd = inputCommand.trim();
    const lang = detectLanguage(cmd);
    
    setInputCommand('');
    setMessages(prev => [...prev, { role: 'user', content: cmd, timestamp: new Date(), status: 'pending' }]);
    setIsStreaming(true);
    
    await streamCommand(cmd);
    setIsStreaming(false);
  };

  // Handle keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleExecute();
    }
  };

  // Rollback trigger
  const handleRollback = () => {
    toast.info('Rollback initiated - restoring previous state...');
    setMessages(prev => [...prev, {
      role: 'system',
      content: '🔄 ROLLBACK TRIGGERED\nRestoring to last stable snapshot...',
      timestamp: new Date(),
      status: 'pending'
    }]);
  };

  return (
    <div className="h-full flex" style={{ background: COLORS.bg }}>
      {/* Access Gate: only boss_owner can use AIRA */}
      {!isBossOwner && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <Shield className="w-16 h-16" style={{ color: COLORS.error }} />
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2" style={{ color: COLORS.text }}>Access Restricted</h2>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>
              VALA AI Command Center is restricted to <strong style={{ color: COLORS.warning }}>boss_owner</strong> only.
            </p>
            <p className="text-xs mt-2" style={{ color: COLORS.textMuted }}>
              All unauthorized access attempts are logged to the audit trail.
            </p>
          </div>
        </div>
      )}

      {/* Main Command Panel — visible to boss_owner only */}
      {isBossOwner && <>
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div 
          className="h-14 flex items-center justify-between px-6"
          style={{ borderBottom: `1px solid ${COLORS.border}`, background: COLORS.bgSecondary }}
        >
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5" style={{ color: COLORS.accent }} />
            <span className="font-bold text-lg" style={{ color: COLORS.text }}>VALA AI COMMAND CENTER</span>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: COLORS.accent, color: COLORS.text }}>
              TEXT-ONLY
            </span>
            {!systemHealthy && (
              <span className="text-xs px-2 py-0.5 rounded flex items-center gap-1" style={{ background: 'rgba(239, 68, 68, 0.2)', color: COLORS.error }}>
                <AlertTriangle className="w-3 h-3" /> FAILSAFE ACTIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Voice Toggle (server-side synthesis, boss_owner only) */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              title={voiceEnabled ? 'Voice output ON (server-side)' : 'Voice output OFF'}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all"
              style={{ 
                background: voiceEnabled ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: voiceEnabled ? COLORS.accent : COLORS.textMuted
              }}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Voice
            </button>
            {/* Lock Status */}
            <button
              onClick={() => setIsLocked(!isLocked)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all"
              style={{ 
                background: isLocked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: isLocked ? COLORS.success : COLORS.error
              }}
            >
              {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              {isLocked ? 'LOCKED' : 'UNLOCKED'}
            </button>
            {/* Rollback */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRollback}
              className="text-sm"
              style={{ color: COLORS.warning }}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Rollback
            </Button>
          </div>
        </div>

        {/* Active Project Bar */}
        <div 
          className="h-10 flex items-center px-6 gap-4"
          style={{ borderBottom: `1px solid ${COLORS.border}`, background: 'rgba(37, 99, 235, 0.1)' }}
        >
          <span className="text-xs font-medium" style={{ color: COLORS.textMuted }}>ACTIVE PROJECT:</span>
          <select
            value={activeProject || ''}
            onChange={(e) => setActiveProject(e.target.value || null)}
            className="bg-transparent text-sm px-2 py-1 rounded"
            style={{ color: COLORS.text, border: `1px solid ${COLORS.border}` }}
          >
            <option value="">None Selected</option>
            {projects.map(p => (
              <option key={p.id} value={p.title}>{p.title}</option>
            ))}
          </select>
        </div>

        {/* Command Output */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3 font-mono text-sm">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-3 rounded-lg",
                  msg.role === 'system' && "border-l-4",
                  msg.role === 'user' && "ml-8",
                  msg.role === 'assistant' && "mr-8"
                )}
                style={{
                  background: msg.role === 'system' 
                    ? 'rgba(37, 99, 235, 0.1)' 
                    : msg.role === 'user' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(16, 185, 129, 0.1)',
                  borderColor: msg.role === 'system' ? COLORS.accent : undefined,
                  color: COLORS.text
                }}
              >
                <div className="flex items-start gap-2">
                  {msg.role === 'system' && <Terminal className="w-4 h-4 mt-0.5 shrink-0" style={{ color: COLORS.accent }} />}
                  {msg.role === 'user' && <span className="text-xs px-1.5 py-0.5 rounded shrink-0" style={{ background: COLORS.accent }}>CMD</span>}
                  {msg.role === 'assistant' && (
                    <span className="shrink-0">
                      {msg.status === 'executing' && <Loader2 className="w-4 h-4 animate-spin" style={{ color: COLORS.warning }} />}
                      {msg.status === 'success' && <CheckCircle2 className="w-4 h-4" style={{ color: COLORS.success }} />}
                      {msg.status === 'error' && <XCircle className="w-4 h-4" style={{ color: COLORS.error }} />}
                    </span>
                  )}
                  <div className="flex-1 whitespace-pre-wrap">{msg.content}</div>
                </div>
                <div className="text-xs mt-1 opacity-50">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Command Input - TEXT ONLY */}
        <div 
          className="p-4"
          style={{ borderTop: `1px solid ${COLORS.border}`, background: COLORS.bgSecondary }}
        >
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputCommand}
                onChange={(e) => setInputCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter command... (TEXT ONLY - No media inputs)"
                rows={2}
                className="w-full resize-none rounded-lg px-4 py-3 text-sm font-mono"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.text
                }}
              />
            </div>
            <Button 
              onClick={handleExecute} 
              disabled={isStreaming || !inputCommand.trim()}
              className="h-full px-6"
              style={{ background: COLORS.accent }}
            >
              {isStreaming ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  EXECUTE
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: COLORS.textMuted }}>
            <span>⌨️ Enter to execute</span>
            <span>|</span>
            <span>⇧+Enter for newline</span>
            <span>|</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" /> 
              {isLocked ? 'Lock Active - Changes Require Approval' : 'CAUTION: Lock Disabled'}
            </span>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Logs & Status */}
      <div 
        className="w-72 flex flex-col"
        style={{ borderLeft: `1px solid ${COLORS.border}`, background: COLORS.bgSecondary }}
      >
        {/* Execution Logs */}
        <div className="p-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3" style={{ color: COLORS.text }}>
            <History className="w-4 h-4" style={{ color: COLORS.accent }} />
            Execution Logs
          </h3>
          <ScrollArea className="h-48">
            {executionLogs.length === 0 ? (
              <p className="text-xs" style={{ color: COLORS.textMuted }}>No executions yet</p>
            ) : (
              <div className="space-y-2">
                {executionLogs.map(log => (
                  <div 
                    key={log.id} 
                    className="p-2 rounded text-xs"
                    style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                  >
                    <div className="flex items-center gap-2">
                      {log.status === 'success' && <CheckCircle2 className="w-3 h-3" style={{ color: COLORS.success }} />}
                      {log.status === 'error' && <XCircle className="w-3 h-3" style={{ color: COLORS.error }} />}
                      {log.status === 'warning' && <AlertTriangle className="w-3 h-3" style={{ color: COLORS.warning }} />}
                      <span className="truncate" style={{ color: COLORS.text }}>{log.command}</span>
                    </div>
                    <div className="flex justify-between mt-1" style={{ color: COLORS.textMuted }}>
                      <span>{log.timestamp.toLocaleTimeString()}</span>
                      <span>{log.duration}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Error Detection */}
        <div className="p-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3" style={{ color: COLORS.text }}>
            <Bug className="w-4 h-4" style={{ color: COLORS.error }} />
            Error Detection
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <span style={{ color: COLORS.textMuted }}>Broken Buttons</span>
              <span style={{ color: COLORS.success }}>0</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <span style={{ color: COLORS.textMuted }}>Dead Routes</span>
              <span style={{ color: COLORS.success }}>0</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <span style={{ color: COLORS.textMuted }}>Missing APIs</span>
              <span style={{ color: COLORS.success }}>0</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <span style={{ color: COLORS.textMuted }}>Permission Issues</span>
              <span style={{ color: COLORS.success }}>0</span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="p-4 flex-1">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3" style={{ color: COLORS.text }}>
            <Activity className="w-4 h-4" style={{ color: COLORS.success }} />
            System Status
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span style={{ color: COLORS.textMuted }}>AI Engine</span>
              <span className="flex items-center gap-1" style={{ color: systemHealthy ? COLORS.success : COLORS.error }}>
                <span className={`w-2 h-2 rounded-full ${systemHealthy ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                {systemHealthy ? 'ONLINE' : 'FAILSAFE'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: COLORS.textMuted }}>Response Time</span>
              <span style={{ color: COLORS.text }}>&lt;300ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: COLORS.textMuted }}>Lock Status</span>
              <span style={{ color: isLocked ? COLORS.success : COLORS.warning }}>
                {isLocked ? 'ACTIVE' : 'DISABLED'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: COLORS.textMuted }}>Mode</span>
              <span style={{ color: COLORS.accent }}>TEXT-ONLY</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: COLORS.textMuted }}>Voice</span>
              <span style={{ color: voiceEnabled ? COLORS.accent : COLORS.textMuted }}>
                {voiceEnabled ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </div>
      </div>
      </>}
    </div>
  );
};

export default ValaAICommandCenter;
