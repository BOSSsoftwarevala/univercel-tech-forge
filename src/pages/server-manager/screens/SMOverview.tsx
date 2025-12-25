import { Server, Activity, Clock, AlertTriangle, Cpu, HardDrive, Gauge } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const stats = [
  { label: 'Total Servers', value: '47', icon: Server },
  { label: 'Services Running', value: '156', icon: Activity },
  { label: 'Uptime', value: '99.97%', icon: Clock },
  { label: 'Open Incidents', value: '3', icon: AlertTriangle },
];

const resourceData = [
  { label: 'CPU', value: 42, color: 'bg-cyan-500' },
  { label: 'RAM', value: 68, color: 'bg-purple-500' },
  { label: 'Disk', value: 55, color: 'bg-orange-500' },
];

const SMOverview = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-stone-800">Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 bg-white rounded-xl shadow-sm border border-stone-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-stone-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-stone-800">{stat.value}</p>
              </div>
              <div className="w-10 h-10 bg-stone-50 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-stone-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resource Heatmap */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Resource Heatmap</h3>
        <div className="grid grid-cols-3 gap-6">
          {resourceData.map((res) => (
            <div key={res.label} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-stone-600">{res.label}</span>
                <span className="text-sm font-bold text-stone-800">{res.value}%</span>
              </div>
              <div className="h-4 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${res.color} rounded-full transition-all`}
                  style={{ width: `${res.value}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-stone-400">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-stone-500">Read-only overview — No actions available</p>
    </div>
  );
};

export default SMOverview;
