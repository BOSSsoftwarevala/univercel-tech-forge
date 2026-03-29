import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Lock, FileDown, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface LegalLog {
  id: string;
  timestamp: string;
  action: string;
  category: 'policy' | 'trademark' | 'violation' | 'document' | 'escalation' | 'ai_flag';
  actor: string;
  details: string;
  immutable: boolean;
}

const mockLogs: LegalLog[] = [
  { id: 'LOG-001', timestamp: '2024-01-15T10:30:00Z', action: 'Policy Draft Saved', category: 'policy', actor: 'LM-A1B2', details: 'Updated Privacy Policy draft v2.5.0', immutable: true },
  { id: 'LOG-002', timestamp: '2024-01-15T10:15:00Z', action: 'AI Flag Reviewed', category: 'ai_flag', actor: 'LM-A1B2', details: 'Reviewed fraud language alert LA-001', immutable: true },
  { id: 'LOG-003', timestamp: '2024-01-15T09:45:00Z', action: 'Violation Escalated', category: 'escalation', actor: 'LM-C3D4', details: 'Escalated VIO-003 to Super Admin', immutable: true },
  { id: 'LOG-004', timestamp: '2024-01-15T09:30:00Z', action: 'Trademark Misuse Detected', category: 'trademark', actor: 'AI-SYSTEM', details: 'AI detected logo misuse in Demo DM-7823', immutable: true },
  { id: 'LOG-005', timestamp: '2024-01-15T09:00:00Z', action: 'Document Uploaded', category: 'document', actor: 'LM-A1B2', details: 'Uploaded Master Service Agreement template', immutable: true },
  { id: 'LOG-006', timestamp: '2024-01-14T17:30:00Z', action: 'Warning Issued', category: 'violation', actor: 'LM-A1B2', details: 'Issued warning to USR-7823 for content policy breach', immutable: true },
  { id: 'LOG-007', timestamp: '2024-01-14T16:00:00Z', action: 'Policy Submitted', category: 'policy', actor: 'LM-C3D4', details: 'Submitted AUP draft for Admin approval', immutable: true },
  { id: 'LOG-008', timestamp: '2024-01-14T14:30:00Z', action: 'Suspension Recommended', category: 'violation', actor: 'LM-A1B2', details: 'Recommended suspension for RSL-4521 (pending Admin)', immutable: true },
];

const LMLegalLogs: React.FC = () => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'policy': return 'bg-blue-500/20 text-blue-400';
      case 'trademark': return 'bg-purple-500/20 text-purple-400';
      case 'violation': return 'bg-red-500/20 text-red-400';
      case 'document': return 'bg-green-500/20 text-green-400';
      case 'escalation': return 'bg-orange-500/20 text-orange-400';
      case 'ai_flag': return 'bg-cyan-500/20 text-cyan-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleExportPDF = () => {
    console.log('[LEGAL_MANAGER] Log export requested:', {
      timestamp: new Date().toISOString(),
      action: 'log_export',
      format: 'PDF'
    });
    toast.success('Legal logs exported to PDF');
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Legal Activity Logs
          <Badge variant="outline" className="ml-2 gap-1">
            <Lock className="h-3 w-3" />
            Immutable
          </Badge>
        </CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" variant="secondary" onClick={handleExportPDF} className="gap-1">
            <FileDown className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {mockLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">{log.id}</span>
                      <Badge className={getCategoryColor(log.category)}>
                        {log.category.replace('_', ' ')}
                      </Badge>
                      {log.immutable && (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <p className="font-medium text-sm">{log.action}</p>
                    <p className="text-sm text-muted-foreground">{log.details}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                    <p>{new Date(log.timestamp).toLocaleDateString()}</p>
                    <p>{new Date(log.timestamp).toLocaleTimeString()}</p>
                    <p className="mt-1 font-mono">{log.actor}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 p-3 rounded bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            All logs are append-only and immutable. Export available in PDF format only.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LMLegalLogs;
