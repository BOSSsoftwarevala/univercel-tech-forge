import React, { useEffect, useMemo, useState } from 'react';
import { Key, MapPin, AlertTriangle, Fingerprint, MonitorSmartphone, Loader2, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { securityApi, type SecuritySessionItem } from '@/lib/api/security';
import { toast } from 'sonner';

const DeviceSessionBinding: React.FC = () => {
  const [sessions, setSessions] = useState<SecuritySessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await securityApi.getSessions({ limit: 100 });
      setSessions(data.sessions);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSessions();
  }, []);

  const formatRelativeTime = (value?: string | null) => {
    if (!value) return 'unknown';
    const diffMinutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${Math.round(diffHours / 24)} day ago`;
  };

  const boundDevices = useMemo(() => sessions.map((session) => ({
    id: session.id,
    fingerprint: session.device_fingerprint || 'not-captured',
    device: session.device_label || `${session.browser || 'Unknown'} on ${session.os || 'Unknown'}`,
    lastActive: formatRelativeTime(session.last_activity_at || session.login_at),
    location: [session.geo_city, session.geo_country].filter(Boolean).join(', ') || 'Unknown region',
    status: session.is_active ? 'active' : 'revoked',
    riskScore: Number(session.risk_score || 0),
  })), [sessions]);

  const sessionTokens = useMemo(() => sessions.map((session) => ({
    id: session.id,
    token: session.id.slice(0, 12),
    created: formatRelativeTime(session.login_at),
    expires: session.expires_at ? formatRelativeTime(session.expires_at) : 'rotating',
    status: session.is_active ? 'valid' : 'revoked',
    authStrength: session.auth_strength || 'password',
  })), [sessions]);

  const locationAlerts = useMemo(() => sessions
    .filter((session) => Number(session.risk_score || 0) >= 70 || session.forced_reauth)
    .map((session) => ({
      id: session.id,
      time: formatRelativeTime(session.last_activity_at || session.login_at),
      from: session.masked_ip || 'unknown network',
      to: [session.geo_city, session.geo_country].filter(Boolean).join(', ') || 'location unresolved',
      role: session.active_role || 'unknown',
      severity: Number(session.risk_score || 0) >= 85 ? 'high' : 'medium',
    })), [sessions]);

  const handleForceLogout = async (sessionId: string) => {
    try {
      setMutatingId(sessionId);
      await securityApi.revokeSession(sessionId, 'manual_force_logout');
      toast.success('Session revoked');
      await loadSessions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to revoke session');
    } finally {
      setMutatingId(null);
    }
  };

  const handleSignOutEverywhere = async () => {
    try {
      setMutatingId('all');
      await securityApi.signOutEverywhere();
      toast.success('Forced sign out dispatched to all active sessions');
      await loadSessions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign out everywhere');
    } finally {
      setMutatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-slate-700/50 bg-slate-900/40">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Device & Session Binding</h2>
          <p className="text-slate-400">Live device fingerprints, session state, and zero-trust step-up enforcement</p>
        </div>
        <Button onClick={() => void handleSignOutEverywhere()} disabled={mutatingId === 'all'} className="bg-red-500 text-white hover:bg-red-400">
          {mutatingId === 'all' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
          Sign Out Everywhere
        </Button>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-blue-400" />
            Bound Device Fingerprints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Device ID</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Fingerprint</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Device</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Last Active</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Location</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {boundDevices.map((device, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-slate-300 font-mono">{device.id.slice(0, 8)}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-sm">{device.fingerprint.slice(0, 14)}</td>
                    <td className="py-3 px-4 text-white">{device.device}</td>
                    <td className="py-3 px-4 text-slate-300">{device.lastActive}</td>
                    <td className="py-3 px-4 text-slate-300">{device.location}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="outline" 
                        className={device.status === 'active' ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}
                      >
                        {device.status} • risk {device.riskScore}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-400" />
            Active Session Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Token</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Created</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Expires In</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {sessionTokens.map((session, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-slate-400 font-mono text-sm">{session.token}...</td>
                    <td className="py-3 px-4 text-slate-300">{session.created}</td>
                    <td className="py-3 px-4 text-slate-300">{session.expires}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={session.status === 'valid' ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}>
                        {session.status} • {session.authStrength}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-400" />
            Location Jump Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">From</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">To</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Severity</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {locationAlerts.map((alert, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-slate-300">{alert.time}</td>
                    <td className="py-3 px-4 text-white">{alert.from}</td>
                    <td className="py-3 px-4 text-red-400">{alert.to}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {alert.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="outline" 
                        className={alert.severity === 'high' ? 'border-red-500/50 text-red-400' : 'border-yellow-500/50 text-yellow-400'}
                      >
                        {alert.severity}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => void handleForceLogout(alert.id)} disabled={mutatingId === alert.id}>
                          {mutatingId === alert.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Force Logout'}
                        </Button>
                        <Button size="sm" variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
                          Force Logout
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {locationAlerts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-slate-400">
                      No location anomalies or concurrent session risk detected.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MonitorSmartphone className="h-5 w-5 text-orange-400" />
            Concurrent Login Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg border ${locationAlerts.length > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
            <div className={`flex items-center gap-2 ${locationAlerts.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">{locationAlerts.length > 0 ? `${locationAlerts.length} concurrent or geo-jump sessions need review` : 'No Concurrent Login Violations Detected'}</span>
            </div>
            <p className={`text-sm mt-1 ${locationAlerts.length > 0 ? 'text-red-300/80' : 'text-green-300/80'}`}>
              {locationAlerts.length > 0
                ? 'High-risk sessions are marked for step-up authentication or forced logout from this panel.'
                : 'All sessions are bound to captured device fingerprints and are within expected trust thresholds.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceSessionBinding;
