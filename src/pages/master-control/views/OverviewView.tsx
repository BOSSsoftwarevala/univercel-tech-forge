import { Globe2, Users, AlertTriangle, Shield, TrendingUp, TrendingDown, Award, Code, Store, Megaphone, MapPin, Building2 } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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

const topPerformers = {
  sellers: [
    { rank: 1, name: 'Rahul Sharma', region: 'India', sales: '₹45.2L', growth: '+28%' },
    { rank: 2, name: 'John Miller', region: 'USA', sales: '$52K', growth: '+22%' },
    { rank: 3, name: 'Ahmed Hassan', region: 'UAE', sales: 'AED 180K', growth: '+18%' },
  ],
  leads: [
    { rank: 1, name: 'Priya Patel', region: 'India', leads: '342', conversion: '68%' },
    { rank: 2, name: 'Sarah Chen', region: 'Singapore', leads: '289', conversion: '72%' },
    { rank: 3, name: 'Maria Garcia', region: 'Spain', leads: '256', conversion: '65%' },
  ],
  developers: [
    { rank: 1, name: 'Alex Kumar', region: 'India', tasks: '156', rating: '4.9' },
    { rank: 2, name: 'David Lee', region: 'Korea', tasks: '142', rating: '4.8' },
    { rank: 3, name: 'Emma Wilson', region: 'UK', tasks: '128', rating: '4.9' },
  ],
  resellers: [
    { rank: 1, name: 'Tech Solutions Ltd', region: 'India', revenue: '₹2.1Cr', clients: '45' },
    { rank: 2, name: 'Global IT Partners', region: 'USA', revenue: '$280K', clients: '38' },
    { rank: 3, name: 'DigiWorld GmbH', region: 'Germany', revenue: '€195K', clients: '32' },
  ],
};

const branchLocations = [
  { name: 'Mumbai HQ', coordinates: [72.8777, 19.0760] as [number, number], type: 'hq', sales: 'high' },
  { name: 'Delhi Branch', coordinates: [77.1025, 28.7041] as [number, number], type: 'branch', sales: 'high' },
  { name: 'Bangalore', coordinates: [77.5946, 12.9716] as [number, number], type: 'franchise', sales: 'high' },
  { name: 'New York', coordinates: [-74.006, 40.7128] as [number, number], type: 'branch', sales: 'medium' },
  { name: 'London', coordinates: [-0.1276, 51.5074] as [number, number], type: 'franchise', sales: 'medium' },
  { name: 'Dubai', coordinates: [55.2708, 25.2048] as [number, number], type: 'branch', sales: 'high' },
  { name: 'Singapore', coordinates: [103.8198, 1.3521] as [number, number], type: 'franchise', sales: 'medium' },
  { name: 'Sydney', coordinates: [151.2093, -33.8688] as [number, number], type: 'branch', sales: 'low' },
  { name: 'Tokyo', coordinates: [139.6917, 35.6895] as [number, number], type: 'franchise', sales: 'medium' },
  { name: 'São Paulo', coordinates: [-46.6333, -23.5505] as [number, number], type: 'branch', sales: 'low' },
  { name: 'Johannesburg', coordinates: [28.0473, -26.2041] as [number, number], type: 'franchise', sales: 'low' },
  { name: 'Frankfurt', coordinates: [8.6821, 50.1109] as [number, number], type: 'branch', sales: 'medium' },
];

const getMarkerColor = (sales: string) => {
  switch (sales) {
    case 'high': return '#10b981';
    case 'medium': return '#f59e0b';
    case 'low': return '#ef4444';
    default: return '#6b7280';
  }
};

