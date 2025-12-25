import { Database, Play, RotateCcw, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const backupSchedules = [
  { name: 'Database Full', frequency: 'Daily', lastRun: '2024-12-25 02:00', status: 'success', nextRun: '2024-12-26 02:00' },
  { name: 'Database Incremental', frequency: 'Hourly', lastRun: '2024-12-25 14:00', status: 'success', nextRun: '2024-12-25 15:00' },
  { name: 'File Storage', frequency: 'Weekly', lastRun: '2024-12-22 03:00', status: 'success', nextRun: '2024-12-29 03:00' },
  { name: 'Config Snapshot', frequency: 'Daily', lastRun: '2024-12-25 01:00', status: 'failed', nextRun: '2024-12-26 01:00' },
  { name: 'Log Archive', frequency: 'Weekly', lastRun: '2024-12-20 04:00', status: 'success', nextRun: '2024-12-27 04:00' },
];

const restorePoints = [
  { id: 'RP-001', date: '2024-12-25 02:00', type: 'Full', size: '245 GB', retention: '30 days' },
  { id: 'RP-002', date: '2024-12-24 02:00', type: 'Full', size: '243 GB', retention: '30 days' },
  { id: 'RP-003', date: '2024-12-23 02:00', type: 'Full', size: '241 GB', retention: '30 days' },
];

const SMBackups = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-stone-800">Backups</h2>
      
      {/* Backup Schedules */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h3 className="text-lg font-semibold text-stone-800">Backup Schedules</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Backup Name</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Frequency</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Last Run</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Next Run</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {backupSchedules.map((backup, idx) => (
              <tr 
                key={backup.name}
                className={`border-b border-stone-50 hover:bg-stone-50 ${idx === backupSchedules.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="px-6 py-4 font-medium text-stone-800">{backup.name}</td>
                <td className="px-6 py-4 text-stone-600">{backup.frequency}</td>
                <td className="px-6 py-4 text-stone-500 text-sm">{backup.lastRun}</td>
                <td className="px-6 py-4">
                  {backup.status === 'success' ? (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Success
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700">
                      <XCircle className="w-3 h-3 mr-1" />
                      Failed
                    </Badge>
                  )}
                </td>
                <td className="px-6 py-4 text-stone-500 text-sm">{backup.nextRun}</td>
                <td className="px-6 py-4">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Play className="w-3 h-3 mr-1" />
                    Run Now
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Restore Points */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h3 className="text-lg font-semibold text-stone-800">Restore Points (Masked)</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Point ID</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Date</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Type</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Size</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Retention</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restorePoints.map((point, idx) => (
              <tr 
                key={point.id}
                className={`border-b border-stone-50 hover:bg-stone-50 ${idx === restorePoints.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="px-6 py-4 font-mono text-stone-800">{point.id}</td>
                <td className="px-6 py-4 text-stone-600">{point.date}</td>
                <td className="px-6 py-4 text-stone-600">{point.type}</td>
                <td className="px-6 py-4 text-stone-600">{point.size}</td>
                <td className="px-6 py-4 text-stone-500">{point.retention}</td>
                <td className="px-6 py-4">
                  <Button variant="outline" size="sm" className="text-xs">
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Request Restore
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-stone-500">⚠️ Run Backup and Restore actions require approval</p>
    </div>
  );
};

export default SMBackups;
