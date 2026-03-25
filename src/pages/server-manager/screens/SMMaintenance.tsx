import { Calendar, Clock, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const maintenanceWindows = [
  { 
    id: 'MW-001', 
    title: 'Database Maintenance', 
    scheduled: '2024-12-28 02:00 - 04:00 UTC',
    affected: ['DB-MAIN-01', 'DB-REPLICA-01'],
    impact: 'Database unavailable',
    status: 'scheduled'
  },
  { 
    id: 'MW-002', 
    title: 'Security Patch Deployment', 
    scheduled: '2024-12-30 03:00 - 05:00 UTC',
    affected: ['All Production Servers'],
    impact: 'Rolling restart',
    status: 'pending_approval'
  },
  { 
    id: 'MW-003', 
    title: 'Network Upgrade', 
    scheduled: '2025-01-05 01:00 - 06:00 UTC',
    affected: ['EU Region'],
    impact: 'EU traffic rerouted',
    status: 'scheduled'
  },
];

const rollingUpdates = [
  { component: 'API Gateway', current: 'v2.4.1', target: 'v2.4.2', servers: 12, progress: 75 },
  { component: 'Auth Service', current: 'v1.8.0', target: 'v1.8.1', servers: 8, progress: 100 },
  { component: 'Cache Layer', current: 'v3.2.0', target: 'v3.2.1', servers: 6, progress: 0 },
];

const SMMaintenance = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-800">Maintenance</h2>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Schedule Maintenance
        </Button>
      </div>
      
      {/* Planned Windows */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Planned Maintenance Windows</h3>
        <div className="space-y-4">
          {maintenanceWindows.map((window) => (
            <div key={window.id} className="p-4 border border-stone-100 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-stone-500">{window.id}</span>
                    <h4 className="font-semibold text-stone-800">{window.title}</h4>
                    <Badge className={
                      window.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }>
                      {window.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-stone-500">Scheduled</p>
                      <p className="text-stone-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {window.scheduled}
                      </p>
                    </div>
                    <div>
                      <p className="text-stone-500">Affected</p>
                      <p className="text-stone-700">{window.affected.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-stone-500">Impact</p>
                      <p className="text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {window.impact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rolling Updates Plan */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Rolling Updates Plan</h3>
        <div className="space-y-4">
          {rollingUpdates.map((update) => (
            <div key={update.component} className="p-4 border border-stone-100 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-stone-800">{update.component}</h4>
                  <p className="text-sm text-stone-500">
                    {update.current} → {update.target} · {update.servers} servers
                  </p>
                </div>
                <Badge className={
                  update.progress === 100 ? 'bg-green-100 text-green-700' :
                  update.progress === 0 ? 'bg-stone-100 text-stone-600' :
                  'bg-blue-100 text-blue-700'
                }>
                  {update.progress === 100 ? 'Complete' : update.progress === 0 ? 'Pending' : 'In Progress'}
                </Badge>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    update.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${update.progress}%` }}
                />
              </div>
              <p className="text-xs text-stone-500 mt-2">{update.progress}% complete</p>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Preview */}
      <div className="bg-amber-50 rounded-xl border border-amber-100 p-6">
        <h3 className="text-lg font-semibold text-amber-800 mb-2">Impact Preview</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Next maintenance: Dec 28 — Database will be unavailable for 2 hours</li>
          <li>• Affected regions: US East, EU West</li>
          <li>• Recommended: Schedule non-critical deployments after maintenance</li>
        </ul>
      </div>

      <p className="text-xs text-stone-500">⚠️ Schedule Maintenance requires approval</p>
    </div>
  );
};

export default SMMaintenance;
