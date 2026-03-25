import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Map, 
  List, 
  X, 
  Users, 
  TrendingUp, 
  Wallet, 
  Globe,
  Building2,
  Code2,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import softwareValaLogo from '@/assets/softwarevala-logo.jpg';

interface BranchData {
  id: string;
  country: string;
  countryCode: string;
  region: string;
  status: 'active' | 'pending' | 'offline';
  leads: number;
  franchises: number;
  developers: number;
  coordinates: { x: number; y: number };
  salesHistory: { month: string; amount: number }[];
  walletBalance: number;
  performance: number;
}

const branchesData: BranchData[] = [
  {
    id: 'uk',
    country: 'United Kingdom',
    countryCode: 'GB',
    region: 'Europe',
    status: 'active',
    leads: 120,
    franchises: 8,
    developers: 24,
    coordinates: { x: 47, y: 28 },
    salesHistory: [
      { month: 'Jan', amount: 45000 },
      { month: 'Feb', amount: 52000 },
      { month: 'Mar', amount: 48000 },
      { month: 'Apr', amount: 61000 },
      { month: 'May', amount: 55000 },
      { month: 'Jun', amount: 67000 },
    ],
    walletBalance: 125000,
    performance: 94,
  },
  {
    id: 'ke',
    country: 'Kenya',
    countryCode: 'KE',
    region: 'East Africa',
    status: 'active',
    leads: 78,
    franchises: 12,
    developers: 18,
    coordinates: { x: 56, y: 52 },
    salesHistory: [
      { month: 'Jan', amount: 28000 },
      { month: 'Feb', amount: 32000 },
      { month: 'Mar', amount: 35000 },
      { month: 'Apr', amount: 41000 },
      { month: 'May', amount: 38000 },
      { month: 'Jun', amount: 45000 },
    ],
    walletBalance: 78000,
    performance: 87,
  },
  {
    id: 'bi',
    country: 'Burundi',
    countryCode: 'BI',
    region: 'East Africa',
    status: 'active',
    leads: 34,
    franchises: 5,
    developers: 8,
    coordinates: { x: 54, y: 55 },
    salesHistory: [
      { month: 'Jan', amount: 12000 },
      { month: 'Feb', amount: 15000 },
      { month: 'Mar', amount: 14000 },
      { month: 'Apr', amount: 18000 },
      { month: 'May', amount: 21000 },
      { month: 'Jun', amount: 24000 },
    ],
    walletBalance: 34000,
    performance: 78,
  },
  {
    id: 'lr',
    country: 'Liberia',
    countryCode: 'LR',
    region: 'West Africa',
    status: 'active',
    leads: 25,
    franchises: 3,
    developers: 6,
    coordinates: { x: 42, y: 50 },
    salesHistory: [
      { month: 'Jan', amount: 8000 },
      { month: 'Feb', amount: 11000 },
      { month: 'Mar', amount: 13000 },
      { month: 'Apr', amount: 15000 },
      { month: 'May', amount: 18000 },
      { month: 'Jun', amount: 20000 },
    ],
    walletBalance: 25000,
    performance: 72,
  },
  {
    id: 'ss',
    country: 'South Sudan',
    countryCode: 'SS',
    region: 'East Africa',
    status: 'active',
    leads: 20,
    franchises: 2,
    developers: 4,
    coordinates: { x: 54, y: 48 },
    salesHistory: [
      { month: 'Jan', amount: 5000 },
      { month: 'Feb', amount: 7000 },
      { month: 'Mar', amount: 9000 },
      { month: 'Apr', amount: 11000 },
      { month: 'May', amount: 14000 },
      { month: 'Jun', amount: 16000 },
    ],
    walletBalance: 18000,
    performance: 65,
  },
  {
    id: 'ph',
    country: 'Philippines',
    countryCode: 'PH',
    region: 'Asia',
    status: 'active',
    leads: 55,
    franchises: 7,
    developers: 35,
    coordinates: { x: 82, y: 46 },
    salesHistory: [
      { month: 'Jan', amount: 22000 },
      { month: 'Feb', amount: 28000 },
      { month: 'Mar', amount: 31000 },
      { month: 'Apr', amount: 35000 },
      { month: 'May', amount: 42000 },
      { month: 'Jun', amount: 48000 },
    ],
    walletBalance: 65000,
    performance: 89,
  },
  {
    id: 'in',
    country: 'India',
    countryCode: 'IN',
    region: 'Asia',
    status: 'active',
    leads: 95,
    franchises: 15,
    developers: 45,
    coordinates: { x: 70, y: 42 },
    salesHistory: [
      { month: 'Jan', amount: 38000 },
      { month: 'Feb', amount: 45000 },
      { month: 'Mar', amount: 52000 },
      { month: 'Apr', amount: 58000 },
      { month: 'May', amount: 65000 },
      { month: 'Jun', amount: 72000 },
    ],
    walletBalance: 112000,
    performance: 92,
  },
];

