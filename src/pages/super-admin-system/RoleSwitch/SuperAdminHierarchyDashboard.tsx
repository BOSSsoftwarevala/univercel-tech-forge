import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Globe2, Shield, Users, MapPin, Lock, Activity, Settings, Eye,
  Plus, Building2, TrendingUp, BarChart3, AlertTriangle, Clock,
  CheckCircle2, XCircle, ChevronRight, Flag, Map
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Continent data
const continentData = [
  { 
    id: "africa", 
    name: "Africa", 
    code: "AF",
    countries: 54, 
    activeManagers: 12,
    status: "active",
    color: "from-amber-500 to-orange-600",
    performance: 85
  },
  { 
    id: "asia", 
    name: "Asia", 
    code: "AS",
    countries: 48, 
    activeManagers: 28,
    status: "active",
    color: "from-red-500 to-pink-600",
    performance: 92
  },
  { 
    id: "europe", 
    name: "Europe", 
    code: "EU",
    countries: 44, 
    activeManagers: 35,
    status: "active",
    color: "from-blue-500 to-indigo-600",
    performance: 94
  },
  { 
    id: "namerica", 
    name: "North America", 
    code: "NA",
    countries: 23, 
    activeManagers: 18,
    status: "active",
    color: "from-emerald-500 to-teal-600",
    performance: 88
  },
  { 
    id: "samerica", 
    name: "South America", 
    code: "SA",
    countries: 12, 
    activeManagers: 8,
    status: "active",
    color: "from-green-500 to-lime-600",
    performance: 78
  },
  { 
    id: "oceania", 
    name: "Oceania", 
    code: "OC",
    countries: 14, 
    activeManagers: 6,
    status: "active",
    color: "from-cyan-500 to-sky-600",
    performance: 90
  },
  { 
    id: "antarctica", 
    name: "Antarctica", 
    code: "AN",
    countries: 0, 
    activeManagers: 0,
    status: "inactive",
    color: "from-slate-500 to-zinc-600",
    performance: 0
  },
];

// Continent Super Admins
const continentSuperAdmins = [
  { 
    id: "CSA-001", 
    name: "Alexander Burke", 
    continent: "Europe",
    countries: 44,
    status: "active",
    lastActive: "5 min ago"
  },
  { 
    id: "CSA-002", 
    name: "Yuki Tanaka", 
    continent: "Asia",
    countries: 48,
    status: "active",
    lastActive: "12 min ago"
  },
  { 
    id: "CSA-003", 
    name: "Amara Okafor", 
    continent: "Africa",
    countries: 54,
    status: "active",
    lastActive: "1 hour ago"
  },
];

// Activity log
const recentActivity = [
  { action: "Continent assigned", target: "CSA-004 → Americas", time: "2 min ago" },
  { action: "Country locked", target: "Brazil (SA)", time: "15 min ago" },
  { action: "Manager escalated", target: "Issue #4521", time: "30 min ago" },
  { action: "Performance review", target: "Asia continent", time: "1 hour ago" },
];

