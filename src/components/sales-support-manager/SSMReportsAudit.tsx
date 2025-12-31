import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Search,
  Download,
  Lock,
  Clock,
  User,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  entityType: 'lead' | 'ticket';
  entityId: string;
  details: string;
  category: 'follow_up' | 'status_change' | 'ticket_action' | 'sla_breach' | 'ai_review';
}

const mockAuditLogs: AuditEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:45:00Z',
    action: 'Lead Stage Updated',
    actor: 'VL-SE-001',
    entityType: 'lead',
    entityId: 'LD-2024-4501',
    details: 'Stage changed from Qualified to Converted with payment proof',
    category: 'status_change'
  },
  {
    id: '2',
    timestamp: '2024-01-15T10:30:00Z',
    action: 'SLA Breach Logged',
    actor: 'SYSTEM',
    entityType: 'ticket',
    entityId: 'TKT-2024-8901',
    details: 'Critical ticket SLA breached at 4h mark. Auto-escalated.',
    category: 'sla_breach'
  },
  {
    id: '3',
    timestamp: '2024-01-15T10:15:00Z',
    action: 'Ticket Assigned',
    actor: 'VL-SSM-001',
    entityType: 'ticket',
    entityId: 'TKT-2024-8902',
    details: 'Assigned to VL-SA-001',
    category: 'ticket_action'
  },
  {
    id: '4',
    timestamp: '2024-01-15T09:45:00Z',
    action: 'Follow-up Logged',
    actor: 'VL-SE-002',
    entityType: 'lead',
    entityId: 'LD-2024-4521',
    details: 'Initial call completed. Demo scheduled for tomorrow.',
    category: 'follow_up'
  },
  {
    id: '5',
    timestamp: '2024-01-15T09:30:00Z',
    action: 'AI Priority Review',
    actor: 'AI_ENGINE',
    entityType: 'lead',
    entityId: 'LD-2024-4522',
    details: 'AI flagged as high priority based on engagement signals',
    category: 'ai_review'
  },
  {
    id: '6',
    timestamp: '2024-01-15T09:00:00Z',
    action: 'Lead Assigned',
    actor: 'VL-SSM-001',
    entityType: 'lead',
    entityId: 'LD-2024-4521',
    details: 'New lead assigned to VL-SE-002',
    category: 'status_change'
  }
];

export const SSMReportsAudit: React.FC = () => {
  const [auditLogs] = useState<AuditEntry[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const handleExportPDF = () => {
    toast.success('Audit log export initiated');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'follow_up':
        return 'bg-blue-500/10 text-blue-500';
      case 'status_change':
        return 'bg-green-500/10 text-green-500';
      case 'ticket_action':
        return 'bg-purple-500/10 text-purple-500';
      case 'sla_breach':
        return 'bg-red-500/10 text-red-500';
      case 'ai_review':
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'follow_up', 'status_change', 'ticket_action', 'sla_breach', 'ai_review'];

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            Reports & Audit Trail
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
              <Lock className="h-3 w-3 mr-1" />
              Immutable Log
            </Badge>
            <Button size="sm" variant="outline" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-1" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={categoryFilter === cat ? 'default' : 'outline'}
                className="cursor-pointer capitalize text-xs"
                onClick={() => setCategoryFilter(cat)}
              >
                {cat.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-border rounded-lg p-3 bg-background"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(log.category)}>
                    {log.category.replace('_', ' ')}
                  </Badge>
                  <span className="font-medium text-foreground">{log.action}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Actor: <span className="font-mono">{log.actor}</span>
                </span>
                <span>
                  {log.entityType}: <span className="font-mono text-primary">{log.entityId}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No audit logs found</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Lock className="h-4 w-4 text-green-500 mt-0.5" />
            <p className="text-xs text-green-500">
              <strong>Immutable Audit Trail:</strong> All actions are permanently logged.
              Includes: Follow-ups, Status changes, Ticket actions, SLA breaches, and AI reviews.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
