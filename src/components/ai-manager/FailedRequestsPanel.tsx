/**
 * FailedRequestsPanel – Real-time monitoring of failed API calls.
 * Shows failed requests with error types, rate limit alerts, and retry options.
 */

import { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RefreshCw, RotateCcw, Loader2, XCircle } from 'lucide-react';
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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getUsageDetails } from '@/routes/ai-usage';
type FailedRecord = {
  id: string;
  service_id: string;
  endpoint: string | null;
  status: string;
  error_message: string | null;
  response_time_ms: number | null;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  failed: 'bg-red-500/10 text-red-400 border-red-500/50',
  rate_limited: 'bg-amber-500/10 text-amber-400 border-amber-500/50',
  fallback_used: 'bg-blue-500/10 text-blue-400 border-blue-500/50',
};

export const FailedRequestsPanel = () => {
  const [records, setRecords] = useState<FailedRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 20;

  const fetch = useCallback(async (p = page) => {
    setLoading(true);
    const { data, count } = await getUsageDetails({ page: p, pageSize: PAGE_SIZE });
    // Filter to failed/rate_limited/fallback statuses
    const failed = (data as FailedRecord[]).filter(
      r => r.status !== 'success'
    );
    setRecords(failed);
    setTotal(count ?? 0);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetch(page);
  }, [fetch, page]);

  const handleRefresh = () => fetch(page);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-400" />
            Failed Requests
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time error monitoring for all AI/API gateway calls
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={cn('w-4 h-4 mr-1', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />
            Error Log
            <Badge variant="outline" className="ml-2 text-xs">{total} total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No failed requests – all services healthy ✅
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableHead className="text-xs">Time</TableHead>
                    <TableHead className="text-xs">Endpoint</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Error</TableHead>
                    <TableHead className="text-xs">Latency</TableHead>
                    <TableHead className="text-xs text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map(r => (
                    <TableRow key={r.id} className="hover:bg-muted/10">
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(r.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs font-mono max-w-[180px] truncate">
                        {r.endpoint ?? '—'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('text-[10px]', STATUS_COLORS[r.status] ?? STATUS_COLORS.failed)}
                        >
                          {r.status.toUpperCase().replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-red-400 max-w-[200px] truncate">
                        {r.error_message ?? '—'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {r.response_time_ms != null ? `${r.response_time_ms}ms` : '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-blue-400 hover:bg-blue-500/20"
                            title="Mark reviewed"
                            onClick={() => toast.info(`Request ${r.id.substring(0, 8)} noted`)}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">Page {page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={records.length < PAGE_SIZE}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FailedRequestsPanel;
