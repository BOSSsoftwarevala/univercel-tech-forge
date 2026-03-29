import { RefreshCw, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const services = [
  { name: 'API Gateway', server: 'PROD-US-01', status: 'running', port: 443, restart: 'always' },
  { name: 'Auth Service', server: 'PROD-US-01', status: 'running', port: 8080, restart: 'always' },
  { name: 'Database Primary', server: 'DB-MAIN-01', status: 'running', port: 5432, restart: 'always' },
  { name: 'Redis Cache', server: 'PROD-EU-01', status: 'running', port: 6379, restart: 'on-failure' },
  { name: 'AI Inference', server: 'AI-GPU-01', status: 'stopped', port: 8000, restart: 'manual' },
  { name: 'Backup Agent', server: 'BACKUP-01', status: 'running', port: 9000, restart: 'always' },
  { name: 'Log Collector', server: 'PROD-IN-01', status: 'warning', port: 5044, restart: 'on-failure' },
];

const SMServices = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-stone-800">Services</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Service Name</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Server</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Port</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Restart Policy</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, idx) => (
              <tr 
                key={service.name}
                className={`border-b border-stone-50 hover:bg-stone-50 transition-colors ${idx === services.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="px-6 py-4 font-medium text-stone-800">{service.name}</td>
                <td className="px-6 py-4 text-stone-600">{service.server}</td>
                <td className="px-6 py-4">
                  <Badge className={
                    service.status === 'running' ? 'bg-green-100 text-green-700' :
                    service.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }>
                    {service.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-stone-600 font-mono text-sm">{service.port}</td>
                <td className="px-6 py-4 text-stone-500 text-sm">{service.restart}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Restart
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Activity className="w-3 h-3 mr-1" />
                      Health
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="text-xs text-stone-500">⚠️ Restart actions require approval</p>
    </div>
  );
};

export default SMServices;
