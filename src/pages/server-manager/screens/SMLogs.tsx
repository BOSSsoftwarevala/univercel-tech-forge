import { FileText, Lock, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const logs = [
  { timestamp: '2024-12-25 14:32:15', server: 'PROD-US-01', service: 'API Gateway', level: 'info', message: 'Request processed successfully' },
  { timestamp: '2024-12-25 14:32:10', server: 'DB-MAIN-01', service: 'PostgreSQL', level: 'warn', message: 'Connection pool reaching limit (80%)' },
  { timestamp: '2024-12-25 14:32:05', server: 'PROD-IN-01', service: 'Auth Service', level: 'error', message: 'Failed to validate token: expired' },
  { timestamp: '2024-12-25 14:32:00', server: 'AI-GPU-01', service: 'Inference', level: 'info', message: 'Model loaded successfully' },
  { timestamp: '2024-12-25 14:31:55', server: 'PROD-EU-01', service: 'Cache', level: 'debug', message: 'Cache hit ratio: 94.2%' },
  { timestamp: '2024-12-25 14:31:50', server: 'BACKUP-01', service: 'Agent', level: 'info', message: 'Incremental backup started' },
  { timestamp: '2024-12-25 14:31:45', server: 'PROD-US-01', service: 'Load Balancer', level: 'warn', message: 'High traffic detected, scaling up' },
  { timestamp: '2024-12-25 14:31:40', server: 'DB-MAIN-01', service: 'PostgreSQL', level: 'error', message: 'Query timeout exceeded 30s' },
  { timestamp: '2024-12-25 14:31:35', server: 'PROD-IN-01', service: 'API Gateway', level: 'info', message: 'Health check passed' },
  { timestamp: '2024-12-25 14:31:30', server: 'PROD-EU-01', service: 'Auth Service', level: 'info', message: 'Session created for user' },
];

const SMLogs = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-800">Logs</h2>
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Lock className="w-3 h-3" />
          <span>No export · No copy</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <Input placeholder="Search logs..." className="w-64 h-9" />
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-stone-100">All</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-red-50 text-red-600 border-red-200">Error</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-amber-50 text-amber-600 border-amber-200">Warn</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-blue-50 text-blue-600 border-blue-200">Info</Badge>
        </div>
      </div>
      
      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Timestamp</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Server/Service</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Level</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr 
                key={idx}
                className={`border-b border-stone-50 hover:bg-stone-50 transition-colors ${idx === logs.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="px-6 py-3 text-stone-500 font-mono text-sm whitespace-nowrap">{log.timestamp}</td>
                <td className="px-6 py-3">
                  <div>
                    <p className="font-medium text-stone-700 text-sm">{log.server}</p>
                    <p className="text-xs text-stone-500">{log.service}</p>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <Badge className={
                    log.level === 'error' ? 'bg-red-100 text-red-700' :
                    log.level === 'warn' ? 'bg-amber-100 text-amber-700' :
                    log.level === 'debug' ? 'bg-stone-100 text-stone-600' :
                    'bg-blue-100 text-blue-700'
                  }>
                    {log.level}
                  </Badge>
                </td>
                <td className="px-6 py-3 text-stone-600 text-sm max-w-md truncate">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
        <p className="text-xs text-amber-700">
          ❌ <strong>Export disabled</strong> · ❌ <strong>Copy disabled</strong> — Logs are view-only for security compliance
        </p>
      </div>
    </div>
  );
};

export default SMLogs;
