// Continent Super Admin - Audit Screen (Read-Only)
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, RefreshCw, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  timestamp: string;
  role: string;
  action: string;
  module: string;
  result: 'Success' | 'Failed' | 'Pending';
  meta_json?: Record<string, unknown>;
}

const AuditView = () => {
  const { toast } = useToast();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    pending: 0,
  });

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;

      const formattedLogs: AuditLog[] = (data || []).map(log => ({
        id: log.id,
        timestamp: format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        role: log.role || 'Unknown',
        action: log.action,
        module: log.module,
        result: determineResult(log.action, log.meta_json),
        meta_json: log.meta_json as Record<string, unknown> | undefined,
      }));

      setAuditLogs(formattedLogs);
      
      // Calculate stats
      const successful = formattedLogs.filter(l => l.result === 'Success').length;
      const failed = formattedLogs.filter(l => l.result === 'Failed').length;
      const pending = formattedLogs.filter(l => l.result === 'Pending').length;
      
      setStats({
        total: formattedLogs.length,
        successful,
        failed,
        pending,
      });
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch audit logs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const determineResult = (action: string, meta: unknown): 'Success' | 'Failed' | 'Pending' => {
    const metaObj = meta as Record<string, unknown> | null;
    if (metaObj?.status === 'failed' || action.includes('failed') || action.includes('error')) {
      return 'Failed';
    }
    if (metaObj?.status === 'pending' || action.includes('pending') || action.includes('escalated')) {
      return 'Pending';
    }
    return 'Success';
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Success': return 'bg-emerald-500/20 text-emerald-500';
      case 'Failed': return 'bg-red-500/20 text-red-500';
      case 'Pending': return 'bg-amber-500/20 text-amber-500';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit</h1>
          <p className="text-muted-foreground">Read-only audit trail (No export, copy, or download)</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAuditLogs}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Security Notice */}
      <Card className="bg-amber-500/10 border-amber-500/30">
        <CardContent className="py-3">
          <div className="flex items-center gap-2 text-amber-500">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">
              This is a read-only view. Export, copy, and download are disabled for security.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Audit Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Logs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-500">{stats.successful}</p>
              <p className="text-sm text-muted-foreground">Successful</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{stats.failed}</p>
              <p className="text-sm text-muted-foreground">Failed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-500">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Clock className="h-5 w-5" />
            Recent Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="select-none" 
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
          >
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No audit logs found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Timestamp</TableHead>
                    <TableHead className="text-muted-foreground">Role</TableHead>
                    <TableHead className="text-muted-foreground">Module</TableHead>
                    <TableHead className="text-muted-foreground">Action</TableHead>
                    <TableHead className="text-muted-foreground">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log, index) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-border"
                    >
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {log.timestamp}
                      </TableCell>
                      <TableCell className="text-foreground capitalize">{log.role}</TableCell>
                      <TableCell className="text-muted-foreground capitalize">{log.module}</TableCell>
                      <TableCell className="text-foreground">{log.action.replace(/_/g, ' ')}</TableCell>
                      <TableCell>
                        <Badge className={getResultColor(log.result)}>
                          {log.result}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditView;
