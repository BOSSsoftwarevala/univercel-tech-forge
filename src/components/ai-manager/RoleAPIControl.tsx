import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getRoleApiPermissions, updateRolePermission, getRoleUsageTracking } from '@/routes/role-api';

interface RolePermission {
  id: string;
  role_name: string;
  service_id: string;
  is_allowed: boolean;
  daily_limit: number;
  tenant_id: string;
}

interface UsageRow {
  role_name: string;
  tokens: number;
  cost: number;
}

interface Props {
  tenantId: string;
}

export default function RoleAPIControl({ tenantId }: Props) {
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [usage, setUsage] = useState<Record<string, UsageRow>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: perms, error: err }, { data: usageLogs }] = await Promise.all([
      getRoleApiPermissions(tenantId),
      getRoleUsageTracking(tenantId),
    ]);
    if (err) { setError(err.message); setLoading(false); return; }
    setPermissions((perms ?? []) as RolePermission[]);

    const agg: Record<string, UsageRow> = {};
    for (const row of (usageLogs ?? []) as any[]) {
      const key = row.role_name ?? 'unknown';
      if (!agg[key]) agg[key] = { role_name: key, tokens: 0, cost: 0 };
      agg[key].tokens += row.tokens_used ?? 0;
      agg[key].cost += row.cost ?? 0;
    }
    setUsage(agg);
    setLoading(false);
  };

  useEffect(() => { load(); }, [tenantId]);

  const handleToggle = async (perm: RolePermission) => {
    await updateRolePermission(perm.id, { is_allowed: !perm.is_allowed }, tenantId);
    load();
  };

  const handleLimitChange = async (perm: RolePermission, value: string) => {
    const limit = parseInt(value);
    if (isNaN(limit)) return;
    await updateRolePermission(perm.id, { daily_limit: limit }, tenantId);
    load();
  };

  const roles = [...new Set(permissions.map(p => p.role_name))];
  const services = [...new Set(permissions.map(p => p.service_id))];

  if (loading) return (
    <Card><CardContent className="p-6 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</CardContent></Card>
  );
  if (error) return <Card><CardContent className="p-6 text-red-500">Error: {error}</CardContent></Card>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Role API Control</h2>

      <Card>
        <CardHeader><CardTitle>Permission Matrix</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[140px]">Role</TableHead>
                {services.map(s => <TableHead key={s} className="min-w-[140px] text-xs">{s}</TableHead>)}
                <TableHead>Daily Limit</TableHead>
                <TableHead>Usage (tokens)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map(role => (
                <TableRow key={role}>
                  <TableCell><Badge variant="outline">{role}</Badge></TableCell>
                  {services.map(svc => {
                    const perm = permissions.find(p => p.role_name === role && p.service_id === svc);
                    return (
                      <TableCell key={svc}>
                        {perm ? (
                          <Switch checked={perm.is_allowed} onCheckedChange={() => handleToggle(perm)} />
                        ) : <span className="text-muted-foreground text-xs">—</span>}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    {(() => {
                      const perm = permissions.find(p => p.role_name === role);
                      return perm ? (
                        <Input
                          type="number"
                          defaultValue={perm.daily_limit}
                          onBlur={e => handleLimitChange(perm, e.target.value)}
                          className="w-24 h-7 text-sm"
                        />
                      ) : '—';
                    })()}
                  </TableCell>
                  <TableCell>{usage[role]?.tokens.toLocaleString() ?? 0}</TableCell>
                </TableRow>
              ))}
              {roles.length === 0 && (
                <TableRow><TableCell colSpan={services.length + 3} className="text-center text-muted-foreground py-8">No permissions configured</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Role Usage Statistics</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Total Tokens</TableHead>
                <TableHead>Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(usage).map(row => (
                <TableRow key={row.role_name}>
                  <TableCell><Badge variant="outline">{row.role_name}</Badge></TableCell>
                  <TableCell>{row.tokens.toLocaleString()}</TableCell>
                  <TableCell>${row.cost.toFixed(4)}</TableCell>
                </TableRow>
              ))}
              {Object.keys(usage).length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-6">No usage data</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
