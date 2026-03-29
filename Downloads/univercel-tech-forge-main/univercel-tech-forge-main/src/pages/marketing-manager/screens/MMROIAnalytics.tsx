import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Sparkles,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Monitor,
  Mail,
} from 'lucide-react';

interface ChannelMetrics {
  channel: string;
  spend: number;
  revenue: number;
  roi: number;
  leads: number;
  conversions: number;
  cpl: number;
  cac: number;
  trend: 'up' | 'down' | 'stable';
}

interface RegionMetrics {
  region: string;
  country: string;
  spend: number;
  revenue: number;
  leads: number;
}

const MMROIAnalytics: React.FC = () => {
  const [channels, setChannels] = useState<ChannelMetrics[]>([]);
  const [regions, setRegions] = useState<RegionMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [analyzing, setAnalyzing] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    // Mock analytics data
    const mockChannels: ChannelMetrics[] = [
      { channel: 'Google Ads', spend: 15000, revenue: 45000, roi: 200, leads: 450, conversions: 45, cpl: 33.33, cac: 333.33, trend: 'up' },
      { channel: 'Facebook', spend: 8000, revenue: 24000, roi: 200, leads: 320, conversions: 32, cpl: 25, cac: 250, trend: 'up' },
      { channel: 'LinkedIn', spend: 5000, revenue: 20000, roi: 300, leads: 80, conversions: 16, cpl: 62.5, cac: 312.5, trend: 'stable' },
      { channel: 'Email', spend: 500, revenue: 8000, roi: 1500, leads: 120, conversions: 24, cpl: 4.17, cac: 20.83, trend: 'up' },
      { channel: 'YouTube', spend: 3000, revenue: 6000, roi: 100, leads: 90, conversions: 9, cpl: 33.33, cac: 333.33, trend: 'down' },
      { channel: 'Native Ads', spend: 2000, revenue: 4500, roi: 125, leads: 60, conversions: 6, cpl: 33.33, cac: 333.33, trend: 'stable' },
    ];

    const mockRegions: RegionMetrics[] = [
      { region: 'North America', country: 'USA', spend: 15000, revenue: 50000, leads: 450 },
      { region: 'Europe', country: 'UK', spend: 8000, revenue: 28000, leads: 280 },
      { region: 'Asia Pacific', country: 'India', spend: 5000, revenue: 18000, leads: 320 },
      { region: 'Middle East', country: 'UAE', spend: 3000, revenue: 12000, leads: 90 },
    ];

    setChannels(mockChannels);
    setRegions(mockRegions);
    setLoading(false);
  };

  const runAIAnalysis = async () => {
    setAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setInsights([
        '📈 Email marketing shows 1500% ROI - consider increasing budget allocation',
        '⚠️ YouTube campaigns underperforming - review targeting and creatives',
        '💡 LinkedIn has highest conversion quality despite higher CPL',
        '🎯 Reallocate 20% of YouTube budget to Email for better returns',
        '🌍 India region shows strong growth potential with low CPL',
      ]);
      toast.success('AI analysis complete');
    } catch (error) {
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const totalSpend = channels.reduce((sum, c) => sum + c.spend, 0);
  const totalRevenue = channels.reduce((sum, c) => sum + c.revenue, 0);
  const totalLeads = channels.reduce((sum, c) => sum + c.leads, 0);
  const totalConversions = channels.reduce((sum, c) => sum + c.conversions, 0);
  const overallROI = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend * 100).toFixed(0) : 0;
  const avgCPL = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(2) : 0;
  const avgCAC = totalConversions > 0 ? (totalSpend / totalConversions).toFixed(2) : 0;

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'google ads': return <Globe className="w-4 h-4" />;
      case 'facebook': return <Smartphone className="w-4 h-4" />;
      case 'linkedin': return <Monitor className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            ROI Analytics
          </h2>
          <p className="text-slate-400 text-sm">Track spend, revenue, and campaign performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchAnalytics} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={runAIAnalysis} disabled={analyzing} className="bg-emerald-600 hover:bg-emerald-700">
            {analyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            AI Insights
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-red-400" />
              <span className="text-xs text-slate-400">Total Spend</span>
            </div>
            <div className="text-2xl font-bold text-white">${totalSpend.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-xs text-slate-400">Revenue</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400">ROI</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">{overallROI}%</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-slate-400">Leads</span>
            </div>
            <div className="text-2xl font-bold text-white">{totalLeads.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-slate-400">CPL</span>
            </div>
            <div className="text-2xl font-bold text-white">${avgCPL}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-slate-400">CAC</span>
            </div>
            <div className="text-2xl font-bold text-white">${avgCAC}</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <Card className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border-emerald-500/30">
          <CardHeader>
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              AI Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.map((insight, i) => (
                <p key={i} className="text-sm text-slate-300">{insight}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Channel Performance */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm text-white">Channel Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {channels.map(channel => (
                <div key={channel.channel} className="p-4 bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        {getChannelIcon(channel.channel)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{channel.channel}</p>
                        <div className="flex items-center gap-1 text-xs">
                          {channel.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-green-400" />}
                          {channel.trend === 'down' && <ArrowDownRight className="w-3 h-3 text-red-400" />}
                          <span className={channel.trend === 'up' ? 'text-green-400' : channel.trend === 'down' ? 'text-red-400' : 'text-slate-400'}>
                            {channel.trend === 'up' ? 'Trending Up' : channel.trend === 'down' ? 'Trending Down' : 'Stable'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={channel.roi >= 200 ? 'bg-green-500/20 text-green-400' : channel.roi >= 100 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}>
                      {channel.roi}% ROI
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-6 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Spend</p>
                      <p className="text-white font-medium">${channel.spend.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Revenue</p>
                      <p className="text-emerald-400 font-medium">${channel.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Leads</p>
                      <p className="text-white font-medium">{channel.leads}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Conversions</p>
                      <p className="text-white font-medium">{channel.conversions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">CPL</p>
                      <p className="text-white font-medium">${channel.cpl.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">CAC</p>
                      <p className="text-white font-medium">${channel.cac.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Budget Utilization</span>
                      <span className="text-white">{((channel.spend / totalSpend) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(channel.spend / totalSpend) * 100} className="h-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Regional Performance */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-white">Regional Performance</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {regions.map(region => (
              <div key={region.region} className="p-4 bg-slate-900 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="font-medium text-white text-sm">{region.region}</p>
                    <p className="text-xs text-slate-400">{region.country}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Spend</span>
                    <span className="text-white">${region.spend.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Revenue</span>
                    <span className="text-emerald-400">${region.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Leads</span>
                    <span className="text-white">{region.leads}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MMROIAnalytics;
