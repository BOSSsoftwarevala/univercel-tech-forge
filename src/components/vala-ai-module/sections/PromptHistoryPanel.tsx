/**
 * VALA AI - Prompt History Panel
 * Shows all past prompts and AI responses
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Search, Bot, User, Copy, Check, Trash2, Clock, Filter } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PromptEntry {
  id: string;
  prompt: string;
  response: string;
  timestamp: string;
  category: string;
  tokens: number;
}

const MOCK_HISTORY: PromptEntry[] = [
  { id: '1', prompt: 'Build a restaurant POS with table management', response: 'Generated 12 screens, 18 APIs, 8 database tables...', timestamp: '5 min ago', category: 'Build', tokens: 4250 },
  { id: '2', prompt: 'Add payment gateway integration', response: 'Added Stripe & Razorpay integration with webhooks...', timestamp: '12 min ago', category: 'Feature', tokens: 2100 },
  { id: '3', prompt: 'Create inventory management module', response: 'Built inventory tracking with stock alerts, supplier management...', timestamp: '25 min ago', category: 'Build', tokens: 3800 },
  { id: '4', prompt: 'Fix the login page layout', response: 'Fixed responsive layout issues on login page...', timestamp: '1 hr ago', category: 'Fix', tokens: 850 },
  { id: '5', prompt: 'Add dark mode support', response: 'Implemented theme provider with dark/light mode toggle...', timestamp: '2 hr ago', category: 'Feature', tokens: 1500 },
  { id: '6', prompt: 'Generate API documentation', response: 'Created OpenAPI spec with all 18 endpoints documented...', timestamp: '3 hr ago', category: 'Docs', tokens: 2900 },
];

const PromptHistoryPanel: React.FC = () => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  const filtered = MOCK_HISTORY.filter(h => {
    const matchSearch = h.prompt.toLowerCase().includes(search.toLowerCase()) || h.response.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || h.category === filter;
    return matchSearch && matchFilter;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Prompt copied');
  };

  const handleReuse = (prompt: string) => {
    toast.info('Prompt copied — go to Command Center to use it');
    navigator.clipboard.writeText(prompt);
  };

  const totalTokens = MOCK_HISTORY.reduce((sum, h) => sum + h.tokens, 0);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: '#0B0F1A' }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(37, 99, 235, 0.2)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Prompt History</h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {MOCK_HISTORY.length} prompts • {totalTokens.toLocaleString()} tokens used
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="px-6 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="pl-9 h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
        <div className="flex items-center gap-1">
          {['All', 'Build', 'Feature', 'Fix', 'Docs'].map(f => (
            <Button
              key={f}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[10px]"
              style={{
                background: filter === f ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                color: filter === f ? '#60a5fa' : 'rgba(255,255,255,0.4)',
              }}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* History List */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-3">
          {filtered.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5" style={{ color: '#60a5fa' }} />
                  <span className="text-xs font-semibold text-white">{entry.prompt}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{
                    background: entry.category === 'Build' ? 'rgba(37,99,235,0.2)' : entry.category === 'Fix' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)',
                    color: entry.category === 'Build' ? '#60a5fa' : entry.category === 'Fix' ? '#f59e0b' : '#10b981',
                  }}>{entry.category}</span>
                  <Button variant="ghost" size="icon" className="w-6 h-6 text-white/20 hover:text-white" onClick={() => handleCopy(entry.prompt, entry.id)}>
                    {copiedId === entry.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
              <div className="flex items-start gap-2 mb-2">
                <Bot className="w-3.5 h-3.5 mt-0.5" style={{ color: '#7c3aed' }} />
                <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{entry.response}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{entry.timestamp}</span>
                  <span>{entry.tokens} tokens</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-blue-400 hover:text-blue-300 hover:bg-blue-500/10" onClick={() => handleReuse(entry.prompt)}>
                  Re-use Prompt
                </Button>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/30 text-sm">No prompts found</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PromptHistoryPanel;