const regions = ['All Regions', 'Europe', 'East Africa', 'West Africa', 'Asia'];

const GlobalBranchMap: React.FC = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [hoveredBranch, setHoveredBranch] = useState<BranchData | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Generate floating particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev.filter(p => p.id > Date.now() - 3000)];
        if (newParticles.length < 15) {
          newParticles.push({
            id: Date.now(),
            x: Math.random() * 100,
            y: Math.random() * 100,
          });
        }
        return newParticles;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const filteredBranches = branchesData.filter(branch => {
    const matchesSearch = branch.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All Regions' || branch.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'rgb(34, 197, 94)';
      case 'pending': return 'rgb(234, 179, 8)';
      case 'offline': return 'rgb(239, 68, 68)';
      default: return 'rgb(34, 197, 94)';
    }
  };

  const getStatusGlow = (status: string) => {
    switch (status) {
      case 'active': return '0 0 20px rgba(34, 197, 94, 0.6), 0 0 40px rgba(34, 197, 94, 0.3)';
      case 'pending': return '0 0 20px rgba(234, 179, 8, 0.6), 0 0 40px rgba(234, 179, 8, 0.3)';
      case 'offline': return '0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.3)';
      default: return '0 0 20px rgba(34, 197, 94, 0.6)';
    }
  };

  const handleBranchClick = (branch: BranchData) => {
    setSelectedBranch(branch);
    setDrawerOpen(true);
  };

  return (
    <div className="relative h-full w-full bg-slate-950 rounded-2xl overflow-hidden border border-cyan-500/20">
      {/* Sci-Fi Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />

      {/* Floating Particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0], y: -50 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
        />
      ))}

      {/* Header Controls */}
      <div className="relative z-10 p-4 border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Global Branch Network</h2>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-48 bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-500 focus:border-cyan-400"
              />
            </div>
            
            {/* Region Filter */}
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-40 bg-slate-800/50 border-cyan-500/30 text-white">
                <Filter className="w-4 h-4 mr-2 text-cyan-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-cyan-500/30">
                {regions.map(region => (
                  <SelectItem key={region} value={region} className="text-white hover:bg-slate-700">
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* View Toggle */}
            <div className="flex bg-slate-800/50 rounded-lg border border-cyan-500/30 p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('map')}
                className={`${viewMode === 'map' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'} hover:text-cyan-400`}
              >
                <Map className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={`${viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'} hover:text-cyan-400`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 h-[calc(100%-120px)]">
        <AnimatePresence mode="wait">
          {viewMode === 'map' ? (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full p-4"
            >
              {/* World Map SVG */}
              <svg
                viewBox="0 0 100 60"
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.2))' }}
              >
                {/* Simplified World Map Outline */}
                <defs>
                  <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
                    <stop offset="100%" stopColor="rgba(6, 182, 212, 0.1)" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Continents simplified paths */}
                {/* North America */}
                <path
                  d="M5,15 Q15,10 25,15 Q30,20 28,30 Q25,35 15,32 Q8,28 5,15"
                  fill="url(#mapGradient)"
                  stroke="rgba(6, 182, 212, 0.5)"
                  strokeWidth="0.2"
                />
                {/* South America */}
                <path
                  d="M20,38 Q25,35 28,40 Q30,50 25,55 Q20,58 18,50 Q16,42 20,38"
                  fill="url(#mapGradient)"
                  stroke="rgba(6, 182, 212, 0.5)"
                  strokeWidth="0.2"
                />
                {/* Europe */}
                <path
                  d="M43,18 Q50,15 55,18 Q58,22 55,28 Q50,32 45,30 Q40,26 43,18"
                  fill="url(#mapGradient)"
                  stroke="rgba(6, 182, 212, 0.5)"
                  strokeWidth="0.2"
                />
                {/* Africa */}
                <path
                  d="M43,32 Q55,30 58,38 Q60,50 55,58 Q48,60 43,55 Q38,48 40,40 Q41,35 43,32"
                  fill="url(#mapGradient)"
                  stroke="rgba(6, 182, 212, 0.5)"
                  strokeWidth="0.2"
                />
                {/* Asia */}
                <path
                  d="M58,12 Q75,8 90,15 Q95,25 88,35 Q80,42 70,45 Q62,42 58,35 Q55,25 58,12"
                  fill="url(#mapGradient)"
                  stroke="rgba(6, 182, 212, 0.5)"
                  strokeWidth="0.2"
                />
                {/* Australia */}
                <path
                  d="M78,48 Q88,46 92,52 Q90,58 82,58 Q76,55 78,48"
                  fill="url(#mapGradient)"
                  stroke="rgba(6, 182, 212, 0.5)"
                  strokeWidth="0.2"
                />
                
                {/* Connection lines between branches */}
                {filteredBranches.map((branch, index) => (
                  filteredBranches.slice(index + 1).map(otherBranch => (
                    <motion.line
                      key={`${branch.id}-${otherBranch.id}`}
                      x1={branch.coordinates.x}
                      y1={branch.coordinates.y}
                      x2={otherBranch.coordinates.x}
                      y2={otherBranch.coordinates.y}
                      stroke="rgba(6, 182, 212, 0.15)"
                      strokeWidth="0.1"
                      strokeDasharray="1 1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: index * 0.1 }}
                    />
                  ))
                ))}
                
                {/* Branch Pins */}
                {filteredBranches.map((branch, index) => (
                  <motion.g
                    key={branch.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.15, type: 'spring' }}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredBranch(branch)}
                    onMouseLeave={() => setHoveredBranch(null)}
                    onClick={() => handleBranchClick(branch)}
                  >
                    {/* Pulse ring animation */}
                    <motion.circle
                      cx={branch.coordinates.x}
                      cy={branch.coordinates.y}
                      r="2"
                      fill="none"
                      stroke={getStatusColor(branch.status)}
                      strokeWidth="0.2"
                      initial={{ r: 1.5, opacity: 0.8 }}
                      animate={{ r: 4, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    />
                    
                    {/* Glow effect */}
                    <circle
                      cx={branch.coordinates.x}
                      cy={branch.coordinates.y}
                      r="2"
                      fill={getStatusColor(branch.status)}
                      opacity="0.3"
                      filter="url(#glow)"
                    />
                    
                    {/* Pin base */}
                    <circle
                      cx={branch.coordinates.x}
                      cy={branch.coordinates.y}
                      r="1.5"
                      fill="rgba(15, 23, 42, 0.9)"
                      stroke={getStatusColor(branch.status)}
                      strokeWidth="0.3"
                    />
                    
                    {/* Logo placeholder (circle with initial) */}
                    <text
                      x={branch.coordinates.x}
                      y={branch.coordinates.y + 0.5}
                      textAnchor="middle"
                      fontSize="1.2"
                      fill={getStatusColor(branch.status)}
                      fontWeight="bold"
                    >
                      ⚡
                    </text>
                  </motion.g>
                ))}
              </svg>

              {/* Hover Tooltip */}
              <AnimatePresence>
                {hoveredBranch && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute z-20 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 shadow-2xl min-w-[250px]"
                    style={{
                      left: `${hoveredBranch.coordinates.x}%`,
                      top: `${hoveredBranch.coordinates.y}%`,
                      transform: 'translate(-50%, -120%)',
                      boxShadow: getStatusGlow(hoveredBranch.status),
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={softwareValaLogo}
                        alt="Software Vala"
                        className="w-10 h-10 rounded-full border-2"
                        style={{ borderColor: getStatusColor(hoveredBranch.status) }}
                      />
                      <div>
                        <h3 className="text-white font-bold">{hoveredBranch.country}</h3>
                        <p className="text-cyan-400 text-sm">{hoveredBranch.region}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Status</span>
                        <Badge 
                          className={`${
                            hoveredBranch.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                            hoveredBranch.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                            'bg-red-500/20 text-red-400 border-red-500/50'
                          }`}
                        >
                          {hoveredBranch.status.charAt(0).toUpperCase() + hoveredBranch.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Leads</span>
                        <span className="text-white font-medium">{hoveredBranch.leads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Franchises</span>
                        <span className="text-white font-medium">{hoveredBranch.franchises}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Developers</span>
                        <span className="text-white font-medium">{hoveredBranch.developers}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-cyan-500/20 text-xs text-cyan-400 flex items-center gap-1">
                      Click for details <ChevronRight className="w-3 h-3" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-2 overflow-auto h-full"
            >
              {filteredBranches.map((branch, index) => (
                <motion.div
                  key={branch.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleBranchClick(branch)}
                  className="flex items-center justify-between p-4 bg-slate-900/50 border border-cyan-500/20 rounded-xl hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-slate-500 w-12">{branch.countryCode}</div>
                    <div className="flex items-center gap-3">
                      <img
                        src={softwareValaLogo}
                        alt="Software Vala"
                        className="w-10 h-10 rounded-full border-2"
                        style={{ borderColor: getStatusColor(branch.status) }}
                      />
                      <div>
                        <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                          {branch.country}
                        </h3>
                        <p className="text-cyan-400 text-sm flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                          {branch.region}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-slate-400 text-xs">Leads</p>
                      <p className="text-white font-bold">{branch.leads}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-xs">Franchises</p>
                      <p className="text-white font-bold">{branch.franchises}</p>
                    </div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: getStatusColor(branch.status),
                        boxShadow: getStatusGlow(branch.status)
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-900/80 backdrop-blur-sm border-t border-cyan-500/20">
        <div className="text-center">
          <p className="text-sm font-bold tracking-[0.3em] text-slate-400">
            SOFTWARE VALA • GLOBAL BRANCH NETWORK
          </p>
          <div className="mt-1 h-0.5 w-48 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
        </div>
      </div>

      {/* Country Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="bg-slate-900 border-l border-cyan-500/30 w-[400px] sm:w-[540px]">
          {selectedBranch && (
            <div className="h-full flex flex-col">
              <SheetHeader className="border-b border-cyan-500/20 pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={softwareValaLogo}
                    alt="Software Vala"
                    className="w-16 h-16 rounded-full border-2"
                    style={{ 
                      borderColor: getStatusColor(selectedBranch.status),
                      boxShadow: getStatusGlow(selectedBranch.status)
                    }}
                  />
                  <div>
                    <SheetTitle className="text-white text-xl">{selectedBranch.country}</SheetTitle>
                    <p className="text-cyan-400">{selectedBranch.region}</p>
                    <Badge 
                      className={`mt-1 ${
                        selectedBranch.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        selectedBranch.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {selectedBranch.status.charAt(0).toUpperCase() + selectedBranch.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-auto py-6 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4 text-center">
                    <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{selectedBranch.leads}</p>
                    <p className="text-xs text-slate-400">Total Leads</p>
                  </div>
                  <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4 text-center">
                    <Building2 className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{selectedBranch.franchises}</p>
                    <p className="text-xs text-slate-400">Franchises</p>
                  </div>
                  <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4 text-center">
                    <Code2 className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{selectedBranch.developers}</p>
                    <p className="text-xs text-slate-400">Developers</p>
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      Region Performance
                    </h4>
                    <span className="text-2xl font-bold text-cyan-400">{selectedBranch.performance}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedBranch.performance}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>

                {/* Sales History */}
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-4">Sales History (Last 6 Months)</h4>
                  <div className="flex items-end gap-2 h-32">
                    {selectedBranch.salesHistory.map((sale, index) => (
                      <div key={sale.month} className="flex-1 flex flex-col items-center gap-1">
                        <motion.div
                          className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t"
                          initial={{ height: 0 }}
                          animate={{ height: `${(sale.amount / 80000) * 100}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        />
                        <span className="text-xs text-slate-400">{sale.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wallet Summary */}
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4">
                  <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                    <Wallet className="w-4 h-4 text-cyan-400" />
                    Wallet Summary
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Available Balance</span>
                    <span className="text-2xl font-bold text-green-400">
                      ${selectedBranch.walletBalance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default GlobalBranchMap;
