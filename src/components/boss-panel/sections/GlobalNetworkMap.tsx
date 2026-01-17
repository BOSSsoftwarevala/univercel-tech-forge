/**
 * ORION-STYLE GLOBAL NETWORK MAP
 * Enterprise-grade live world map with zero gaps
 * Dark theme, hex dots, animated connections
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ShoppingCart,
  Activity,
  Globe2,
  Zap,
  Server,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Live region data with real-time simulation
const regionData = [
  { 
    id: 'na',
    name: 'North America', 
    coordinates: [-100, 40] as [number, number],
    status: 'healthy',
    transactions: 2847392,
    users: 1243567,
    growth: 12.4,
  },
  { 
    id: 'eu',
    name: 'Europe', 
    coordinates: [10, 50] as [number, number],
    status: 'healthy',
    transactions: 1923847,
    users: 892341,
    growth: 8.7,
  },
  { 
    id: 'asia',
    name: 'Asia Pacific', 
    coordinates: [105, 35] as [number, number],
    status: 'warning',
    transactions: 3421098,
    users: 2134567,
    growth: 23.1,
  },
  { 
    id: 'sa',
    name: 'South America', 
    coordinates: [-60, -15] as [number, number],
    status: 'healthy',
    transactions: 892341,
    users: 456123,
    growth: 15.2,
  },
  { 
    id: 'africa',
    name: 'Africa', 
    coordinates: [20, 5] as [number, number],
    status: 'healthy',
    transactions: 567234,
    users: 234567,
    growth: 31.4,
  },
  { 
    id: 'oceania',
    name: 'Oceania', 
    coordinates: [135, -25] as [number, number],
    status: 'healthy',
    transactions: 234123,
    users: 123456,
    growth: 9.8,
  },
];

// Connection lines between regions
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

export function GlobalNetworkMap({ className }: GlobalNetworkMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [liveData, setLiveData] = useState(regionData);
  const [pulsePhase, setPulsePhase] = useState(0);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => prev.map(region => ({
        ...region,
        transactions: region.transactions + Math.floor(Math.random() * 100),
        users: region.users + Math.floor(Math.random() * 10),
      })));
      setPulsePhase(p => (p + 1) % 360);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Calculate totals
  const totals = useMemo(() => ({
    transactions: liveData.reduce((acc, r) => acc + r.transactions, 0),
    users: liveData.reduce((acc, r) => acc + r.users, 0),
    avgGrowth: (liveData.reduce((acc, r) => acc + r.growth, 0) / liveData.length).toFixed(1),
  }), [liveData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className={cn(
      "relative w-full overflow-hidden rounded-2xl",
      "bg-[#0a0e1a]",
      className
    )}>
      {/* GRID LAYOUT: Stats Panel + Map - NO GAP */}
      <div className="grid grid-cols-[280px_1fr] min-h-[70vh]">
        {/* LEFT STATS PANEL */}
        <div className="bg-[#0d1321] border-r border-slate-800/50 p-5 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Globe2 className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Global Network</span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              {formatNumber(totals.transactions)}
            </h2>
            <p className="text-xs text-slate-500">Total Transactions</p>
          </div>

          {/* Live Activity Bar */}
          <div className="mb-6">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Live Activity</p>
            <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-800">
              <motion.div 
                className="bg-emerald-500"
                animate={{ width: ['30%', '35%', '30%'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div 
                className="bg-blue-500"
                animate={{ width: ['25%', '22%', '25%'] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <motion.div 
                className="bg-amber-500"
                animate={{ width: ['20%', '23%', '20%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="bg-rose-500"
                animate={{ width: ['15%', '12%', '15%'] }}
                transition={{ duration: 2.8, repeat: Infinity }}
              />
            </div>
          </div>

          {/* Region List */}
          <div className="space-y-2 flex-1">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Regions</p>
            {liveData.map((region, i) => (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-all",
                  hoveredRegion === region.id 
                    ? "bg-slate-700/50 border border-slate-600" 
                    : "bg-slate-800/30 border border-transparent hover:bg-slate-800/50"
                )}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
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
              </motion.div>
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

        {/* MAP CONTAINER - FULL WIDTH, NO PADDING */}
        <div className="relative bg-[#0a0e1a]">
          {/* Hex Grid Background Pattern */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Map */}
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 150,
              center: [20, 20],
            }}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Geography - Transparent with glowing borders */}
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

            {/* Animated Connection Lines */}
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

            {/* Region Markers */}
            {liveData.map((region) => {
              const isHovered = hoveredRegion === region.id;
              const statusColor = getStatusColor(region.status);
              
              return (
                <Marker 
                  key={region.id} 
                  coordinates={region.coordinates}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  {/* Outer pulse ring */}
                  <motion.circle
                    r={isHovered ? 35 : 25}
                    fill={statusColor}
                    opacity={0.1}
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.1, 0.05, 0.1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />

                  {/* Middle ring */}
                  <motion.circle
                    r={isHovered ? 20 : 14}
                    fill={statusColor}
                    opacity={0.2}
                    animate={{ 
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />

                  {/* Core dot */}
                  <motion.circle
                    r={isHovered ? 10 : 6}
                    fill={statusColor}
                    className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    animate={{ scale: isHovered ? 1.3 : 1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  />

                  {/* Label on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.g
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <foreignObject
                          x={-70}
                          y={20}
                          width={140}
                          height={60}
                        >
                          <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-2 text-center shadow-xl">
                            <p className="text-[10px] text-slate-400">{region.name}</p>
                            <p className="text-sm font-bold text-white">{formatNumber(region.transactions)}</p>
                            <p className="text-[9px] text-emerald-400">+{region.growth}% growth</p>
                          </div>
                        </foreignObject>
                      </motion.g>
                    )}
                  </AnimatePresence>
                </Marker>
              );
            })}
          </ComposableMap>

          {/* Gradient overlays for depth */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0a0e1a] to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a0e1a] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0a0e1a] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0a0e1a] to-transparent pointer-events-none" />

          {/* Live indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-900/80 border border-slate-700 rounded-full px-3 py-1.5">
            <motion.div 
              className="w-2 h-2 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-[10px] font-medium text-slate-300">LIVE</span>
          </div>

          {/* Quick Stats Bar */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
              {[
                { label: 'Transactions/sec', value: '12.4K', icon: Activity, color: 'text-blue-400' },
                { label: 'Active Sessions', value: '847K', icon: Users, color: 'text-emerald-400' },
                { label: 'Revenue/hr', value: '$2.3M', icon: DollarSign, color: 'text-amber-400' },
                { label: 'API Calls', value: '98.7M', icon: Zap, color: 'text-purple-400' },
                { label: 'Server Load', value: '67%', icon: Server, color: 'text-cyan-400' },
                { label: 'Security Score', value: '98/100', icon: Shield, color: 'text-emerald-400' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="text-center"
                >
                  <stat.icon className={cn("w-4 h-4 mx-auto mb-1", stat.color)} />
                  <p className="text-sm font-bold text-white">{stat.value}</p>
                  <p className="text-[9px] text-slate-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalNetworkMap;
