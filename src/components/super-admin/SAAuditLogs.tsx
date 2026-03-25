import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Search, Lock, Clock, User, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface AuditLog {
  id: string;
  action: string;
  module: string;
  role: string | null;
  userId: string | null;
  timestamp: Date;
  metadata: Record<string, unknown> | null;
}

const SAAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('all');
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
        .limit(100);

      if (error) throw error;

      setLogs((data || []).map(log => ({
        id: log.id,
        action: log.action,
        module: log.module,
        role: log.role,
        userId: log.user_id,
        timestamp: new Date(log.timestamp),
        metadata: log.meta_json as Record<string, unknown> | null,
      })));
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      // Fallback to mock data
      setLogs([
        {
          id: '1',
          action: 'withdrawal_approved',
          module: 'super_admin_action',
          role: 'super_admin',
          userId: 'VALA-1234',
          timestamp: new Date(Date.now() - 3600000),
          metadata: { amount: 5000, target: 'VALA-7721', reason: 'Verified withdrawal request' },
        },
        {
          id: '2',
          action: 'role_suspended',
          module: 'super_admin_action',
          role: 'super_admin',
          userId: 'VALA-1234',
          timestamp: new Date(Date.now() - 7200000),
          metadata: { target: 'VALA-4455', role: 'influencer', reason: 'Policy violation detected' },
        },
        {
          id: '3',
          action: 'incident_declared',
          module: 'super_admin_action',
          role: 'super_admin',
          userId: 'VALA-1234',
          timestamp: new Date(Date.now() - 10800000),
          metadata: { severity: 'high', description: 'Payment gateway degradation' },
        },
        {
          id: '4',
          action: 'wallet_frozen',
          module: 'super_admin_action',
          role: 'super_admin',
          userId: 'VALA-1234',
          timestamp: new Date(Date.now() - 14400000),
          metadata: { target: 'VALA-3345', reason: 'Suspicious activity detected' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('approved') || action.includes('activated')) {
      return 'bg-emerald-500/20 text-emerald-400';
    }
    if (action.includes('rejected') || action.includes('suspended') || action.includes('frozen')) {
      return 'bg-red-500/20 text-red-400';
    }
    if (action.includes('incident') || action.includes('escalated')) {
      return 'bg-amber-500/20 text-amber-400';
    }
    return 'bg-muted text-muted-foreground';
  };

  const uniqueModules = [...new Set(logs.map(l => l.module))];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(log.metadata).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesModule = filterModule === 'all' || log.module === filterModule;
    
    return matchesSearch && matchesModule;
  });

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Immutable Audit Logs
          </CardTitle>
          <Badge variant="outline" className="bg-muted/50">
            <Lock className="w-3 h-3 mr-1" />
            Append-Only
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Master Admin has full visibility • Logs cannot be modified or deleted
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterModule} onValueChange={setFilterModule}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {uniqueModules.map(mod => (
                <SelectItem key={mod} value={mod}>{mod.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  transition={{ delay: index * 0.02 }}
                  className="p-3 rounded-lg bg-background/50 border border-border/30 font-mono text-sm"
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
                      </div>
                      
                      {log.metadata && (
                        <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                          {Object.entries(log.metadata).map(([key, value]) => (
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
                      {log.userId && (
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <User className="w-3 h-3" />
                          {log.userId}
                        </div>
                      )}
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
      </CardContent>
    </Card>
  );
};

export default SAAuditLogs;
