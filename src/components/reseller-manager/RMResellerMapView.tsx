import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  MapPin, Users, Building2, TrendingUp, Search,
  Filter, Eye, RefreshCw, Globe2, Layers
} from 'lucide-react';

interface RegionData {
  id: string;
  name: string;
  country: string;
  resellers: number;
  activeResellers: number;
  revenue: number;
  growth: number;
  status: 'active' | 'growing' | 'declining';
}

const mockRegions: RegionData[] = [
  { id: 'IN-MH', name: 'Maharashtra', country: 'India', resellers: 45, activeResellers: 38, revenue: 4500000, growth: 15, status: 'active' },
  { id: 'IN-DL', name: 'Delhi NCR', country: 'India', resellers: 32, activeResellers: 28, revenue: 3200000, growth: 22, status: 'growing' },
  { id: 'IN-KA', name: 'Karnataka', country: 'India', resellers: 28, activeResellers: 25, revenue: 2800000, growth: 18, status: 'active' },
  { id: 'IN-TN', name: 'Tamil Nadu', country: 'India', resellers: 24, activeResellers: 20, revenue: 2400000, growth: 12, status: 'active' },
  { id: 'IN-GJ', name: 'Gujarat', country: 'India', resellers: 22, activeResellers: 18, revenue: 2200000, growth: -5, status: 'declining' },
  { id: 'IN-UP', name: 'Uttar Pradesh', country: 'India', resellers: 35, activeResellers: 28, revenue: 3000000, growth: 8, status: 'active' },
  { id: 'IN-RJ', name: 'Rajasthan', country: 'India', resellers: 18, activeResellers: 15, revenue: 1500000, growth: 25, status: 'growing' },
  { id: 'IN-WB', name: 'West Bengal', country: 'India', resellers: 20, activeResellers: 16, revenue: 1800000, growth: 10, status: 'active' },
];

const RMResellerMapView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);

  const filteredRegions = mockRegions.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalResellers = mockRegions.reduce((sum, r) => sum + r.resellers, 0);
  const totalActive = mockRegions.reduce((sum, r) => sum + r.activeResellers, 0);
  const totalRevenue = mockRegions.reduce((sum, r) => sum + r.revenue, 0);

  const handleViewRegion = (region: RegionData) => {
    setSelectedRegion(region);
    toast.success(`Viewing ${region.name}`, { description: `${region.resellers} resellers in this region` });
  };

  const handleRefresh = () => {
    toast.loading('Refreshing map data...', { id: 'map-refresh' });
    setTimeout(() => toast.success('Map data refreshed', { id: 'map-refresh' }), 1000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-emerald-400" />
            Reseller Geographic Map
          </h1>
          <p className="text-sm text-slate-400">Regional distribution and performance overview</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{mockRegions.length}</div>
                <div className="text-xs text-slate-400">Active Regions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalResellers}</div>
                <div className="text-xs text-slate-400">Total Resellers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalActive}</div>
                <div className="text-xs text-slate-400">Active Partners</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">₹{(totalRevenue / 100000).toFixed(1)}L</div>
                <div className="text-xs text-slate-400">Total Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search regions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-700"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Regions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRegions.map((region) => (
          <Card 
            key={region.id} 
            className={`bg-slate-900/50 border-slate-700/50 cursor-pointer hover:bg-slate-800/50 transition-all ${
              selectedRegion?.id === region.id ? 'ring-2 ring-emerald-500' : ''
            }`}
            onClick={() => handleViewRegion(region)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-semibold text-white">{region.name}</h3>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    region.status === 'growing' ? 'text-emerald-400 border-emerald-500/30' :
                    region.status === 'declining' ? 'text-red-400 border-red-500/30' :
                    'text-blue-400 border-blue-500/30'
                  }
                >
                  {region.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-400">Resellers:</span>
                  <span className="ml-2 text-white font-medium">{region.resellers}</span>
                </div>
                <div>
                  <span className="text-slate-400">Active:</span>
                  <span className="ml-2 text-emerald-400 font-medium">{region.activeResellers}</span>
                </div>
                <div>
                  <span className="text-slate-400">Revenue:</span>
                  <span className="ml-2 text-white font-medium">₹{(region.revenue / 100000).toFixed(1)}L</span>
                </div>
                <div>
                  <span className="text-slate-400">Growth:</span>
                  <span className={`ml-2 font-medium ${region.growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {region.growth >= 0 ? '+' : ''}{region.growth}%
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-700/50">
                <Button variant="ghost" size="sm" className="w-full gap-2 text-slate-400 hover:text-white">
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RMResellerMapView;