const getMarkerSize = (type: string) => {
  switch (type) {
    case 'hq': return 10;
    case 'branch': return 7;
    case 'franchise': return 5;
    default: return 5;
  }
};

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

      {/* Section B: Top Performers Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-5">Top Performers This Month</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Top Sellers */}
          <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Store className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white">Top Sellers</h3>
            </div>
            <div className="space-y-3">
              {topPerformers.sellers.map((seller) => (
                <div key={seller.rank} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    seller.rank === 1 ? 'bg-yellow-500 text-black' : 
                    seller.rank === 2 ? 'bg-gray-400 text-black' : 'bg-amber-700 text-white'
                  }`}>
                    {seller.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{seller.name}</p>
                    <p className="text-xs text-gray-500">{seller.region}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-400">{seller.sales}</p>
                    <p className="text-xs text-emerald-500">{seller.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Leads */}
          <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white">Top Lead Generators</h3>
            </div>
            <div className="space-y-3">
              {topPerformers.leads.map((lead) => (
                <div key={lead.rank} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    lead.rank === 1 ? 'bg-yellow-500 text-black' : 
                    lead.rank === 2 ? 'bg-gray-400 text-black' : 'bg-amber-700 text-white'
                  }`}>
                    {lead.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.region}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-400">{lead.leads} leads</p>
                    <p className="text-xs text-blue-500">{lead.conversion} conv.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Developers */}
          <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white">Top Developers</h3>
            </div>
            <div className="space-y-3">
              {topPerformers.developers.map((dev) => (
                <div key={dev.rank} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    dev.rank === 1 ? 'bg-yellow-500 text-black' : 
                    dev.rank === 2 ? 'bg-gray-400 text-black' : 'bg-amber-700 text-white'
                  }`}>
                    {dev.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{dev.name}</p>
                    <p className="text-xs text-gray-500">{dev.region}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-purple-400">{dev.tasks} tasks</p>
                    <p className="text-xs text-purple-500">⭐ {dev.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Resellers */}
          <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-orange-400" />
              </div>
              <h3 className="font-semibold text-white">Top Resellers</h3>
            </div>
            <div className="space-y-3">
              {topPerformers.resellers.map((reseller) => (
                <div key={reseller.rank} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    reseller.rank === 1 ? 'bg-yellow-500 text-black' : 
                    reseller.rank === 2 ? 'bg-gray-400 text-black' : 'bg-amber-700 text-white'
                  }`}>
                    {reseller.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{reseller.name}</p>
                    <p className="text-xs text-gray-500">{reseller.region}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-orange-400">{reseller.revenue}</p>
                    <p className="text-xs text-orange-500">{reseller.clients} clients</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section C: World Map with Branches */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-5">Global Network Overview</h2>
        <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-5">
          <div className="flex flex-wrap gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-gray-400">High Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-gray-400">Medium Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-400">Low Sales</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">HQ</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">Branch</span>
            </div>
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">Franchise</span>
            </div>
          </div>
          
          <div className="relative h-[400px] bg-[#0f0f1a] rounded-lg overflow-hidden">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 120,
                center: [20, 20]
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1e293b"
                      stroke="#334155"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: '#334155', outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>
              {branchLocations.map((location) => (
                <Marker key={location.name} coordinates={location.coordinates}>
                  <circle
                    r={getMarkerSize(location.type)}
                    fill={getMarkerColor(location.sales)}
                    stroke="#fff"
                    strokeWidth={1}
                    style={{ cursor: 'pointer' }}
                  />
                  <title>{`${location.name} (${location.type}) - ${location.sales} sales`}</title>
                </Marker>
              ))}
            </ComposableMap>
          </div>

          {/* Location Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-[#0f0f1a] rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">1</p>
              <p className="text-xs text-gray-400">Headquarters</p>
            </div>
            <div className="bg-[#0f0f1a] rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">6</p>
              <p className="text-xs text-gray-400">Branches</p>
            </div>
            <div className="bg-[#0f0f1a] rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">5</p>
              <p className="text-xs text-gray-400">Franchises</p>
            </div>
            <div className="bg-[#0f0f1a] rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">4</p>
              <p className="text-xs text-gray-400">High Performers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section D: Continent Snapshot Table */}
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
