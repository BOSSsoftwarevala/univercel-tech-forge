import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Megaphone, TrendingUp, DollarSign, Eye, MousePointer,
  Target, Play, Pause, RefreshCw, Settings, Plus,
  Facebook, Chrome, BarChart3, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const AdsAutomation = () => {
  const [automationEnabled, setAutomationEnabled] = useState(true);

  const adStats = [
    { label: "Total Spend", value: "₹4,52,840", change: "+12%", trend: "up", icon: DollarSign },
    { label: "Impressions", value: "2.4M", change: "+28%", trend: "up", icon: Eye },
    { label: "Clicks", value: "48,521", change: "+18%", trend: "up", icon: MousePointer },
    { label: "Conversions", value: "1,247", change: "+24%", trend: "up", icon: Target },
  ];

  const metaCampaigns = [
    { id: 1, name: "Brand Awareness Q4", platform: "Meta", status: "active", spend: "₹85,420", impressions: "425K", clicks: "8,421", ctr: "1.98%", roas: "3.2x" },
    { id: 2, name: "Lead Gen - Software Demo", platform: "Meta", status: "active", spend: "₹1,24,800", impressions: "892K", clicks: "15,842", ctr: "1.78%", roas: "4.1x" },
    { id: 3, name: "Retargeting - Website Visitors", platform: "Meta", status: "paused", spend: "₹42,100", impressions: "156K", clicks: "4,215", ctr: "2.7%", roas: "5.8x" },
  ];

  const googleCampaigns = [
    { id: 1, name: "Search - Software Solutions", platform: "Google", status: "active", spend: "₹1,42,520", impressions: "524K", clicks: "12,451", ctr: "2.38%", roas: "4.5x" },
    { id: 2, name: "Display - Tech Audience", platform: "Google", status: "active", spend: "₹58,000", impressions: "1.2M", clicks: "7,892", ctr: "0.66%", roas: "2.1x" },
  ];

  const automationRules = [
    { id: 1, name: "Pause low CTR ads", condition: "CTR < 0.5%", action: "Pause Ad", status: "active", triggered: 12 },
    { id: 2, name: "Increase budget on high ROAS", condition: "ROAS > 4x", action: "+20% Budget", status: "active", triggered: 5 },
    { id: 3, name: "Alert on overspend", condition: "Daily spend > ₹15K", action: "Send Alert", status: "active", triggered: 3 },
    { id: 4, name: "Scale winning audiences", condition: "Conv Rate > 5%", action: "Duplicate & Scale", status: "paused", triggered: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
              <Megaphone className="h-6 w-6 text-purple-400" />
            </div>
            Ads Automation
          </h1>
          <p className="text-muted-foreground mt-1">Manage Meta & Google Ads with AI-powered automation</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-cyan-500/20">
            <span className="text-sm text-slate-400">Auto-Optimization</span>
            <Switch checked={automationEnabled} onCheckedChange={setAutomationEnabled} />
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <stat.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                    {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Campaigns Tabs */}
      <Tabs defaultValue="meta" className="space-y-4">
        <TabsList className="bg-slate-800/50 border border-purple-500/20">
          <TabsTrigger value="meta" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 flex items-center gap-2">
            <Facebook className="w-4 h-4" />
            Meta Ads
          </TabsTrigger>
          <TabsTrigger value="google" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 flex items-center gap-2">
            <Chrome className="w-4 h-4" />
            Google Ads
          </TabsTrigger>
          <TabsTrigger value="automation" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Automation Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meta">
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-300">Meta Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metaCampaigns.map((campaign) => (
                  <motion.div
                    key={campaign.id}
                    className="p-4 bg-slate-800/30 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Facebook className="w-8 h-8 text-blue-400" />
                        <div>
                          <h4 className="font-medium text-white">{campaign.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>Spend: {campaign.spend}</span>
                            <span>CTR: {campaign.ctr}</span>
                            <span className="text-green-400">ROAS: {campaign.roas}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={campaign.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                          {campaign.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-purple-400">
                          {campaign.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-purple-400">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="google">
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-300">Google Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {googleCampaigns.map((campaign) => (
                  <motion.div
                    key={campaign.id}
                    className="p-4 bg-slate-800/30 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Chrome className="w-8 h-8 text-yellow-400" />
                        <div>
                          <h4 className="font-medium text-white">{campaign.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>Spend: {campaign.spend}</span>
                            <span>CTR: {campaign.ctr}</span>
                            <span className="text-green-400">ROAS: {campaign.roas}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-500/20 text-green-400">{campaign.status}</Badge>
                        <Button variant="ghost" size="sm" className="text-purple-400">
                          <Pause className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-purple-400">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-purple-300">Automation Rules</CardTitle>
              <Button variant="outline" className="border-purple-500/30 text-purple-400">
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {automationRules.map((rule) => (
                  <motion.div
                    key={rule.id}
                    className="p-4 bg-slate-800/30 rounded-lg border border-purple-500/10"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{rule.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>IF: {rule.condition}</span>
                          <span>→</span>
                          <span className="text-purple-400">THEN: {rule.action}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Triggered: {rule.triggered}x</span>
                        <Badge className={rule.status === "active" ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"}>
                          {rule.status}
                        </Badge>
                        <Switch checked={rule.status === "active"} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdsAutomation;
