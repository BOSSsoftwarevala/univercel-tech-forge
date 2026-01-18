/**
 * ORION-STYLE GLOBAL NETWORK MAP
 * OPTIMIZED: Removed framer-motion, reduced updates, CSS-only animations
 * Enterprise-grade live world map
 */

import React, { useState, useMemo, memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Zap,
  Server,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Static region data - no live updates to prevent re-renders
const regionData = [
  { id: 'na', name: 'North America', coordinates: [-100, 40] as [number, number], status: 'healthy', transactions: 2847392, users: 1243567, growth: 12.4 },
  { id: 'eu', name: 'Europe', coordinates: [10, 50] as [number, number], status: 'healthy', transactions: 1923847, users: 892341, growth: 8.7 },
  { id: 'asia', name: 'Asia Pacific', coordinates: [105, 35] as [number, number], status: 'warning', transactions: 3421098, users: 2134567, growth: 23.1 },
  { id: 'sa', name: 'South America', coordinates: [-60, -15] as [number, number], status: 'healthy', transactions: 892341, users: 456123, growth: 15.2 },
  { id: 'africa', name: 'Africa', coordinates: [20, 5] as [number, number], status: 'healthy', transactions: 567234, users: 234567, growth: 31.4 },
  { id: 'oceania', name: 'Oceania', coordinates: [135, -25] as [number, number], status: 'healthy', transactions: 234123, users: 123456, growth: 9.8 },
];

const connections = [
  { from: [-100, 40], to: [10, 50], active: true },
  { from: [10, 50], to: [105, 35], active: true },
  { from: [-100, 40], to: [-60, -15], active: true },
  { from: [10, 50], to: [20, 5], active: false },
  { from: [105, 35], to: [135, -25], active: true },
  { from: [20, 5], to: [105, 35], active: false },
];

interface GlobalNetworkMapProps {
  className?: string;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return '#10b981';
    case 'warning': return '#f59e0b';
    case 'critical': return '#ef4444';
    default: return '#6b7280';
  }
};

// Memoized region item
const RegionItem = memo(({ region, isHovered, onHover }: { 
  region: typeof regionData[0]; 
  isHovered: boolean; 
  onHover: (id: string | null) => void;
}) => (
  <div
    className={cn(
      "p-3 rounded-lg cursor-pointer transition-colors duration-150",
      isHovered 
        ? "bg-slate-700/50 border border-slate-600" 
        : "bg-slate-800/30 border border-transparent hover:bg-slate-800/50"
    )}
    onMouseEnter={() => onHover(region.id)}
    onMouseLeave={() => onHover(null)}
  >
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-2">
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: getStatusColor(region.status) }}
        />
        <span className="text-xs font-medium text-slate-300">{region.name}</span>
      </div>
      <span className="text-[10px] text-emerald-400">+{region.growth}%</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-white">{formatNumber(region.transactions)}</span>
      <span className="text-[10px] text-slate-500">{formatNumber(region.users)} users</span>
    </div>
  </div>
));
RegionItem.displayName = 'RegionItem';

// Memoized stat item
const StatItem = memo(({ label, value, icon: Icon, color }: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="text-center">
    <Icon className={cn("w-4 h-4 mx-auto mb-1", color)} />
    <p className="text-sm font-bold text-white">{value}</p>
    <p className="text-[9px] text-slate-500">{label}</p>
  </div>
));
StatItem.displayName = 'StatItem';

// Memoized map component to prevent re-renders
const MapContent = memo(({ hoveredRegion, onHover }: { 
  hoveredRegion: string | null; 
  onHover: (id: string | null) => void;
}) => (
  <ComposableMap
    projection="geoMercator"
    projectionConfig={{ scale: 150, center: [20, 20] }}
    style={{ width: '100%', height: '100%' }}
  >
    <Geographies geography={geoUrl}>
      {({ geographies }) =>
        geographies.map((geo) => (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            fill="transparent"
            stroke="rgba(59, 130, 246, 0.15)"
            strokeWidth={0.5}
            style={{
              default: { outline: 'none' },
              hover: { outline: 'none', fill: 'rgba(59, 130, 246, 0.05)' },
              pressed: { outline: 'none' },
            }}
          />
        ))
      }
    </Geographies>

    {connections.map((conn, i) => (
      <Line
        key={i}
        from={conn.from as [number, number]}
        to={conn.to as [number, number]}
        stroke={conn.active ? "rgba(59, 130, 246, 0.4)" : "rgba(100, 116, 139, 0.2)"}
        strokeWidth={conn.active ? 1.5 : 0.5}
        strokeLinecap="round"
        strokeDasharray={conn.active ? "6 4" : "2 4"}
      />
    ))}

    {regionData.map((region) => {
      const isHovered = hoveredRegion === region.id;
      const statusColor = getStatusColor(region.status);
      
      return (
        <Marker 
          key={region.id} 
          coordinates={region.coordinates}
          onMouseEnter={() => onHover(region.id)}
          onMouseLeave={() => onHover(null)}
        >
          {/* Outer pulse ring - CSS animation */}
          <circle
            r={isHovered ? 35 : 25}
            fill={statusColor}
            opacity={0.1}
            className="animate-pulse"
          />
          {/* Core dot */}
          <circle
            r={isHovered ? 10 : 6}
            fill={statusColor}
            className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-150"
          />
          
          {/* Label on hover */}
          {isHovered && (
            <foreignObject x={-70} y={20} width={140} height={60}>
              <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-2 text-center shadow-xl">
                <p className="text-[10px] text-slate-400">{region.name}</p>
                <p className="text-sm font-bold text-white">{formatNumber(region.transactions)}</p>
                <p className="text-[9px] text-emerald-400">+{region.growth}% growth</p>
              </div>
            </foreignObject>
          )}
        </Marker>
      );
    })}
  </ComposableMap>
));
MapContent.displayName = 'MapContent';

