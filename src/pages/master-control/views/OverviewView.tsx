import { Globe2, Users, AlertTriangle, Shield, TrendingUp, TrendingDown } from 'lucide-react';

const summaryCards = [
  { label: 'Total Continents', value: '6', icon: Globe2 },
  { label: 'Active Super Admins', value: '5', icon: Users },
  { label: 'Pending Critical Approvals', value: '12', icon: AlertTriangle },
  { label: 'Global Risk Level', value: 'Low', icon: Shield },
];

const continentData = [
  { name: 'Africa', admin: 'John Doe', countries: 12, trend: 'up' },
  { name: 'Asia', admin: 'Jane Smith', countries: 28, trend: 'up' },
  { name: 'Europe', admin: 'Hans Mueller', countries: 22, trend: 'down' },
  { name: 'North America', admin: 'Mike Johnson', countries: 8, trend: 'up' },
  { name: 'South America', admin: 'Carlos Rivera', countries: 10, trend: 'down' },
  { name: 'Oceania', admin: 'Sarah Williams', countries: 4, trend: 'up' },
];

const OverviewView = () => {
  return (
    <div className="space-y-8">
      {/* Section A: Global Summary Cards */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-5">Global Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <div 
              key={card.label} 
              className="p-5 bg-[#1a1a2e] rounded-xl border border-gray-800/50 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                </div>
                <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section B: Continent Snapshot Table */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-5">Continent Snapshot</h2>
        <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Continent Name</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Super Admin</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Active Countries</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue Trend</th>
                </tr>
              </thead>
              <tbody>
                {continentData.map((row, idx) => (
                  <tr 
                    key={row.name} 
                    className={`border-b border-gray-800/30 hover:bg-gray-800/30 cursor-pointer transition-colors ${
                      idx === continentData.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-white">{row.name}</td>
                    <td className="px-6 py-4 text-gray-400">{row.admin}</td>
                    <td className="px-6 py-4 text-gray-400">{row.countries}</td>
                    <td className="px-6 py-4">
                      {row.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-gray-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewView;
