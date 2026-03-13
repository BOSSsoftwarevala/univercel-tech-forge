// ============================================
// COUNTRY ADMIN — STRIPE ATLAS CLONE
// Clean, Minimal Enterprise Dashboard
// ============================================
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Users, Building2, Store, Target, BarChart3,
  AlertTriangle, FileText, Settings, ChevronRight, ChevronLeft,
  TrendingUp, TrendingDown, Activity, DollarSign, Shield,
  Clock, CheckCircle2, Globe, Map, RefreshCw, Search,
  ArrowUpRight, Minus, Bell, Layers, Brain, Calendar
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CountryConfig, RegionData, CountryEntity, CountryActionKPI, MARKER_COLORS, generateCountryEntities, countryConfigs } from "./types";

// ── Stripe Atlas Sidebar Sections ──
type SidebarSection = 
  | "overview" | "regions" | "area-managers" | "franchises" 
  | "resellers" | "influencers" | "sales" | "marketplace"
  | "analytics" | "reports";

const sidebarItems: { id: SidebarSection; label: string; icon: any; badge?: number }[] = [
  { id: "overview", label: "Overview", icon: Globe },
  { id: "regions", label: "Regions & Areas", icon: MapPin },
  { id: "area-managers", label: "Area Managers", icon: Users },
  { id: "franchises", label: "Franchises", icon: Building2 },
  { id: "resellers", label: "Resellers", icon: Store },
  { id: "influencers", label: "Influencers", icon: Target },
  { id: "sales", label: "Sales", icon: DollarSign },
  { id: "marketplace", label: "Marketplace", icon: Layers },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "reports", label: "Reports", icon: FileText },
];

interface CountryAdminStripeAtlasProps {
  countryCode?: string;
  onBack?: () => void;
}

