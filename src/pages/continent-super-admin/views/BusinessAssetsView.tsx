// ============================================
// BUSINESS ASSETS — META BUSINESS MANAGER STYLE
// Franchises, Resellers, and operational assets
// ============================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Store, Globe2, TrendingUp, Search, 
  Plus, MoreHorizontal, ChevronRight, ExternalLink,
  CheckCircle2, Clock, AlertTriangle, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const assetTabs = ['All Assets', 'Franchises', 'Resellers', 'Products', 'Campaigns'] as const;

const mockAssets = [
  { id: '1', name: 'India Premium Franchise', type: 'Franchise', region: 'South Asia', status: 'active', revenue: '₹8.2L', owners: 4, created: '2024-06' },
  { id: '2', name: 'Nigeria Growth Pack', type: 'Franchise', region: 'West Africa', status: 'active', revenue: '₹4.1L', owners: 2, created: '2024-08' },
  { id: '3', name: 'EU Reseller Network', type: 'Reseller', region: 'Europe', status: 'active', revenue: '₹3.2L', owners: 8, created: '2024-04' },
  { id: '4', name: 'LATAM Expansion', type: 'Franchise', region: 'South America', status: 'pending', revenue: '₹0', owners: 1, created: '2025-02' },
  { id: '5', name: 'APAC Reseller Group', type: 'Reseller', region: 'Asia Pacific', status: 'active', revenue: '₹5.7L', owners: 12, created: '2024-03' },
  { id: '6', name: 'US Enterprise Franchise', type: 'Franchise', region: 'North America', status: 'active', revenue: '₹3.8L', owners: 3, created: '2024-07' },
];

const BusinessAssetsView = () => {
  const [activeTab, setActiveTab] = useState<string>('All Assets');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockAssets.filter(a => {
    if (activeTab !== 'All Assets' && !a.type.toLowerCase().includes(activeTab.toLowerCase().slice(0, -1))) return false;
    if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const typeColors: Record<string, string> = {
    Franchise: '#1877F2',
    Reseller: '#42b72a',
    Product: '#8b5cf6',
    Campaign: '#f5a623',
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1c1e21]">Business Assets</h1>
          <p className="text-[14px] text-[#65676b] mt-0.5">Manage franchises, reseller networks, and business resources</p>
        </div>
        <Button 
          onClick={() => toast.info('Asset creation — coming soon')}
          className="bg-[#1877F2] hover:bg-[#166fe5] text-white text-[13px] font-medium h-9 px-4 rounded-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Franchises', value: '4,890', icon: Building2, color: '#1877F2' },
          { label: 'Total Resellers', value: '12,130', icon: Store, color: '#42b72a' },
          { label: 'Active Products', value: '48', icon: Star, color: '#8b5cf6' },
          { label: 'Active Campaigns', value: '24', icon: TrendingUp, color: '#f5a623' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border border-[#dddfe2] p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-[22px] font-bold text-[#1c1e21]">{stat.value}</p>
              <p className="text-[12px] text-[#65676b]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-[#dddfe2]">
        {assetTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-[14px] transition-colors relative ${
              activeTab === tab 
                ? 'text-[#1877F2] font-semibold' 
                : 'text-[#65676b] hover:text-[#1c1e21]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="assetTab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1877F2] rounded-t-full" />
            )}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#dddfe2] rounded-lg mb-1">
          <Search className="w-3.5 h-3.5 text-[#65676b]" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-[13px] text-[#1c1e21] placeholder:text-[#bec3c9] outline-none w-40"
          />
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((asset, i) => {
          const color = typeColors[asset.type] || '#65676b';
          return (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-lg border border-[#dddfe2] p-5 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                    {asset.type === 'Franchise' ? (
                      <Building2 className="w-5 h-5" style={{ color }} />
                    ) : (
                      <Store className="w-5 h-5" style={{ color }} />
                    )}
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-[#1c1e21]">{asset.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${color}15`, color }}>
                        {asset.type}
                      </span>
                      <span className="text-[12px] text-[#65676b]">{asset.region}</span>
                    </div>
                  </div>
                </div>
                <button className="p-1.5 rounded hover:bg-[#f0f2f5] transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="w-4 h-4 text-[#65676b]" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#f0f2f5]">
                <div>
                  <p className="text-[12px] text-[#65676b]">Revenue</p>
                  <p className="text-[14px] font-semibold text-[#1c1e21]">{asset.revenue}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#65676b]">Members</p>
                  <p className="text-[14px] font-semibold text-[#1c1e21]">{asset.owners}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#65676b]">Status</p>
                  <p className={`text-[14px] font-semibold ${asset.status === 'active' ? 'text-[#42b72a]' : 'text-[#f5a623]'}`}>
                    {asset.status === 'active' ? 'Active' : 'Pending'}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessAssetsView;
