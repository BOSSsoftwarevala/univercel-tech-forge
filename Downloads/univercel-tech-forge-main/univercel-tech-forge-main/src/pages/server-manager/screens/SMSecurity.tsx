import { Shield, Eye, ArrowUpRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const firewallStatus = [
  { rule: 'Inbound HTTP/HTTPS', status: 'active', ports: '80, 443', action: 'Allow' },
  { rule: 'SSH Access', status: 'active', ports: '22', action: 'Allow (IP restricted)' },
  { rule: 'Database Port', status: 'active', ports: '5432', action: 'Allow (Internal)' },
  { rule: 'Block All Other', status: 'active', ports: '*', action: 'Deny' },
];

const securityAlerts = [
  { id: 'SEC-001', type: 'Port Scan', source: '185.x.x.x', severity: 'high', time: '10 min ago', status: 'open' },
  { id: 'SEC-002', type: 'Failed SSH', source: '103.x.x.x', severity: 'medium', time: '1 hour ago', status: 'blocked' },
  { id: 'SEC-003', type: 'Intrusion Flag', source: '45.x.x.x', severity: 'critical', time: '2 hours ago', status: 'escalated' },
];

const patchStatus = [
  { server: 'PROD-US-01', os: 'Up to date', app: 'Up to date', lastPatched: '2024-12-20' },
  { server: 'PROD-EU-01', os: 'Up to date', app: '1 pending', lastPatched: '2024-12-18' },
  { server: 'DB-MAIN-01', os: 'Up to date', app: 'Up to date', lastPatched: '2024-12-22' },
  { server: 'AI-GPU-01', os: '2 pending', app: '1 pending', lastPatched: '2024-12-10' },
];

const SMSecurity = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-stone-800">Security</h2>
      
      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
          <Shield className="w-5 h-5 text-green-600 mb-2" />
          <p className="text-sm text-green-600">Firewall</p>
          <p className="text-lg font-bold text-green-700">Active</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
          <AlertTriangle className="w-5 h-5 text-amber-600 mb-2" />
          <p className="text-sm text-amber-600">Port Scan Alerts</p>
          <p className="text-lg font-bold text-amber-700">3</p>
        </div>
        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
          <AlertTriangle className="w-5 h-5 text-red-600 mb-2" />
          <p className="text-sm text-red-600">Intrusion Flags</p>
          <p className="text-lg font-bold text-red-700">1</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <CheckCircle className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-sm text-blue-600">Patch Status</p>
          <p className="text-lg font-bold text-blue-700">4 pending</p>
        </div>
      </div>

      {/* Firewall Status */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Firewall Rules</h3>
        <div className="space-y-2">
          {firewallStatus.map((rule) => (
            <div key={rule.rule} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-medium text-stone-700">{rule.rule}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-stone-500">Ports: {rule.ports}</span>
                <Badge variant="outline" className="text-stone-600">{rule.action}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h3 className="text-lg font-semibold text-stone-800">Security Alerts</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Alert ID</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Type</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Source</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Severity</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {securityAlerts.map((alert, idx) => (
              <tr key={alert.id} className={`border-b border-stone-50 ${idx === securityAlerts.length - 1 ? 'border-b-0' : ''}`}>
                <td className="px-6 py-4 font-mono text-stone-800">{alert.id}</td>
                <td className="px-6 py-4 text-stone-700">{alert.type}</td>
                <td className="px-6 py-4 text-stone-600 font-mono">{alert.source}</td>
                <td className="px-6 py-4">
                  <Badge className={
                    alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-amber-100 text-amber-700'
                  }>
                    {alert.severity}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline">{alert.status}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Review
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      Escalate
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Patch Status */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Patch Status</h3>
        <div className="grid grid-cols-4 gap-4">
          {patchStatus.map((server) => (
            <div key={server.server} className="p-4 border border-stone-100 rounded-lg">
              <p className="font-medium text-stone-800 mb-2">{server.server}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">OS:</span>
                  <span className={server.os === 'Up to date' ? 'text-green-600' : 'text-amber-600'}>{server.os}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">App:</span>
                  <span className={server.app === 'Up to date' ? 'text-green-600' : 'text-amber-600'}>{server.app}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SMSecurity;
