/**
 * VALA AI - Prompt History Panel
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { History, Search, Bot, User, Copy, Check, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface PromptEntry {
  id: string;
  prompt: string;
  response: string;
  timestamp: string;
  category: 'Build' | 'Feature' | 'Fix' | 'Docs';
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

const FILTERS: Array<'All' | PromptEntry['category']> = ['All', 'Build', 'Feature', 'Fix', 'Docs'];

const PromptHistoryPanel: React.FC = () => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const filtered = useMemo(() => {
    return MOCK_HISTORY.filter(h => {
      const matchSearch = h.prompt.toLowerCase().includes(search.toLowerCase()) || h.response.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'All' || h.category === filter;
      return matchSearch && matchFilter;
    });
  }, [filter, search]);

  const totalTokens = useMemo(() => MOCK_HISTORY.reduce((sum, h) => sum + h.tokens, 0), []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
    toast.success('Copied');
  };

  const handleReuse = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.info('Prompt copied — paste it in Command Center');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/15">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Prompt History</h1>
            <p className="text-xs text-muted-foreground">{MOCK_HISTORY.length} prompts • {totalTokens.toLocaleString()} tokens</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 flex items-center gap-3 border-b border-border/40">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="pl-9 h-8 text-xs"
          />
        </div>
        <div className="flex items-center gap-1">
          {FILTERS.map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-2 text-[10px]"
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-3">
          {filtered.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="bg-card/60 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <User className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-xs font-semibold text-foreground truncate">{entry.prompt}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/15 text-primary">
                        {entry.category}
                      </span>
                      <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleCopy(entry.prompt, entry.id)}>
                        {copiedId === entry.id ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mb-3">
                    <Bot className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                    <p className="text-[11px] leading-relaxed text-muted-foreground">{entry.response}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{entry.timestamp}</span>
                      <span>{entry.tokens} tokens</span>
                    </div>
                    <Button variant="secondary" size="sm" className="h-6 px-2 text-[10px]" onClick={() => handleReuse(entry.prompt)}>
                      Re-use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No prompts found</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PromptHistoryPanel;
