import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Flag, MapPin, Users, Building2, TrendingUp, Activity, Settings,
  Eye, Plus, BarChart3, AlertTriangle, Clock, CheckCircle2,
  ChevronRight, Briefcase, UserCheck, Phone, Mail, Map, Target,
  Store, DollarSign, Shield, Zap, Globe2, ArrowUpRight, ArrowDownRight,
  Download, RefreshCw, Bell, Filter, ChevronDown, X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

// Country flag mapping
const countryFlags: Record<string, string> = {
  "India": "🇮🇳", "China": "🇨🇳", "Japan": "🇯🇵", "South Korea": "🇰🇷",
  "Indonesia": "🇮🇩", "Thailand": "🇹🇭", "Vietnam": "🇻🇳", "Philippines": "🇵🇭",
  "Malaysia": "🇲🇾", "Singapore": "🇸🇬", "UAE": "🇦🇪", "Saudi Arabia": "🇸🇦",
  "Nigeria": "🇳🇬", "Egypt": "🇪🇬", "South Africa": "🇿🇦", "Kenya": "🇰🇪",
  "Ghana": "🇬🇭", "Morocco": "🇲🇦", "Tanzania": "🇹🇿", "Ethiopia": "🇪🇹",
  "Germany": "🇩🇪", "France": "🇫🇷", "United Kingdom": "🇬🇧", "Italy": "🇮🇹",
  "Spain": "🇪🇸", "Netherlands": "🇳🇱", "Poland": "🇵🇱", "Sweden": "🇸🇪",
  "United States": "🇺🇸", "Canada": "🇨🇦", "Mexico": "🇲🇽",
  "Brazil": "🇧🇷", "Argentina": "🇦🇷", "Colombia": "🇨🇴", "Chile": "🇨🇱",
  "Australia": "🇦🇺", "New Zealand": "🇳🇿"
};

interface CountryData {
  id: string;
  name: string;
  admin: string;
  status: "healthy" | "warning" | "critical";
  franchises: number;
  resellers: number;
  leads: number;
  revenue: number;
}

interface CountryAdminDashboardProps {
  country: CountryData;
  continent: string;
  onBack: () => void;
}

