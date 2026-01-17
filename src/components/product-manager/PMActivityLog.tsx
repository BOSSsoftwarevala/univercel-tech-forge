import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Activity,
  Search,
  RefreshCw,
  Filter,
  Package,
  Plus,
  Edit,
  Trash2,
  Power,
  Eye,
  Download,
  Loader2,
  Lock,
  Calendar,
} from 'lucide-react';

interface ActivityLog {
  id: string;
  product_id: string;
  product_name: string;
  action: string;
  action_details?: any;
  created_at: string;
}

const actionIcons: Record<string, React.ElementType> = {
  product_created: Plus,
  product_updated: Edit,
  product_deleted: Trash2,
  product_activated: Power,
  product_deactivated: Power,
  product_viewed: Eye,
};

const actionColors: Record<string, string> = {
  product_created: 'bg-green-500/10 text-green-500 border-green-500/30',
  product_updated: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  product_deleted: 'bg-red-500/10 text-red-500 border-red-500/30',
  product_activated: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  product_deactivated: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  product_viewed: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
};

const PMActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('product_action_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (search) {
        query = query.ilike('product_name', `%${search}%`);
      }
      if (filterAction !== 'all') {
        query = query.eq('action', filterAction);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, filterAction]);

  const handleExport = () => {
    const csv = [
      ['Date', 'Product', 'Action', 'Details'].join(','),
      ...logs.map(log => [
        format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
        log.product_name,
        log.action,
        JSON.stringify(log.action_details || {}).replace(/,/g, ';'),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-activity-${Date.now()}.csv`;
    a.click();
    toast.success('Activity log exported');
  };

  const stats = {
    total: logs.length,
    created: logs.filter(l => l.action === 'product_created').length,
    updated: logs.filter(l => l.action === 'product_updated').length,
    deleted: logs.filter(l => l.action === 'product_deleted').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-500" />
            Product Activity Log
          </h1>
          <p className="text-muted-foreground text-sm">
            Immutable audit trail of all product actions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="icon" onClick={fetchLogs}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex items-center gap-3">
          <Lock className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Immutable Audit Trail</p>
            <p className="text-xs text-muted-foreground">
              These logs are non-editable and cannot be deleted. Every action is timestamped and recorded.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Activity className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Actions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Plus className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats.created}</p>
              <p className="text-xs text-muted-foreground">Products Created</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Edit className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.updated}</p>
              <p className="text-xs text-muted-foreground">Updates Made</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{stats.deleted}</p>
              <p className="text-xs text-muted-foreground">Deleted</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="product_created">Created</SelectItem>
                <SelectItem value="product_updated">Updated</SelectItem>
                <SelectItem value="product_deleted">Deleted</SelectItem>
                <SelectItem value="product_activated">Activated</SelectItem>
                <SelectItem value="product_deactivated">Deactivated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Activity className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Activity Logs</h3>
              <p className="text-muted-foreground text-sm">Product actions will appear here</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const ActionIcon = actionIcons[log.action] || Activity;
                  const colorClass = actionColors[log.action] || 'bg-secondary text-foreground';
                  
                  return (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm">{format(new Date(log.created_at), 'MMM dd, yyyy')}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(log.created_at), 'HH:mm:ss')}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{log.product_name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{log.product_id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`gap-1 ${colorClass}`}>
                          <ActionIcon className="w-3 h-3" />
                          {log.action.replace('product_', '').replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.action_details ? (
                          <span className="text-xs text-muted-foreground">
                            {Object.keys(log.action_details).length} fields
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PMActivityLog;
