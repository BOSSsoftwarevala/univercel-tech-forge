import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Clock, Filter, Lock, User, CheckCircle, AlertTriangle, Bot, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  timestamp: string;
  valaId: string;
  action: string;
  category: 'application' | 'status' | 'ai_review' | 'warning' | 'escalation';
  details: string;
  performedBy: string;
}

const mockLogs: AuditLog[] = [
  { id: '1', timestamp: '2024-01-15 16:45:22', valaId: 'VL-7382916', action: 'Application Approved', category: 'application', details: 'Influencer application approved after identity verification', performedBy: 'IM-7829' },
  { id: '2', timestamp: '2024-01-15 16:30:18', valaId: 'VL-4827163', action: 'AI Flag Reviewed', category: 'ai_review', details: 'Bot traffic flag confirmed - 94% confidence. Recommended suspension.', performedBy: 'IM-7829' },
  { id: '3', timestamp: '2024-01-15 15:30:00', valaId: 'VL-4827163', action: 'Escalated to Admin', category: 'escalation', details: 'Fraud escalation sent to Admin team for suspension decision', performedBy: 'IM-7829' },
  { id: '4', timestamp: '2024-01-15 14:22:45', valaId: 'VL-2918374', action: 'Warning Issued', category: 'warning', details: 'Warning issued for missing #ad disclosure in promotional posts', performedBy: 'IM-7829' },
  { id: '5', timestamp: '2024-01-15 12:15:33', valaId: 'VL-9173628', action: 'Status Changed', category: 'status', details: 'Status changed from Active to Suspended. Reason: Policy violation', performedBy: 'IM-7829' },
  { id: '6', timestamp: '2024-01-15 10:22:00', valaId: 'VL-9173628', action: 'Escalated to Legal', category: 'escalation', details: 'Compliance issue escalated: Promoting in restricted region', performedBy: 'IM-7829' },
  { id: '7', timestamp: '2024-01-14 18:45:12', valaId: 'VL-3829174', action: 'Application Rejected', category: 'application', details: 'Application rejected. Reason: Insufficient follower count for tier requirements', performedBy: 'IM-7829' },
  { id: '8', timestamp: '2024-01-14 16:20:00', valaId: 'VL-7382916', action: 'AI Flag Dismissed', category: 'ai_review', details: 'Pattern match flag dismissed after manual review - false positive', performedBy: 'IM-7829' },
];

export function IMReportsAudit() {
  const { toast } = useToast();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'application': return <User className="w-4 h-4 text-blue-400" />;
      case 'status': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'ai_review': return <Bot className="w-4 h-4 text-primary" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'escalation': return <FileText className="w-4 h-4 text-red-400" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'application': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'status': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'ai_review': return 'bg-primary/20 text-primary border-primary/30';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'escalation': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Audit report is being generated. Download will start shortly.",
    });
  };

  const filteredLogs = filterCategory === 'all' 
    ? mockLogs 
    : mockLogs.filter(log => log.category === filterCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Reports & Audit Trail</h2>
          <p className="text-sm text-muted-foreground">Immutable action logs • All changes tracked</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            IMMUTABLE
          </Badge>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter by:</span>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="application">Application Reviews</SelectItem>
                <SelectItem value="status">Status Changes</SelectItem>
                <SelectItem value="ai_review">AI Flag Reviews</SelectItem>
                <SelectItem value="warning">Warnings Issued</SelectItem>
                <SelectItem value="escalation">Escalations</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Showing {filteredLogs.length} of {mockLogs.length} entries
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Category Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {['application', 'status', 'ai_review', 'warning', 'escalation'].map(cat => (
          <Card 
            key={cat} 
            className={`bg-card/50 border-border/50 cursor-pointer transition-all ${
              filterCategory === cat ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setFilterCategory(filterCategory === cat ? 'all' : cat)}
          >
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-2">
                {getCategoryIcon(cat)}
                <span className="text-lg font-bold text-foreground">
                  {mockLogs.filter(l => l.category === cat).length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground capitalize">{cat.replace('_', ' ')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Audit Log */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 p-3 bg-muted/30 rounded-lg"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  {getCategoryIcon(log.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-semibold text-foreground">{log.valaId}</span>
                    <Badge variant="outline" className={getCategoryBadge(log.category)}>
                      {log.category.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground mt-1">{log.action}</p>
                  <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <User className="w-3 h-3" />
                    <span className="font-mono">{log.performedBy}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Immutability Notice */}
      <Card className="bg-primary/5 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Immutable Audit Trail</p>
              <p className="text-sm text-muted-foreground">
                All actions are permanently logged. Entries cannot be edited or deleted. 
                This ensures complete transparency and accountability.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
