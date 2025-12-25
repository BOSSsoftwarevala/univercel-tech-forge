import { Server, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const servers = [
  { id: 'SRV-001', name: 'PROD-US-01', region: 'US East', status: 'active', cpu: 45, ram: 72, disk: 48, lastCheck: '2 min ago' },
  { id: 'SRV-002', name: 'PROD-EU-01', region: 'EU West', status: 'active', cpu: 38, ram: 65, disk: 52, lastCheck: '1 min ago' },
  { id: 'SRV-003', name: 'PROD-IN-01', region: 'India', status: 'warning', cpu: 82, ram: 78, disk: 61, lastCheck: '30 sec ago' },
  { id: 'SRV-004', name: 'DB-MAIN-01', region: 'US East', status: 'active', cpu: 35, ram: 82, disk: 75, lastCheck: '1 min ago' },
  { id: 'SRV-005', name: 'AI-GPU-01', region: 'US West', status: 'maintenance', cpu: 0, ram: 0, disk: 45, lastCheck: '5 min ago' },
  { id: 'SRV-006', name: 'BACKUP-01', region: 'EU North', status: 'active', cpu: 12, ram: 25, disk: 88, lastCheck: '2 min ago' },
];

const SMServers = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-stone-800">Servers</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Server ID</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Region</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">CPU</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">RAM</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Disk</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Last Check</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {servers.map((server, idx) => (
              <tr 
                key={server.id}
                className={`border-b border-stone-50 hover:bg-stone-50 transition-colors ${idx === servers.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-stone-800">{server.id}</p>
                    <p className="text-xs text-stone-500">{server.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-stone-600">{server.region}</td>
                <td className="px-6 py-4">
                  <Badge className={
                    server.status === 'active' ? 'bg-green-100 text-green-700' :
                    server.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                    'bg-stone-100 text-stone-600'
                  }>
                    {server.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className={server.cpu > 80 ? 'text-red-600 font-medium' : 'text-stone-600'}>
                    {server.cpu}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={server.ram > 80 ? 'text-red-600 font-medium' : 'text-stone-600'}>
                    {server.ram}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={server.disk > 80 ? 'text-amber-600 font-medium' : 'text-stone-600'}>
                    {server.disk}%
                  </span>
                </td>
                <td className="px-6 py-4 text-stone-500 text-sm">{server.lastCheck}</td>
                <td className="px-6 py-4">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SMServers;
