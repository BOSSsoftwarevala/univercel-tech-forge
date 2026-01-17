import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup,
} from 'react-simple-maps';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  Activity,
  Globe2,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// BRAND THEME: Blue + Red colors
const globalMarkers = [
  { 
    id: 'chicago',
    name: 'Chicago', 
    coordinates: [-87.6298, 41.8781] as [number, number], 
    value: '98,320,300',
    color: 'hsl(217, 91%, 50%)', // Primary Blue
    icon: ShoppingCart,
    size: 'large'
  },
  { 
    id: 'canada',
    name: 'Canada', 
    coordinates: [-106.3468, 56.1304] as [number, number], 
    value: '6,097,321',
    color: 'hsl(199, 89%, 48%)', // Cyan
    icon: Users,
    size: 'medium'
  },
  { 
    id: 'berlin',
    name: 'Berlin', 
    coordinates: [13.4050, 52.5200] as [number, number], 
    value: '76,541,106',
    color: 'hsl(0, 84%, 60%)', // Brand Red
    icon: TrendingUp,
    size: 'large'
  },
  { 
    id: 'russia',
    name: 'Russia', 
    coordinates: [105.3188, 61.5240] as [number, number], 
    value: '66,097,321',
    color: 'hsl(0, 84%, 60%)', // Brand Red
    icon: Activity,
    size: 'large'
  },
  { 
    id: 'morocco',
    name: 'Morocco', 
    coordinates: [-7.0926, 31.7917] as [number, number], 
    value: '4,591,031',
    color: 'hsl(142, 71%, 45%)', // Success Green
    icon: Globe2,
    size: 'medium'
  },
  { 
    id: 'manaus',
    name: 'Manaus', 
    coordinates: [-60.0217, -3.1190] as [number, number], 
    value: '12,320,300',
    color: 'hsl(38, 92%, 50%)', // Warning Orange
    icon: DollarSign,
    size: 'medium'
  },
  { 
    id: 'shanghai',
    name: 'Shanghai', 
    coordinates: [121.4737, 31.2304] as [number, number], 
    value: '239,570,110',
    color: 'hsl(0, 84%, 60%)', // Brand Red
    icon: TrendingUp,
    size: 'large'
  },
  { 
    id: 'giza',
    name: 'Giza', 
    coordinates: [31.2089, 30.0131] as [number, number], 
    value: '10,547,980',
    color: 'hsl(199, 89%, 48%)', // Cyan
    icon: Users,
    size: 'medium'
  },
  { 
    id: 'queenstown',
    name: 'Queensland', 
    coordinates: [153.0251, -27.4698] as [number, number], 
    value: '6,097,321',
    color: 'hsl(217, 91%, 50%)', // Primary Blue
    icon: Activity,
    size: 'medium'
  },
];

// Connection lines between cities
const connections = [
  { from: [-87.6298, 41.8781], to: [13.4050, 52.5200] },
  { from: [13.4050, 52.5200], to: [105.3188, 61.5240] },
  { from: [-106.3468, 56.1304], to: [13.4050, 52.5200] },
  { from: [-7.0926, 31.7917], to: [31.2089, 30.0131] },
];

// Stats cards data - Brand colors
const statsCards = [
  { label: 'Transactions', value: '343,054', icon: Activity, gradient: 'from-primary to-primary/70' },
  { label: 'Purchases', value: '44,430', icon: ShoppingCart, gradient: 'from-destructive to-destructive/70' },
  { label: 'Dynamic', value: '12,503', icon: TrendingUp, gradient: 'from-amber-500 to-amber-400' },
];

// Country activity list
const countryActivity = [
  { country: 'United States', value: '4,504,210', percent: 55 },
  { country: 'France', value: '2,100,950', percent: 25 },
  { country: 'China', value: '1,960,240', percent: 15 },
  { country: 'Brazil', value: '1,504,210', percent: 15 },
];

interface GlobalNetworkMapProps {
  className?: string;
}

