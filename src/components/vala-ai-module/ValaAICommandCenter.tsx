/**
 * VALA AI ENGINE - LOVABLE-STYLE AI PRODUCT BUILDER
 * ================================================
 * Clone of Lovable's AI Builder Interface
 * ================================================
 * LOCKED: DO NOT CHANGE COLORS/FONTS/THEME
 */

import React, { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Play, RefreshCw, Trash2, Save, Upload, Loader2,
  Layers, Code2, Database, GitBranch, TrendingUp, Rocket,
  Sparkles, Settings2, Circle, CheckCircle2, Clock,
  Pause, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// ===== LOCKED COLORS (DO NOT CHANGE) =====
const COLORS = {
  bg: '#0B0F1A',
  bgSecondary: '#0d1b2a',
  bgCard: '#111827',
  border: '#1e3a5f',
  accent: '#2563eb',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  cyan: '#06b6d4',
  purple: '#8b5cf6',
  orange: '#f97316',
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.6)',
};

type PipelineStep = {
  id: string;
  label: string;
  status: 'idle' | 'running' | 'done' | 'error';
};

type SavedPrompt = {
  id: string;
  text: string;
};

const INITIAL_PIPELINE: PipelineStep[] = [
  { id: '1', label: 'Requirement Analysis', status: 'idle' },
  { id: '2', label: 'Feature Mapping', status: 'idle' },
  { id: '3', label: 'Screen Generation', status: 'idle' },
  { id: '4', label: 'API Planning', status: 'idle' },
  { id: '5', label: 'Database Schema', status: 'idle' },
  { id: '6', label: 'Flow Generation', status: 'idle' },
  { id: '7', label: 'Code Assembly', status: 'idle' },
  { id: '8', label: 'Deploy Package', status: 'idle' },
];

