import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Search, Lock, Clock, Shield, Ban, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  action: string;
  module: string;
  role: string | null;
  timestamp: Date;
  metadata: Record<string, unknown> | null;
  encrypted: boolean;
}

interface MAFullAuditLedgerProps {
  onDeleteAttempt: () => boolean;
}

const MAFullAuditLedger = ({ onDeleteAttempt }: MAFullAuditLedgerProps) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(500);

      if (error) throw error;

      setLogs((data || []).map(log => ({
        id: log.id,
        action: log.action,
        module: log.module,
        role: log.role,
        timestamp: new Date(log.timestamp),
        metadata: log.meta_json as Record<string, unknown> | null,
        encrypted: (log.meta_json as any)?.encrypted === true,
      })));
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttempt = () => {
    const blocked = onDeleteAttempt();
    if (!blocked) {
      toast.error('BLOCKED: Logs cannot be deleted even by Master Admin');
    }
  };

  const getActionColor = (action: string) => {
    if (action.startsWith('MASTER_')) {
      return 'bg-purple-500/20 text-purple-400';
    }
    if (action.includes('KILL') || action.includes('LOCK') || action.includes('FREEZE')) {
      return 'bg-red-500/20 text-red-400';
    }
    if (action.includes('approved') || action.includes('restored')) {
      return 'bg-emerald-500/20 text-emerald-400';
    }
    if (action.includes('rejected') || action.includes('suspended')) {
      return 'bg-amber-500/20 text-amber-400';
    }
    return 'bg-muted text-muted-foreground';
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
    JSON.stringify(log.metadata).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Full Audit Ledger
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-500/10 text-purple-400">
              <Eye className="w-3 h-3 mr-1" />
              Master View
            </Badge>
            <Badge variant="outline" className="bg-muted/50">
              <Lock className="w-3 h-3 mr-1" />
              Append-Only
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Complete immutable audit trail • No deletion allowed even by Master Admin
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search all logs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative group">
            <button
              onClick={handleDeleteAttempt}
              className="px-4 py-2 rounded border border-red-500/30 text-red-400/50 cursor-not-allowed flex items-center gap-2"
              disabled
            >
              <Ban className="w-4 h-4" />
              Delete (Blocked)
            </button>
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-slate-700">
              Audit logs cannot be deleted for compliance
            </span>
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading audit logs...
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No logs found</p>
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.01 }}
                  className={`p-3 rounded-lg border font-mono text-sm ${
                    log.encrypted 
                      ? 'bg-purple-500/5 border-purple-500/20' 
                      : 'bg-background/50 border-border/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {log.module}
                        </Badge>
                        {log.encrypted && (
                          <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400">
                            <Lock className="w-3 h-3 mr-1" />
                            Encrypted
                          </Badge>
                        )}
                      </div>
                      
                      {log.metadata && (
                        <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                          {Object.entries(log.metadata)
                            .filter(([key]) => key !== 'encrypted')
                            .map(([key, value]) => (
                              <div key={key}>
                                <span className="text-muted-foreground/70">{key}: </span>
                                <span>{String(value)}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        {log.timestamp.toLocaleString()}
                      </div>
                      {log.role && (
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <Shield className="w-3 h-3" />
                          {log.role}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
          <Lock className="w-4 h-4 inline mr-2" />
          Logs are immutable and cannot be deleted or modified by any user including Master Admin
        </div>
      </CardContent>
    </Card>
  );
};

export default MAFullAuditLedger;
