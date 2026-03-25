import { FileText, TrendingUp, Clock, CheckCircle, Lock } from 'lucide-react';

const healthMetrics = [
  { label: 'Overall Health', value: '98.5%', trend: '+0.3%', status: 'good' },
  { label: 'Avg Response Time', value: '45ms', trend: '-5ms', status: 'good' },
  { label: 'Error Rate', value: '0.02%', trend: '-0.01%', status: 'good' },
  { label: 'Throughput', value: '12.4k/s', trend: '+1.2k', status: 'good' },
];

const incidentMetrics = [
  { period: 'Today', incidents: 3, mttr: '15 min', resolved: 2 },
  { period: 'This Week', incidents: 12, mttr: '22 min', resolved: 11 },
  { period: 'This Month', incidents: 34, mttr: '28 min', resolved: 32 },
];

const slaCompliance = [
  { service: 'API Gateway', target: '99.9%', actual: '99.97%', status: 'compliant' },
  { service: 'Database', target: '99.9%', actual: '99.95%', status: 'compliant' },
  { service: 'Auth Service', target: '99.9%', actual: '99.92%', status: 'compliant' },
  { service: 'AI Inference', target: '99.0%', actual: '98.50%', status: 'breach' },
];

const SMReports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-800">Reports</h2>
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Lock className="w-3 h-3" />
          <span>No export · No copy</span>
        </div>
      </div>

      {/* Health Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Daily Infrastructure Health</h3>
        <div className="grid grid-cols-4 gap-4">
          {healthMetrics.map((metric) => (
            <div key={metric.label} className="p-4 bg-stone-50 rounded-lg">
              <p className="text-sm text-stone-500 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-stone-800">{metric.value}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                {metric.trend} vs yesterday
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Incident MTTR */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Incident MTTR (Mean Time to Resolve)</h3>
        <div className="grid grid-cols-3 gap-4">
          {incidentMetrics.map((metric) => (
            <div key={metric.period} className="p-4 border border-stone-100 rounded-lg">
              <p className="text-sm text-stone-500 mb-2">{metric.period}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-600">Total Incidents</span>
                  <span className="font-semibold text-stone-800">{metric.incidents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Avg MTTR</span>
                  <span className="font-semibold text-stone-800">{metric.mttr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Resolved</span>
                  <span className="font-semibold text-green-600">{metric.resolved}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SLA Compliance */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h3 className="text-lg font-semibold text-stone-800">SLA Compliance Report</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Service</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Target SLA</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Actual</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-stone-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {slaCompliance.map((item, idx) => (
              <tr key={item.service} className={`border-b border-stone-50 ${idx === slaCompliance.length - 1 ? 'border-b-0' : ''}`}>
                <td className="px-6 py-4 font-medium text-stone-800">{item.service}</td>
                <td className="px-6 py-4 text-stone-600">{item.target}</td>
                <td className="px-6 py-4">
                  <span className={item.status === 'compliant' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {item.actual}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {item.status === 'compliant' ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Compliant
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 text-sm">
                      ⚠️ Breach
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
        <p className="text-xs text-amber-700">
          ❌ <strong>Export disabled</strong> · ❌ <strong>Copy disabled</strong> — Reports are view-only
        </p>
      </div>
    </div>
  );
};

export default SMReports;
