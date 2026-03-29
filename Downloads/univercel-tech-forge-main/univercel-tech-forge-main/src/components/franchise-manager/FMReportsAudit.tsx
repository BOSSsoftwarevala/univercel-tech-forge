import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Download, Search, Filter, Lock, CheckCircle, AlertTriangle, ArrowUpRight, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

type AuditAction = 'application_review' | 'territory_assignment' | 'status_change' | 'ai_flag_review' | 'escalation' | 'warning_issued' | 'compliance_check';

interface AuditEntry {
  id: string;
  action: AuditAction;
  target: string;
  targetType: string;
  performedBy: string;
  timestamp: string;
  details: string;
  oldValue?: string;
  newValue?: string;
  result: 'success' | 'blocked' | 'pending';
}

const mockAuditLogs: AuditEntry[] = [
  {
    id: 'AUD-001',
    action: 'application_review',
    target: 'TechVentures Mumbai (FA-001)',
    targetType: 'Application',
    performedBy: 'Franchise Manager',
    timestamp: '2024-01-15 15:30:22',
    details: 'Application approved after KYC verification',
    oldValue: 'Pending',
    newValue: 'Approved',
    result: 'success'
  },
  {
    id: 'AUD-002',
    action: 'territory_assignment',
    target: 'Mumbai Central (MUM-CENT)',
    targetType: 'Territory',
    performedBy: 'Franchise Manager',
    timestamp: '2024-01-15 15:32:45',
    details: 'Territory assigned to TechVentures Mumbai',
    result: 'success'
  },
  {
    id: 'AUD-003',
    action: 'status_change',
    target: 'SaaS Solutions Bangalore (FR-003)',
    targetType: 'Franchise',
    performedBy: 'Franchise Manager',
    timestamp: '2024-01-14 11:20:00',
    details: 'Franchise suspended due to policy violations',
    oldValue: 'Active',
    newValue: 'Suspended',
    result: 'success'
  },
  {
    id: 'AUD-004',
    action: 'ai_flag_review',
    target: 'Lead Manipulation Alert (AFA-001)',
    targetType: 'AI Alert',
    performedBy: 'Franchise Manager',
    timestamp: '2024-01-14 10:15:30',
    details: 'AI fraud alert reviewed and confirmed',
    result: 'success'
  },
  {
    id: 'AUD-005',
    action: 'escalation',
    target: 'Policy Breach (ESC-001)',
    targetType: 'Compliance',
    performedBy: 'Franchise Manager',
    timestamp: '2024-01-13 16:45:00',
    details: 'Issue escalated to Super Admin for review',
    result: 'pending'
  },
  {
    id: 'AUD-006',
    action: 'warning_issued',
    target: 'Digital Dynamics Delhi (FR-002)',
    targetType: 'Franchise',
    performedBy: 'Franchise Manager',
    timestamp: '2024-01-12 14:00:00',
    details: 'Warning issued for brand misuse in marketing',
    result: 'success'
  }
];

export function FMReportsAudit() {
  const [logs] = useState<AuditEntry[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionIcon = (action: AuditAction) => {
    switch (action) {
      case 'application_review':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'territory_assignment':
        return <MapPin className="h-4 w-4 text-blue-400" />;
      case 'status_change':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'ai_flag_review':
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'escalation':
        return <ArrowUpRight className="h-4 w-4 text-purple-400" />;
      case 'warning_issued':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'compliance_check':
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getResultBadge = (result: 'success' | 'blocked' | 'pending') => {
    switch (result) {
      case 'success':
        return <Badge className="bg-green-500/20 text-green-400">Success</Badge>;
      case 'blocked':
        return <Badge className="bg-destructive/20 text-destructive">Blocked</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>;
    }
  };

  const handleExport = () => {
    toast.success('Audit Log Exported', {
      description: 'PDF report generated and downloading...'
    });
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Reports & Audit Trail
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-muted/50 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              IMMUTABLE
            </Badge>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="application_review">Application Reviews</SelectItem>
              <SelectItem value="territory_assignment">Territory Assignments</SelectItem>
              <SelectItem value="status_change">Status Changes</SelectItem>
              <SelectItem value="ai_flag_review">AI Flag Reviews</SelectItem>
              <SelectItem value="escalation">Escalations</SelectItem>
              <SelectItem value="warning_issued">Warnings</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
            <div className="text-xl font-bold text-green-400">
              {logs.filter(l => l.action === 'application_review').length}
            </div>
            <div className="text-xs text-muted-foreground">Reviews</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
            <div className="text-xl font-bold text-blue-400">
              {logs.filter(l => l.action === 'territory_assignment').length}
            </div>
            <div className="text-xs text-muted-foreground">Territories</div>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
            <div className="text-xl font-bold text-yellow-400">
              {logs.filter(l => l.action === 'status_change').length}
            </div>
            <div className="text-xs text-muted-foreground">Status Changes</div>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
            <div className="text-xl font-bold text-purple-400">
              {logs.filter(l => l.action === 'escalation').length}
            </div>
            <div className="text-xs text-muted-foreground">Escalations</div>
          </div>
        </div>

        {/* Audit Log List */}
        <ScrollArea className="h-[350px]">
          <div className="space-y-2">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getActionIcon(log.action)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <Badge variant="outline" className="text-xs">{log.id}</Badge>
                        {getResultBadge(log.result)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{log.target}</div>
                      <div className="text-xs text-muted-foreground mt-1">{log.details}</div>
                      {log.oldValue && log.newValue && (
                        <div className="text-xs mt-1">
                          <span className="text-muted-foreground line-through">{log.oldValue}</span>
                          <span className="mx-2">→</span>
                          <span className="text-foreground">{log.newValue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{log.timestamp}</div>
                    <div className="text-xs text-muted-foreground mt-1">{log.performedBy}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Lock className="h-3 w-3" />
            All audit logs are immutable and append-only. Logs cannot be edited or deleted.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
