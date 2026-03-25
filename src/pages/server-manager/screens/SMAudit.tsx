import { Eye, Lock, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const auditLogs = [
  { time: '2024-12-25 14:32:15', action: 'Server Restart', actor: 'SRV-MGR-001', result: 'Approved', details: 'PROD-IN-01 restart requested' },
  { time: '2024-12-25 14:28:00', action: 'Backup Triggered', actor: 'SRV-MGR-001', result: 'Success', details: 'Manual backup for DB-MAIN-01' },
  { time: '2024-12-25 14:15:30', action: 'Patch Applied', actor: 'SRV-MGR-002', result: 'Success', details: 'Security patch v2.4.2 on PROD-US-01' },
  { time: '2024-12-25 13:45:00', action: 'Incident Escalated', actor: 'SRV-MGR-001', result: 'Escalated', details: 'INC-003 escalated to Super Admin' },
  { time: '2024-12-25 13:30:00', action: 'Service Restart', actor: 'SRV-MGR-003', result: 'Denied', details: 'Auth Service restart - insufficient approval' },
  { time: '2024-12-25 12:00:00', action: 'Maintenance Scheduled', actor: 'SRV-MGR-001', result: 'Pending', details: 'DB maintenance window MW-001' },
  { time: '2024-12-25 11:30:00', action: 'Alert Acknowledged', actor: 'SRV-MGR-002', result: 'Success', details: 'High CPU alert on PROD-IN-01' },
  { time: '2024-12-25 10:15:00', action: 'Restore Requested', actor: 'SRV-MGR-001', result: 'Pending', details: 'Config restore from RP-002' },
];

const SMAudit = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-stone-800">Audit</h2>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Read Only
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Lock className="w-3 h-3" />
          <span>Immutable logs</span>
        </div>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Audit logs are immutable and cannot be modified or deleted. All server actions are logged permanently.
        </p>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Time</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Action</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Actor</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Result</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log, idx) => (
              <tr 
                key={idx}
                className={`border-b border-stone-50 hover:bg-stone-50 transition-colors ${idx === auditLogs.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="px-6 py-4 text-stone-500 font-mono text-sm whitespace-nowrap">{log.time}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-stone-800">{log.action}</p>
                    <p className="text-xs text-stone-500">{log.details}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-stone-600 font-mono text-sm">{log.actor}</td>
                <td className="px-6 py-4">
                  <Badge className={
                    log.result === 'Success' || log.result === 'Approved' ? 'bg-green-100 text-green-700' :
                    log.result === 'Denied' ? 'bg-red-100 text-red-700' :
                    log.result === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }>
                    {log.result}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-stone-500">Read-only view — Audit logs cannot be modified or exported</p>
    </div>
  );
};

export default SMAudit;