export const GlobalNetworkMap = memo(({ className }: GlobalNetworkMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Static totals - no recalculation
  const totals = useMemo(() => ({
    transactions: regionData.reduce((acc, r) => acc + r.transactions, 0),
    users: regionData.reduce((acc, r) => acc + r.users, 0),
    avgGrowth: (regionData.reduce((acc, r) => acc + r.growth, 0) / regionData.length).toFixed(1),
  }), []);

  const stats = useMemo(() => [
    { label: 'Transactions/sec', value: '12.4K', icon: Activity, color: 'text-blue-400' },
    { label: 'Active Sessions', value: '847K', icon: Users, color: 'text-emerald-400' },
    { label: 'Revenue/hr', value: '$2.3M', icon: DollarSign, color: 'text-amber-400' },
    { label: 'API Calls', value: '98.7M', icon: Zap, color: 'text-purple-400' },
    { label: 'Server Load', value: '67%', icon: Server, color: 'text-cyan-400' },
    { label: 'Security Score', value: '98/100', icon: Shield, color: 'text-emerald-400' },
  ], []);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="grid grid-cols-[280px_1fr] min-h-[480px]">
        {/* Stats Panel */}
        <div className="bg-slate-900 border-r border-slate-800 p-4 flex flex-col">
          <div className="mb-6">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Global Operations</p>
            <h2 className="text-3xl font-bold text-white">
              {formatNumber(totals.transactions)}
            </h2>
            <p className="text-xs text-slate-500">Total Transactions</p>
          </div>

          {/* Static Activity Bar */}
          <div className="mb-6">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Live Activity</p>
            <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-800">
              <div className="bg-emerald-500" style={{ width: '30%' }} />
              <div className="bg-blue-500" style={{ width: '25%' }} />
              <div className="bg-amber-500" style={{ width: '20%' }} />
              <div className="bg-rose-500" style={{ width: '15%' }} />
            </div>
          </div>

          {/* Region List */}
          <div className="space-y-2 flex-1">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Regions</p>
            {regionData.map((region) => (
              <RegionItem 
                key={region.id}
                region={region}
                isHovered={hoveredRegion === region.id}
                onHover={setHoveredRegion}
              />
            ))}
          </div>

          {/* Bottom Stats */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-500/10 rounded-lg p-3">
                <Users className="w-4 h-4 text-blue-400 mb-1" />
                <p className="text-lg font-bold text-white">{formatNumber(totals.users)}</p>
                <p className="text-[10px] text-slate-500">Total Users</p>
              </div>
              <div className="bg-emerald-500/10 rounded-lg p-3">
                <TrendingUp className="w-4 h-4 text-emerald-400 mb-1" />
                <p className="text-lg font-bold text-white">{totals.avgGrowth}%</p>
                <p className="text-[10px] text-slate-500">Avg Growth</p>
              </div>
            </div>
          </div>
        </div>

        {/* MAP CONTAINER */}
        <div className="relative bg-[#0a0e1a]">
          {/* Hex Grid Background Pattern */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <MapContent hoveredRegion={hoveredRegion} onHover={setHoveredRegion} />

          {/* Gradient overlays */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0a0e1a] to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a0e1a] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0a0e1a] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0a0e1a] to-transparent pointer-events-none" />

          {/* Live indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-900/80 border border-slate-700 rounded-full px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-medium text-slate-300">LIVE</span>
          </div>

          {/* Quick Stats Bar */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
              {stats.map((stat) => (
                <StatItem key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
GlobalNetworkMap.displayName = 'GlobalNetworkMap';

export default GlobalNetworkMap;
