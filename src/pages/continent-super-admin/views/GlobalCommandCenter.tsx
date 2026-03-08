// ============================================
// SOFTWARE VALA — GLOBAL COMMAND CENTER
// 7D World Map Dashboard
// Enterprise Execution Mode
// ============================================
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup
} from 'react-simple-maps';
import {
  Globe2, Activity, Users, TrendingUp, Zap, Shield,
  MapPin, ArrowUpRight, ArrowDownRight, Server, Wifi,
  DollarSign, Package, Store, Building2, AlertTriangle,
  Clock, Eye, Radio, Layers, BarChart3, ChevronRight,
  Signal, Database, Cpu, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Continent HQ markers with live data
const continentMarkers = [
  {
    id: 'asia',
    name: 'Asia Pacific',
    coordinates: [105, 25] as [number, number],
    icon: '🌏',
    color: '#ef4444',
    status: 'active',
    countries: 48,
    activeAdmins: 45,
    revenue: '$2.4M',
    revenueChange: 12.5,
    users: '3,240',
    products: 4200,
    franchises: 18,
    resellers: 890,
    healthScore: 94,
    latency: '42ms',
    alerts: 2,
    liveEvents: 156,
  },
  {
    id: 'africa',
    name: 'Africa',
    coordinates: [20, 5] as [number, number],
    icon: '🌍',
    color: '#f59e0b',
    status: 'active',
    countries: 54,
    activeAdmins: 48,
    revenue: '$1.8M',
    revenueChange: 24.3,
    users: '2,850',
    products: 3100,
    franchises: 14,
    resellers: 720,
    healthScore: 89,
    latency: '68ms',
    alerts: 5,
    liveEvents: 203,
  },
  {
    id: 'europe',
    name: 'Europe',
    coordinates: [15, 50] as [number, number],
    icon: '🌍',
    color: '#3b82f6',
    status: 'active',
    countries: 44,
    activeAdmins: 42,
    revenue: '$3.1M',
    revenueChange: 8.7,
    users: '4,120',
    products: 5600,
    franchises: 12,
    resellers: 540,
    healthScore: 96,
    latency: '28ms',
    alerts: 1,
    liveEvents: 89,
  },
  {
    id: 'north_america',
    name: 'North America',
    coordinates: [-100, 45] as [number, number],
    icon: '🌎',
    color: '#10b981',
    status: 'active',
    countries: 23,
    activeAdmins: 21,
    revenue: '$4.2M',
    revenueChange: 6.2,
    users: '5,800',
    products: 6100,
    franchises: 8,
    resellers: 320,
    healthScore: 91,
    latency: '22ms',
    alerts: 3,
    liveEvents: 67,
  },
  {
    id: 'south_america',
    name: 'South America',
    coordinates: [-60, -15] as [number, number],
    icon: '🌎',
    color: '#84cc16',
    status: 'active',
    countries: 12,
    activeAdmins: 10,
    revenue: '$890K',
    revenueChange: 18.4,
    users: '1,420',
    products: 1800,
    franchises: 6,
    resellers: 280,
    healthScore: 87,
    latency: '55ms',
    alerts: 2,
    liveEvents: 45,
  },
  {
    id: 'oceania',
    name: 'Oceania',
    coordinates: [135, -25] as [number, number],
    icon: '🌏',
    color: '#8b5cf6',
    status: 'active',
    countries: 14,
    activeAdmins: 12,
    revenue: '$1.1M',
    revenueChange: 14.1,
    users: '980',
    products: 1200,
    franchises: 4,
    resellers: 160,
    healthScore: 88,
    latency: '38ms',
    alerts: 0,
    liveEvents: 38,
  },
];

// Data flow lines between continents
const dataFlowLines = [
  { from: [15, 50], to: [-100, 45] },       // Europe -> NA
  { from: [-100, 45], to: [105, 25] },       // NA -> Asia
  { from: [105, 25], to: [135, -25] },       // Asia -> Oceania
  { from: [20, 5], to: [15, 50] },           // Africa -> Europe
  { from: [-60, -15], to: [-100, 45] },      // SA -> NA
  { from: [15, 50], to: [105, 25] },         // Europe -> Asia
];

// Live feed events
const liveFeed = [
  { time: '2s ago', event: 'New franchise application', region: 'Kenya', type: 'info', icon: Building2 },
  { time: '8s ago', event: 'Product purchase: $2,400', region: 'India', type: 'success', icon: Package },
  { time: '15s ago', event: 'Reseller onboarded', region: 'UK', type: 'info', icon: Store },
  { time: '22s ago', event: 'High risk alert triggered', region: 'Brazil', type: 'warning', icon: AlertTriangle },
  { time: '31s ago', event: 'License generated', region: 'USA', type: 'success', icon: Zap },
  { time: '45s ago', event: 'Withdrawal approved', region: 'Germany', type: 'info', icon: DollarSign },
  { time: '52s ago', event: 'Server scaled up', region: 'Singapore', type: 'info', icon: Server },
  { time: '1m ago', event: 'New influencer joined', region: 'Philippines', type: 'success', icon: Users },
];

interface GlobalCommandCenterProps {
  onSelectContinent?: (continentId: string) => void;
}

const GlobalCommandCenter = ({ onSelectContinent }: GlobalCommandCenterProps) => {
  const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(p => (p + 1) % 360);
      setLiveTime(new Date());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const totals = useMemo(() => ({
    revenue: '$13.5M',
    users: '18,410',
    products: '21,900',
    franchises: 62,
    resellers: 2910,
    countries: 195,
    activeAdmins: 178,
    alerts: continentMarkers.reduce((s, c) => s + c.alerts, 0),
    liveEvents: continentMarkers.reduce((s, c) => s + c.liveEvents, 0),
  }), []);

  const activeMarker = continentMarkers.find(m => m.id === (hoveredContinent || selectedContinent));

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'linear-gradient(145deg, hsl(222, 47%, 5%) 0%, hsl(222, 47%, 9%) 50%, hsl(230, 40%, 7%) 100%)' }}>

      {/* Top Command Bar */}
      <div className="flex-shrink-0 px-6 py-3 border-b flex items-center justify-between" style={{ borderColor: 'hsla(220, 50%, 30%, 0.3)', background: 'hsla(222, 47%, 8%, 0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1A4FA0, #3b82f6)' }}>
            <Globe2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Software Vala — Global Command Center</h1>
            <p className="text-xs" style={{ color: 'hsla(220, 30%, 60%, 1)' }}>Real-time ecosystem monitoring across 7 continents</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'hsla(142, 70%, 45%, 0.15)', border: '1px solid hsla(142, 70%, 45%, 0.3)' }}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">ALL SYSTEMS OPERATIONAL</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'hsla(220, 50%, 30%, 0.2)' }}>
            <Clock className="w-3.5 h-3.5" style={{ color: 'hsla(220, 30%, 60%, 1)' }} />
            <span className="text-xs font-mono text-white">{liveTime.toLocaleTimeString('en-US', { hour12: false })}</span>
            <span className="text-xs" style={{ color: 'hsla(220, 30%, 50%, 1)' }}>UTC</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Map Area */}
        <div className="flex-1 relative overflow-hidden">

          {/* Global KPI Strip */}
          <div className="absolute top-4 left-4 right-4 z-10 flex gap-3">
            {[
              { label: 'Global Revenue', value: totals.revenue, icon: DollarSign, change: '+12.3%', up: true, color: '#10b981' },
              { label: 'Active Users', value: totals.users, icon: Users, change: '+8.7%', up: true, color: '#3b82f6' },
              { label: 'Products Live', value: totals.products, icon: Package, change: '+156', up: true, color: '#8b5cf6' },
              { label: 'Live Events', value: totals.liveEvents.toString(), icon: Activity, change: 'Real-time', up: true, color: '#f59e0b' },
              { label: 'Active Alerts', value: totals.alerts.toString(), icon: AlertTriangle, change: totals.alerts > 5 ? 'High' : 'Normal', up: totals.alerts <= 5, color: totals.alerts > 5 ? '#ef4444' : '#10b981' },
            ].map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex-1 px-4 py-3 rounded-xl"
                style={{
                  background: 'hsla(222, 47%, 10%, 0.85)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid hsla(220, 50%, 25%, 0.4)',
                  boxShadow: '0 8px 32px hsla(222, 47%, 5%, 0.5)'
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: 'hsla(220, 30%, 55%, 1)' }}>{kpi.label}</span>
                  <kpi.icon className="w-3.5 h-3.5" style={{ color: kpi.color }} />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-white">{kpi.value}</span>
                  <span className={cn("text-[10px] font-medium flex items-center gap-0.5 mb-0.5", kpi.up ? "text-emerald-400" : "text-red-400")}>
                    {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* World Map */}
          <div className="absolute inset-0" style={{ filter: 'saturate(1.2)' }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 140, center: [20, 20] }}
              style={{ width: '100%', height: '100%' }}
            >
              <defs>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsla(220, 60%, 30%, 0.15)" />
                  <stop offset="100%" stopColor="hsla(222, 47%, 5%, 0)" />
                </radialGradient>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsla(220, 80%, 60%, 0)" />
                  <stop offset="50%" stopColor="hsla(220, 80%, 60%, 0.6)" />
                  <stop offset="100%" stopColor="hsla(220, 80%, 60%, 0)" />
                </linearGradient>
              </defs>

              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rpiKey || geo.properties?.name}
                      geography={geo}
                      fill="hsla(220, 40%, 18%, 0.6)"
                      stroke="hsla(220, 50%, 30%, 0.4)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: 'hsla(220, 50%, 25%, 0.8)', outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Data Flow Lines */}
              {dataFlowLines.map((line, i) => (
                <Line
                  key={i}
                  from={line.from as [number, number]}
                  to={line.to as [number, number]}
                  stroke="hsla(220, 80%, 60%, 0.15)"
                  strokeWidth={1}
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Continent HQ Markers */}
              {continentMarkers.map((marker) => {
                const isHovered = hoveredContinent === marker.id;
                const isSelected = selectedContinent === marker.id;
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
                    {/* Pulse ring */}
                    <circle r={isHovered ? 18 : 12} fill="none" stroke={marker.color} strokeWidth={1} opacity={0.3}>
                      <animate attributeName="r" from={isHovered ? 14 : 10} to={isHovered ? 28 : 20} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    {/* Outer glow */}
                    <circle r={isHovered ? 12 : 8} fill={marker.color} opacity={0.2} />
                    {/* Core dot */}
                    <circle r={isHovered ? 7 : 5} fill={marker.color} opacity={0.9} />
                    <circle r={isHovered ? 3 : 2} fill="white" opacity={0.9} />
                    {/* Label */}
                    <text
                      textAnchor="middle"
                      y={isHovered ? -22 : -16}
                      style={{
                        fontFamily: 'system-ui',
                        fontSize: isHovered ? '11px' : '9px',
                        fontWeight: 700,
                        fill: 'white',
                        textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                        pointerEvents: 'none'
                      }}
                    >
                      {marker.name}
                    </text>
                    {/* Alert badge */}
                    {marker.alerts > 0 && (
                      <>
                        <circle cx={10} cy={-8} r={7} fill="#ef4444" />
                        <text x={10} y={-5} textAnchor="middle" style={{ fontSize: '8px', fontWeight: 700, fill: 'white' }}>
                          {marker.alerts}
                        </text>
                      </>
                    )}
                  </Marker>
                );
              })}
            </ComposableMap>
          </div>

          {/* Bottom Continent Health Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="flex gap-2">
              {continentMarkers.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  onClick={() => onSelectContinent?.(m.id)}
                  onMouseEnter={() => setHoveredContinent(m.id)}
                  onMouseLeave={() => setHoveredContinent(null)}
                  className={cn(
                    "flex-1 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300",
                    hoveredContinent === m.id && "scale-[1.02]"
                  )}
                  style={{
                    background: hoveredContinent === m.id
                      ? `linear-gradient(135deg, ${m.color}22, hsla(222, 47%, 12%, 0.9))`
                      : 'hsla(222, 47%, 10%, 0.85)',
                    backdropFilter: 'blur(20px)',
                    border: hoveredContinent === m.id
                      ? `1px solid ${m.color}66`
                      : '1px solid hsla(220, 50%, 25%, 0.3)',
                    boxShadow: hoveredContinent === m.id
                      ? `0 0 20px ${m.color}22`
                      : 'none'
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">{m.icon}</span>
                    <span className="text-[10px] font-semibold text-white truncate">{m.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{m.revenue}</span>
                    <span className={cn("text-[9px] font-medium", m.revenueChange > 0 ? "text-emerald-400" : "text-red-400")}>
                      +{m.revenueChange}%
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsla(220, 30%, 20%, 1)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: m.color, width: `${m.healthScore}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${m.healthScore}%` }}
                        transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                      />
                    </div>
                    <span className="text-[8px] mt-0.5 block" style={{ color: 'hsla(220, 30%, 50%, 1)' }}>Health: {m.healthScore}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Hover Tooltip Card */}
          <AnimatePresence>
            {activeMarker && (
              <motion.div
                key={activeMarker.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute top-28 left-1/2 -translate-x-1/2 z-20 w-[420px]"
                style={{
                  background: 'hsla(222, 47%, 10%, 0.95)',
                  backdropFilter: 'blur(24px)',
                  border: `1px solid ${activeMarker.color}44`,
                  borderRadius: '16px',
                  boxShadow: `0 20px 60px hsla(222, 47%, 3%, 0.7), 0 0 40px ${activeMarker.color}15`
                }}
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{activeMarker.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white">{activeMarker.name} Command</h3>
                      <p className="text-[10px]" style={{ color: 'hsla(220, 30%, 55%, 1)' }}>{activeMarker.countries} countries • {activeMarker.activeAdmins} active admins</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: 'hsla(142, 70%, 45%, 0.15)' }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-medium text-emerald-400">LIVE</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { label: 'Revenue', value: activeMarker.revenue, icon: DollarSign },
                      { label: 'Users', value: activeMarker.users, icon: Users },
                      { label: 'Franchises', value: activeMarker.franchises.toString(), icon: Building2 },
                      { label: 'Resellers', value: activeMarker.resellers.toString(), icon: Store },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center p-2 rounded-lg" style={{ background: 'hsla(220, 40%, 15%, 0.6)' }}>
                        <stat.icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: activeMarker.color }} />
                        <div className="text-sm font-bold text-white">{stat.value}</div>
                        <div className="text-[8px]" style={{ color: 'hsla(220, 30%, 50%, 1)' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between px-2 py-1.5 rounded-lg" style={{ background: 'hsla(220, 40%, 15%, 0.4)' }}>
                    <div className="flex items-center gap-2">
                      <Signal className="w-3 h-3" style={{ color: activeMarker.color }} />
                      <span className="text-[10px] text-white">Latency: {activeMarker.latency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="w-3 h-3" style={{ color: activeMarker.color }} />
                      <span className="text-[10px] text-white">{activeMarker.products} products</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] text-white">{activeMarker.liveEvents} events/24h</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel — Live Feed */}
        <div className="w-[300px] flex-shrink-0 flex flex-col border-l" style={{ borderColor: 'hsla(220, 50%, 25%, 0.3)', background: 'hsla(222, 47%, 8%, 0.9)' }}>
          {/* Panel Header */}
          <div className="px-4 py-3 border-b" style={{ borderColor: 'hsla(220, 50%, 25%, 0.3)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-sm font-bold text-white">Live Activity Feed</span>
              </div>
              <RefreshCw className="w-3.5 h-3.5" style={{ color: 'hsla(220, 30%, 50%, 1)' }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'hsla(142, 70%, 45%, 0.15)', color: '#10b981' }}>
                {totals.liveEvents} events today
              </span>
            </div>
          </div>

          {/* Feed Items */}
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {liveFeed.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="p-3 rounded-xl"
                  style={{
                    background: 'hsla(220, 40%, 13%, 0.6)',
                    border: '1px solid hsla(220, 50%, 25%, 0.2)'
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                      event.type === 'success' && 'bg-emerald-500/15',
                      event.type === 'warning' && 'bg-amber-500/15',
                      event.type === 'info' && 'bg-blue-500/15',
                    )}>
                      <event.icon className={cn(
                        "w-3.5 h-3.5",
                        event.type === 'success' && 'text-emerald-400',
                        event.type === 'warning' && 'text-amber-400',
                        event.type === 'info' && 'text-blue-400',
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-medium leading-tight">{event.event}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-2.5 h-2.5" style={{ color: 'hsla(220, 30%, 50%, 1)' }} />
                        <span className="text-[10px]" style={{ color: 'hsla(220, 30%, 55%, 1)' }}>{event.region}</span>
                        <span className="text-[10px]" style={{ color: 'hsla(220, 30%, 40%, 1)' }}>•</span>
                        <span className="text-[10px]" style={{ color: 'hsla(220, 30%, 45%, 1)' }}>{event.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          {/* Infrastructure Summary */}
          <div className="p-4 border-t" style={{ borderColor: 'hsla(220, 50%, 25%, 0.3)' }}>
            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'hsla(220, 30%, 50%, 1)' }}>Infrastructure</span>
            <div className="mt-2 space-y-2">
              {[
                { label: 'Servers Online', value: '42/42', pct: 100, color: '#10b981' },
                { label: 'Database Load', value: '34%', pct: 34, color: '#3b82f6' },
                { label: 'API Response', value: '~38ms', pct: 85, color: '#8b5cf6' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-white">{item.label}</span>
                    <span className="text-[10px] font-bold text-white">{item.value}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsla(220, 30%, 18%, 1)' }}>
                    <div className="h-full rounded-full transition-all" style={{ background: item.color, width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalCommandCenter;