const SuperAdminHierarchyDashboard = () => {
  const [selectedContinent, setSelectedContinent] = useState<typeof continentData[0] | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const handleLockContinent = (continentId: string) => {
    toast.success(`Continent ${continentId} locked successfully`);
  };

  const handleAssignContinent = () => {
    toast.success("Continent assignment initiated");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <Globe2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Boss Dashboard</h1>
              <p className="text-blue-400/80">Global Operations Head • All Continents</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              GLOBAL OPERATIONS
            </Badge>
            <Button className="bg-blue-500 hover:bg-blue-600 gap-2">
              <Plus className="w-4 h-4" />
              Create Continent Admin
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Continents</p>
                <p className="text-2xl font-bold text-white mt-1">7</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Continent Admins</p>
                <p className="text-2xl font-bold text-white mt-1">7</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Countries</p>
                <p className="text-2xl font-bold text-white mt-1">195</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Flag className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Pending Actions</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">8</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-blue-500/20 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            World Overview
          </TabsTrigger>
          <TabsTrigger value="continents" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Continents
          </TabsTrigger>
          <TabsTrigger value="admins" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Continent Admins
          </TabsTrigger>
          <TabsTrigger value="modules" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Global Modules
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Activity Log
          </TabsTrigger>
        </TabsList>

        {/* World Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* World Map Placeholder */}
            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-400" />
                  World Operations Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-blue-500/20">
                  <div className="text-center">
                    <Globe2 className="w-20 h-20 text-blue-400/50 mx-auto mb-4 animate-pulse" />
                    <p className="text-slate-400">Interactive World Map</p>
                    <p className="text-xs text-slate-500">All Continents Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continent Performance */}
            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Continent Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {continentData.filter(c => c.status === "active").map((continent) => (
                      <div key={continent.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${continent.color} flex items-center justify-center`}>
                              <span className="text-xs font-bold text-white">{continent.code}</span>
                            </div>
                            <span className="text-sm text-white">{continent.name}</span>
                          </div>
                          <span className="text-sm font-mono text-blue-400">{continent.performance}%</span>
                        </div>
                        <Progress value={continent.performance} className="h-2" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Powers Section */}
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Super Admin Powers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Users, label: "Manage Continent Admins", desc: "Create, assign, suspend" },
                  { icon: Globe2, label: "Assign Continents", desc: "Territory allocation" },
                  { icon: Settings, label: "Global Modules", desc: "Non-core management" },
                  { icon: CheckCircle2, label: "Approve Actions", desc: "Continent-level" },
                  { icon: Lock, label: "Lock Continents", desc: "Temporary restrictions" },
                  { icon: TrendingUp, label: "Monitor Performance", desc: "Global metrics" },
                  { icon: AlertTriangle, label: "Escalate to Master", desc: "Critical issues" },
                  { icon: Activity, label: "Global Activity", desc: "Read-only audit" },
                ].map((power, i) => (
                  <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-blue-500/20">
                    <power.icon className="w-6 h-6 text-blue-400 mb-2" />
                    <p className="text-sm font-medium text-white">{power.label}</p>
                    <p className="text-xs text-slate-400">{power.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Limits Section */}
          <Card className="bg-slate-900/50 border-red-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                Access Limits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <XCircle className="w-5 h-5 text-red-400 mb-2" />
                  <p className="text-sm font-medium text-white">Cannot Delete Master Admin</p>
                  <p className="text-xs text-slate-400">Protected system role</p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <XCircle className="w-5 h-5 text-red-400 mb-2" />
                  <p className="text-sm font-medium text-white">Cannot Bypass Audit</p>
                  <p className="text-xs text-slate-400">All actions logged</p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <XCircle className="w-5 h-5 text-red-400 mb-2" />
                  <p className="text-sm font-medium text-white">Cannot Change Core Settings</p>
                  <p className="text-xs text-slate-400">Master Admin only</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Continents Tab */}
        <TabsContent value="continents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {continentData.map((continent) => (
              <Card 
                key={continent.id}
                className={`bg-slate-900/50 border-blue-500/20 backdrop-blur-xl cursor-pointer transition-all hover:border-blue-400/50 ${
                  selectedContinent?.id === continent.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedContinent(continent)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${continent.color} flex items-center justify-center`}>
                        <Globe2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{continent.name}</h3>
                        <Badge className={continent.status === "active" 
                          ? "bg-emerald-500/20 text-emerald-400 text-xs" 
                          : "bg-slate-500/20 text-slate-400 text-xs"
                        }>
                          {continent.status}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-2 rounded-lg bg-slate-800/50">
                      <p className="text-lg font-bold text-white">{continent.countries}</p>
                      <p className="text-xs text-slate-400">Countries</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/50">
                      <p className="text-lg font-bold text-white">{continent.activeManagers}</p>
                      <p className="text-xs text-slate-400">Managers</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                      <Eye className="w-3 h-3 mr-1" /> View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLockContinent(continent.id);
                      }}
                    >
                      <Lock className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Continent Admins Tab */}
        <TabsContent value="admins" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <Input 
              placeholder="Search Continent Admins..." 
              className="max-w-sm bg-slate-800 border-blue-500/30 text-white"
            />
            <Button className="bg-blue-500 hover:bg-blue-600 gap-2" onClick={handleAssignContinent}>
              <Plus className="w-4 h-4" />
              Assign Continent
            </Button>
          </div>

          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="divide-y divide-blue-500/10">
                  {continentSuperAdmins.map((admin) => (
                    <div key={admin.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                          <span className="text-white font-bold">{admin.name.split(" ").map(n => n[0]).join("")}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white">{admin.name}</h3>
                            <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                              {admin.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400">
                            {admin.continent} • {admin.countries} countries
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Last active</p>
                          <p className="text-sm text-slate-300">{admin.lastActive}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-400">
                            <Settings className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Global Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white">Global Module Management (Non-Core)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {["Marketing", "Support", "Sales", "Analytics", "Reporting", "Communications"].map((module) => (
                  <div key={module} className="p-4 rounded-lg bg-slate-800/50 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-white">{module}</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Active</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 border-slate-600 text-slate-300">
                        Configure
                      </Button>
                      <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-400">
                        <Lock className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-slate-900/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Global Activity Log (Read-Only)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {recentActivity.concat(recentActivity).concat(recentActivity).map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-blue-500/10">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <div className="flex-1">
                        <p className="text-sm text-white">{activity.action}</p>
                        <p className="text-xs text-slate-400">{activity.target}</p>
                      </div>
                      <span className="text-xs text-slate-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminHierarchyDashboard;
