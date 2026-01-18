/**
 * VALA AI - ISSUE INBOX
 * AI-powered issue handling - read context, request info, auto-fix or escalate
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Inbox, AlertCircle, CheckCircle2, Clock, MessageSquare,
  Wrench, ArrowUp, Eye, Filter, Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Issue {
  id: string;
  title: string;
  description: string;
  source: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'analyzing' | 'needs-info' | 'auto-fixing' | 'escalated' | 'resolved';
  createdAt: string;
  aiAnalysis?: string;
}

const mockIssues: Issue[] = [
  { 
    id: 'issue-001', 
    title: 'Login button not responding', 
    description: 'Users report the login button on mobile devices is not clickable',
    source: 'User Report',
    priority: 'high', 
    status: 'auto-fixing', 
    createdAt: '5 min ago',
    aiAnalysis: 'Touch target too small on mobile. Increasing button size and adding touch feedback.'
  },
  { 
    id: 'issue-002', 
    title: 'Dashboard charts loading slowly', 
    description: 'Performance issue with analytics dashboard',
    source: 'System Monitor',
    priority: 'medium', 
    status: 'analyzing', 
    createdAt: '15 min ago',
    aiAnalysis: 'Analyzing data fetching patterns and render optimization...'
  },
  { 
    id: 'issue-003', 
    title: 'Payment processing error', 
    description: 'Stripe webhook returning 500 errors intermittently',
    source: 'Error Logs',
    priority: 'critical', 
    status: 'escalated', 
    createdAt: '30 min ago',
    aiAnalysis: 'Requires payment infrastructure review. Escalated to Boss for approval.'
  },
  { 
    id: 'issue-004', 
    title: 'Missing translations on settings page', 
    description: 'Several text fields showing raw translation keys',
    source: 'QA Team',
    priority: 'low', 
    status: 'needs-info', 
    createdAt: '1 hour ago',
    aiAnalysis: 'Requesting list of affected language keys...'
  },
  { 
    id: 'issue-005', 
    title: 'Image upload failing for large files', 
    description: 'Files over 5MB causing timeout',
    source: 'User Report',
    priority: 'medium', 
    status: 'resolved', 
    createdAt: '2 hours ago',
    aiAnalysis: 'Implemented chunked upload and increased timeout. Issue resolved.'
  },
];

const getPriorityColor = (priority: Issue['priority']) => {
  switch (priority) {
    case 'critical': return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
    case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
    case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
  }
};

const getStatusConfig = (status: Issue['status']) => {
  switch (status) {
    case 'new': return { icon: Inbox, color: 'text-blue-500', label: 'New' };
    case 'analyzing': return { icon: Eye, color: 'text-purple-500', label: 'Analyzing' };
    case 'needs-info': return { icon: MessageSquare, color: 'text-amber-500', label: 'Needs Info' };
    case 'auto-fixing': return { icon: Wrench, color: 'text-cyan-500', label: 'Auto-Fixing' };
    case 'escalated': return { icon: ArrowUp, color: 'text-rose-500', label: 'Escalated' };
    case 'resolved': return { icon: CheckCircle2, color: 'text-emerald-500', label: 'Resolved' };
  }
};

export const ValaAIIssueInbox: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<Issue['status'] | 'all'>('all');

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || issue.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAction = (issueId: string, action: 'view' | 'auto-fix' | 'escalate') => {
    if (action === 'auto-fix') {
      setIssues(prev => prev.map(i => 
        i.id === issueId ? { ...i, status: 'auto-fixing' as const } : i
      ));
      toast.success('AI auto-fix initiated');
    } else if (action === 'escalate') {
      setIssues(prev => prev.map(i => 
        i.id === issueId ? { ...i, status: 'escalated' as const } : i
      ));
      toast.info('Issue escalated to Boss approval');
    } else {
      toast.info('Opening issue details...');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Inbox className="w-6 h-6 text-primary" />
            Issue Inbox
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered issue detection and resolution
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <AlertCircle className="w-3 h-3" />
          {issues.filter(i => i.status !== 'resolved').length} Active Issues
        </Badge>
      </div>

      {/* Search & Filter */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'new', 'analyzing', 'auto-fixing', 'escalated'] as const).map(status => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                >
                  {status === 'all' ? 'All' : status.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="space-y-3">
        {filteredIssues.map((issue, idx) => {
          const statusConfig = getStatusConfig(issue.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-primary/10`}>
                      <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground truncate">{issue.title}</h3>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{issue.description}</p>
                      
                      {issue.aiAnalysis && (
                        <div className="mt-2 p-2 rounded bg-muted/50 text-xs text-muted-foreground">
                          <span className="text-primary font-medium">AI: </span>
                          {issue.aiAnalysis}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Source: {issue.source}</span>
                        <span>{issue.createdAt}</span>
                        <span>{issue.id.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleAction(issue.id, 'view')}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {issue.status !== 'resolved' && issue.status !== 'auto-fixing' && (
                        <Button variant="ghost" size="sm" onClick={() => handleAction(issue.id, 'auto-fix')}>
                          <Wrench className="w-4 h-4" />
                        </Button>
                      )}
                      {issue.status !== 'escalated' && issue.status !== 'resolved' && (
                        <Button variant="ghost" size="sm" onClick={() => handleAction(issue.id, 'escalate')}>
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredIssues.length === 0 && (
        <Card className="bg-card/30 border-border/30">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-muted-foreground">No issues match your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
