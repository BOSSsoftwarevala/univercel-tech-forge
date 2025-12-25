import { Clock, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const uptimeData = [
  { service: 'API Gateway', uptime: 99.99, sla: 99.9, status: 'ok' },
  { service: 'Auth Service', uptime: 99.97, sla: 99.9, status: 'ok' },
  { service: 'Database', uptime: 99.95, sla: 99.9, status: 'ok' },
  { service: 'AI Inference', uptime: 98.50, sla: 99.0, status: 'breach' },
  { service: 'Cache Layer', uptime: 99.99, sla: 99.5, status: 'ok' },
];

const breachHistory = [
  { date: '2024-12-20', service: 'AI Inference', duration: '45 min', reason: 'GPU memory overflow' },
  { date: '2024-12-15', service: 'Database', duration: '12 min', reason: 'Failover triggered' },
  { date: '2024-12-10', service: 'API Gateway', duration: '5 min', reason: 'Certificate renewal' },
];

const SMUptime = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-stone-800">Uptime & SLA</h2>
      
      {/* Uptime Charts */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Service Uptime</h3>
        <div className="space-y-4">
          {uptimeData.map((item) => (
            <div key={item.service} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-stone-700">{item.service}</div>
              <div className="flex-1">
                <div className="h-6 bg-stone-100 rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full rounded-full ${item.status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${item.uptime}%` }}
                  />
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-stone-400"
                    style={{ left: `${item.sla}%` }}
                  />
                </div>
              </div>
              <div className="w-20 text-right">
                <span className={`text-sm font-bold ${item.status === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.uptime}%
                </span>
              </div>
              <div className="w-16 text-right text-xs text-stone-500">
                SLA: {item.sla}%
              </div>
              {item.status === 'breach' && (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SLA Thresholds */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl shadow-sm border border-stone-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-stone-400" />
            <span className="text-sm text-stone-500">Critical SLA</span>
          </div>
          <p className="text-2xl font-bold text-stone-800">99.9%</p>
          <p className="text-xs text-green-600 mt-1">All services meeting</p>
        </div>
        <div className="p-5 bg-white rounded-xl shadow-sm border border-stone-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-stone-500">Avg Uptime</span>
          </div>
          <p className="text-2xl font-bold text-stone-800">99.68%</p>
          <p className="text-xs text-stone-500 mt-1">Last 30 days</p>
        </div>
        <div className="p-5 bg-white rounded-xl shadow-sm border border-stone-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <span className="text-sm text-stone-500">SLA Breaches</span>
          </div>
          <p className="text-2xl font-bold text-stone-800">3</p>
          <p className="text-xs text-stone-500 mt-1">This month</p>
        </div>
      </div>

      {/* Breach History */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Breach History</h3>
        <div className="space-y-3">
          {breachHistory.map((breach, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-stone-50 rounded-lg">
              <div className="w-24 text-sm text-stone-500">{breach.date}</div>
              <div className="w-32 font-medium text-stone-700">{breach.service}</div>
              <div className="w-20 text-sm text-red-600">{breach.duration}</div>
              <div className="flex-1 text-sm text-stone-600">{breach.reason}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-stone-500">Read-only view — No actions available</p>
    </div>
  );
};

export default SMUptime;
