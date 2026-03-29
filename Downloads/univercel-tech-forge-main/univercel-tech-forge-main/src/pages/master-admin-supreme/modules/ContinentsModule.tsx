import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe2, Users, TrendingUp, Activity, ChevronRight, 
  Clock, Zap, MapPin, Box
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BlackboxPanel } from '../engines/BlackboxEngine';
import { LiveActivityFeed } from '../engines/LiveActivityEngine';

interface Continent {
  id: string;
  name: string;
  code: string;
  users: number;
  revenue: string;
  growth: number;
  status: 'active' | 'limited' | 'maintenance';
  gradient: string;
  rentalExpiry?: string;
}

const continents: Continent[] = [
  { id: 'asia', name: 'Asia Pacific', code: 'APAC', users: 3240, revenue: '₹4.2M', growth: 18.5, status: 'active', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'europe', name: 'Europe', code: 'EU', users: 2180, revenue: '₹3.1M', growth: 12.3, status: 'active', gradient: 'from-blue-500 to-indigo-600' },
  { id: 'namerica', name: 'North America', code: 'NA', users: 1890, revenue: '₹2.8M', growth: 8.7, status: 'active', gradient: 'from-purple-500 to-violet-600' },
  { id: 'africa', name: 'Africa', code: 'AF', users: 980, revenue: '₹0.9M', growth: 24.2, status: 'limited', gradient: 'from-amber-500 to-orange-600', rentalExpiry: '14:32:00' },
  { id: 'samerica', name: 'South America', code: 'SA', users: 720, revenue: '₹0.6M', growth: 15.8, status: 'active', gradient: 'from-rose-500 to-pink-600' },
  { id: 'oceania', name: 'Oceania', code: 'OC', users: 340, revenue: '₹0.4M', growth: 6.2, status: 'maintenance', gradient: 'from-cyan-500 to-sky-600' },
];

export function ContinentsModule() {
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Continent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {continents.map((continent, index) => (
          <motion.div
            key={continent.id}
            initial={{ opacity: 0, y: 30, rotateY: -10 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02, rotateY: 5 }}
            onClick={() => setSelectedContinent(selectedContinent === continent.id ? null : continent.id)}
            className="cursor-pointer group"
            style={{ perspective: '1000px' }}
          >
            <Card className={`relative p-6 bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ${
              selectedContinent === continent.id ? 'ring-2 ring-emerald-500/50' : ''
            }`}>
              {/* Background texture */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)'
                }} />
              </div>

              {/* Light reflection */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              {/* Rental indicator */}
              {continent.rentalExpiry && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] text-amber-300">{continent.rentalExpiry}</span>
                </div>
              )}

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${continent.gradient} flex items-center justify-center shadow-lg`}>
                    <Globe2 className="w-7 h-7 text-white" />
                  </div>
                  <Badge variant="outline" className={`
                    ${continent.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      continent.status === 'limited' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-slate-500/20 text-slate-400 border-slate-500/30'}
                  `}>
                    {continent.status}
                  </Badge>
                </div>

                {/* Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-white">{continent.name}</h3>
                    <span className="text-xs text-white/40 font-mono">{continent.code}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/50 text-sm">
                    <MapPin className="w-3 h-3" />
                    <span>Regional Hub</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-white/50" />
                      <span className="text-xs text-white/50">Users</span>
                    </div>
                    <p className="text-lg font-bold text-white">{continent.users.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-white/50" />
                      <span className="text-xs text-white/50">Revenue</span>
                    </div>
                    <p className="text-lg font-bold text-white">{continent.revenue}</p>
                  </div>
                </div>

                {/* Growth bar */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50">Growth Rate</span>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-sm font-semibold">+{continent.growth}%</span>
                  </div>
                </div>
                <Progress value={continent.growth * 3} className="h-2" />

                {/* Expand indicator */}
                <div className="flex items-center justify-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <span>Drill down</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Geo-Access Rental Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-300">Geo-Access Control</h4>
                <p className="text-xs text-emerald-200/60">Per-continent rental • Region-based access • Expiry timers active</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-white/50">Active Regions</p>
                <p className="text-lg font-bold text-emerald-300">5 / 6</p>
              </div>
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Regional Blackbox & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="relative">
            <div className="absolute -top-2 left-4 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
              <div className="flex items-center gap-2">
                <Box className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-bold">Region-based Blackbox Filters</span>
              </div>
            </div>
            <BlackboxPanel maxEvents={6} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-4 bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border-emerald-500/20 backdrop-blur-xl h-full">
            <LiveActivityFeed maxEvents={8} />
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
