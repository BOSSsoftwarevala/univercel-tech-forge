/**
 * STEP 05: AI SUPPORT HISTORY PANEL
 * Boss Panel view of all AI support interactions
 * Shows client issues, AI confidence, fix status
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Bug,
  Sparkles,
  Settings,
  Zap,
  Shield,
  User,
  Server,
  FileText,
  Eye,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SupportTicket {
  id: string;
  clientName: string;
  clientId: string;
  productName: string;
  productId: string;
  serverId: string;
  issueType: 'bug' | 'feature' | 'config' | 'performance' | 'security';
  issueDescription: string;
  status: 'pending' | 'analyzing' | 'fixing' | 'testing' | 'completed' | 'escalated';
  aiConfidence: number;
  timeSpent: string;
  resolvedAt?: string;
  createdAt: string;
  versionBefore: string;
  versionAfter?: string;
}

// Mock support history data
const mockTickets: SupportTicket[] = [
  {
    id: 'SPT-001',
    clientName: 'Delhi Public School',
    clientId: 'CLT-A7X9',
    productName: 'School Management System',
    productId: 'PRD-007',
    serverId: 'SRV-AWS-IN-01',
    issueType: 'bug',
    issueDescription: 'Student attendance report not generating for weekend classes',
    status: 'completed',
    aiConfidence: 94,
    timeSpent: '4m 32s',
    resolvedAt: '2024-01-15 14:32',
    createdAt: '2024-01-15 14:28',
    versionBefore: 'v2.4.0',
    versionAfter: 'v2.4.1'
  },
  {
    id: 'SPT-002',
    clientName: 'Mumbai International School',
    clientId: 'CLT-B3K2',
    productName: 'School Management System',
    productId: 'PRD-007',
    serverId: 'SRV-AWS-MU-02',
    issueType: 'performance',
    issueDescription: 'Dashboard loading slow during peak hours',
    status: 'completed',
    aiConfidence: 89,
    timeSpent: '8m 15s',
    resolvedAt: '2024-01-15 12:45',
    createdAt: '2024-01-15 12:37',
    versionBefore: 'v2.4.1',
    versionAfter: 'v2.4.2'
  },
  {
    id: 'SPT-003',
    clientName: 'Bangalore Tech Academy',
    clientId: 'CLT-C9M7',
    productName: 'School Management System',
    productId: 'PRD-007',
    serverId: 'SRV-GCP-BG-01',
    issueType: 'feature',
    issueDescription: 'Add bulk SMS notification for exam schedules',
    status: 'fixing',
    aiConfidence: 87,
    timeSpent: '6m 42s',
    createdAt: '2024-01-15 16:20',
    versionBefore: 'v2.4.2'
  },
  {
    id: 'SPT-004',
    clientName: 'Chennai Global School',
    clientId: 'CLT-D4P5',
    productName: 'School Management System',
    productId: 'PRD-007',
    serverId: 'SRV-AWS-CH-01',
    issueType: 'security',
    issueDescription: 'Update session timeout for admin users',
    status: 'testing',
    aiConfidence: 96,
    timeSpent: '3m 18s',
    createdAt: '2024-01-15 16:45',
    versionBefore: 'v2.4.2'
  },
  {
    id: 'SPT-005',
    clientName: 'Kolkata Heritage School',
    clientId: 'CLT-E2N8',
    productName: 'School Management System',
    productId: 'PRD-007',
    serverId: 'SRV-AWS-KO-01',
    issueType: 'config',
    issueDescription: 'Enable multi-language support for Bengali',
    status: 'analyzing',
    aiConfidence: 0,
    timeSpent: '1m 05s',
    createdAt: '2024-01-15 17:02',
    versionBefore: 'v2.4.2'
  }
];

export const AISupportHistoryPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = 
      ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.issueDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockTickets.length,
    completed: mockTickets.filter(t => t.status === 'completed').length,
    inProgress: mockTickets.filter(t => ['analyzing', 'fixing', 'testing'].includes(t.status)).length,
    avgConfidence: Math.round(mockTickets.reduce((sum, t) => sum + t.aiConfidence, 0) / mockTickets.length),
    avgTime: '5m 26s'
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
      pending: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: Clock },
      analyzing: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Search },
      fixing: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Zap },
      testing: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Settings },
      completed: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
      escalated: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertCircle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={cn("border flex items-center gap-1", config.color)}>
        <Icon className="w-3 h-3" />
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const getIssueIcon = (type: SupportTicket['issueType']) => {
    const icons: Record<string, { icon: React.ElementType; color: string }> = {
      bug: { icon: Bug, color: 'text-red-400' },
      feature: { icon: Sparkles, color: 'text-blue-400' },
      config: { icon: Settings, color: 'text-purple-400' },
      performance: { icon: Zap, color: 'text-yellow-400' },
      security: { icon: Shield, color: 'text-green-400' }
    };
    
    const config = icons[type];
    const Icon = config.icon;
    return <Icon className={cn("w-4 h-4", config.color)} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            AI Support History
          </h2>
          <p className="text-sm text-muted-foreground">
            All AI-handled support interactions • Boss Panel View
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Tickets', value: stats.total, icon: FileText, color: 'text-blue-400' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-400' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-yellow-400' },
          { label: 'Avg Confidence', value: `${stats.avgConfidence}%`, icon: TrendingUp, color: 'text-purple-400' },
          { label: 'Avg Resolution', value: stats.avgTime, icon: BarChart3, color: 'text-primary' }
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tickets..."
                  className="pl-9 bg-background/50 border-border/50"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'completed', 'analyzing', 'fixing', 'testing'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">
            Support Tickets ({filteredTickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-background/30 border border-border/30 rounded-lg p-4 hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getIssueIcon(ticket.issueType)}
                        <span className="font-medium text-foreground">{ticket.id}</span>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <p className="text-sm text-foreground line-clamp-1">
                        {ticket.issueDescription}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ticket.clientName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Server className="w-3 h-3" />
                          {ticket.serverId}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ticket.timeSpent}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-xs text-muted-foreground">AI Confidence</div>
                      <div className="flex items-center gap-2">
                        <Progress value={ticket.aiConfidence} className="w-20 h-2" />
                        <span className="text-sm font-medium text-foreground">
                          {ticket.aiConfidence}%
                        </span>
                      </div>
                      {ticket.versionAfter && (
                        <div className="text-xs text-green-400">
                          {ticket.versionBefore} → {ticket.versionAfter}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Selected Ticket Detail Modal */}
      {selectedTicket && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTicket(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-card border border-border rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getIssueIcon(selectedTicket.issueType)}
                <h3 className="text-lg font-bold text-foreground">{selectedTicket.id}</h3>
                {getStatusBadge(selectedTicket.status)}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)}>
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                <h4 className="text-sm font-medium text-foreground mb-2">Issue Description</h4>
                <p className="text-sm text-muted-foreground">{selectedTicket.issueDescription}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                  <h4 className="text-sm font-medium text-foreground mb-2">Client Info</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Name: {selectedTicket.clientName}</p>
                    <p>ID: {selectedTicket.clientId}</p>
                    <p>Product: {selectedTicket.productName}</p>
                  </div>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                  <h4 className="text-sm font-medium text-foreground mb-2">Technical Info</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Server: {selectedTicket.serverId}</p>
                    <p>Version: {selectedTicket.versionBefore}{selectedTicket.versionAfter && ` → ${selectedTicket.versionAfter}`}</p>
                    <p>Time Spent: {selectedTicket.timeSpent}</p>
                  </div>
                </div>
              </div>

              <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                <h4 className="text-sm font-medium text-foreground mb-2">AI Analysis</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Confidence Score</p>
                    <Progress value={selectedTicket.aiConfidence} className="h-3" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">{selectedTicket.aiConfidence}%</span>
                </div>
              </div>

              <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                <h4 className="text-sm font-medium text-foreground mb-2">Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Created: {selectedTicket.createdAt}</span>
                  </div>
                  {selectedTicket.resolvedAt && (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Resolved: {selectedTicket.resolvedAt}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AISupportHistoryPanel;