export function GlobalNetworkMap({ className }: GlobalNetworkMapProps) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 20]);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.5, 8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.5, 1));
  const handleReset = () => {
    setZoom(1);
    setCenter([0, 20]);
  };

  return (
    <div className={`bg-sidebar rounded-3xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">General Statistics</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">All users</span>
              <span className="text-xs text-primary cursor-pointer hover:underline">DETAIL →</span>
            </div>
            <p className="text-4xl font-bold text-foreground mt-2">7,541,390</p>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              className="bg-white/5 hover:bg-white/10 text-foreground rounded-xl"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              className="bg-white/5 hover:bg-white/10 text-foreground rounded-xl"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="bg-white/5 hover:bg-white/10 text-foreground rounded-xl"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Current Activity Bar - Brand colors */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Current activity</p>
          <div className="flex h-2 rounded-full overflow-hidden bg-muted">
            <div className="bg-primary w-[35%]" />
            <div className="bg-primary/70 w-[25%]" />
            <div className="bg-destructive w-[20%]" />
            <div className="bg-amber-500 w-[20%]" />
          </div>
        </div>

        {/* Country List */}
        <div className="space-y-2 mb-4">
          {countryActivity.map((item, i) => (
            <div key={item.country} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  i === 0 ? 'bg-primary' : i === 1 ? 'bg-primary/70' : i === 2 ? 'bg-destructive' : 'bg-amber-500'
                }`} />
                <span className="text-muted-foreground">{item.country}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-foreground font-medium">{item.value}</span>
                <span className="text-muted-foreground w-8 text-right">{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[400px]">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 140 * zoom,
            center: center,
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup zoom={zoom} center={center} onMoveEnd={({ coordinates }) => setCenter(coordinates as [number, number])}>
            {/* Geography */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="transparent"
                    stroke="#1e293b"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: 'rgba(59, 130, 246, 0.1)' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Hexagonal dot pattern overlay - simulated with small circles */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={`hex-${geo.rsmKey}`}
                    geography={geo}
                    fill="url(#hexPattern)"
                    stroke="none"
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Connection Lines */}
            {connections.map((conn, i) => (
              <Line
                key={i}
                from={conn.from as [number, number]}
                to={conn.to as [number, number]}
                stroke="rgba(236, 72, 153, 0.4)"
                strokeWidth={1}
                strokeLinecap="round"
                strokeDasharray="4 2"
              />
            ))}

            {/* City Markers */}
            {globalMarkers.map((marker) => {
              const Icon = marker.icon;
              const isHovered = hoveredMarker === marker.id;
              const markerSize = marker.size === 'large' ? 40 : 32;
              
              return (
                <Marker 
                  key={marker.id} 
                  coordinates={marker.coordinates}
                  onMouseEnter={() => setHoveredMarker(marker.id)}
                  onMouseLeave={() => setHoveredMarker(null)}
                >
                  {/* Pulse effect */}
                  <motion.circle
                    r={markerSize / 2 + 8}
                    fill={marker.color}
                    opacity={0.2}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.1, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {/* Main marker */}
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: isHovered ? 1.2 : 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <circle
                      r={markerSize / 2}
                      fill={marker.color}
                      className="drop-shadow-lg"
                    />
                    <foreignObject
                      x={-10}
                      y={-10}
                      width={20}
                      height={20}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                    </foreignObject>
                  </motion.g>

                  {/* Label */}
                  <AnimatePresence>
                    {(isHovered || marker.size === 'large') && (
                      <motion.g
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <foreignObject
                          x={-60}
                          y={markerSize / 2 + 5}
                          width={120}
                          height={50}
                        >
                          <div className="text-center">
                            <p className="text-[10px] text-slate-400">{marker.name}</p>
                            <p className="text-xs font-bold text-white">{marker.value}</p>
                          </div>
                        </foreignObject>
                      </motion.g>
                    )}
                  </AnimatePresence>
                </Marker>
              );
            })}
          </ZoomableGroup>

          {/* SVG Defs for patterns */}
          <defs>
            <pattern id="hexPattern" patternUnits="userSpaceOnUse" width="8" height="8">
              <circle cx="4" cy="4" r="1.5" fill="rgba(59, 130, 246, 0.3)" />
            </pattern>
          </defs>
        </ComposableMap>

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#0a0e1a]/50 via-transparent to-transparent" />
      </div>

      {/* Bottom Stats */}
      <div className="p-6 pt-4">
        <div className="flex items-center justify-between">
          {/* Stats Cards */}
          <div className="flex gap-3">
            {statsCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-4 min-w-[100px]`}
                >
                  <Icon className="w-5 h-5 text-white/80 mb-2" />
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/70">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Right side totals */}
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-xs text-slate-400">All users</p>
              <p className="text-xl font-bold text-white">1,430,205</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Unique</p>
              <p className="text-xl font-bold text-white">45,549</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">New users</p>
              <p className="text-xl font-bold text-white">32,950</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Trend</p>
              <p className="text-xl font-bold text-emerald-400">95%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
