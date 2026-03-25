import React, { useEffect, useState } from 'react';
import { Shield, Users, Ban, AlertTriangle, CheckCircle, Activity, Loader2, ScanSearch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { securityApi, type SecurityOverviewResponse } from '@/lib/api/security';
import { toast } from 'sonner';

const SecurityOverview: React.FC = () => {
  const [overview, setOverview] = useState<SecurityOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const data = await securityApi.getOverview();
      setOverview(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load security overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOverview();
  }, []);

  const handleRunScan = async () => {
    try {
      setScanning(true);
      const result = await securityApi.runScan({ scope: 'global' });
      toast.success(`Threat scan completed with risk score ${result.risk_score}`);
      await loadOverview();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to run threat scan');
    } finally {
      setScanning(false);
    }
  };

  const formatRelativeTime = (value?: string | null) => {
    if (!value) return 'unknown';
    const timestamp = new Date(value).getTime();
    const diffMinutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} day ago`;
  };

  const getSeverityColor = (severity?: string | null) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600/15 text-red-400 border-red-500/40';
      case 'high':
        return 'bg-red-500/10 text-red-300 border-red-400/30';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-300 border-yellow-400/30';
      case 'low':
        return 'bg-blue-500/10 text-blue-300 border-blue-400/30';
      default:
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30';
    }
  };

  const stats = overview ? [
    { label: 'Security Status', value: overview.summary.zero_trust_enabled ? 'Zero Trust Live' : 'Review Needed', icon: Shield, color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: 'Active Sessions', value: overview.summary.active_sessions.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'Blocked Today', value: overview.summary.blocked_attempts_24h.toLocaleString(), icon: Ban, color: 'text-red-400', bg: 'bg-red-500/20' },
    { label: 'Open Alerts', value: overview.summary.open_alerts.toLocaleString(), icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  ] : [];

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
          <h2 className="text-2xl font-bold text-white mb-2">Security Overview</h2>
          <p className="text-slate-400">Global security posture, live threat signals, and finance-linked risk controls</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
            2FA adoption {overview?.summary['2fa_adoption_rate'] ?? 0}%
          </Badge>
          <Button onClick={() => void handleRunScan()} disabled={scanning} className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
            {scanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanSearch className="mr-2 h-4 w-4" />}
            Run Threat Scan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Active Protection Layers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Zero Trust', enabled: Boolean(overview?.controls?.zero_trust_enabled) },
              { label: 'Admin 2FA', enabled: Boolean(overview?.controls?.require_2fa_for_admin) },
              { label: 'Finance Step-Up', enabled: Boolean(overview?.controls?.require_2fa_for_finance) },
              { label: 'Unknown Device OTP', enabled: Boolean(overview?.controls?.unknown_device_requires_otp) },
              { label: 'Geo Change Reauth', enabled: Boolean(overview?.controls?.geo_change_force_reauth) },
              { label: 'High-Risk Auto Block', enabled: Boolean(overview?.controls?.high_risk_auto_block) },
              { label: 'Authenticator Ready', enabled: Boolean(overview?.controls?.totp_enabled) },
              { label: 'Backup Recovery Codes', enabled: Boolean(overview?.controls?.backup_codes_enabled) },
            ].map((protection, index) => (
              <div 
                key={index}
                className={`flex items-center gap-2 p-3 rounded-lg border ${protection.enabled ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}
              >
                <CheckCircle className={`h-4 w-4 ${protection.enabled ? 'text-green-400' : 'text-red-400'}`} />
                <span className={`text-sm ${protection.enabled ? 'text-green-300' : 'text-red-300'}`}>{protection.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              Recent Security Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overview?.recent_logs.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-900/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${activity.event_type.includes('disabled') || activity.event_type.includes('blocked') ? 'bg-red-400' : activity.event_type.includes('scan') ? 'bg-yellow-400' : 'bg-cyan-400'}`} />
                    <div>
                      <span className="text-white block">{activity.event_type.replace(/_/g, ' ')}</span>
                      <span className="text-xs text-slate-500">{activity.user_role || 'system'} • {activity.masked_ip || 'unknown IP'}</span>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400">{formatRelativeTime(activity.created_at)}</span>
                </div>
              ))}
              {overview?.recent_logs.length === 0 && (
                <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-4 text-sm text-slate-400">
                  No immutable security activity recorded yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Threat Hotspots</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview?.threat_hotspots.map((hotspot) => (
              <div key={hotspot.type} className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-white">{hotspot.type.replace(/_/g, ' ')}</span>
                  <Badge variant="outline" className={getSeverityColor(hotspot.maxSeverity)}>
                    {hotspot.maxSeverity}
                  </Badge>
                </div>
                <p className="mt-2 text-2xl font-bold text-cyan-300">{hotspot.count}</p>
              </div>
            ))}
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-amber-200">Finance high-risk payouts</span>
                <Badge variant="outline" className="border-amber-500/40 text-amber-300">
                  {overview?.summary.finance_high_risk_payouts ?? 0}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-amber-100/80">Every payout above the risk threshold is now surfaced directly into the security shield.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityOverview;
