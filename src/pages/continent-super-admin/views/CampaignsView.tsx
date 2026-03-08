// ============================================
// CAMPAIGNS — META BUSINESS MANAGER STYLE
// ============================================
import { useState } from 'react';
import { 
  Megaphone, TrendingUp, Eye, MousePointer, 
  DollarSign, Plus, MoreHorizontal, Pause, Play,
  ArrowUpRight, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const mockCampaigns = [
  { id: '1', name: 'Q1 India Expansion', status: 'active', budget: '₹5L', spent: '₹3.2L', reach: '145K', clicks: '8.2K', conversions: 342, region: 'South Asia' },
  { id: '2', name: 'Africa Growth Drive', status: 'active', budget: '₹3L', spent: '₹1.8L', reach: '98K', clicks: '5.1K', conversions: 189, region: 'Africa' },
  { id: '3', name: 'EU Reseller Recruitment', status: 'paused', budget: '₹2L', spent: '₹2L', reach: '76K', clicks: '3.4K', conversions: 124, region: 'Europe' },
  { id: '4', name: 'Global Brand Awareness', status: 'active', budget: '₹8L', spent: '₹4.5L', reach: '320K', clicks: '18K', conversions: 567, region: 'Global' },
  { id: '5', name: 'LATAM Launch', status: 'draft', budget: '₹1.5L', spent: '₹0', reach: '0', clicks: '0', conversions: 0, region: 'South America' },
];

const CampaignsView = () => {
  const statusColors: Record<string, { color: string; bg: string }> = {
    active: { color: '#42b72a', bg: '#42b72a15' },
    paused: { color: '#f5a623', bg: '#f5a62315' },
    draft: { color: '#65676b', bg: '#65676b15' },
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1c1e21]">Campaigns</h1>
          <p className="text-[14px] text-[#65676b] mt-0.5">Manage growth campaigns across all regions</p>
        </div>
        <Button className="bg-[#42b72a] hover:bg-[#36a420] text-white text-[13px] font-medium h-9 px-4 rounded-md">
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Reach', value: '639K', icon: Eye, color: '#1877F2' },
          { label: 'Total Clicks', value: '34.7K', icon: MousePointer, color: '#42b72a' },
          { label: 'Conversions', value: '1,222', icon: TrendingUp, color: '#8b5cf6' },
          { label: 'Total Spend', value: '₹11.5L', icon: DollarSign, color: '#f5a623' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border border-[#dddfe2] p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-[20px] font-bold text-[#1c1e21]">{stat.value}</p>
              <p className="text-[12px] text-[#65676b]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign List */}
      <div className="bg-white rounded-lg border border-[#dddfe2] overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#e4e6eb] text-[12px] text-[#65676b] font-semibold uppercase tracking-wider">
          <div className="col-span-3">Campaign</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Budget / Spent</div>
          <div className="col-span-2">Reach / Clicks</div>
          <div className="col-span-2">Conversions</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {mockCampaigns.map((campaign, i) => {
          const config = statusColors[campaign.status];
          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-[#f7f8fa] transition-colors ${
                i < mockCampaigns.length - 1 ? 'border-b border-[#f0f2f5]' : ''
              }`}
            >
              <div className="col-span-3">
                <p className="text-[14px] font-medium text-[#1c1e21]">{campaign.name}</p>
                <p className="text-[12px] text-[#65676b]">{campaign.region}</p>
              </div>
              <div className="col-span-1">
                <span 
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium capitalize"
                  style={{ backgroundColor: config.bg, color: config.color }}
                >
                  {campaign.status}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-[13px] text-[#1c1e21]">{campaign.budget}</p>
                <p className="text-[11px] text-[#65676b]">Spent: {campaign.spent}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[13px] text-[#1c1e21]">{campaign.reach}</p>
                <p className="text-[11px] text-[#65676b]">{campaign.clicks} clicks</p>
              </div>
              <div className="col-span-2">
                <p className="text-[18px] font-bold text-[#1c1e21]">{campaign.conversions}</p>
              </div>
              <div className="col-span-2 flex items-center justify-end gap-1">
                {campaign.status === 'active' && (
                  <button 
                    onClick={() => toast.info(`Pausing ${campaign.name}...`)}
                    className="p-2 rounded hover:bg-[#e4e6eb] transition-colors"
                  >
                    <Pause className="w-4 h-4 text-[#65676b]" />
                  </button>
                )}
                {campaign.status === 'paused' && (
                  <button 
                    onClick={() => toast.info(`Resuming ${campaign.name}...`)}
                    className="p-2 rounded hover:bg-[#e4e6eb] transition-colors"
                  >
                    <Play className="w-4 h-4 text-[#42b72a]" />
                  </button>
                )}
                <button className="p-2 rounded hover:bg-[#e4e6eb] transition-colors">
                  <BarChart3 className="w-4 h-4 text-[#65676b]" />
                </button>
                <button className="p-2 rounded hover:bg-[#e4e6eb] transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-[#65676b]" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignsView;
