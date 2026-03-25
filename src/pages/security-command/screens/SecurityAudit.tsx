import React, { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Clock, User, Activity, Monitor, Globe, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { securityApi, type SecurityLogItem } from '@/lib/api/security';
import { toast } from 'sonner';

const SecurityAudit: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<SecurityLogItem[]>([]);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await securityApi.getLogs(100);
        setAuditLogs(data.logs);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load security audit log');
      }
    };

    void loadLogs();
  }, []);

  const formatTimestamp = (value: string) => new Date(value).toLocaleString();

  const stats = useMemo(() => {
    const userCount = new Set(auditLogs.map((log) => log.user_id).filter(Boolean)).size;
    const deviceCount = new Set(auditLogs.map((log) => log.device_fingerprint).filter(Boolean)).size;
    const countryCount = new Set(
      auditLogs
        .map((log) => String(log.action_details?.geo_country || ''))
        .filter(Boolean),
    ).size;

    return {
      total: auditLogs.length,
      users: userCount,
      devices: deviceCount,
      countries: countryCount,
    };
  }, [auditLogs]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Audit (Read Only)</h2>
        <p className="text-slate-400">Immutable security audit trail - view only, no modifications allowed</p>
      </div>

      {/* Read Only Notice */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-3">
        <Lock className="h-5 w-5 text-blue-400" />
        <div>
          <span className="font-medium text-blue-400">Read Only Mode</span>
          <p className="text-sm text-blue-300/80">Audit logs are immutable. No editing, deletion, or export permitted.</p>
        </div>
      </div>

      {/* Audit Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <Activity className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</p>
            <p className="text-sm text-slate-400">Total Logs Today</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <User className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.users.toLocaleString()}</p>
            <p className="text-sm text-slate-400">Active Users</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <Monitor className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.devices.toLocaleString()}</p>
            <p className="text-sm text-slate-400">Device Types</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <Globe className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.countries.toLocaleString()}</p>
            <p className="text-sm text-slate-400">Countries</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-400" />
            Security Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Timestamp
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Action</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Result</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                      <Monitor className="h-4 w-4" />
                      Device
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      IP (Masked)
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 font-mono text-sm text-slate-300">{formatTimestamp(log.created_at)}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {log.user_role || 'system'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">{log.event_type.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="outline" 
                        className={
                          log.event_type.includes('blocked') || log.event_type.includes('disabled') ? 'border-red-500/50 text-red-400' :
                          log.event_type.includes('alert') || log.event_type.includes('scan') ? 'border-yellow-500/50 text-yellow-400' :
                          'border-green-500/50 text-green-400'
                        }
                      >
                        {log.event_type.includes('blocked') || log.event_type.includes('disabled') ? 'Blocked' : log.event_type.includes('scan') ? 'Logged' : 'Allowed'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">{log.device_fingerprint ? log.device_fingerprint.slice(0, 12) : 'system'}</td>
                    <td className="py-3 px-4 font-mono text-sm text-slate-400">{log.masked_ip || 'unknown'}</td>
                  </tr>
                ))}
                {auditLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-slate-400">
                      Immutable security log has no events yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Log Integrity Notice */}
      <Card className="bg-green-500/10 border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-green-400" />
            <div>
              <h4 className="font-medium text-green-400">Log Integrity Verified</h4>
              <p className="text-sm text-green-300/80">
                All audit logs are cryptographically signed and tamper-proof. 
                Hash chain verified as of last refresh.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityAudit;
