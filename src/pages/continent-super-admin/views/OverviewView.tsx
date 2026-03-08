// ============================================
// OVERVIEW — META BUSINESS MANAGER HOME
// ============================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe2, TrendingUp, AlertTriangle, Users, Loader2,
  ArrowUpRight, ArrowDownRight, Building2, Store, Target,
  CheckCircle2, Clock, DollarSign, Activity, ChevronRight,
  Zap, BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const OverviewView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ countries: 0, alerts: 0, managers: 0 });

  useEffect(() => {
    const fetch = async () => {
      try {
        const [countriesRes, alertsRes, managersRes] = await Promise.all([
          supabase.from('franchise_accounts').select('country').not('country', 'is', null),
          supabase.from('boss_alerts').select('id', { count: 'exact', head: true }).eq('is_resolved', false),
          supabase.from('area_manager_accounts').select('id', { count: 'exact', head: true }),
        ]);
        const uniqueCountries = new Set((countriesRes.data || []).map(f => f.country)).size;
        setData({
          countries: uniqueCountries,
          alerts: alertsRes.count || 0,
          managers: managersRes.count || 0,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const kpiCards = [
    { title: 'Active Regions', value: loading ? '—' : `${data.countries}`, change: '+3 this month', trend: 'up', icon: Globe2, color: '#1877F2' },
    { title: 'Total People', value: loading ? '—' : `${data.managers}`, change: '+12 added', trend: 'up', icon: Users, color: '#42b72a' },
    { title: 'Pending Actions', value: loading ? '—' : `${data.alerts}`, change: 'Requires attention', trend: data.alerts > 0 ? 'down' : 'up', icon: AlertTriangle, color: data.alerts > 0 ? '#e41e3f' : '#42b72a' },
    { title: 'Revenue (MTD)', value: '₹24.8L', change: '+18.3% vs last month', trend: 'up', icon: DollarSign, color: '#1877F2' },
  ];

  const recentActivity = [
    { action: 'New franchise approved', region: 'South Asia', time: '2m ago', type: 'approve' },
    { action: 'Country admin onboarded', region: 'West Africa', time: '15m ago', type: 'add' },
    { action: 'Reseller application received', region: 'Europe', time: '1h ago', type: 'request' },
    { action: 'Revenue milestone reached', region: 'North America', time: '3h ago', type: 'milestone' },
    { action: 'Risk alert resolved', region: 'Southeast Asia', time: '5h ago', type: 'resolve' },
  ];

  const quickActions = [
    { label: 'Review Requests', count: 12, icon: Clock, color: '#e41e3f' },
    { label: 'Onboard Admin', count: null, icon: Users, color: '#1877F2' },
    { label: 'View Reports', count: null, icon: BarChart3, color: '#42b72a' },
    { label: 'Manage Assets', count: 3, icon: Building2, color: '#f5a623' },
  ];

  const topRegions = [
    { name: 'India', flag: '🇮🇳', revenue: '₹8.2L', growth: '+22%', status: 'active' },
    { name: 'Nigeria', flag: '🇳🇬', revenue: '₹4.1L', growth: '+15%', status: 'active' },
    { name: 'USA', flag: '🇺🇸', revenue: '₹3.8L', growth: '+8%', status: 'active' },
    { name: 'Germany', flag: '🇩🇪', revenue: '₹2.9L', growth: '+12%', status: 'active' },
    { name: 'Brazil', flag: '🇧🇷', revenue: '₹2.1L', growth: '+31%', status: 'growing' },
  ];

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Page Header */}
      <div>
        <h1 className="text-[22px] font-bold text-[#1c1e21]">Business Overview</h1>
        <p className="text-[14px] text-[#65676b] mt-0.5">Your global business performance at a glance</p>
      </div>

      {/* KPI Cards — Meta Style */}
      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-lg border border-[#dddfe2] p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[13px] text-[#65676b] font-medium">{card.title}</p>
                <p className="text-[28px] font-bold text-[#1c1e21] mt-1 leading-tight">{card.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {card.trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3 text-[#42b72a]" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-[#e41e3f]" />
                  )}
                  <span className={`text-[12px] ${card.trend === 'up' ? 'text-[#42b72a]' : 'text-[#e41e3f]'}`}>
                    {card.change}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Quick Actions — 1 col */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white rounded-lg border border-[#dddfe2] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e4e6eb]">
              <h3 className="text-[15px] font-semibold text-[#1c1e21]">Quick Actions</h3>
            </div>
            <div className="p-2">
              {quickActions.map((action, i) => (
                <button 
                  key={i}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#f0f2f5] transition-colors"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${action.color}15` }}>
                    <action.icon className="w-4 h-4" style={{ color: action.color }} />
                  </div>
                  <span className="text-[13px] text-[#1c1e21] flex-1 text-left">{action.label}</span>
                  {action.count && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#e41e3f] text-white">
                      {action.count}
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-[#bec3c9]" />
                </button>
              ))}
            </div>
          </div>

          {/* Top Regions */}
          <div className="bg-white rounded-lg border border-[#dddfe2] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e4e6eb] flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-[#1c1e21]">Top Regions</h3>
              <button className="text-[13px] text-[#1877F2] font-medium hover:underline">See all</button>
            </div>
            <div>
              {topRegions.map((region, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 hover:bg-[#f0f2f5] transition-colors ${
                  i < topRegions.length - 1 ? 'border-b border-[#f0f2f5]' : ''
                }`}>
                  <span className="text-lg">{region.flag}</span>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-[#1c1e21]">{region.name}</p>
                    <p className="text-[11px] text-[#65676b]">{region.revenue}</p>
                  </div>
                  <span className="text-[12px] text-[#42b72a] font-medium">{region.growth}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity — 2 cols */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg border border-[#dddfe2] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e4e6eb] flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-[#1c1e21]">Recent Activity</h3>
              <button className="text-[13px] text-[#1877F2] font-medium hover:underline">View all</button>
            </div>
            <div>
              {recentActivity.map((item, i) => {
                const typeColors: Record<string, string> = {
                  approve: '#42b72a', add: '#1877F2', request: '#f5a623', 
                  milestone: '#8b5cf6', resolve: '#42b72a'
                };
                const typeIcons: Record<string, any> = {
                  approve: CheckCircle2, add: Users, request: Clock,
                  milestone: Zap, resolve: CheckCircle2
                };
                const Icon = typeIcons[item.type] || Activity;
                const color = typeColors[item.type] || '#65676b';

                return (
                  <div key={i} className={`flex items-start gap-4 px-4 py-4 hover:bg-[#f7f8fa] transition-colors ${
                    i < recentActivity.length - 1 ? 'border-b border-[#f0f2f5]' : ''
                  }`}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${color}15` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] text-[#1c1e21]">{item.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[12px] text-[#65676b]">{item.region}</span>
                        <span className="text-[12px] text-[#bec3c9]">·</span>
                        <span className="text-[12px] text-[#65676b]">{item.time}</span>
                      </div>
                    </div>
                    <button className="text-[13px] text-[#1877F2] font-medium hover:underline flex-shrink-0">
                      View
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-lg border border-[#dddfe2] overflow-hidden mt-4">
            <div className="px-4 py-3 border-b border-[#e4e6eb]">
              <h3 className="text-[15px] font-semibold text-[#1c1e21]">Performance Summary</h3>
            </div>
            <div className="grid grid-cols-3 gap-0">
              {[
                { label: 'Franchises Active', value: '4,890', sub: 'Across 6 continents', color: '#42b72a' },
                { label: 'Resellers Active', value: '12,130', sub: '45 pending approval', color: '#1877F2' },
                { label: 'Conversion Rate', value: '78.4%', sub: '+4.2% this quarter', color: '#8b5cf6' },
              ].map((stat, i) => (
                <div key={i} className={`p-5 text-center ${i < 2 ? 'border-r border-[#e4e6eb]' : ''}`}>
                  <p className="text-[28px] font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-[13px] font-medium text-[#1c1e21] mt-1">{stat.label}</p>
                  <p className="text-[12px] text-[#65676b] mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewView;
