import { motion } from 'framer-motion';
import { MapPin, Building2, TrendingUp, Users } from 'lucide-react';
import type { Franchise } from '@/pages/FranchiseManagement';

interface TerritoryMapProps {
  franchises: Franchise[];
  onSelectFranchise: (franchise: Franchise) => void;
}

const stateCoordinates: Record<string, { x: number; y: number }> = {
  'Maharashtra': { x: 25, y: 55 },
  'Delhi': { x: 35, y: 25 },
  'Karnataka': { x: 25, y: 70 },
  'Tamil Nadu': { x: 30, y: 80 },
  'Telangana': { x: 30, y: 60 },
  'Gujarat': { x: 15, y: 45 },
  'Rajasthan': { x: 20, y: 30 },
  'Uttar Pradesh': { x: 40, y: 30 },
  'West Bengal': { x: 60, y: 40 },
  'Punjab': { x: 30, y: 18 },
  'Haryana': { x: 32, y: 22 },
  'Kerala': { x: 25, y: 85 },
  'Andhra Pradesh': { x: 35, y: 65 },
  'Madhya Pradesh': { x: 35, y: 42 },
  'Bihar': { x: 55, y: 32 },
  'Odisha': { x: 52, y: 50 },
  'Jharkhand': { x: 52, y: 38 },
  'Assam': { x: 75, y: 30 },
  'Chhattisgarh': { x: 45, y: 50 }
};

const statusColors = {
  active: '#00f0ff',
  pending: '#ff9500',
  suspended: '#ef4444',
  terminated: '#6b7280'
};

const TerritoryMap = ({ franchises, onSelectFranchise }: TerritoryMapProps) => {
  // Group franchises by state
  const franchisesByState = franchises.reduce((acc, franchise) => {
    if (!acc[franchise.state]) {
      acc[franchise.state] = [];
    }
    acc[franchise.state].push(franchise);
    return acc;
  }, {} as Record<string, Franchise[]>);

  const totalActive = franchises.filter(f => f.status === 'active').length;
  const totalSales = franchises.reduce((sum, f) => sum + f.totalSales, 0);

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-mono font-bold text-foreground">Territory Overview</h3>
          <p className="text-sm text-muted-foreground">Click on markers to view franchise details</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-orange" />
            <span className="text-xs text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-red" />
            <span className="text-xs text-muted-foreground">Suspended</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[500px] bg-secondary/30 rounded-xl border border-border/30 overflow-hidden">
        {/* India Outline (Simplified) */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full opacity-20"
        >
          <path
            d="M30 10 L45 8 L55 12 L65 15 L75 20 L80 30 L78 40 L82 50 L75 60 L70 70 L60 80 L50 90 L40 88 L30 82 L22 75 L18 65 L15 55 L12 45 L15 35 L20 25 L25 15 Z"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
          />
        </svg>

        {/* State Markers */}
        {Object.entries(franchisesByState).map(([state, stateFranchises]) => {
          const coords = stateCoordinates[state] || { x: 50, y: 50 };
          const primaryFranchise = stateFranchises[0];
          const hasActive = stateFranchises.some(f => f.status === 'active');
          
          return (
            <motion.div
              key={state}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: Math.random() * 0.3 }}
              style={{
                position: 'absolute',
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className="cursor-pointer group"
              onClick={() => onSelectFranchise(primaryFranchise)}
            >
              {/* Pulse Effect */}
              {hasActive && (
                <div 
                  className="absolute inset-0 w-8 h-8 rounded-full animate-ping"
                  style={{ 
                    backgroundColor: statusColors[primaryFranchise.status],
                    opacity: 0.3
                  }}
                />
              )}
              
              {/* Marker */}
              <div 
                className="relative w-8 h-8 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-125"
                style={{ 
                  backgroundColor: `${statusColors[primaryFranchise.status]}20`,
                  borderColor: statusColors[primaryFranchise.status],
                  boxShadow: `0 0 20px ${statusColors[primaryFranchise.status]}40`
                }}
              >
                <MapPin 
                  className="w-4 h-4" 
                  style={{ color: statusColors[primaryFranchise.status] }}
                />
                
                {/* Count Badge */}
                {stateFranchises.length > 1 && (
                  <div 
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ 
                      backgroundColor: statusColors[primaryFranchise.status],
                      color: '#000'
                    }}
                  >
                    {stateFranchises.length}
                  </div>
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="glass-panel px-3 py-2 whitespace-nowrap">
                  <p className="font-mono text-sm font-bold text-foreground">{state}</p>
                  <p className="text-xs text-muted-foreground">
                    {stateFranchises.length} franchise{stateFranchises.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-primary">
                    ₹{(stateFranchises.reduce((s, f) => s + f.totalSales, 0) / 100000).toFixed(1)}L sales
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Empty State */}
        {Object.keys(franchisesByState).length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No franchises to display on map</p>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="glass-panel p-4 border border-border/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-lg font-mono font-bold text-foreground">{Object.keys(franchisesByState).length}</p>
              <p className="text-xs text-muted-foreground">States Covered</p>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-4 border border-border/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neon-green/10">
              <Users className="w-4 h-4 text-neon-green" />
            </div>
            <div>
              <p className="text-lg font-mono font-bold text-foreground">{totalActive}</p>
              <p className="text-xs text-muted-foreground">Active Franchises</p>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-4 border border-border/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neon-teal/10">
              <TrendingUp className="w-4 h-4 text-neon-teal" />
            </div>
            <div>
              <p className="text-lg font-mono font-bold text-foreground">₹{(totalSales / 100000).toFixed(1)}L</p>
              <p className="text-xs text-muted-foreground">Combined Sales</p>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-4 border border-border/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neon-purple/10">
              <MapPin className="w-4 h-4 text-neon-purple" />
            </div>
            <div>
              <p className="text-lg font-mono font-bold text-foreground">
                {franchises.filter(f => f.leadRouting).length}
              </p>
              <p className="text-xs text-muted-foreground">Lead Routing Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerritoryMap;
