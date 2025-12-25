import { AlertTriangle, CheckCircle, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const incidents = [
  { id: 'INC-001', type: 'High CPU', severity: 'warning', affected: 'PROD-IN-01', status: 'open', time: '15 min ago' },
  { id: 'INC-002', type: 'Disk Full', severity: 'critical', affected: 'DB-MAIN-01', status: 'acknowledged', time: '1 hour ago' },
  { id: 'INC-003', type: 'Service Down', severity: 'critical', affected: 'AI-GPU-01', status: 'in_progress', time: '2 hours ago' },
  { id: 'INC-004', type: 'Memory Leak', severity: 'warning', affected: 'PROD-EU-01', status: 'open', time: '30 min ago' },
  { id: 'INC-005', type: 'Network Latency', severity: 'info', affected: 'BACKUP-01', status: 'resolved', time: '3 hours ago' },
];

const SMIncidents = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-stone-800">Incidents</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
          <p className="text-sm text-red-600">Critical</p>
          <p className="text-2xl font-bold text-red-700">2</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-sm text-amber-600">Warning</p>
          <p className="text-2xl font-bold text-amber-700">2</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-600">Info</p>
          <p className="text-2xl font-bold text-blue-700">1</p>
        </div>
        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
          <p className="text-sm text-green-600">Resolved Today</p>
          <p className="text-2xl font-bold text-green-700">1</p>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Incident ID</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Type</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Severity</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Affected</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident, idx) => (
              <tr 
                key={incident.id}
                className={`border-b border-stone-50 hover:bg-stone-50 transition-colors ${idx === incidents.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-stone-800">{incident.id}</p>
                    <p className="text-xs text-stone-500">{incident.time}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-stone-700">{incident.type}</td>
                <td className="px-6 py-4">
                  <Badge className={
                    incident.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    incident.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }>
                    {incident.severity}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-stone-600 font-mono text-sm">{incident.affected}</td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className={
                    incident.status === 'resolved' ? 'border-green-300 text-green-700' :
                    incident.status === 'in_progress' ? 'border-blue-300 text-blue-700' :
                    'border-stone-300 text-stone-600'
                  }>
                    {incident.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {incident.status !== 'resolved' && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Acknowledge
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        Escalate
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-stone-500">⚠️ Critical incident resolution requires approval</p>
    </div>
  );
};

export default SMIncidents;
