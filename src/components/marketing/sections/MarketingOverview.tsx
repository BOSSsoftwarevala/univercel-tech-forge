import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Users, 
  DollarSign,
  BarChart3,
  Rocket,
  Eye,
  MousePointer,
  RefreshCw
} from "lucide-react";

interface MarketingOverviewProps {
  activeView: string;
}

const MarketingOverview = ({ activeView }: MarketingOverviewProps) => {
  const campaigns = [
    { name: "Summer Sale 2024", status: "active", budget: 5000, spent: 3200, leads: 245, roi: 340 },
    { name: "Product Launch", status: "active", budget: 8000, spent: 6100, leads: 189, roi: 280 },
    { name: "Black Friday Prep", status: "scheduled", budget: 15000, spent: 0, leads: 0, roi: 0 },
    { name: "Brand Awareness", status: "active", budget: 3000, spent: 2800, leads: 156, roi: 220 },
    { name: "Retargeting Q4", status: "paused", budget: 2500, spent: 1200, leads: 89, roi: 180 },
  ];

  const channels = [
    { name: "Google Ads", leads: 456, spend: 4200, conversion: 4.2, status: "active" },
    { name: "Meta Ads", leads: 389, spend: 3100, conversion: 3.8, status: "active" },
    { name: "LinkedIn", leads: 145, spend: 2800, conversion: 2.1, status: "active" },
    { name: "Email Marketing", leads: 234, spend: 500, conversion: 8.5, status: "active" },
    { name: "SEO Organic", leads: 567, spend: 0, conversion: 5.2, status: "active" },
  ];

  const renderCampaignStatus = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Live Campaign Status</h3>
        <Button size="sm" variant="outline" className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {campaigns.map((campaign, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-white">{campaign.name}</CardTitle>
                <Badge 
                  className={`text-[10px] ${
                    campaign.status === 'active' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : campaign.status === 'scheduled'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-orange-500/20 text-orange-400'
                  }`}
                >
                  {campaign.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Budget Usage</span>
                  <span className="text-white">${campaign.spent} / ${campaign.budget}</span>
                </div>
                <Progress value={(campaign.spent / campaign.budget) * 100} className="h-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Leads</span>
                  <p className="text-white font-semibold">{campaign.leads}</p>
                </div>
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">ROI</span>
                  <p className="text-emerald-400 font-semibold">{campaign.roi}%</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 h-7 text-xs border-slate-600">
                  View
                </Button>
                <Button size="sm" className="flex-1 h-7 text-xs bg-teal-600 hover:bg-teal-700">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderActiveChannels = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Active Channels</h3>
      
      <div className="grid gap-4">
        {channels.map((channel, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{channel.name}</h4>
                    <p className="text-xs text-slate-400">{channel.leads} leads this month</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${channel.spend}</p>
                  <p className="text-xs text-emerald-400">{channel.conversion}% conv.</p>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">
                  {channel.status.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLeadsToday = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Leads Today</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-teal-500/20 to-cyan-600/10 border-teal-500/30">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-teal-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">247</p>
            <p className="text-xs text-slate-400">Total Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/20 to-green-600/10 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">+18%</p>
            <p className="text-xs text-slate-400">vs Yesterday</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-600/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">89</p>
            <p className="text-xs text-slate-400">Qualified</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/10 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <MousePointer className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">4.2%</p>
            <p className="text-xs text-slate-400">Conversion</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm text-white">Lead Sources Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { source: "Google Ads", count: 78, color: "bg-blue-500" },
              { source: "Facebook", count: 56, color: "bg-indigo-500" },
              { source: "Organic SEO", count: 45, color: "bg-emerald-500" },
              { source: "Referral", count: 34, color: "bg-orange-500" },
              { source: "Direct", count: 34, color: "bg-purple-500" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-sm text-slate-300 flex-1">{item.source}</span>
                <span className="text-sm font-medium text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCostVsResult = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Cost vs Result Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-8 h-8 text-teal-400" />
              <div>
                <p className="text-2xl font-bold text-white">$24,500</p>
                <p className="text-xs text-slate-400">Total Spend (MTD)</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">12% under budget</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-white">1,847</p>
                <p className="text-xs text-slate-400">Total Leads (MTD)</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">+23% vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">$13.27</p>
                <p className="text-xs text-slate-400">Cost Per Lead</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingDown className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">-8% vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm text-white">Channel Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channels.map((channel, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">{channel.name}</span>
                  <span className="text-white">${(channel.spend / channel.leads || 0).toFixed(2)} CPL</span>
                </div>
                <Progress value={(channel.conversion / 10) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConversionRate = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Conversion Rate Analysis</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">125,430</p>
            <p className="text-xs text-slate-400">Impressions</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <MousePointer className="w-6 h-6 text-teal-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">8,456</p>
            <p className="text-xs text-slate-400">Clicks</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">1,847</p>
            <p className="text-xs text-slate-400">Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">342</p>
            <p className="text-xs text-slate-400">Conversions</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm text-white">Funnel Conversion Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { stage: "Impression → Click", rate: 6.74, change: "+0.8%" },
              { stage: "Click → Lead", rate: 21.84, change: "+2.3%" },
              { stage: "Lead → Qualified", rate: 48.2, change: "-1.2%" },
              { stage: "Qualified → Sale", rate: 18.5, change: "+3.5%" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <span className="text-sm text-slate-300">{item.stage}</span>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white">{item.rate}%</span>
                  <Badge className={item.change.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                    {item.change}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render based on active view
  switch (activeView) {
    case "overview-campaigns":
      return renderCampaignStatus();
    case "overview-channels":
      return renderActiveChannels();
    case "overview-leads":
      return renderLeadsToday();
    case "overview-cost":
      return renderCostVsResult();
    case "overview-conversion":
      return renderConversionRate();
    default:
      return renderCampaignStatus();
  }
};

export default MarketingOverview;
