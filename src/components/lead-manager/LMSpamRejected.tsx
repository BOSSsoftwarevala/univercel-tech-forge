import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Ban, 
  AlertTriangle,
  Clock,
  Bot,
  Shield,
  Eye,
  RefreshCcw,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface RejectedLead {
  id: string;
  email: string;
  source: string;
  rejectedAt: string;
  reason: 'spam' | 'duplicate' | 'bot' | 'incomplete' | 'manual';
  aiSpamScore: number;
  details: string;
  canRecover: boolean;
}

const mockRejected: RejectedLead[] = [
  {
    id: 'LD-003',
    email: 'b***@test.org',
    source: 'influencer',
    rejectedAt: '2035-01-15 09:50',
    reason: 'spam',
    aiSpamScore: 87,
    details: 'High spam score + suspicious email pattern',
    canRecover: true
  },
  {
    id: 'LD-005',
    email: 'a***@corp.net',
    source: 'api',
    rejectedAt: '2035-01-15 09:10',
    reason: 'bot',
    aiSpamScore: 92,
    details: 'Bot-like behavior detected: <2s form completion',
    canRecover: false
  },
  {
    id: 'LD-008',
    email: 'x***@temp.com',
    source: 'frontend',
    rejectedAt: '2035-01-14 18:30',
    reason: 'duplicate',
    aiSpamScore: 15,
    details: 'Duplicate of LD-001 (same email)',
    canRecover: false
  },
  {
    id: 'LD-009',
    email: 'n***@mail.ru',
    source: 'api',
    rejectedAt: '2035-01-14 17:45',
    reason: 'incomplete',
    aiSpamScore: 45,
    details: 'Missing required fields: phone, company name',
    canRecover: true
  },
  {
    id: 'LD-010',
    email: 'f***@fake.io',
    source: 'reseller',
    rejectedAt: '2035-01-14 16:20',
    reason: 'manual',
    aiSpamScore: 65,
    details: 'Manual rejection by LM-7823: Test submission',
    canRecover: false
  }
];

const getReasonBadge = (reason: string) => {
  const configs: Record<string, { color: string; icon: React.ReactNode }> = {
    spam: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <AlertTriangle className="h-3 w-3" /> },
    duplicate: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: <RefreshCcw className="h-3 w-3" /> },
    bot: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: <Bot className="h-3 w-3" /> },
    incomplete: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: <AlertTriangle className="h-3 w-3" /> },
    manual: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: <Ban className="h-3 w-3" /> }
  };
  const config = configs[reason] || configs.manual;
  return (
    <Badge className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {reason.toUpperCase()}
    </Badge>
  );
};

export const LMSpamRejected: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'spam' | 'bot' | 'duplicate'>('all');

  const handleReview = (lead: RejectedLead) => {
    toast.info(`Reviewing lead ${lead.id}`, {
      description: lead.details
    });
    console.log('[LEAD-MANAGER] Review rejected lead:', lead.id);
  };

  const handleRecover = (lead: RejectedLead) => {
    if (!lead.canRecover) {
      toast.error('This lead cannot be recovered');
      return;
    }
    toast.success(`Lead ${lead.id} sent back to queue`, {
      description: 'Requires re-qualification'
    });
    console.log('[LEAD-MANAGER] Lead recovered:', lead.id);
  };

  const filteredLeads = mockRejected.filter(l => 
    filter === 'all' || l.reason === filter
  );

  const spamCount = mockRejected.filter(l => l.reason === 'spam').length;
  const botCount = mockRejected.filter(l => l.reason === 'bot').length;
  const dupCount = mockRejected.filter(l => l.reason === 'duplicate').length;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Ban className="h-5 w-5 text-red-500" />
            Spam / Rejected Leads
            <Badge variant="destructive" className="ml-2">{mockRejected.length}</Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-red-400">{spamCount}</p>
            <p className="text-xs text-muted-foreground">Spam</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-purple-400">{botCount}</p>
            <p className="text-xs text-muted-foreground">Bots</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-yellow-400">{dupCount}</p>
            <p className="text-xs text-muted-foreground">Duplicates</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {['all', 'spam', 'bot', 'duplicate'].map(f => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f as any)}
              className="text-xs h-7"
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Rejected Leads List */}
        <div className="space-y-2 max-h-[280px] overflow-y-auto">
          {filteredLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-red-500/5 border border-red-500/20 rounded-lg p-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sm">{lead.id}</span>
                    {getReasonBadge(lead.reason)}
                  </div>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Sparkles className="h-3 w-3 text-red-400" />
                  <span className="font-mono text-red-400">{lead.aiSpamScore}%</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-2">{lead.details}</p>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {lead.rejectedAt}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs"
                    onClick={() => handleReview(lead)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Review
                  </Button>
                  {lead.canRecover && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs"
                      onClick={() => handleRecover(lead)}
                    >
                      <RefreshCcw className="h-3 w-3 mr-1" />
                      Recover
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="h-3 w-3 inline mr-1" />
            AI spam scoring • Rejection reason mandatory
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