const CountryAdminDashboard = ({ country, continent, onBack }: CountryAdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const flag = countryFlags[country.name] || "🏳️";

  const [areaManagers, setAreaManagers] = useState<Array<{ id: string; name: string; area: string; users: number; status: string; lastActive: string }>>([]);
  const [franchisesList, setFranchisesList] = useState<Array<{ id: string; name: string; area: string; status: string; revenue: number; leads: number }>>([]);
  const [resellersList, setResellersList] = useState<Array<{ id: string; name: string; tier: string; conversions: number; leads: number; status: string }>>([]);
  const [liveActivities, setLiveActivities] = useState<Array<{ type: string; message: string; time: string; icon: React.ElementType }>>([]);
  const [pendingApprovals, setPendingApprovals] = useState<Array<{ id: string; type: string; requester: string; priority: string; created: string }>>([]);
  const [areas, setAreas] = useState<Array<{ id: string; name: string; cities: number; managers: number; status: string; performance: number; franchises: number; leads: number }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: managers, error: mError } = await supabase
        .from('area_managers')
        .select('id, name, area_id, status, last_active_at')
        .eq('country_id', country.id);
      if (!mError) {
        setAreaManagers((managers || []).map((m: { id: string; name: string; area_id: string; status: string; last_active_at: string }) => ({
          id: m.id,
          name: m.name,
          area: m.area_id || '—',
          users: 0,
          status: m.status || 'active',
          lastActive: m.last_active_at ? new Date(m.last_active_at).toLocaleString() : '—',
        })));
      } else {
        console.error('Failed to fetch area managers:', mError);
        setAreaManagers([]);
      }

      const { data: franchises, error: fError } = await supabase
        .from('franchises')
        .select('id, name, area_id, status, revenue, leads')
        .eq('country_id', country.id);
      if (!fError) {
        setFranchisesList((franchises || []).map((f: { id: string; name: string; area_id: string; status: string; revenue: number; leads: number }) => ({
          id: f.id,
          name: f.name,
          area: f.area_id || '—',
          status: f.status || 'active',
          revenue: f.revenue || 0,
          leads: f.leads || 0,
        })));
      } else {
        console.error('Failed to fetch franchises:', fError);
        setFranchisesList([]);
      }

      const { data: resellers, error: rError } = await supabase
        .from('resellers')
        .select('id, name, tier, conversions, leads, status')
        .eq('country_id', country.id);
      if (!rError) {
        setResellersList((resellers || []).map((r: { id: string; name: string; tier: string; conversions: number; leads: number; status: string }) => ({
          id: r.id,
          name: r.name,
          tier: r.tier || 'Bronze',
          conversions: r.conversions || 0,
          leads: r.leads || 0,
          status: r.status || 'active',
        })));
      } else {
        console.error('Failed to fetch resellers:', rError);
        setResellersList([]);
      }

      const { data: activity, error: aError } = await supabase
        .from('audit_logs')
        .select('id, action, meta_json, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      if (!aError) {
        setLiveActivities((activity || []).map((a: { id: string; action: string; meta_json?: { type?: string }; created_at: string }) => ({
          type: a.meta_json?.type || 'log',
          message: a.action,
          time: new Date(a.created_at).toLocaleString(),
          icon: Activity,
        })));
      }

      const { data: approvals, error: appError } = await supabase
        .from('approvals')
        .select('id, title, requested_by, priority, created_at')
        .eq('status', 'pending')
        .limit(5);
      if (!appError) {
        setPendingApprovals((approvals || []).map((a: { id: string; title: string; requested_by: string; priority: string; created_at: string }) => ({
          id: a.id,
          type: a.title,
          requester: a.requested_by || '—',
          priority: a.priority || 'medium',
          created: new Date(a.created_at).toLocaleString(),
        })));
      }

      const { data: areasData, error: arError } = await supabase
        .from('areas')
        .select('id, name, status')
        .eq('country_id', country.id);
      if (!arError) {
        setAreas((areasData || []).map((a: { id: string; name: string; status: string }) => ({
          id: a.id,
          name: a.name,
          cities: 0,
          managers: 0,
          status: a.status || 'active',
          performance: 0,
          franchises: 0,
          leads: 0,
        })));
      }
    };

    fetchData();
  }, [country.id]);

  const summaryStats = [
    { label: "Areas/Regions", value: areas.length.toString(), change: "+0", icon: Map, color: "from-blue-500 to-cyan-500" },
    { label: "Area Managers", value: areaManagers.length.toString(), change: "+1", icon: Users, color: "from-emerald-500 to-green-500" },
    { label: "Franchises", value: country.franchises.toString(), change: "+2", icon: Building2, color: "from-purple-500 to-violet-500" },
    { label: "Resellers", value: country.resellers.toString(), change: "+5", icon: Store, color: "from-orange-500 to-amber-500" },
    { label: "Active Leads", value: country.leads.toString(), change: "+12", icon: Target, color: "from-pink-500 to-rose-500" },
    { label: "Revenue", value: `₹${(country.revenue / 1000000).toFixed(1)}M`, change: "+8.5%", icon: DollarSign, color: "from-yellow-500 to-orange-500" },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-950 via-orange-950/10 to-slate-950">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Button>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-4xl shadow-lg shadow-orange-500/20">
              {flag}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{country.name} Country Admin</h1>
              <p className="text-slate-400">
                Admin: {country.admin} • Continent: {continent} • 
                <Badge className={cn(
                  "ml-2",
                  country.status === "healthy" ? "bg-emerald-500/20 text-emerald-400" :
                  country.status === "warning" ? "bg-amber-500/20 text-amber-400" :
                  "bg-red-500/20 text-red-400"
                )}>
                  {country.status}
                </Badge>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 px-3 py-1">
              <Flag className="w-3 h-3 mr-2" />
              COUNTRY OPERATIONS
            </Badge>
            <Button variant="outline" size="sm" className="gap-2 border-amber-500/50 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              Escalate to {continent}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {summaryStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-slate-900/50 border-slate-700/50 hover:border-orange-500/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br", stat.color)}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Tabs for Different Sections */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800/50 border border-slate-700/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="areas">Areas & Cities</TabsTrigger>
              <TabsTrigger value="franchises">Franchises</TabsTrigger>
              <TabsTrigger value="resellers">Resellers</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Area Performance */}
                <Card className="lg:col-span-2 bg-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Map className="w-5 h-5 text-orange-400" />
                      Regional Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {areas.map((area) => (
                      <div key={area.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-orange-500/30 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              area.status === "active" ? "bg-emerald-500/20" : "bg-amber-500/20"
                            )}>
                              <MapPin className={cn(
                                "w-5 h-5",
                                area.status === "active" ? "text-emerald-400" : "text-amber-400"
                              )} />
                            </div>
                            <div>
                              <p className="font-medium text-white">{area.name}</p>
                              <p className="text-xs text-slate-400">{area.cities} cities • {area.managers} managers</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-purple-400">{area.franchises} franchises</span>
                            <span className="text-pink-400">{area.leads} leads</span>
                            <Badge className={cn(
                              area.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                            )}>
                              {area.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={area.performance} className="flex-1 h-2" />
                          <span className={cn(
                            "text-sm font-medium",
                            area.performance >= 80 ? "text-emerald-400" : "text-amber-400"
                          )}>
                            {area.performance}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Live Activity */}
                <Card className="bg-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                      Live Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {liveActivities.map((activity, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                            <activity.icon className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{activity.message}</p>
                            <p className="text-xs text-slate-500">{activity.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Pending Approvals */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-400" />
                      Pending Approvals
                    </CardTitle>
                    <Badge className="bg-amber-500/20 text-amber-400">
                      {pendingApprovals.length} pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50">
                        <TableHead className="text-slate-400">ID</TableHead>
                        <TableHead className="text-slate-400">Type</TableHead>
                        <TableHead className="text-slate-400">Requester</TableHead>
                        <TableHead className="text-slate-400">Priority</TableHead>
                        <TableHead className="text-slate-400">Created</TableHead>
                        <TableHead className="text-slate-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApprovals.map((approval) => (
                        <TableRow key={approval.id} className="border-slate-700/50 hover:bg-slate-800/50">
                          <TableCell className="text-white font-mono">{approval.id}</TableCell>
                          <TableCell className="text-white">{approval.type}</TableCell>
                          <TableCell className="text-slate-300">{approval.requester}</TableCell>
                          <TableCell>
                            <Badge className={cn(
                              approval.priority === "high" ? "bg-red-500/20 text-red-400" :
                              approval.priority === "medium" ? "bg-amber-500/20 text-amber-400" :
                              "bg-slate-500/20 text-slate-400"
                            )}>
                              {approval.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-400">{approval.created}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" className="h-7 bg-emerald-600 hover:bg-emerald-700 text-white">
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 border-red-500/50 text-red-400">
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Areas Tab */}
            <TabsContent value="areas" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Areas & City Managers</CardTitle>
                    <Button size="sm" className="gap-2 bg-orange-600 hover:bg-orange-700">
                      <Plus className="w-4 h-4" />
                      Add Area Manager
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50">
                        <TableHead className="text-slate-400">ID</TableHead>
                        <TableHead className="text-slate-400">Manager</TableHead>
                        <TableHead className="text-slate-400">Area</TableHead>
                        <TableHead className="text-slate-400">Users</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                        <TableHead className="text-slate-400">Last Active</TableHead>
                        <TableHead className="text-slate-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {areaManagers.map((manager) => (
                        <TableRow key={manager.id} className="border-slate-700/50 hover:bg-slate-800/50">
                          <TableCell className="text-white font-mono">{manager.id}</TableCell>
                          <TableCell className="text-white">{manager.name}</TableCell>
                          <TableCell className="text-slate-300">{manager.area}</TableCell>
                          <TableCell className="text-cyan-400">{manager.users.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={cn(
                              manager.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                            )}>
                              {manager.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-400">{manager.lastActive}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" className="h-7">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Franchises Tab */}
            <TabsContent value="franchises" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Franchise Network</CardTitle>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50">
                        <TableHead className="text-slate-400">ID</TableHead>
                        <TableHead className="text-slate-400">Franchise</TableHead>
                        <TableHead className="text-slate-400">Area</TableHead>
                        <TableHead className="text-slate-400">Revenue</TableHead>
                        <TableHead className="text-slate-400">Leads</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                        <TableHead className="text-slate-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {franchisesList.map((franchise) => (
                        <TableRow key={franchise.id} className="border-slate-700/50 hover:bg-slate-800/50">
                          <TableCell className="text-white font-mono">{franchise.id}</TableCell>
                          <TableCell className="text-white">{franchise.name}</TableCell>
                          <TableCell className="text-slate-300">{franchise.area}</TableCell>
                          <TableCell className="text-emerald-400">₹{(franchise.revenue / 1000000).toFixed(2)}M</TableCell>
                          <TableCell className="text-pink-400">{franchise.leads}</TableCell>
                          <TableCell>
                            <Badge className={cn(
                              franchise.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                            )}>
                              {franchise.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" className="h-7">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resellers Tab */}
            <TabsContent value="resellers" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Reseller Network</CardTitle>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
                          <SelectValue placeholder="Tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Tiers</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                          <SelectItem value="bronze">Bronze</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50">
                        <TableHead className="text-slate-400">ID</TableHead>
                        <TableHead className="text-slate-400">Reseller</TableHead>
                        <TableHead className="text-slate-400">Tier</TableHead>
                        <TableHead className="text-slate-400">Conversions</TableHead>
                        <TableHead className="text-slate-400">Leads</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                        <TableHead className="text-slate-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resellersList.map((reseller) => (
                        <TableRow key={reseller.id} className="border-slate-700/50 hover:bg-slate-800/50">
                          <TableCell className="text-white font-mono">{reseller.id}</TableCell>
                          <TableCell className="text-white">{reseller.name}</TableCell>
                          <TableCell>
                            <Badge className={cn(
                              reseller.tier === "Gold" ? "bg-yellow-500/20 text-yellow-400" :
                              reseller.tier === "Silver" ? "bg-slate-400/20 text-slate-300" :
                              "bg-orange-700/20 text-orange-400"
                            )}>
                              {reseller.tier}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-emerald-400">{reseller.conversions}</TableCell>
                          <TableCell className="text-pink-400">{reseller.leads}</TableCell>
                          <TableCell>
                            <Badge className={cn(
                              reseller.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                            )}>
                              {reseller.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" className="h-7">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leads Tab */}
            <TabsContent value="leads" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Lead Pipeline</CardTitle>
                    <Badge className="bg-pink-500/20 text-pink-400">{country.leads} total leads</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4">
                    {["New", "Contacted", "Demo Given", "Negotiation", "Converted"].map((stage, idx) => {
                      const stageCount = Math.floor(country.leads / 5 * (1 - idx * 0.15));
                      return (
                        <div key={stage} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 text-center">
                          <p className="text-2xl font-bold text-white">{stageCount}</p>
                          <p className="text-xs text-slate-400">{stage}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Approvals Tab */}
            <TabsContent value="approvals" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">All Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50">
                        <TableHead className="text-slate-400">ID</TableHead>
                        <TableHead className="text-slate-400">Type</TableHead>
                        <TableHead className="text-slate-400">Requester</TableHead>
                        <TableHead className="text-slate-400">Priority</TableHead>
                        <TableHead className="text-slate-400">Created</TableHead>
                        <TableHead className="text-slate-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApprovals.map((approval) => (
                        <TableRow key={approval.id} className="border-slate-700/50 hover:bg-slate-800/50">
                          <TableCell className="text-white font-mono">{approval.id}</TableCell>
                          <TableCell className="text-white">{approval.type}</TableCell>
                          <TableCell className="text-slate-300">{approval.requester}</TableCell>
                          <TableCell>
                            <Badge className={cn(
                              approval.priority === "high" ? "bg-red-500/20 text-red-400" :
                              approval.priority === "medium" ? "bg-amber-500/20 text-amber-400" :
                              "bg-slate-500/20 text-slate-400"
                            )}>
                              {approval.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-400">{approval.created}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" className="h-7 bg-emerald-600 hover:bg-emerald-700 text-white">
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 border-red-500/50 text-red-400">
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CountryAdminDashboard;