const SAVED_PROMPTS: SavedPrompt[] = [
  { id: '1', text: 'Build a user dashboard with role-based access control' },
  { id: '2', text: 'Create an e-commerce checkout flow with payment integration' },
  { id: '3', text: 'Design a social media feed with real-time updates' },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vala-ai-chat`;

const ValaAICommandCenter: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pipeline, setPipeline] = useState<PipelineStep[]>(INITIAL_PIPELINE);
  const [pipelineStatus, setPipelineStatus] = useState<'draft' | 'running' | 'done' | 'error'>('draft');
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(SAVED_PROMPTS);
  const [engineStatus, setEngineStatus] = useState<'Idle' | 'Running' | 'Done'>('Idle');
  const [version, setVersion] = useState('v1');

  // KPI counters
  const [kpis, setKpis] = useState({
    screens: 0,
    apis: 0,
    dbTables: 0,
    flows: 0,
    stepsDone: 0,
    totalSteps: 8,
    deploy: 'Ready' as string,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Simulate pipeline execution step by step
  const runPipeline = async () => {
    if (!prompt.trim()) {
      toast.error('Enter a prompt first');
      return;
    }

    setIsGenerating(true);
    setEngineStatus('Running');
    setPipelineStatus('running');
    const updatedKpis = { ...kpis, screens: 0, apis: 0, dbTables: 0, flows: 0, stepsDone: 0, deploy: 'Building' };
    setKpis(updatedKpis);

    // Reset pipeline
    setPipeline(INITIAL_PIPELINE.map(s => ({ ...s, status: 'idle' })));

    // Run each step
    for (let i = 0; i < INITIAL_PIPELINE.length; i++) {
      setPipeline(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'running' } : s
      ));

      // Simulate AI work with varying delays
      await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));

      // Update KPIs per step
      setPipeline(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'done' } : s
      ));

      const stepKpis = { ...updatedKpis };
      switch (i) {
        case 0: stepKpis.screens = 0; break;
        case 1: stepKpis.screens = 3; break;
        case 2: stepKpis.screens = 6; stepKpis.apis = 2; break;
        case 3: stepKpis.apis = 5; break;
        case 4: stepKpis.dbTables = 4; break;
        case 5: stepKpis.flows = 3; break;
        case 6: stepKpis.flows = 5; break;
        case 7: stepKpis.deploy = 'Ready'; break;
      }
      stepKpis.stepsDone = i + 1;
      setKpis(stepKpis);
    }

    setPipelineStatus('done');
    setEngineStatus('Done');
    setIsGenerating(false);
    toast.success('AI Pipeline complete — product ready for deployment');
  };

  const handleRegenerate = () => {
    if (!prompt.trim()) return;
    runPipeline();
  };

  const handleClear = () => {
    setPrompt('');
    setPipeline(INITIAL_PIPELINE);
    setPipelineStatus('draft');
    setEngineStatus('Idle');
    setKpis({ screens: 0, apis: 0, dbTables: 0, flows: 0, stepsDone: 0, totalSteps: 8, deploy: 'Ready' });
    textareaRef.current?.focus();
  };

  const handleSave = () => {
    if (!prompt.trim()) return;
    const newPrompt: SavedPrompt = { id: Date.now().toString(), text: prompt };
    setSavedPrompts(prev => [newPrompt, ...prev.slice(0, 9)]);
    toast.success('Prompt saved');
  };

  const loadPrompt = (text: string) => {
    setPrompt(text);
    textareaRef.current?.focus();
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle2 className="w-5 h-5" style={{ color: COLORS.success }} />;
      case 'running': return <Loader2 className="w-5 h-5 animate-spin" style={{ color: COLORS.cyan }} />;
      case 'error': return <Circle className="w-5 h-5" style={{ color: COLORS.error }} />;
      default: return <Clock className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.25)' }} />;
    }
  };

  const kpiCards = [
    { label: 'Screens', value: kpis.screens, icon: Layers, color: COLORS.accent },
    { label: 'APIs', value: kpis.apis, icon: Code2, color: COLORS.cyan },
    { label: 'DB Tables', value: kpis.dbTables, icon: Database, color: COLORS.success },
    { label: 'Flows', value: kpis.flows, icon: GitBranch, color: COLORS.purple },
    { label: 'Steps Done', value: `${kpis.stepsDone}/${kpis.totalSteps}`, icon: TrendingUp, color: COLORS.orange },
    { label: 'Deploy', value: kpis.deploy, icon: Rocket, color: kpis.deploy === 'Ready' ? COLORS.success : COLORS.warning },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: COLORS.bg }}>
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }}
          >
            <Settings2 className="w-6 h-6" style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: COLORS.text }}>VALA AI Engine</h1>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>Lovable-Style AI Product Builder</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium"
            style={{ 
              background: engineStatus === 'Running' ? 'rgba(6, 182, 212, 0.15)' : engineStatus === 'Done' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.08)',
              color: engineStatus === 'Running' ? COLORS.cyan : engineStatus === 'Done' ? COLORS.success : COLORS.textMuted,
              border: 'none'
            }}
          >
            {engineStatus === 'Running' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Pause className="w-3 h-3" />}
            {engineStatus}
          </Badge>
          <Badge 
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium"
            style={{ background: 'rgba(255,255,255,0.08)', color: COLORS.textMuted, border: 'none' }}
          >
            <Eye className="w-3 h-3" />
            {version}
          </Badge>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="px-6 py-4 grid grid-cols-6 gap-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl px-4 py-3 flex items-center justify-between"
            style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
          >
            <div>
              <p className="text-xs mb-1" style={{ color: COLORS.textMuted }}>{kpi.label}</p>
              <p className="text-xl font-bold" style={{ color: COLORS.text }}>{kpi.value}</p>
            </div>
            <kpi.icon className="w-6 h-6 opacity-40" style={{ color: kpi.color }} />
          </div>
        ))}
      </div>

      {/* Main Content: Prompt + Pipeline */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Prompt Input */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden" style={{ borderRight: `1px solid ${COLORS.border}` }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" style={{ color: COLORS.cyan }} />
            <h2 className="text-base font-semibold" style={{ color: COLORS.text }}>Prompt Input</h2>
          </div>

          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to build... e.g., 'Create a user management dashboard with role-based access control'"
            className="flex-1 w-full resize-none rounded-xl p-4 text-sm leading-relaxed"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
              minHeight: '160px',
              maxHeight: '240px',
            }}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4">
            <Button
              onClick={runPipeline}
              disabled={isGenerating || !prompt.trim()}
              className="px-5 h-10 text-sm font-medium gap-2"
              style={{ background: COLORS.success, color: '#fff' }}
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Generate
            </Button>
            <Button
              onClick={handleRegenerate}
              disabled={isGenerating || !prompt.trim()}
              variant="outline"
              className="px-4 h-10 text-sm gap-2"
              style={{ borderColor: COLORS.border, color: COLORS.text, background: 'transparent' }}
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="px-4 h-10 text-sm gap-2"
              style={{ borderColor: COLORS.border, color: COLORS.text, background: 'transparent' }}
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
            <Button
              onClick={handleSave}
              disabled={!prompt.trim()}
              variant="outline"
              className="px-4 h-10 text-sm gap-2"
              style={{ borderColor: COLORS.border, color: COLORS.text, background: 'transparent' }}
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>

          {/* Saved Prompts */}
          <div className="mt-5">
            <p className="text-xs font-medium mb-2" style={{ color: COLORS.textMuted }}>Saved Prompts:</p>
            <div className="flex flex-wrap gap-2">
              {savedPrompts.slice(0, 5).map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => loadPrompt(sp.text)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80 max-w-[220px] truncate"
                  style={{ background: 'rgba(255,255,255,0.06)', color: COLORS.textMuted, border: `1px solid ${COLORS.border}` }}
                >
                  <Upload className="w-3 h-3 shrink-0" />
                  <span className="truncate">{sp.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AI Pipeline */}
        <div className="w-[420px] flex flex-col p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings2 className="w-5 h-5" style={{ color: COLORS.accent }} />
              <h2 className="text-base font-semibold" style={{ color: COLORS.text }}>AI Pipeline</h2>
            </div>
            <Badge
              className="text-xs px-3 py-1"
              style={{
                background: pipelineStatus === 'done' ? 'rgba(16,185,129,0.15)' : pipelineStatus === 'running' ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.08)',
                color: pipelineStatus === 'done' ? COLORS.success : pipelineStatus === 'running' ? COLORS.cyan : COLORS.textMuted,
                border: 'none',
              }}
            >
              {pipelineStatus}
            </Badge>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-1">
              {pipeline.map((step, idx) => (
                <div
                  key={step.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                  style={{
                    background: step.status === 'running' ? 'rgba(6, 182, 212, 0.08)' : step.status === 'done' ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                    border: step.status === 'running' ? `1px solid rgba(6, 182, 212, 0.2)` : '1px solid transparent',
                  }}
                >
                  {getStepIcon(step.status)}
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: step.status === 'done' ? COLORS.text : step.status === 'running' ? COLORS.cyan : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ValaAICommandCenter;
