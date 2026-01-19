import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  DollarSign, 
  TrendingUp, 
  BarChart3,
  Play,
  Pause,
  Settings,
  Eye,
  MousePointer,
  Users
} from "lucide-react";

interface PaidAdsManagerProps {
  activeView: string;
}

const PaidAdsManager = ({ activeView }: PaidAdsManagerProps) => {
  const googleAds = [
    { name: "Brand Search Campaign", status: "active", budget: 2000, spent: 1450, clicks: 3456, conversions: 145 },
    { name: "Product Keywords", status: "active", budget: 3000, spent: 2100, clicks: 5678, conversions: 234 },
    { name: "Competitor Keywords", status: "paused", budget: 1500, spent: 890, clicks: 2345, conversions: 78 },
  ];

  const metaAds = [
    { name: "Lead Generation", status: "active", budget: 2500, spent: 1890, reach: 125000, leads: 345 },
    { name: "Retargeting", status: "active", budget: 1500, spent: 980, reach: 45000, leads: 156 },
    { name: "Brand Awareness", status: "active", budget: 1000, spent: 780, reach: 89000, leads: 45 },
  ];

  const renderGoogleAds = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Google Ads</h3>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Target className="w-4 h-4 mr-1" />
          New Campaign
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">$4,440</p>
            <p className="text-xs text-slate-400">Total Spend</p>
          </CardContent>
        </Card>
        <Card className="bg-teal-500/10 border-teal-500/30">
          <CardContent className="p-4 text-center">
            <MousePointer className="w-6 h-6 text-teal-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">11,479</p>
            <p className="text-xs text-slate-400">Total Clicks</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">457</p>
            <p className="text-xs text-slate-400">Conversions</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4">
        {googleAds.map((ad, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{ad.name}</h4>
                    <p className="text-xs text-slate-400">${ad.spent} / ${ad.budget} spent</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={ad.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}>
                    {ad.status.toUpperCase()}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    {ad.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <Settings className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <Progress value={(ad.spent / ad.budget) * 100} className="h-1.5 mb-3" />
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Clicks</span>
                  <p className="text-white font-semibold">{ad.clicks.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Conversions</span>
                  <p className="text-emerald-400 font-semibold">{ad.conversions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMetaAds = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Meta Ads</h3>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
          <Target className="w-4 h-4 mr-1" />
          New Ad Set
        </Button>
      </div>
      
      <div className="grid gap-4">
        {metaAds.map((ad, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{ad.name}</h4>
                    <p className="text-xs text-slate-400">${ad.spent} / ${ad.budget} spent</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400">ACTIVE</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Reach</span>
                  <p className="text-white font-semibold">{ad.reach.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Leads</span>
                  <p className="text-emerald-400 font-semibold">{ad.leads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderYouTubeAds = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">YouTube Ads</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm text-white">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Product Demo Video", views: 45600, ctr: 4.2 },
              { name: "Brand Story", views: 23400, ctr: 3.8 },
              { name: "Tutorial Series", views: 12300, ctr: 5.1 },
            ].map((video, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                <span className="text-sm text-white">{video.name}</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">{video.views.toLocaleString()}</span>
                  </div>
                  <Badge className="bg-teal-500/20 text-teal-400">{video.ctr}% CTR</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm text-white">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Total Views</span>
              <span className="text-lg font-bold text-white">81,300</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Avg. CTR</span>
              <span className="text-lg font-bold text-teal-400">4.37%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Cost per View</span>
              <span className="text-lg font-bold text-white">$0.023</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDisplayAds = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Display Ads</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <Eye className="w-6 h-6 text-teal-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">2.4M</p>
            <p className="text-xs text-slate-400">Impressions</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <MousePointer className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">18,456</p>
            <p className="text-xs text-slate-400">Clicks</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">0.77%</p>
            <p className="text-xs text-slate-400">CTR</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-purple-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">$1.24</p>
            <p className="text-xs text-slate-400">CPC</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderBudgetControl = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Budget Control</h3>
      
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm text-white">Monthly Budget Allocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { channel: "Google Ads", budget: 8000, spent: 5440, color: "bg-blue-500" },
            { channel: "Meta Ads", budget: 5000, spent: 3650, color: "bg-indigo-500" },
            { channel: "YouTube Ads", budget: 3000, spent: 1890, color: "bg-red-500" },
            { channel: "LinkedIn Ads", budget: 2000, spent: 1200, color: "bg-cyan-500" },
            { channel: "Display Network", budget: 2000, spent: 1450, color: "bg-purple-500" },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-sm text-white">{item.channel}</span>
                </div>
                <span className="text-sm text-slate-400">${item.spent.toLocaleString()} / ${item.budget.toLocaleString()}</span>
              </div>
              <Progress value={(item.spent / item.budget) * 100} className="h-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderROITracking = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">ROI Tracking</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/20 to-green-600/10 border-emerald-500/30">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white">342%</p>
            <p className="text-sm text-slate-400">Overall ROI</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm text-white">ROI by Channel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { channel: "Google Ads", roi: 420, trend: "+15%" },
              { channel: "Meta Ads", roi: 380, trend: "+8%" },
              { channel: "Email", roi: 520, trend: "+22%" },
              { channel: "SEO", roi: 890, trend: "+12%" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                <span className="text-sm text-white">{item.channel}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-emerald-400">{item.roi}%</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">{item.trend}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  switch (activeView) {
    case "ads-google":
      return renderGoogleAds();
    case "ads-meta":
      return renderMetaAds();
    case "ads-youtube":
      return renderYouTubeAds();
    case "ads-display":
      return renderDisplayAds();
    case "ads-budget":
      return renderBudgetControl();
    case "ads-roi":
      return renderROITracking();
    default:
      return renderGoogleAds();
  }
};

export default PaidAdsManager;
