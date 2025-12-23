import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, Target, TrendingUp, Filter, Download, RefreshCw,
  Mail, Phone, Globe, Building2, Calendar, BarChart3,
  ArrowUpRight, ArrowDownRight, Eye, MessageSquare, Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LeadIntelligence = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const leadStats = [
    { label: "Total Leads", value: "12,847", change: "+18%", trend: "up", icon: Users },
    { label: "Qualified Leads", value: "3,241", change: "+24%", trend: "up", icon: Target },
    { label: "Conversion Rate", value: "28.4%", change: "+3.2%", trend: "up", icon: TrendingUp },
    { label: "Avg Lead Score", value: "72", change: "-2", trend: "down", icon: Star },
  ];

  const leads = [
    { id: 1, name: "Rajan Technologies", email: "info@rajantech.com", phone: "+91 98xxx xxxxx", source: "Google Ads", score: 92, status: "hot", lastActivity: "2 hours ago", value: "₹8.5L" },
    { id: 2, name: "Sharma Enterprises", email: "contact@sharma-ent.in", phone: "+91 87xxx xxxxx", source: "SEO", score: 85, status: "warm", lastActivity: "5 hours ago", value: "₹5.2L" },
    { id: 3, name: "GlobalTech Solutions", email: "sales@globaltech.com", phone: "+91 99xxx xxxxx", source: "Referral", score: 78, status: "warm", lastActivity: "1 day ago", value: "₹12.8L" },
    { id: 4, name: "Digital First India", email: "hello@digitalfirst.in", phone: "+91 70xxx xxxxx", source: "Meta Ads", score: 65, status: "cold", lastActivity: "3 days ago", value: "₹3.1L" },
    { id: 5, name: "NextGen Softwares", email: "info@nextgensw.com", phone: "+91 88xxx xxxxx", source: "LinkedIn", score: 88, status: "hot", lastActivity: "1 hour ago", value: "₹15.4L" },
  ];

  const leadSources = [
    { source: "Google Ads", leads: 4521, percentage: 35 },
    { source: "SEO/Organic", leads: 3218, percentage: 25 },
    { source: "Meta Ads", leads: 2571, percentage: 20 },
    { source: "Referrals", leads: 1542, percentage: 12 },
    { source: "LinkedIn", leads: 995, percentage: 8 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "warm": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "cold": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
              <Target className="h-6 w-6 text-cyan-400" />
            </div>
            Lead Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">Track, score, and convert leads with AI-powered insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-cyan-500/30 text-cyan-400">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync CRM
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {leadStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-cyan-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <stat.icon className="w-5 h-5 text-cyan-400" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Table */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-cyan-500/20 backdrop-blur-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-cyan-300">Active Leads</CardTitle>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 bg-slate-800/50 border-cyan-500/20"
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32 bg-slate-800/50 border-cyan-500/20">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="hot">Hot</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="cold">Cold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    className="p-4 bg-slate-800/30 rounded-lg border border-cyan-500/10 hover:border-cyan-500/30 transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{lead.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-cyan-400">{lead.value}</p>
                          <p className="text-xs text-muted-foreground">{lead.lastActivity}</p>
                        </div>
                        <Badge className={getStatusColor(lead.status)}>{lead.status.toUpperCase()}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-medium">{lead.score}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-cyan-400">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-cyan-400">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lead Sources */}
        <Card className="bg-slate-900/50 border-cyan-500/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Lead Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {leadSources.map((source) => (
              <div key={source.source} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{source.source}</span>
                  <span className="text-cyan-400 font-medium">{source.leads.toLocaleString()}</span>
                </div>
                <Progress value={source.percentage} className="h-2 bg-slate-700" />
              </div>
            ))}

            <div className="pt-4 border-t border-cyan-500/20">
              <h4 className="text-sm font-medium text-cyan-300 mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 text-xs">
                  <Filter className="w-3 h-3 mr-1" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 text-xs">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Analytics
                </Button>
                <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  Schedule
                </Button>
                <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 text-xs">
                  <Mail className="w-3 h-3 mr-1" />
                  Campaign
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadIntelligence;