const CountryAdminStripeAtlas = ({ countryCode = "IN", onBack }: CountryAdminStripeAtlasProps) => {
  const config = countryConfigs[countryCode] || countryConfigs.IN;
  const [activeSection, setActiveSection] = useState<SidebarSection>("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const entities = useMemo(() => generateCountryEntities(config.regions), [config.regions]);

  const totalRegions = config.regions.length;
  const totalFranchises = config.regions.reduce((s, r) => s + r.franchises, 0);
  const totalResellers = config.regions.reduce((s, r) => s + r.resellers, 0);
  const totalInfluencers = config.regions.reduce((s, r) => s + r.influencers, 0);
  const pendingApprovals = config.regions.reduce((s, r) => s + r.pendingApprovals, 0);
  const openIssues = config.regions.reduce((s, r) => s + r.openIssues, 0);
  const totalRevenue = config.regions.reduce((s, r) => s + r.revenue, 0);
  const avgPerformance = Math.round(config.regions.reduce((s, r) => s + r.performance, 0) / config.regions.length);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setIsRefreshing(false);
    toast.success("Data refreshed");
  }, []);

  const kpiCards = useMemo(() => [
    { label: "Regions", value: totalRegions.toString(), icon: MapPin, change: "Active", color: "#635bff" },
    { label: "Franchises", value: totalFranchises.toString(), icon: Building2, change: `+${Math.floor(totalFranchises * 0.08)}`, color: "#0a2540" },
    { label: "Resellers", value: totalResellers.toString(), icon: Store, change: `+${Math.floor(totalResellers * 0.12)}`, color: "#635bff" },
    { label: "Influencers", value: totalInfluencers.toString(), icon: Target, change: `+${Math.floor(totalInfluencers * 0.15)}`, color: "#0a2540" },
    { label: "Revenue", value: `$${(totalRevenue / 1000000).toFixed(1)}M`, icon: DollarSign, change: "+18.3%", color: "#00d4aa" },
    { label: "Performance", value: `${avgPerformance}%`, icon: TrendingUp, change: "Stable", color: "#635bff" },
    { label: "Pending", value: pendingApprovals.toString(), icon: Clock, change: "Needs review", color: pendingApprovals > 5 ? "#df1b41" : "#f59e0b" },
    { label: "Issues", value: openIssues.toString(), icon: AlertTriangle, change: openIssues > 0 ? "Action needed" : "Clear", color: openIssues > 0 ? "#df1b41" : "#00d4aa" },
  ], [totalRegions, totalFranchises, totalResellers, totalInfluencers, totalRevenue, avgPerformance, pendingApprovals, openIssues]);

  const renderOverview = () => (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white rounded-xl border border-[#e3e8ee] p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-[#697386] font-medium">{kpi.label}</span>
              <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
            </div>
            <p className="text-2xl font-semibold text-[#0a2540] tracking-tight">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <ArrowUpRight className="w-3 h-3 text-[#00d4aa]" />
              <span className="text-[12px] text-[#697386]">{kpi.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Regions Table */}
      <div className="bg-white rounded-xl border border-[#e3e8ee] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e3e8ee] flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[#0a2540]">Regions</h3>
          <span className="text-[12px] text-[#697386] bg-[#f7f8fa] px-2.5 py-1 rounded-full">{config.regions.length} total</span>
        </div>
        <div className="divide-y divide-[#e3e8ee]">
          {config.regions.map((region, i) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.03 }}
              className="px-6 py-4 flex items-center justify-between hover:bg-[#f7f8fa] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  region.status === "active" && "bg-[#00d4aa]",
                  region.status === "maintenance" && "bg-[#f59e0b]",
                  region.status === "warning" && "bg-[#df1b41]",
                  region.status === "critical" && "bg-[#df1b41]"
                )} />
                <div>
                  <p className="text-[14px] font-medium text-[#0a2540]">{region.name}</p>
                  <p className="text-[12px] text-[#697386]">{region.cities} cities · {region.managers} managers</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[13px] font-medium text-[#0a2540]">${(region.revenue / 1000000).toFixed(1)}M</p>
                  <p className="text-[11px] text-[#697386]">Revenue</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-medium text-[#0a2540]">{region.franchises}</p>
                  <p className="text-[11px] text-[#697386]">Franchises</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-medium text-[#0a2540]">{region.performance}%</p>
                  <p className="text-[11px] text-[#697386]">Perf.</p>
                </div>
                {(region.pendingApprovals > 0 || region.openIssues > 0) && (
                  <div className="flex gap-1.5">
                    {region.pendingApprovals > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#fef3cd] text-[#856404] font-medium">
                        {region.pendingApprovals} pending
                      </span>
                    )}
                    {region.openIssues > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f8d7da] text-[#721c24] font-medium">
                        {region.openIssues} issues
                      </span>
                    )}
                  </div>
                )}
                <ChevronRight className="w-4 h-4 text-[#c1c9d2]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-[#e3e8ee] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e3e8ee]">
          <h3 className="text-[15px] font-semibold text-[#0a2540]">Recent Activity</h3>
        </div>
        <div className="divide-y divide-[#e3e8ee]">
          {[
            { action: "Franchise approved", target: `${config.regions[0]?.name} Region`, time: "2m ago", type: "success" },
            { action: "Reseller application received", target: `${config.regions[1]?.name || 'Central'}`, time: "15m ago", type: "info" },
            { action: "Payment processed", target: `$24,500`, time: "1h ago", type: "success" },
            { action: "Compliance review needed", target: `${config.regions[Math.min(2, config.regions.length - 1)]?.name}`, time: "3h ago", type: "warning" },
            { action: "New influencer onboarded", target: `${config.name}`, time: "5h ago", type: "info" },
          ].map((item, i) => (
            <div key={i} className="px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  item.type === "success" && "bg-[#00d4aa]",
                  item.type === "info" && "bg-[#635bff]",
                  item.type === "warning" && "bg-[#f59e0b]"
                )} />
                <div>
                  <p className="text-[13px] text-[#0a2540]">{item.action}</p>
                  <p className="text-[12px] text-[#697386]">{item.target}</p>
                </div>
              </div>
              <span className="text-[12px] text-[#a3acb9]">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── REGIONS VIEW ──
  const renderRegions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[#0a2540]">Regions & Areas</h2>
        <span className="text-[12px] text-[#697386] bg-[#f7f8fa] px-3 py-1 rounded-full">{config.regions.length} regions</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {config.regions.map((region, i) => (
          <motion.div key={region.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-[#e3e8ee] p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full", region.status === "active" ? "bg-[#00d4aa]" : region.status === "warning" ? "bg-[#f59e0b]" : "bg-[#df1b41]")} />
                <div>
                  <p className="text-[14px] font-semibold text-[#0a2540]">{region.name}</p>
                  <p className="text-[12px] text-[#697386]">{region.cities} cities · {region.managers} managers</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[11px] border-[#e3e8ee] text-[#697386]">{region.status}</Badge>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: "Franchises", value: region.franchises },
                { label: "Resellers", value: region.resellers },
                { label: "Influencers", value: region.influencers },
                { label: "Revenue", value: `$${(region.revenue / 1000000).toFixed(1)}M` },
              ].map(s => (
                <div key={s.label} className="text-center p-2 rounded-lg bg-[#f7f8fa]">
                  <p className="text-[14px] font-semibold text-[#0a2540]">{s.value}</p>
                  <p className="text-[10px] text-[#697386]">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 rounded-full bg-[#e3e8ee] overflow-hidden">
                  <div className="h-full rounded-full bg-[#635bff]" style={{ width: `${region.performance}%` }} />
                </div>
                <span className="text-[11px] text-[#697386]">{region.performance}%</span>
              </div>
              {(region.pendingApprovals > 0 || region.openIssues > 0) && (
                <div className="flex gap-1.5">
                  {region.pendingApprovals > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fef3cd] text-[#856404]">{region.pendingApprovals} pending</span>}
                  {region.openIssues > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f8d7da] text-[#721c24]">{region.openIssues} issues</span>}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // ── AREA MANAGERS VIEW ──
  const renderAreaManagers = () => {
    const managers = config.regions.flatMap((r, ri) => 
      Array.from({ length: r.managers }, (_, i) => ({
        id: `${r.id}-mgr-${i}`, name: `Manager ${ri * 10 + i + 1}`, region: r.name,
        users: Math.floor(Math.random() * 2000) + 500, status: Math.random() > 0.15 ? "active" : "on-hold",
        lastActive: `${Math.floor(Math.random() * 60)} min ago`, performance: Math.floor(Math.random() * 20) + 78,
      }))
    );
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#0a2540]">Area Managers</h2>
          <span className="text-[12px] text-[#697386] bg-[#f7f8fa] px-3 py-1 rounded-full">{managers.length} managers</span>
        </div>
        <div className="bg-white rounded-xl border border-[#e3e8ee] overflow-hidden">
          <div className="divide-y divide-[#e3e8ee]">
            {managers.slice(0, 15).map((mgr, i) => (
              <motion.div key={mgr.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className="px-6 py-4 flex items-center justify-between hover:bg-[#f7f8fa] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#635bff]/10 flex items-center justify-center text-[13px] font-semibold text-[#635bff]">
                    {mgr.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#0a2540]">{mgr.name}</p>
                    <p className="text-[11px] text-[#697386]">{mgr.region} · {mgr.lastActive}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right"><p className="text-[13px] font-medium text-[#0a2540]">{mgr.users.toLocaleString()}</p><p className="text-[10px] text-[#697386]">Users</p></div>
                  <div className="text-right"><p className="text-[13px] font-medium text-[#0a2540]">{mgr.performance}%</p><p className="text-[10px] text-[#697386]">Perf.</p></div>
                  <div className={cn("w-2 h-2 rounded-full", mgr.status === "active" ? "bg-[#00d4aa]" : "bg-[#f59e0b]")} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── ENTITY TABLE VIEW (reused for franchises, resellers, influencers) ──
  const renderEntityTable = (type: "franchise" | "reseller" | "influencer") => {
    const filtered = entities.filter(e => e.type === type);
    const label = type === "franchise" ? "Franchises" : type === "reseller" ? "Resellers" : "Influencers";
    const color = type === "franchise" ? "#00d4aa" : type === "reseller" ? "#3b82f6" : "#f97316";
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#0a2540]">{label}</h2>
          <span className="text-[12px] text-[#697386] bg-[#f7f8fa] px-3 py-1 rounded-full">{filtered.length} total</span>
        </div>
        <div className="bg-white rounded-xl border border-[#e3e8ee] overflow-hidden">
          <div className="divide-y divide-[#e3e8ee]">
            {filtered.map((entity, i) => (
              <motion.div key={entity.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className="px-6 py-4 flex items-center justify-between hover:bg-[#f7f8fa] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <div>
                    <p className="text-[13px] font-medium text-[#0a2540]">{entity.name}</p>
                    <p className="text-[11px] text-[#697386]">{entity.region} · {entity.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right"><p className="text-[13px] font-medium text-[#0a2540]">${(entity.revenue / 1000).toFixed(0)}K</p><p className="text-[10px] text-[#697386]">Revenue</p></div>
                  <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-medium",
                    entity.status === "active" ? "bg-[#d1fae5] text-[#065f46]" :
                    entity.status === "pending" ? "bg-[#fef3cd] text-[#856404]" :
                    entity.status === "warning" ? "bg-[#fed7aa] text-[#9a3412]" : "bg-[#f8d7da] text-[#721c24]"
                  )}>{entity.status}</span>
                  {entity.openIssues > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f8d7da] text-[#721c24]">{entity.openIssues} issues</span>}
                  <ChevronRight className="w-4 h-4 text-[#c1c9d2]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── SALES VIEW ──
  const renderSales = () => {
    const salesData = config.regions.map(r => ({ name: r.name, revenue: r.revenue, growth: Math.floor(Math.random() * 30) + 5 }));
    const totalRev = salesData.reduce((s, d) => s + d.revenue, 0);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#0a2540]">Sales Overview</h2>
          <span className="text-[15px] font-semibold text-[#0a2540]">${(totalRev / 1000000).toFixed(2)}M Total</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: `$${(totalRev / 1000000).toFixed(1)}M`, change: "+18.3%", color: "#00d4aa" },
            { label: "Active Deals", value: `${Math.floor(totalFranchises * 1.5)}`, change: "+12", color: "#635bff" },
            { label: "Avg Deal Size", value: `$${Math.floor(totalRev / totalFranchises / 1000)}K`, change: "+5.2%", color: "#0a2540" },
            { label: "Win Rate", value: `${Math.floor(Math.random() * 15) + 72}%`, change: "+3.1%", color: "#00d4aa" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white rounded-xl border border-[#e3e8ee] p-5">
              <p className="text-[12px] text-[#697386] mb-1">{s.label}</p>
              <p className="text-[22px] font-semibold text-[#0a2540]">{s.value}</p>
              <div className="flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" style={{ color: s.color }} /><span className="text-[11px] text-[#697386]">{s.change}</span></div>
            </motion.div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-[#e3e8ee] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e3e8ee]"><h3 className="text-[15px] font-semibold text-[#0a2540]">Revenue by Region</h3></div>
          <div className="divide-y divide-[#e3e8ee]">
            {salesData.sort((a, b) => b.revenue - a.revenue).map((d, i) => (
              <div key={d.name} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-[13px] font-medium text-[#0a2540] w-40">{d.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-[#e3e8ee] overflow-hidden">
                    <div className="h-full rounded-full bg-[#635bff]" style={{ width: `${(d.revenue / salesData[0].revenue) * 100}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className="text-[13px] font-medium text-[#0a2540]">${(d.revenue / 1000000).toFixed(2)}M</span>
                  <span className="text-[11px] text-[#00d4aa]">+{d.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── MARKETPLACE VIEW ──
  const renderMarketplace = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[#0a2540]">Marketplace</h2>
        <span className="text-[12px] text-[#697386] bg-[#f7f8fa] px-3 py-1 rounded-full">{config.name}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Products", value: `${totalFranchises * 8}`, icon: Layers },
          { label: "Monthly Orders", value: `${totalResellers * 15}`, icon: Activity },
          { label: "Marketplace Revenue", value: `$${(totalRevenue * 0.12 / 1000000).toFixed(1)}M`, icon: DollarSign },
          { label: "Top Sellers", value: `${Math.floor(totalFranchises * 0.3)}`, icon: TrendingUp },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-xl border border-[#e3e8ee] p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-[#697386]">{m.label}</span>
              <m.icon className="w-4 h-4 text-[#635bff]" />
            </div>
            <p className="text-[22px] font-semibold text-[#0a2540]">{m.value}</p>
          </motion.div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[#e3e8ee] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e3e8ee]"><h3 className="text-[15px] font-semibold text-[#0a2540]">Top Products</h3></div>
        <div className="divide-y divide-[#e3e8ee]">
          {["Software License Pro", "Enterprise Suite", "Cloud Package", "Security Bundle", "Analytics Platform"].map((product, i) => (
            <div key={product} className="px-6 py-4 flex items-center justify-between hover:bg-[#f7f8fa] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#635bff]/10 flex items-center justify-center text-[13px] font-bold text-[#635bff]">#{i + 1}</div>
                <div><p className="text-[13px] font-medium text-[#0a2540]">{product}</p><p className="text-[11px] text-[#697386]">{Math.floor(Math.random() * 200) + 50} orders this month</p></div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-medium text-[#0a2540]">${(Math.random() * 50000 + 10000).toFixed(0)}</span>
                <ChevronRight className="w-4 h-4 text-[#c1c9d2]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── ANALYTICS VIEW ──
  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-[18px] font-semibold text-[#0a2540]">Analytics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: `${(totalFranchises * 120 + totalResellers * 80).toLocaleString()}`, change: "+14.2%" },
          { label: "Active Sessions", value: `${Math.floor(totalFranchises * 45)}`, change: "+8.5%" },
          { label: "Conversion Rate", value: `${(Math.random() * 5 + 3).toFixed(1)}%`, change: "+1.2%" },
          { label: "Avg Session Duration", value: `${Math.floor(Math.random() * 10) + 5}m`, change: "+22s" },
          { label: "Bounce Rate", value: `${Math.floor(Math.random() * 15) + 20}%`, change: "-3.1%" },
          { label: "Page Views", value: `${(totalFranchises * 850).toLocaleString()}`, change: "+19.8%" },
        ].map((a, i) => (
          <motion.div key={a.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-xl border border-[#e3e8ee] p-5">
            <p className="text-[12px] text-[#697386] mb-1">{a.label}</p>
            <p className="text-[22px] font-semibold text-[#0a2540]">{a.value}</p>
            <div className="flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3 text-[#00d4aa]" /><span className="text-[11px] text-[#697386]">{a.change}</span></div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-6">
          <h3 className="text-[15px] font-semibold text-[#0a2540] mb-4">Performance by Region</h3>
          {config.regions.map(r => (
            <div key={r.id} className="flex items-center gap-3 mb-3">
              <span className="text-[12px] text-[#697386] w-32 truncate">{r.name}</span>
              <div className="flex-1 h-2 rounded-full bg-[#e3e8ee] overflow-hidden">
                <div className="h-full rounded-full bg-[#635bff]" style={{ width: `${r.performance}%` }} />
              </div>
              <span className="text-[12px] font-medium text-[#0a2540]">{r.performance}%</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-6">
          <h3 className="text-[15px] font-semibold text-[#0a2540] mb-4">Top Metrics</h3>
          {[
            { label: "Highest Revenue Region", value: config.regions.sort((a, b) => b.revenue - a.revenue)[0]?.name || "-" },
            { label: "Most Franchises", value: config.regions.sort((a, b) => b.franchises - a.franchises)[0]?.name || "-" },
            { label: "Best Performance", value: config.regions.sort((a, b) => b.performance - a.performance)[0]?.name || "-" },
            { label: "Most Issues", value: config.regions.sort((a, b) => b.openIssues - a.openIssues)[0]?.name || "-" },
          ].map(m => (
            <div key={m.label} className="flex items-center justify-between py-2.5 border-b border-[#e3e8ee] last:border-0">
              <span className="text-[12px] text-[#697386]">{m.label}</span>
              <span className="text-[13px] font-medium text-[#0a2540]">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── REPORTS VIEW ──
  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[#0a2540]">Reports</h2>
        <button className="text-[13px] text-[#635bff] font-medium hover:underline">Generate New Report</button>
      </div>
      <div className="bg-white rounded-xl border border-[#e3e8ee] overflow-hidden">
        <div className="divide-y divide-[#e3e8ee]">
          {[
            { name: "Monthly Revenue Report", type: "Financial", date: "Mar 1, 2026", status: "Ready" },
            { name: "Franchise Performance Q1", type: "Operations", date: "Feb 28, 2026", status: "Ready" },
            { name: "Reseller Activity Summary", type: "Sales", date: "Feb 25, 2026", status: "Ready" },
            { name: "Compliance Audit Report", type: "Legal", date: "Feb 20, 2026", status: "Ready" },
            { name: "Regional Growth Analysis", type: "Analytics", date: "Feb 15, 2026", status: "Ready" },
            { name: "Influencer ROI Report", type: "Marketing", date: "Feb 10, 2026", status: "Processing" },
            { name: "Customer Satisfaction Survey", type: "Support", date: "Feb 5, 2026", status: "Ready" },
          ].map((report, i) => (
            <motion.div key={report.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="px-6 py-4 flex items-center justify-between hover:bg-[#f7f8fa] transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#f7f8fa] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#697386]" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#0a2540]">{report.name}</p>
                  <p className="text-[11px] text-[#697386]">{report.type} · {report.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-medium",
                  report.status === "Ready" ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fef3cd] text-[#856404]"
                )}>{report.status}</span>
                <ChevronRight className="w-4 h-4 text-[#c1c9d2]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "overview": return renderOverview();
      case "regions": return renderRegions();
      case "area-managers": return renderAreaManagers();
      case "franchises": return renderEntityTable("franchise");
      case "resellers": return renderEntityTable("reseller");
      case "influencers": return renderEntityTable("influencer");
      case "sales": return renderSales();
      case "marketplace": return renderMarketplace();
      case "analytics": return renderAnalytics();
      case "reports": return renderReports();
      default: return renderOverview();
    }
  };

  return (
    <div className="h-full flex" style={{ background: '#f7f8fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* ═══ LEFT SIDEBAR — Stripe Atlas Style ═══ */}
      <aside className="w-[240px] bg-[#0a2540] flex-shrink-0 flex flex-col">
        {/* Logo / Country Header */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.flag}</span>
            <div>
              <p className="text-[14px] font-semibold text-white">{config.name}</p>
              <p className="text-[11px] text-white/50">{config.continent} · Country Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-3">
          <nav className="px-3 space-y-0.5">
            {sidebarItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all",
                    isActive
                      ? "bg-white/10 text-white font-medium"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive ? "text-[#635bff]" : "text-white/40")} />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/10">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
            <Shield className="w-4 h-4 text-[#635bff]" />
            <div>
              <p className="text-[11px] font-medium text-white/80">Country Scope</p>
              <p className="text-[10px] text-white/40">Verified Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-[56px] bg-white border-b border-[#e3e8ee] flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} className="text-[#697386] hover:text-[#0a2540] transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <h1 className="text-[15px] font-semibold text-[#0a2540]">{config.name}</h1>
              <ChevronRight className="w-3.5 h-3.5 text-[#c1c9d2]" />
              <span className="text-[13px] text-[#697386]">
                {sidebarItems.find(s => s.id === activeSection)?.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f7f8fa] border border-[#e3e8ee]">
              <Search className="w-3.5 h-3.5 text-[#a3acb9]" />
              <span className="text-[12px] text-[#a3acb9]">Search...</span>
            </div>
            <button className="relative p-2 rounded-lg hover:bg-[#f7f8fa] transition-colors">
              <Bell className="w-4 h-4 text-[#697386]" />
              {pendingApprovals > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#df1b41]" />
              )}
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-1.5 text-[12px] h-8 border-[#e3e8ee] text-[#697386] hover:text-[#0a2540]"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </header>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6 max-w-[1200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
              >
                {renderSectionContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CountryAdminStripeAtlas;
