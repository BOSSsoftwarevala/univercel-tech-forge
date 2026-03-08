// ============================================
// SOFTWARE VALA — GLOBAL COMMAND CENTER
// 7D World Map Dashboard — No Internal Sidebar
// Fits within parent RoleSwitchDashboard layout
// ============================================
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps';
import {
  Globe2, Activity, Users, TrendingUp, Zap, Shield,
  MapPin, ArrowUpRight, ArrowDownRight, Server,
  DollarSign, Package, Store, Building2, AlertTriangle,
  Clock, Radio, Signal, Database, RefreshCw,
  ShoppingCart, Key, Rocket, Megaphone, Eye,
  Cpu, UserCheck, Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ── Continent Data ──
const continentMarkers = [
  {
    id: 'asia', name: 'Asia Pacific', coordinates: [105, 25] as [number, number],
    icon: '🌏', color: '#ef4444', countries: 48, activeAdmins: 45,
    revenue: '$2.4M', revenueChange: 12.5, users: '3,240', products: 4200,
    franchises: 18, resellers: 890, healthScore: 94, latency: '42ms',
    alerts: 2, liveEvents: 156, sales: '$1.2M', licenses: 2340,
  },
  {
    id: 'africa', name: 'Africa', coordinates: [20, 5] as [number, number],
    icon: '🌍', color: '#f59e0b', countries: 54, activeAdmins: 48,
    revenue: '$1.8M', revenueChange: 24.3, users: '2,850', products: 3100,
    franchises: 14, resellers: 720, healthScore: 89, latency: '68ms',
    alerts: 5, liveEvents: 203, sales: '$890K', licenses: 1560,
  },
  {
    id: 'europe', name: 'Europe', coordinates: [15, 50] as [number, number],
    icon: '🌍', color: '#3b82f6', countries: 44, activeAdmins: 42,
    revenue: '$3.1M', revenueChange: 8.7, users: '4,120', products: 5600,
    franchises: 12, resellers: 540, healthScore: 96, latency: '28ms',
    alerts: 1, liveEvents: 89, sales: '$2.1M', licenses: 3200,
  },
  {
    id: 'north_america', name: 'North America', coordinates: [-100, 45] as [number, number],
    icon: '🌎', color: '#10b981', countries: 23, activeAdmins: 21,
    revenue: '$4.2M', revenueChange: 6.2, users: '5,800', products: 6100,
    franchises: 8, resellers: 320, healthScore: 91, latency: '22ms',
    alerts: 3, liveEvents: 67, sales: '$3.4M', licenses: 4100,
  },
  {
    id: 'south_america', name: 'South America', coordinates: [-60, -15] as [number, number],
    icon: '🌎', color: '#84cc16', countries: 12, activeAdmins: 10,
    revenue: '$890K', revenueChange: 18.4, users: '1,420', products: 1800,
    franchises: 6, resellers: 280, healthScore: 87, latency: '55ms',
    alerts: 2, liveEvents: 45, sales: '$520K', licenses: 780,
  },
  {
    id: 'oceania', name: 'Oceania', coordinates: [135, -25] as [number, number],
    icon: '🌏', color: '#8b5cf6', countries: 14, activeAdmins: 12,
    revenue: '$1.1M', revenueChange: 14.1, users: '980', products: 1200,
    franchises: 4, resellers: 160, healthScore: 88, latency: '38ms',
    alerts: 0, liveEvents: 38, sales: '$680K', licenses: 920,
  },
  {
    id: 'middle_east', name: 'Middle East', coordinates: [45, 25] as [number, number],
    icon: '🕌', color: '#f59e0b', countries: 15, activeAdmins: 14,
    revenue: '$1.6M', revenueChange: 22.8, users: '1,850', products: 2400,
    franchises: 10, resellers: 220, healthScore: 92, latency: '45ms',
    alerts: 1, liveEvents: 78, sales: '$980K', licenses: 1450,
  },
];

// Activity signal points across the globe
const activityPoints: { coordinates: [number, number]; type: string; color: string }[] = [
  { coordinates: [77, 20], type: 'user', color: '#3b82f6' },
  { coordinates: [121, 31], type: 'sale', color: '#10b981' },
  { coordinates: [-74, 40], type: 'deploy', color: '#8b5cf6' },
  { coordinates: [2, 48], type: 'license', color: '#f59e0b' },
  { coordinates: [37, -1], type: 'user', color: '#3b82f6' },
  { coordinates: [103, 1], type: 'sale', color: '#10b981' },
  { coordinates: [-43, -23], type: 'alert', color: '#ef4444' },
  { coordinates: [151, -34], type: 'marketplace', color: '#06b6d4' },
  { coordinates: [-122, 37], type: 'deploy', color: '#8b5cf6' },
  { coordinates: [0, 51], type: 'sale', color: '#10b981' },
  { coordinates: [55, 25], type: 'user', color: '#3b82f6' },
  { coordinates: [139, 35], type: 'license', color: '#f59e0b' },
  { coordinates: [-99, 19], type: 'marketplace', color: '#06b6d4' },
  { coordinates: [28, -26], type: 'sale', color: '#10b981' },
  { coordinates: [13, 52], type: 'deploy', color: '#8b5cf6' },
];

const dataFlowLines = [
  { from: [15, 50], to: [-100, 45], label: 'EU→NA' },
  { from: [-100, 45], to: [105, 25], label: 'NA→AS' },
  { from: [105, 25], to: [135, -25], label: 'AS→OC' },
  { from: [20, 5], to: [15, 50], label: 'AF→EU' },
  { from: [-60, -15], to: [-100, 45], label: 'SA→NA' },
  { from: [15, 50], to: [105, 25], label: 'EU→AS' },
  { from: [135, -25], to: [-60, -15], label: 'OC→SA' },
];

// System connection modules
const systemConnections = [
  { name: 'Marketplace', icon: '🛒', status: 'active', requests: '2.4K/min', color: '#10b981' },
  { name: 'Sales', icon: '💰', status: 'active', requests: '890/min', color: '#3b82f6' },
  { name: 'License', icon: '🔑', status: 'active', requests: '340/min', color: '#8b5cf6' },
  { name: 'Deploy', icon: '🚀', status: 'active', requests: '42/min', color: '#06b6d4' },
  { name: 'Analytics', icon: '📊', status: 'active', requests: '1.2K/min', color: '#f59e0b' },
  { name: 'Servers', icon: '🖥️', status: 'active', requests: '680/min', color: '#ef4444' },
  { name: 'Notifications', icon: '🔔', status: 'active', requests: '3.1K/min', color: '#ec4899' },
];

// Floating stat positions on map (absolute positioned)
const floatingStats = [
  { top: '15%', left: '8%', label: 'NA Active', value: '5.8K', color: '#10b981' },
  { top: '30%', left: '42%', label: 'EU Revenue', value: '$3.1M', color: '#3b82f6' },
  { top: '55%', left: '60%', label: 'AF Growth', value: '+24%', color: '#f59e0b' },
  { top: '25%', left: '75%', label: 'AS Products', value: '4.2K', color: '#ef4444' },
];

// Live feed events
const liveFeedItems = [
  { time: '2s', event: 'New franchise application', region: 'Kenya', type: 'franchise', icon: Building2, color: '#f59e0b' },
  { time: '5s', event: 'Product purchased — $2,400', region: 'Mumbai', type: 'sale', icon: ShoppingCart, color: '#10b981' },
  { time: '12s', event: 'Reseller onboarded', region: 'London', type: 'reseller', icon: Store, color: '#3b82f6' },
  { time: '18s', event: 'High risk alert', region: 'São Paulo', type: 'alert', icon: AlertTriangle, color: '#ef4444' },
  { time: '22s', event: 'License — Enterprise', region: 'New York', type: 'license', icon: Key, color: '#8b5cf6' },
  { time: '31s', event: 'Withdrawal $12K', region: 'Berlin', type: 'finance', icon: DollarSign, color: '#10b981' },
  { time: '38s', event: 'Server auto-scaled', region: 'Singapore', type: 'system', icon: Server, color: '#06b6d4' },
  { time: '45s', event: 'Influencer joined', region: 'Manila', type: 'user', icon: Megaphone, color: '#ec4899' },
  { time: '52s', event: 'Deployment done', region: 'Toronto', type: 'deploy', icon: Rocket, color: '#8b5cf6' },
  { time: '1m', event: 'Product listed', region: 'Dubai', type: 'marketplace', icon: Package, color: '#06b6d4' },
  { time: '1m', event: 'KYC verified', region: 'Lagos', type: 'user', icon: UserCheck, color: '#10b981' },
  { time: '2m', event: 'Escalation resolved', region: 'Tokyo', type: 'escalation', icon: Shield, color: '#f59e0b' },
];

const systemAlerts = [
  { severity: 'critical', message: 'Africa region latency spike — 120ms', time: '3m ago' },
  { severity: 'warning', message: 'South America backup delayed', time: '12m ago' },
  { severity: 'info', message: 'Europe CDN cache refreshed', time: '18m ago' },
];

// ── Styles ──
const cardStyle = {
  background: 'hsla(222, 47%, 10%, 0.85)',
  backdropFilter: 'blur(20px)',
  border: '1px solid hsla(220, 50%, 25%, 0.4)',
  boxShadow: '0 8px 32px hsla(222, 47%, 5%, 0.5)',
};
const labelColor = 'hsla(220, 30%, 55%, 1)';
const mutedColor = 'hsla(220, 30%, 45%, 1)';
const surfaceBg = 'hsla(220, 40%, 13%, 0.6)';
const borderCol = 'hsla(220, 50%, 25%, 0.3)';

interface GlobalCommandCenterProps {
  onSelectContinent?: (continentId: string) => void;
}

const GlobalCommandCenter = ({ onSelectContinent }: GlobalCommandCenterProps) => {
  const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const totals = useMemo(() => ({
    continents: 7, countries: 195, users: '18,410', franchises: 62,
    resellers: '2,910', products: '21,900', sales: '$8.8M', revenue: '$13.5M',
    healthScore: 92, servers: 42,
    alerts: continentMarkers.reduce((s, c) => s + c.alerts, 0),
    liveEvents: continentMarkers.reduce((s, c) => s + c.liveEvents, 0),
  }), []);

  const activeMarker = continentMarkers.find(m => m.id === (hoveredContinent || selectedContinent));

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'linear-gradient(145deg, hsl(222, 47%, 5%) 0%, hsl(222, 47%, 9%) 50%, hsl(230, 40%, 7%) 100%)' }}>

      {/* ═══ Top Command Bar ═══ */}
      <div className="flex-shrink-0 px-5 py-2.5 border-b flex items-center justify-between" style={{ borderColor: borderCol, background: 'hsla(222, 47%, 8%, 0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1A4FA0, #3b82f6)' }}>
            <Globe2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">Software Vala — Global Command Center</h1>
            <p className="text-[9px]" style={{ color: mutedColor }}>Real-time ecosystem monitoring across 7 continents</p>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md ml-2" style={{ background: 'hsla(142, 70%, 45%, 0.12)', border: '1px solid hsla(142, 70%, 45%, 0.25)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-semibold text-emerald-400">ALL SYSTEMS LIVE</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-[10px]" style={{ color: labelColor }}>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {totals.liveEvents} events</span>
            <span className="flex items-center gap-1"><Server className="w-3 h-3 text-emerald-400" /> {totals.servers}/42 servers</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{ background: 'hsla(220, 40%, 15%, 0.6)' }}>
            <Clock className="w-3 h-3" style={{ color: labelColor }} />
            <span className="text-[10px] font-mono text-white">{liveTime.toLocaleTimeString('en-US', { hour12: false })}</span>
          </div>
        </div>
      </div>

      {/* ═══ Top KPI Strip — 10 Metric Cards ═══ */}
      <div className="flex-shrink-0 px-4 py-2.5 border-b overflow-x-auto" style={{ borderColor: borderCol }}>
        <div className="flex gap-2 min-w-max">
          {[
            { label: 'Continents', value: '7', icon: Globe2, color: '#1A4FA0', change: 'Active' },
            { label: 'Countries', value: '195', icon: Flag, color: '#3b82f6', change: '178 active' },
            { label: 'Users', value: totals.users, icon: Users, color: '#06b6d4', change: '+8.7%' },
            { label: 'Franchises', value: totals.franchises.toString(), icon: Building2, color: '#f59e0b', change: '+4' },
            { label: 'Resellers', value: totals.resellers, icon: Store, color: '#84cc16', change: '+126' },
            { label: 'Products', value: totals.products, icon: Package, color: '#8b5cf6', change: '+340' },
            { label: 'Sales', value: totals.sales, icon: ShoppingCart, color: '#10b981', change: '+12.3%' },
            { label: 'Revenue', value: totals.revenue, icon: DollarSign, color: '#10b981', change: '+$1.2M' },
            { label: 'Health', value: `${totals.healthScore}%`, icon: Activity, color: '#10b981', change: 'Stable' },
            { label: 'Servers', value: `${totals.servers}`, icon: Server, color: '#3b82f6', change: '100% up' },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="px-3 py-2 rounded-xl min-w-[110px]"
              style={cardStyle}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[8px] uppercase tracking-wider font-medium" style={{ color: mutedColor }}>{kpi.label}</span>
                <kpi.icon className="w-3 h-3" style={{ color: kpi.color }} />
              </div>
              <div className="text-base font-bold text-white leading-none">{kpi.value}</div>
              <span className="text-[8px] font-medium text-emerald-400 flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" />{kpi.change}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ Main Content: Map + Right Panel ═══ */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Center — World Map */}
        <div className="flex-1 relative overflow-hidden">
          
          {/* Map */}
          <div className="absolute inset-0">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 145, center: [20, 20] }}
              style={{ width: '100%', height: '100%' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rpiKey || geo.properties?.name}
                      geography={geo}
                      fill="hsla(220, 40%, 18%, 0.6)"
                      stroke="hsla(220, 50%, 30%, 0.35)"
                      strokeWidth={0.4}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: 'hsla(220, 50%, 25%, 0.7)', outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Animated Data Flow Lines with Moving Dots */}
              {dataFlowLines.map((line, i) => (
                <g key={`flow-${i}`}>
                  <Line
                    from={line.from as [number, number]}
                    to={line.to as [number, number]}
                    stroke="hsla(220, 80%, 60%, 0.15)"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                  />
                  {/* Animated traveling dot along the line */}
                  <Marker coordinates={line.from as [number, number]}>
                    <circle r={2} fill="#60a5fa" opacity={0.9}>
                      <animateMotion
                        dur={`${3 + i * 0.5}s`}
                        repeatCount="indefinite"
                        path={`M0,0 L${(line.to[0] - line.from[0]) * 2},${(line.to[1] - line.from[1]) * -2}`}
                      />
                      <animate attributeName="opacity" values="0;1;1;0" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
                    </circle>
                  </Marker>
                  {/* Second dot, offset timing */}
                  <Marker coordinates={line.from as [number, number]}>
                    <circle r={1.5} fill="#93c5fd" opacity={0.7}>
                      <animateMotion
                        dur={`${3 + i * 0.5}s`}
                        repeatCount="indefinite"
                        begin={`${1.5 + i * 0.25}s`}
                        path={`M0,0 L${(line.to[0] - line.from[0]) * 2},${(line.to[1] - line.from[1]) * -2}`}
                      />
                      <animate attributeName="opacity" values="0;0.8;0.8;0" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" begin={`${1.5 + i * 0.25}s`} />
                    </circle>
                  </Marker>
                </g>
              ))}

              {/* Activity Signal Points */}
              {activityPoints.map((pt, i) => (
                <Marker key={`act-${i}`} coordinates={pt.coordinates}>
                  <circle r={2.5} fill={pt.color} opacity={0.7}>
                    <animate attributeName="r" from="2" to="6" dur="3s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                    <animate attributeName="opacity" from="0.7" to="0" dur="3s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                  </circle>
                  <circle r={1.5} fill={pt.color} opacity={0.9} />
                </Marker>
              ))}

              {/* Continent HQ Markers */}
              {continentMarkers.map((marker) => {
                const isHovered = hoveredContinent === marker.id;
                return (
                  <Marker
                    key={marker.id}
                    coordinates={marker.coordinates}
                    onMouseEnter={() => setHoveredContinent(marker.id)}
                    onMouseLeave={() => setHoveredContinent(null)}
                    onClick={() => {
                      setSelectedContinent(marker.id);
                      onSelectContinent?.(marker.id);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle r={12} fill="none" stroke={marker.color} strokeWidth={1} opacity={0.3}>
                      <animate attributeName="r" from="10" to="24" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.4" to="0" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle r={isHovered ? 10 : 7} fill={marker.color} opacity={0.25} />
                    <circle r={isHovered ? 6 : 4.5} fill={marker.color} opacity={0.85} />
                    <circle r={isHovered ? 2.5 : 1.8} fill="white" opacity={0.9} />
                    <text textAnchor="middle" y={isHovered ? -18 : -14} style={{
                      fontFamily: 'system-ui', fontSize: isHovered ? '10px' : '8px',
                      fontWeight: 700, fill: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.9)', pointerEvents: 'none'
                    }}>
                      {marker.name}
                    </text>
                    {marker.alerts > 0 && (
                      <>
                        <circle cx={9} cy={-7} r={6} fill="#ef4444" />
                        <text x={9} y={-4} textAnchor="middle" style={{ fontSize: '7px', fontWeight: 700, fill: 'white' }}>{marker.alerts}</text>
                      </>
                    )}
                  </Marker>
                );
              })}
            </ComposableMap>
          </div>

          {/* Hover Tooltip */}
          <AnimatePresence>
            {activeMarker && (
              <motion.div
                key={activeMarker.id}
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[440px]"
                style={{
                  background: 'hsla(222, 47%, 10%, 0.96)',
                  backdropFilter: 'blur(24px)',
                  border: `1px solid ${activeMarker.color}44`,
                  borderRadius: '16px',
                  boxShadow: `0 20px 60px hsla(222, 47%, 3%, 0.8), 0 0 40px ${activeMarker.color}12`
                }}
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{activeMarker.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white">{activeMarker.name} Command</h3>
                      <p className="text-[10px]" style={{ color: labelColor }}>{activeMarker.countries} countries • {activeMarker.activeAdmins} admins • Health {activeMarker.healthScore}%</p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: 'hsla(142, 70%, 45%, 0.12)' }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] font-semibold text-emerald-400">LIVE</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {[
                      { l: 'Revenue', v: activeMarker.revenue, ic: DollarSign },
                      { l: 'Users', v: activeMarker.users, ic: Users },
                      { l: 'Sales', v: activeMarker.sales, ic: ShoppingCart },
                      { l: 'Franchises', v: activeMarker.franchises.toString(), ic: Building2 },
                      { l: 'Resellers', v: activeMarker.resellers.toString(), ic: Store },
                      { l: 'Licenses', v: activeMarker.licenses.toString(), ic: Key },
                    ].map((s) => (
                      <div key={s.l} className="text-center p-1.5 rounded-lg" style={{ background: surfaceBg }}>
                        <s.ic className="w-3 h-3 mx-auto mb-0.5" style={{ color: activeMarker.color }} />
                        <div className="text-xs font-bold text-white">{s.v}</div>
                        <div className="text-[7px]" style={{ color: mutedColor }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-2 px-2 py-1.5 rounded-lg" style={{ background: surfaceBg }}>
                    <span className="text-[9px] flex items-center gap-1 text-white"><Signal className="w-3 h-3" style={{ color: activeMarker.color }} /> {activeMarker.latency}</span>
                    <span className="text-[9px] flex items-center gap-1 text-white"><Package className="w-3 h-3" style={{ color: activeMarker.color }} /> {activeMarker.products} products</span>
                    <span className="text-[9px] flex items-center gap-1 text-white"><Activity className="w-3 h-3 text-emerald-400" /> {activeMarker.liveEvents} events</span>
                    <span className="text-[9px] flex items-center gap-1 text-white"><TrendingUp className="w-3 h-3 text-emerald-400" /> +{activeMarker.revenueChange}%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map Legend */}
          <div className="absolute top-4 left-4 z-10 px-3 py-2 rounded-xl" style={cardStyle}>
            <span className="text-[8px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: mutedColor }}>Map Signals</span>
            <div className="space-y-1">
              {[
                { color: '#3b82f6', label: 'User Activity' },
                { color: '#10b981', label: 'Sales' },
                { color: '#8b5cf6', label: 'Deployments' },
                { color: '#f59e0b', label: 'Licenses' },
                { color: '#ef4444', label: 'Alerts' },
                { color: '#06b6d4', label: 'Marketplace' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  <span className="text-[8px] text-white">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Stat Cards */}
          {floatingStats.map((fs, i) => (
            <motion.div
              key={fs.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
              transition={{ 
                delay: 1 + i * 0.2,
                y: { duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="absolute z-10 px-2.5 py-1.5 rounded-lg pointer-events-none"
              style={{
                top: fs.top, left: fs.left,
                background: 'hsla(222, 47%, 10%, 0.8)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${fs.color}33`,
                boxShadow: `0 4px 20px ${fs.color}15`,
              }}
            >
              <div className="text-[7px] uppercase tracking-wider" style={{ color: mutedColor }}>{fs.label}</div>
              <div className="text-sm font-bold text-white">{fs.value}</div>
            </motion.div>
          ))}

          {/* Bottom Continent Health Strip */}
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <div className="flex gap-1.5">
              {continentMarkers.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  onClick={() => onSelectContinent?.(m.id)}
                  onMouseEnter={() => setHoveredContinent(m.id)}
                  onMouseLeave={() => setHoveredContinent(null)}
                  className="flex-1 px-2.5 py-2 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    ...cardStyle,
                    ...(hoveredContinent === m.id ? { border: `1px solid ${m.color}55`, boxShadow: `0 0 16px ${m.color}18` } : {}),
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{m.icon}</span>
                    <span className="text-[9px] font-semibold text-white truncate">{m.name}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{m.revenue}</span>
                    <span className="text-[8px] font-medium text-emerald-400">+{m.revenueChange}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsla(220, 30%, 18%, 1)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: m.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${m.healthScore}%` }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.8 }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[7px]" style={{ color: mutedColor }}>Health</span>
                    <span className="text-[7px] font-bold text-white">{m.healthScore}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ RIGHT COMMAND PANEL ═══ */}
        <div className="w-[260px] flex-shrink-0 flex flex-col border-l overflow-hidden" style={{ borderColor: borderCol, background: 'hsla(222, 47%, 7%, 0.95)' }}>
          
          {/* Live Activity Feed Header */}
          <div className="px-3 py-2.5 border-b flex-shrink-0" style={{ borderColor: borderCol }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span className="text-xs font-bold text-white">Live Activity</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'hsla(142, 70%, 45%, 0.12)', color: '#10b981' }}>
                {totals.liveEvents} today
              </span>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1.5">
              {/* Feed Items */}
              {liveFeedItems.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.04 }}
                  className="p-2 rounded-lg"
                  style={{ background: surfaceBg, border: `1px solid ${borderCol}` }}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${event.color}18` }}>
                      <event.icon className="w-3 h-3" style={{ color: event.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-white font-medium leading-tight">{event.event}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2 h-2" style={{ color: mutedColor }} />
                        <span className="text-[8px]" style={{ color: labelColor }}>{event.region}</span>
                        <span className="text-[8px]" style={{ color: mutedColor }}>• {event.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* System Alerts */}
            <div className="border-t mx-2" style={{ borderColor: borderCol }}>
              <div className="px-1 py-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-bold text-white">System Alerts</span>
              </div>
              <div className="space-y-1 pb-2">
                {systemAlerts.map((alert, i) => (
                  <div key={i} className="px-2 py-1.5 rounded-lg flex items-start gap-2 mx-1" style={{ background: surfaceBg }}>
                    <div className={cn("w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0",
                      alert.severity === 'critical' && 'bg-red-400',
                      alert.severity === 'warning' && 'bg-amber-400',
                      alert.severity === 'info' && 'bg-blue-400',
                    )} />
                    <div>
                      <p className="text-[9px] text-white leading-tight">{alert.message}</p>
                      <span className="text-[8px]" style={{ color: mutedColor }}>{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Monitor */}
            <div className="border-t mx-2 py-2" style={{ borderColor: borderCol }}>
              <div className="flex items-center gap-1.5 px-1 mb-2">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-bold text-white">Risk Monitor</span>
              </div>
              <div className="space-y-1.5 px-1">
                {[
                  { label: 'Fraud Score', value: 'Low', pct: 12, color: '#10b981' },
                  { label: 'Compliance', value: '96%', pct: 96, color: '#3b82f6' },
                  { label: 'Threat Level', value: 'Normal', pct: 18, color: '#10b981' },
                ].map((r) => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px]" style={{ color: labelColor }}>{r.label}</span>
                      <span className="text-[9px] font-bold text-white">{r.value}</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsla(220, 30%, 18%, 1)' }}>
                      <div className="h-full rounded-full" style={{ background: r.color, width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Connections */}
            <div className="border-t mx-2 py-2" style={{ borderColor: borderCol }}>
              <div className="flex items-center gap-1.5 px-1 mb-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-bold text-white">System Connections</span>
              </div>
              <div className="space-y-1 px-1">
                {systemConnections.map((conn, i) => (
                  <motion.div
                    key={conn.name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.05 }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                    style={{ background: surfaceBg }}
                  >
                    <span className="text-xs">{conn.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-medium text-white block">{conn.name}</span>
                      <span className="text-[7px]" style={{ color: mutedColor }}>{conn.requests}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[7px] text-emerald-400">Live</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Infrastructure */}
            <div className="border-t mx-2 py-2" style={{ borderColor: borderCol }}>
              <div className="flex items-center gap-1.5 px-1 mb-2">
                <Cpu className="w-3.5 h-3.5" style={{ color: '#8b5cf6' }} />
                <span className="text-[10px] font-bold text-white">Infrastructure</span>
              </div>
              <div className="space-y-1.5 px-1">
                {[
                  { label: 'Servers', value: '42/42', pct: 100, color: '#10b981' },
                  { label: 'DB Load', value: '34%', pct: 34, color: '#3b82f6' },
                  { label: 'API Latency', value: '~38ms', pct: 82, color: '#8b5cf6' },
                  { label: 'CDN Hit Rate', value: '97.2%', pct: 97, color: '#06b6d4' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px]" style={{ color: labelColor }}>{item.label}</span>
                      <span className="text-[9px] font-bold text-white">{item.value}</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsla(220, 30%, 18%, 1)' }}>
                      <div className="h-full rounded-full transition-all" style={{ background: item.color, width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default GlobalCommandCenter;
