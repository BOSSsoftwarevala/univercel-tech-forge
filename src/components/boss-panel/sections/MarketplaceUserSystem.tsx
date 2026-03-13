import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Users, Package, Star, TrendingUp, Search,
  Filter, Eye, Ban, CheckCircle, AlertTriangle, RefreshCw,
  DollarSign, BarChart3, ArrowUpRight, Clock
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const T = {
  glass: 'hsla(222, 47%, 11%, 0.72)',
  glassBorder: 'hsla(215, 40%, 35%, 0.25)',
  text: 'hsl(210, 40%, 98%)',
  muted: 'hsl(215, 22%, 65%)',
  dim: 'hsl(215, 15%, 42%)',
  blue: 'hsl(217, 92%, 65%)',
  green: 'hsl(160, 84%, 44%)',
  amber: 'hsl(38, 95%, 55%)',
  red: 'hsl(346, 82%, 55%)',
  purple: 'hsl(262, 85%, 63%)',
  rowHover: 'hsla(217, 91%, 60%, 0.07)',
};

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const rise = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 28 } } };

const Glass = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div variants={rise} className={`rounded-2xl overflow-hidden ${className}`}
    style={{ background: T.glass, backdropFilter: 'blur(20px)', border: `1px solid ${T.glassBorder}`, boxShadow: `0 8px 32px -8px hsla(222,47%,4%,0.5)` }}>
    {children}
  </motion.div>
);

export function MarketplaceUserSystem() {
  const [activeTab, setActiveTab] = useState<'overview' | 'buyers' | 'orders' | 'reviews'>('overview');
  const [search, setSearch] = useState('');

  const { data: products } = useQuery({
    queryKey: ['marketplace-user-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('software_catalog')
        .select('id, product_name, type, status, created_at')
        .limit(10)
        .order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    },
  });

  const { data: orders } = useQuery({
    queryKey: ['marketplace-orders-boss'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) return [];
      return data || [];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['marketplace-user-stats'],
    queryFn: async () => {
      const [catRes, ordersRes, usersRes] = await Promise.all([
        supabase.from('software_catalog').select('id', { count: 'exact', head: true }),
        supabase.from('marketplace_orders').select('id, total_amount'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ]);
      const totalRevenue = (ordersRes.data || []).reduce((s, o) => s + Number(o.total_amount || 0), 0);
      return {
        products: catRes.count || 0,
        orders: ordersRes.data?.length || 0,
        users: usersRes.count || 0,
        revenue: totalRevenue,
      };
    },
    refetchInterval: 30000,
  });

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'buyers', label: 'Buyers', icon: Users },
    { key: 'orders', label: 'Orders', icon: ShoppingCart },
    { key: 'reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <motion.div className="space-y-5" variants={stagger} initial="hidden" animate="show" style={{ color: T.text }}>
      {/* Header */}
      <motion.div variants={rise} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight">Marketplace User System</h1>
          <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>Monitor buyers, sellers, orders, and marketplace performance</p>
        </div>
        <button onClick={() => toast.info('Full marketplace analytics loading')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold"
          style={{ background: T.blue, color: 'white' }}>
          <ArrowUpRight className="w-3.5 h-3.5" /> Open Marketplace
        </button>
      </motion.div>

      {/* KPI */}
      <motion.div variants={stagger} className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: stats?.products.toLocaleString() ?? '—', icon: Package, color: T.blue },
          { label: 'Total Orders', value: stats?.orders.toLocaleString() ?? '—', icon: ShoppingCart, color: T.green },
          { label: 'Total Users', value: stats?.users.toLocaleString() ?? '—', icon: Users, color: T.purple },
          { label: 'Revenue', value: `$${((stats?.revenue || 0) / 1000).toFixed(1)}K`, icon: DollarSign, color: T.amber },
        ].map(k => (
          <Glass key={k.label} className="p-4">
            <k.icon className="w-4 h-4 mb-2" style={{ color: k.color }} />
            <p className="text-2xl font-black">{k.value}</p>
            <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: T.muted }}>{k.label}</p>
          </Glass>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={rise} className="flex gap-1 p-1 rounded-xl" style={{ background: 'hsla(222,47%,9%,0.8)', border: `1px solid ${T.glassBorder}` }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as any)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all flex-1 justify-center"
            style={{ background: activeTab === t.key ? T.blue : 'transparent', color: activeTab === t.key ? 'white' : T.muted }}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </motion.div>

      {/* Products Table (Overview) */}
      {activeTab === 'overview' && (
        <Glass className="p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: T.text }}>
            Recent Products ({products?.length || 0})
          </h3>
          <div className="space-y-2">
            {(products || []).map((p: any) => (
              <motion.div key={p.id} variants={rise}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                whileHover={{ backgroundColor: T.rowHover }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${T.blue}15` }}>
                  <Package className="w-4 h-4" style={{ color: T.blue }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: T.text }}>{p.product_name}</p>
                  <p className="text-[10px]" style={{ color: T.muted }}>{p.type} • {p.status}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
                    style={{ background: p.status === 'active' ? `${T.green}18` : `${T.amber}18`, color: p.status === 'active' ? T.green : T.amber }}>
                    {p.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono" style={{ color: T.dim }}>
                    {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Glass>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <Glass className="p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: T.text }}>
            Recent Orders ({orders?.length || 0})
          </h3>
          {(orders || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="w-10 h-10 mb-3" style={{ color: T.dim }} />
              <p style={{ color: T.muted }} className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
              {(orders || []).map((o: any) => (
                <motion.div key={o.id} variants={rise}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                  whileHover={{ backgroundColor: T.rowHover }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${T.green}15` }}>
                    <ShoppingCart className="w-4 h-4" style={{ color: T.green }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: T.text }}>Order #{o.id?.slice(0, 8)}</p>
                    <p className="text-[10px]" style={{ color: T.muted }}>{o.user_id?.slice(0, 8)} • {o.status}</p>
                  </div>
                  <p className="text-sm font-bold" style={{ color: T.green }}>${Number(o.total_amount || 0).toFixed(2)}</p>
                  <p className="text-[10px] font-mono" style={{ color: T.dim }}>
                    {new Date(o.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </Glass>
      )}

      {/* Buyers & Reviews - coming soon */}
      {(activeTab === 'buyers' || activeTab === 'reviews') && (
        <Glass className="p-12 flex flex-col items-center justify-center">
          {activeTab === 'buyers' ? <Users className="w-12 h-12 mb-4" style={{ color: T.dim }} /> : <Star className="w-12 h-12 mb-4" style={{ color: T.dim }} />}
          <h3 className="text-base font-bold mb-2" style={{ color: T.text }}>{activeTab === 'buyers' ? 'Buyer Analytics' : 'Review Management'}</h3>
          <p className="text-sm text-center max-w-sm" style={{ color: T.muted }}>
            {activeTab === 'buyers' ? 'Detailed buyer segmentation, purchase history, and cohort analysis coming soon.' : 'AI-powered review analysis, spam detection, and sentiment scoring coming soon.'}
          </p>
        </Glass>
      )}
    </motion.div>
  );
}
