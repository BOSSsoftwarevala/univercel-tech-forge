import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  TrendingUp, TrendingDown, DollarSign, Target, Users,
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight,
  Calendar, Download, RefreshCw, Award, Star
} from 'lucide-react';

interface PerformanceData {
  id: string;
  name: string;
  maskedId: string;
  revenue: number;
  target: number;
  sales: number;
  conversion: number;
  growth: number;
  rank: number;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
}

const mockPerformers: PerformanceData[] = [
  { id: 'RS-001', name: 'Raj Electronics', maskedId: 'RSL-8472', revenue: 850000, target: 800000, sales: 156, conversion: 42, growth: 28, rank: 1, tier: 'platinum' },
  { id: 'RS-002', name: 'Tech Solutions Hub', maskedId: 'RSL-3891', revenue: 720000, target: 750000, sales: 134, conversion: 38, growth: 15, rank: 2, tier: 'platinum' },
  { id: 'RS-003', name: 'Digital World', maskedId: 'RSL-5623', revenue: 650000, target: 600000, sales: 128, conversion: 35, growth: 22, rank: 3, tier: 'gold' },
  { id: 'RS-004', name: 'Smart Systems', maskedId: 'RSL-7142', revenue: 580000, target: 550000, sales: 112, conversion: 32, growth: 18, rank: 4, tier: 'gold' },
  { id: 'RS-005', name: 'Info Tech Pro', maskedId: 'RSL-9284', revenue: 520000, target: 500000, sales: 98, conversion: 30, growth: 12, rank: 5, tier: 'silver' },
  { id: 'RS-006', name: 'Net Solutions', maskedId: 'RSL-1567', revenue: 480000, target: 500000, sales: 92, conversion: 28, growth: -5, rank: 6, tier: 'silver' },
  { id: 'RS-007', name: 'Cloud Partners', maskedId: 'RSL-4829', revenue: 420000, target: 450000, sales: 85, conversion: 25, growth: 8, rank: 7, tier: 'bronze' },
  { id: 'RS-008', name: 'Data Systems', maskedId: 'RSL-6193', revenue: 380000, target: 400000, sales: 78, conversion: 22, growth: 3, rank: 8, tier: 'bronze' },
];

const tierColors = {
  platinum: 'from-purple-500 to-pink-500',
  gold: 'from-amber-500 to-yellow-500',
  silver: 'from-slate-400 to-slate-500',
  bronze: 'from-orange-700 to-orange-800',
};

const RMPerformanceRevenueView: React.FC = () => {
  const [period, setPeriod] = useState('month');
  const [sortBy, setSortBy] = useState('revenue');

  const totalRevenue = mockPerformers.reduce((sum, p) => sum + p.revenue, 0);
  const totalTarget = mockPerformers.reduce((sum, p) => sum + p.target, 0);
  const totalSales = mockPerformers.reduce((sum, p) => sum + p.sales, 0);
  const avgConversion = Math.round(mockPerformers.reduce((sum, p) => sum + p.conversion, 0) / mockPerformers.length);
  const overallGrowth = Math.round(mockPerformers.reduce((sum, p) => sum + p.growth, 0) / mockPerformers.length);

  const handleExport = () => {
    toast.success('Exporting performance report...', { description: 'Download will start shortly' });
  };

  const handleRefresh = () => {
    toast.loading('Refreshing data...', { id: 'perf-refresh' });
    setTimeout(() => toast.success('Performance data refreshed', { id: 'perf-refresh' }), 1000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            Performance & Revenue
          </h1>
          <p className="text-sm text-slate-400">Track reseller performance metrics and revenue</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32 bg-slate-900/50 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">₹{(totalRevenue / 100000).toFixed(1)}L</div>
                <div className="text-xs text-slate-400">Total Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{Math.round((totalRevenue / totalTarget) * 100)}%</div>
                <div className="text-xs text-slate-400">Target Achieved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{totalSales}</div>
                <div className="text-xs text-slate-400">Total Sales</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{avgConversion}%</div>
                <div className="text-xs text-slate-400">Avg Conversion</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${overallGrowth >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                {overallGrowth >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div>
                <div className={`text-xl font-bold ${overallGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {overallGrowth >= 0 ? '+' : ''}{overallGrowth}%
                </div>
                <div className="text-xs text-slate-400">Overall Growth</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {mockPerformers.map((performer) => (
                <div 
                  key={performer.id}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-800 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${tierColors[performer.tier]} flex items-center justify-center text-white font-bold text-sm`}>
                        {performer.rank}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{performer.name}</h4>
                        <p className="text-xs text-slate-400">{performer.maskedId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs ${
                        performer.tier === 'platinum' ? 'text-purple-400 border-purple-500/30' :
                        performer.tier === 'gold' ? 'text-amber-400 border-amber-500/30' :
                        performer.tier === 'silver' ? 'text-slate-400 border-slate-500/30' :
                        'text-orange-400 border-orange-500/30'
                      }`}>
                        <Star className="w-3 h-3 mr-1" />
                        {performer.tier.toUpperCase()}
                      </Badge>
                      {performer.growth >= 0 ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 gap-1">
                          <ArrowUpRight className="w-3 h-3" />
                          {performer.growth}%
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/20 text-red-400 gap-1">
                          <ArrowDownRight className="w-3 h-3" />
                          {Math.abs(performer.growth)}%
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Revenue:</span>
                      <span className="ml-2 text-white font-medium">₹{(performer.revenue / 100000).toFixed(1)}L</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Sales:</span>
                      <span className="ml-2 text-white font-medium">{performer.sales}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Conversion:</span>
                      <span className="ml-2 text-white font-medium">{performer.conversion}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Target:</span>
                      <span className={`ml-2 font-medium ${performer.revenue >= performer.target ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {Math.round((performer.revenue / performer.target) * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Target Progress</span>
                      <span className="text-white">{Math.round((performer.revenue / performer.target) * 100)}%</span>
                    </div>
                    <Progress 
                      value={Math.min((performer.revenue / performer.target) * 100, 100)} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default RMPerformanceRevenueView;
