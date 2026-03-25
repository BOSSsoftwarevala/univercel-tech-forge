import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ScrollText,
  Search,
  Filter,
  Download,
  Lock,
  Rocket,
  RotateCcw,
  Scale,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
} from 'lucide-react';
import { toast } from 'sonner';
import { serverManagerAPI } from '@/hooks/useServerManagerAPI';

interface AuditLog {
  id: string;
  action: string;
  action_type?: string | null;
  created_at: string;
  performed_by_role?: string | null;
  server_instances?: {
    server_name?: string | null;
  } | null;
  approval_status?: string | null;
}

interface AuditResponse {
  audit: AuditLog[];
}

type InfraCategory = 'deploy' | 'restart' | 'scaling' | 'access' | 'security' | 'backup';

interface InfraLog {
  id: string;
  timestamp: string;
  category: InfraCategory;
  action: string;
  actor: string;
  target: string;
  status: 'success' | 'failed' | 'pending';
  details: string;
  checksum: string;
}

const inferCategory = (actionType?: string | null, action?: string): InfraCategory => {
  const source = `${actionType || ''} ${action || ''}`.toLowerCase();
  if (source.includes('deploy') || source.includes('create')) return 'deploy';
  if (source.includes('restart') || source.includes('shutdown')) return 'restart';
  if (source.includes('scale')) return 'scaling';
  if (source.includes('backup') || source.includes('restore')) return 'backup';
  if (source.includes('security') || source.includes('lockdown') || source.includes('firewall')) return 'security';
  return 'access';
};

export function SMInfraLogs() {
  const [logs, setLogs] = useState<InfraLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    let cancelled = false;

    const loadLogs = async () => {
      try {
        const data = await serverManagerAPI.getAuditLogs() as AuditResponse;
        if (cancelled) {
          return;
        }

        setLogs(
          (data.audit || []).map((log) => {
            const category = inferCategory(log.action_type, log.action);
            return {
              id: log.id,
              timestamp: log.created_at,
              category,
              action: log.action.toUpperCase().replace(/\s+/g, '_'),
              actor: log.performed_by_role || 'SYSTEM',
              target: log.server_instances?.server_name || 'server-manager',
              status: log.approval_status === 'pending' ? 'pending' : 'success',
              details: log.action,
              checksum: log.id,
            };
          }),
        );
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load infrastructure logs');
      }
    };

    void loadLogs();

    return () => {
      cancelled = true;
    };
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'deploy':
        return Rocket;
      case 'restart':
        return RotateCcw;
      case 'scaling':
        return Scale;
      case 'access':
        return Shield;
      case 'security':
        return Lock;
      case 'backup':
        return Server;
      default:
        return ScrollText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'deploy':
        return 'bg-blue-500/20 text-blue-400';
      case 'restart':
        return 'bg-orange-500/20 text-orange-400';
      case 'scaling':
        return 'bg-purple-500/20 text-purple-400';
      case 'access':
        return 'bg-green-500/20 text-green-400';
      case 'security':
        return 'bg-red-500/20 text-red-400';
      case 'backup':
        return 'bg-cyan-500/20 text-cyan-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400 animate-pulse" />;
      default:
        return null;
    }
  };

  const filteredLogs = useMemo(
    () =>
      logs.filter((log) => {
        const matchesSearch =
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
        return matchesSearch && matchesCategory;
      }),
    [categoryFilter, logs, searchTerm],
  );

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `server-manager-audit-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Audit log export generated');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-primary" />
          Infrastructure Logs
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            <Lock className="h-3 w-3 mr-1" />
            Immutable
          </Badge>
          <Button size="sm" variant="outline" onClick={handleExport} className="text-xs">
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search logs..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="pl-10" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="deploy">Deployments</SelectItem>
            <SelectItem value="restart">Restarts</SelectItem>
            <SelectItem value="scaling">Scaling</SelectItem>
            <SelectItem value="access">Access</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="backup">Backups</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredLogs.map((log) => {
              const CategoryIcon = getCategoryIcon(log.category);

              return (
                <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(log.category)}`}>
                        <CategoryIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-sm">{log.action}</span>
                          {getStatusIcon(log.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Target: {log.target}</span>
                          <span>Actor: {log.actor}</span>
                          <span className="font-mono text-[10px] opacity-50">{log.checksum}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getCategoryColor(log.category)} variant="outline">
                        {log.category}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1 font-mono">{log.timestamp}</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {!filteredLogs.length && <div className="p-6 text-sm text-center text-muted-foreground">No logs match the current filters.</div>}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {filteredLogs.length} of {logs.length} logs
        </span>
        <span className="flex items-center gap-1">
          <Lock className="h-3 w-3" />
          Export contains immutable audit data only
        </span>
      </div>
    </div>
  );
}