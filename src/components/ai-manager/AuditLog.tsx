import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Search } from 'lucide-react';
import { getAuditLogs, getAdminActionLogs, exportAuditLogs } from '@/routes/audit';

interface AuditEntry {
  id: string;
  user_id: string;
  action: string;
  module: string;
  meta_json?: any;
  role?: string;
  timestamp: string;
}

interface Props {
  tenantId: string;
}

export default function AuditLog({ tenantId }: Props) {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ action: '', userId: '', entityType: '' });
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [exporting, setExporting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await getAuditLogs(tenantId, 200, {
      action: filters.action || undefined,
      userId: filters.userId || undefined,
      entityType: filters.entityType || undefined,
    });
    if (err) { setError(err.message); setLoading(false); return; }
    setLogs((data ?? []) as AuditEntry[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [tenantId]);

  const handleExport = async () => {
    setExporting(true);
    const { data, error: err } = await exportAuditLogs(tenantId, exportFormat);
    setExporting(false);
    if (err || !data) { alert('Export failed'); return; }

    const blob = new Blob([data], { type: exportFormat === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs.${exportFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Audit Log</h2>
        <div className="flex gap-2 items-center">
          <Select value={exportFormat} onValueChange={v => setExportFormat(v as 'csv' | 'json')}>
            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport} disabled={exporting}>
            <Download className="w-4 h-4 mr-2" />{exporting ? 'Exporting…' : 'Export'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Search className="w-4 h-4" />Filters</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>Action</Label><Input placeholder="e.g. block_user" value={filters.action} onChange={e => setFilters(f => ({ ...f, action: e.target.value }))} /></div>
            <div><Label>User ID</Label><Input placeholder="UUID" value={filters.userId} onChange={e => setFilters(f => ({ ...f, userId: e.target.value }))} /></div>
            <div><Label>Entity Type</Label><Input placeholder="e.g. user, system" value={filters.entityType} onChange={e => setFilters(f => ({ ...f, entityType: e.target.value }))} /></div>
          </div>
          <Button className="mt-4" onClick={load}>Apply Filters</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : error ? (
            <div className="p-6 text-red-500">Error: {error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No audit logs found</TableCell></TableRow>}
                {logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-xs max-w-[120px] truncate">{log.user_id}</TableCell>
                    <TableCell><span className="font-medium text-sm">{log.action}</span></TableCell>
                    <TableCell className="text-sm">{log.module}</TableCell>
                    <TableCell className="text-sm">{log.role ?? '—'}</TableCell>
                    <TableCell className="font-mono text-xs max-w-[120px] truncate">{log.meta_json ? JSON.stringify(log.meta_json) : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
