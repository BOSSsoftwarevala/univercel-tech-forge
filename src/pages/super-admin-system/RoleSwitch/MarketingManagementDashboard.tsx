import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Megaphone, Users, Target, Image, Share2, LineChart, Palette,
  Search, Filter, ChevronRight, ArrowLeft, Shield, Mail, MapPin,
  Play, Pause, Square, DollarSign, TrendingUp, BarChart3, Eye,
  CheckCircle, XCircle, Clock, Globe2, Flag, Zap, Award,
  FileText, Video, ImageIcon, Layout, AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Manager type definition
interface MarketingManager {
  id: string;
  name: string;
  email: string;
  photo: string | null;
  region: string;
  country: string;
  countryFlag: string;
  activeCampaigns: number;
  leadsGenerated: number;
  conversionRate: number;
  status: string;
  adSpend: number;
  roi: number;
}

const MarketingManagementDashboard = () => {
  const [selectedManager, setSelectedManager] = useState<MarketingManager | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterChannel, setFilterChannel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("campaigns");
  const [marketingManagers, setMarketingManagers] = useState<MarketingManager[]>([]);
  const [campaigns, setCampaigns] = useState<Array<{ id: string; name: string; type: string; status: string; budget: number; spent: number; leads: number; roi: number }>>([]);
  const [leadSources, setLeadSources] = useState<Array<{ channel: string; leads: number; quality: number; cost: number; cpl: number }>>([]);
  const [contentAssets, setContentAssets] = useState<Array<{ id: string; name: string; type: string; status: string; created: string }>>([]);
  const [adAccounts, setAdAccounts] = useState<Array<{ platform: string; accountId: string; status: string; monthlySpend: number; balance: number }>>([]);
  const [activityLog, setActivityLog] = useState<Array<{ id: string | number; action: string; details: string; time: string; type: string }>>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*');
      if (error) { console.error('Failed to fetch campaigns:', error); setCampaigns([]); }
      else setCampaigns((data || []).map((c: { id: string; name: string; type: string; status: string; budget: number; spent: number; leads: number; roi: number }) => ({
        id: c.id, name: c.name, type: c.type || '—', status: c.status || 'Active',
        budget: c.budget || 0, spent: c.spent || 0, leads: c.leads || 0, roi: c.roi || 0,
      })));
    };

    const fetchLeadSources = async () => {
      const { data, error } = await supabase
        .from('lead_sources')
        .select('channel, leads, quality_score, cost');
      if (error) { console.error('Failed to fetch lead sources:', error); setLeadSources([]); }
      else setLeadSources((data || []).map((l: { channel: string; leads: number; quality_score: number; cost: number }) => ({
        channel: l.channel, leads: l.leads || 0, quality: l.quality_score || 0,
        cost: l.cost || 0, cpl: l.leads > 0 ? (l.cost || 0) / l.leads : 0,
      })));
    };

    const fetchContentAssets = async () => {
      const { data, error } = await supabase
        .from('content_assets')
        .select('*');
      if (error) { console.error('Failed to fetch content assets:', error); setContentAssets([]); }
      else setContentAssets((data || []).map((a: { id: string; name: string; type: string; status: string; created_at: string }) => ({
        id: a.id, name: a.name, type: a.type || '—', status: a.status || 'Pending',
        created: a.created_at ? new Date(a.created_at).toLocaleDateString() : '—',
      })));
    };

    const fetchAdAccounts = async () => {
      const { data, error } = await supabase
        .from('ad_accounts')
        .select('*');
      if (error) { console.error('Failed to fetch ad accounts:', error); setAdAccounts([]); }
      else setAdAccounts((data || []).map((a: { platform: string; account_id: string; status: string; monthly_spend: number; balance: number }) => ({
        platform: a.platform, accountId: a.account_id || '—', status: a.status || 'Active',
        monthlySpend: a.monthly_spend || 0, balance: a.balance || 0,
      })));
    };

    const fetchManagers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, region, country, status')
        .eq('department', 'marketing');
      if (error) { console.error('Failed to fetch marketing managers:', error); setMarketingManagers([]); }
      else setMarketingManagers((data || []).map((u: { id: string; name: string; email: string; region: string; country: string; status: string }) => ({
        id: u.id, name: u.name || '—', email: u.email || '—', photo: null,
        region: u.region || '—', country: u.country || '—', countryFlag: '🌍',
        activeCampaigns: 0, leadsGenerated: 0, conversionRate: 0,
        status: u.status || 'Active', adSpend: 0, roi: 0,
      })));
    };

    const fetchActivityLog = async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('id, action, meta_json, created_at')
        .eq('module', 'marketing')
        .order('created_at', { ascending: false })
        .limit(10);
      if (!error) {
        setActivityLog((data || []).map((l: { id: string; action: string; meta_json?: { details?: string; type?: string }; created_at: string }) => ({
          id: l.id, action: l.action, details: l.meta_json?.details || '—',
          time: new Date(l.created_at).toLocaleString(), type: l.meta_json?.type || 'log',
        })));
      }
    };

    fetchCampaigns();
    fetchLeadSources();
    fetchContentAssets();
    fetchAdAccounts();
    fetchManagers();
    fetchActivityLog();
  }, []);

  const filteredManagers = marketingManagers.filter(manager => {
    const matchesSearch = manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = filterCountry === "all" || manager.country === filterCountry;
    const matchesStatus = filterStatus === "all" || manager.status === filterStatus;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "Hold": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "Paused": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "Pending": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "Approved": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "Rejected": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "Limited": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  const handleAction = (action: string) => {
    toast.success(`${action} action triggered`);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-pink-950/20 via-background to-rose-950/20 p-6">
      <AnimatePresence mode="wait">
        {!selectedManager ? (
          // LIST VIEW
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                  Marketing Manager Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">Global marketing & growth control view</p>
              </div>
              <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/50">
                <Megaphone className="w-3 h-3 mr-1" />
                {marketingManagers.length} Marketing Managers
              </Badge>
            </div>

            {/* Filters */}
            <Card className="bg-card/50 border-pink-500/20">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search managers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background/50 border-pink-500/30"
                      />
                    </div>
                  </div>
                  <Select value={filterCountry} onValueChange={setFilterCountry}>
                    <SelectTrigger className="w-[160px] bg-background/50 border-pink-500/30">
                      <Globe2 className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="Singapore">Singapore</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="Brazil">Brazil</SelectItem>
                      <SelectItem value="UAE">UAE</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterChannel} onValueChange={setFilterChannel}>
                    <SelectTrigger className="w-[160px] bg-background/50 border-pink-500/30">
                      <Share2 className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      <SelectItem value="ads">Ads</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="seo">SEO</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[140px] bg-background/50 border-pink-500/30">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Manager Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredManagers.map((manager, index) => (
                <motion.div
                  key={manager.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="bg-card/50 border-pink-500/20 hover:border-pink-500/50 transition-all cursor-pointer group"
                    onClick={() => setSelectedManager(manager)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg">
                          {manager.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground truncate">{manager.name}</h3>
                            <Badge className={cn("text-xs", getStatusColor(manager.status))}>
                              {manager.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span className="text-lg">{manager.countryFlag}</span>
                            <span>{manager.region}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-pink-500/10 rounded-lg p-2 text-center">
                          <p className="text-xs text-muted-foreground">Campaigns</p>
                          <p className="text-lg font-bold text-pink-400">{manager.activeCampaigns}</p>
                        </div>
                        <div className="bg-rose-500/10 rounded-lg p-2 text-center">
                          <p className="text-xs text-muted-foreground">Leads</p>
                          <p className="text-lg font-bold text-rose-400">{manager.leadsGenerated.toLocaleString()}</p>
                        </div>
                        <div className="bg-purple-500/10 rounded-lg p-2 text-center">
                          <p className="text-xs text-muted-foreground">Conv. Rate</p>
                          <p className="text-lg font-bold text-purple-400">{manager.conversionRate}%</p>
                        </div>
                        <div className="bg-emerald-500/10 rounded-lg p-2 text-center">
                          <p className="text-xs text-muted-foreground">ROI</p>
                          <p className="text-lg font-bold text-emerald-400">{manager.roi}%</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-pink-500/20">
                        <span className="text-xs text-muted-foreground">
                          Ad Spend: ${manager.adSpend.toLocaleString()}
                        </span>
                        <ChevronRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          // DETAIL VIEW
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedManager(null)}
                className="hover:bg-pink-500/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-foreground">{selectedManager.name}</h1>
                <p className="text-sm text-muted-foreground">{selectedManager.email}</p>
              </div>
              <Badge className={cn("text-sm", getStatusColor(selectedManager.status))}>
                {selectedManager.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel - Identity, Powers, Actions */}
              <div className="space-y-4">
                {/* Identity */}
                <Card className="bg-card/50 border-pink-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-pink-400 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Identity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-2xl">
                        {selectedManager.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{selectedManager.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {selectedManager.email}
                        </p>
                      </div>
                    </div>
                    <Separator className="bg-pink-500/20" />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Region</p>
                        <p className="font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-pink-400" /> {selectedManager.region}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Country</p>
                        <p className="font-medium">
                          {selectedManager.countryFlag} {selectedManager.country}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Role Level</p>
                        <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/50 mt-1">
                          Marketing Manager
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Powers */}
                <Card className="bg-card/50 border-pink-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-pink-400 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Powers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {[
                        "Can create marketing campaigns",
                        "Can manage ad accounts",
                        "Can manage content assets",
                        "Can control lead sources",
                        "Can assign campaigns to regions",
                        "Can view full marketing analytics",
                        "Can pause / stop campaigns",
                        "Can manage branding guidelines",
                      ].map((power, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-pink-400" />
                          <span>{power}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card className="bg-card/50 border-pink-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-pink-400 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      className="w-full justify-start bg-pink-500/20 hover:bg-pink-500/30 text-pink-400"
                      onClick={() => handleAction("Create Campaign")}
                    >
                      <Megaphone className="w-4 h-4 mr-2" /> Create Campaign
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-pink-500/30 hover:bg-pink-500/10"
                      onClick={() => handleAction("Edit Campaign")}
                    >
                      <FileText className="w-4 h-4 mr-2" /> Edit Campaign
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-orange-500/30 hover:bg-orange-500/10 text-orange-400"
                      onClick={() => handleAction("Pause Campaign")}
                    >
                      <Pause className="w-4 h-4 mr-2" /> Pause Campaign
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-red-500/30 hover:bg-red-500/10 text-red-400"
                      onClick={() => handleAction("Stop Campaign")}
                    >
                      <Square className="w-4 h-4 mr-2" /> Stop Campaign
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400"
                      onClick={() => handleAction("Assign Budget")}
                    >
                      <DollarSign className="w-4 h-4 mr-2" /> Assign Budget
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-blue-500/30 hover:bg-blue-500/10 text-blue-400"
                      onClick={() => handleAction("Assign Region")}
                    >
                      <MapPin className="w-4 h-4 mr-2" /> Assign Region
                    </Button>
                    <Separator className="bg-pink-500/20 my-2" />
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      onClick={() => handleAction("Suspend Manager")}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" /> Suspend Marketing Manager
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Tabs */}
              <div className="lg:col-span-2">
                <Card className="bg-card/50 border-pink-500/20">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <CardHeader className="pb-0">
                      <TabsList className="bg-pink-500/10 w-full flex-wrap h-auto gap-1 p-1">
                        <TabsTrigger value="campaigns" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white text-xs">
                          Campaigns
                        </TabsTrigger>
                        <TabsTrigger value="leads" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white text-xs">
                          Lead Sources
                        </TabsTrigger>
                        <TabsTrigger value="content" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white text-xs">
                          Content
                        </TabsTrigger>
                        <TabsTrigger value="ads" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white text-xs">
                          Ad Accounts
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white text-xs">
                          Analytics
                        </TabsTrigger>
                        <TabsTrigger value="brand" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white text-xs">
                          Brand
                        </TabsTrigger>
                      </TabsList>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {/* Tab A: Campaigns */}
                      <TabsContent value="campaigns" className="mt-0">
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-3">
                            {campaigns.map((campaign) => (
                              <div key={campaign.id} className="p-3 rounded-lg bg-pink-500/5 border border-pink-500/20">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Megaphone className="w-4 h-4 text-pink-400" />
                                    <span className="font-medium text-foreground">{campaign.name}</span>
                                  </div>
                                  <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Type</p>
                                    <p className="font-medium text-pink-400">{campaign.type}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Budget</p>
                                    <p className="font-medium">${campaign.budget.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Leads</p>
                                    <p className="font-medium text-emerald-400">{campaign.leads}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">ROI</p>
                                    <p className="font-medium text-emerald-400">{campaign.roi}%</p>
                                  </div>
                                </div>
                                <Progress value={(campaign.spent / campaign.budget) * 100} className="h-1 mt-2" />
                                <p className="text-xs text-muted-foreground mt-1">
                                  ${campaign.spent.toLocaleString()} spent of ${campaign.budget.toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      {/* Tab B: Lead Sources */}
                      <TabsContent value="leads" className="mt-0">
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-3">
                            {leadSources.map((source, idx) => (
                              <div key={idx} className="p-3 rounded-lg bg-pink-500/5 border border-pink-500/20">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-pink-400" />
                                    <span className="font-medium text-foreground">{source.channel}</span>
                                  </div>
                                  <Badge className="bg-emerald-500/20 text-emerald-400">
                                    Quality: {source.quality}%
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Leads</p>
                                    <p className="font-medium text-pink-400">{source.leads.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Cost</p>
                                    <p className="font-medium">${source.cost.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">CPL</p>
                                    <p className="font-medium text-blue-400">${source.cpl.toFixed(2)}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      {/* Tab C: Content Management */}
                      <TabsContent value="content" className="mt-0">
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-3">
                            {contentAssets.map((asset) => (
                              <div key={asset.id} className="p-3 rounded-lg bg-pink-500/5 border border-pink-500/20 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                                    {asset.type === "Video" ? <Video className="w-5 h-5 text-pink-400" /> :
                                     asset.type === "Banner" ? <ImageIcon className="w-5 h-5 text-pink-400" /> :
                                     asset.type === "Landing Page" ? <Layout className="w-5 h-5 text-pink-400" /> :
                                     <Image className="w-5 h-5 text-pink-400" />}
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground">{asset.name}</p>
                                    <p className="text-xs text-muted-foreground">{asset.type} • {asset.created}</p>
                                  </div>
                                </div>
                                <Badge className={getStatusColor(asset.status)}>{asset.status}</Badge>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      {/* Tab D: Ad Accounts */}
                      <TabsContent value="ads" className="mt-0">
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-3">
                            {adAccounts.map((account, idx) => (
                              <div key={idx} className="p-3 rounded-lg bg-pink-500/5 border border-pink-500/20">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Share2 className="w-4 h-4 text-pink-400" />
                                    <span className="font-medium text-foreground">{account.platform}</span>
                                  </div>
                                  <Badge className={getStatusColor(account.status)}>{account.status}</Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Account ID</p>
                                    <p className="font-mono text-xs">{account.accountId}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Monthly Spend</p>
                                    <p className="font-medium">${account.monthlySpend.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Balance</p>
                                    <p className="font-medium text-emerald-400">${account.balance.toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      {/* Tab E: Analytics & Insights */}
                      <TabsContent value="analytics" className="mt-0">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-pink-500/10 text-center">
                              <Eye className="w-6 h-6 text-pink-400 mx-auto mb-1" />
                              <p className="text-2xl font-bold text-pink-400">125K</p>
                              <p className="text-xs text-muted-foreground">Total Traffic</p>
                            </div>
                            <div className="p-3 rounded-lg bg-emerald-500/10 text-center">
                              <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                              <p className="text-2xl font-bold text-emerald-400">3.8%</p>
                              <p className="text-xs text-muted-foreground">Conversion Rate</p>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-500/10 text-center">
                              <Target className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                              <p className="text-2xl font-bold text-blue-400">4,520</p>
                              <p className="text-xs text-muted-foreground">Total Leads</p>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-500/10 text-center">
                              <BarChart3 className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                              <p className="text-2xl font-bold text-purple-400">340%</p>
                              <p className="text-xs text-muted-foreground">Overall ROI</p>
                            </div>
                          </div>
                          <div className="h-40 rounded-lg bg-pink-500/5 border border-pink-500/20 flex items-center justify-center">
                            <p className="text-muted-foreground text-sm">📊 Conversion Funnel Chart</p>
                          </div>
                          <div className="h-40 rounded-lg bg-pink-500/5 border border-pink-500/20 flex items-center justify-center">
                            <p className="text-muted-foreground text-sm">📈 Campaign Comparison Chart</p>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Tab F: Brand & Compliance */}
                      <TabsContent value="brand" className="mt-0">
                        <div className="space-y-4">
                          <div className="p-3 rounded-lg bg-pink-500/5 border border-pink-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Palette className="w-4 h-4 text-pink-400" />
                              <span className="font-medium">Brand Assets</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="h-20 rounded bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-xs">
                                Primary Colors
                              </div>
                              <div className="h-20 rounded bg-slate-800 flex items-center justify-center text-white text-xs">
                                Logo Variants
                              </div>
                              <div className="h-20 rounded bg-slate-700 flex items-center justify-center text-white text-xs">
                                Typography
                              </div>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-pink-500/5 border border-pink-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-4 h-4 text-pink-400" />
                              <span className="font-medium">Compliance Checks</span>
                            </div>
                            <div className="space-y-2">
                              {[
                                { name: "GDPR Compliance", status: "Passed" },
                                { name: "Brand Guidelines", status: "Passed" },
                                { name: "Ad Policy Review", status: "Pending" },
                              ].map((check, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">{check.name}</span>
                                  <Badge className={check.status === "Passed" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}>
                                    {check.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>

                {/* Activity Log */}
                <Card className="bg-card/50 border-pink-500/20 mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-pink-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Marketing Activity Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[150px]">
                      <div className="space-y-2">
                        {activityLog.map((log) => (
                          <div key={log.id} className="flex items-center justify-between p-2 rounded bg-pink-500/5 text-sm">
                            <div className="flex items-center gap-2">
                              {log.type === "create" && <Megaphone className="w-3 h-3 text-emerald-400" />}
                              {log.type === "budget" && <DollarSign className="w-3 h-3 text-blue-400" />}
                              {log.type === "pause" && <Pause className="w-3 h-3 text-orange-400" />}
                              {log.type === "approval" && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                              {log.type === "performance" && <TrendingUp className="w-3 h-3 text-pink-400" />}
                              <span className="text-foreground">{log.action}</span>
                              <span className="text-muted-foreground">- {log.details}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{log.time}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketingManagementDashboard;
