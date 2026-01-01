import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Flag, MapPin, Users, Building2, TrendingUp, Activity, Settings,
  Eye, Plus, Lock, BarChart3, AlertTriangle, Clock, CheckCircle2,
  ChevronRight, Briefcase, UserCheck, Phone, Mail, Map
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Country regions/areas
const countryAreas = [
  { id: "north", name: "North Region", cities: 12, managers: 4, status: "active", performance: 88 },
  { id: "south", name: "South Region", cities: 8, managers: 3, status: "active", performance: 92 },
  { id: "east", name: "East Region", cities: 10, managers: 3, status: "active", performance: 85 },
  { id: "west", name: "West Region", cities: 15, managers: 5, status: "active", performance: 90 },
  { id: "central", name: "Central Region", cities: 6, managers: 2, status: "maintenance", performance: 75 },
];

// Area managers
const areaManagers = [
  { id: "AM-001", name: "Rahul Sharma", area: "North Region", users: 1250, status: "active", lastActive: "2 min ago" },
  { id: "AM-002", name: "Priya Patel", area: "South Region", users: 980, status: "active", lastActive: "5 min ago" },
  { id: "AM-003", name: "Arjun Singh", area: "East Region", users: 1100, status: "active", lastActive: "15 min ago" },
  { id: "AM-004", name: "Meera Reddy", area: "West Region", users: 1450, status: "active", lastActive: "1 hour ago" },
  { id: "AM-005", name: "Vikram Das", area: "Central Region", users: 650, status: "hold", lastActive: "2 hours ago" },
];

// Country stats
const countryStats = {
  name: "India",
  code: "IN",
  flag: "🇮🇳",
  continent: "Asia",
  totalUsers: 45000,
  totalAreas: 5,
  totalManagers: 17,
  performance: 87
};

// Activity log
const recentActivity = [
  { action: "Area Manager assigned", target: "AM-006 → Central", time: "5 min ago" },
  { action: "Local staff added", target: "12 new staff members", time: "30 min ago" },
  { action: "Performance review", target: "North Region", time: "1 hour ago" },
  { action: "Escalation raised", target: "To Continent Admin", time: "2 hours ago" },
];

const CountryHeadDashboard = () => {
  const [selectedArea, setSelectedArea] = useState<typeof countryAreas[0] | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const handleEnableArea = (areaId: string) => {
    toast.success(`Area ${areaId} enabled`);
  };

  const handleEscalate = () => {
    toast.success("Issue escalated to Continent Super Admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950/20 via-background to-amber-950/20 p-6">
      {/* Header with Flag Theme */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-white to-green-500 flex items-center justify-center shadow-2xl shadow-orange-500/20 text-4xl">
              {countryStats.flag}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Country Head Dashboard</h1>
              <p className="text-orange-400/80">{countryStats.name} • {countryStats.continent} • Country & Regional Operations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 px-4 py-2">
              <Flag className="w-4 h-4 mr-2" />
              COUNTRY OPERATIONS
            </Badge>
            <Button 
              variant="outline" 
              className="border-amber-500/50 text-amber-400 gap-2"
              onClick={handleEscalate}
            >
              <AlertTriangle className="w-4 h-4" />
              Escalate to Continent
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card/50 border-orange-500/20 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Areas</p>
                <p className="text-2xl font-bold text-foreground mt-1">{countryStats.totalAreas}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Map className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-orange-500/20 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Area Managers</p>
                <p className="text-2xl font-bold text-foreground mt-1">{countryStats.totalManagers}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-orange-500/20 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Users</p>
                <p className="text-2xl font-bold text-foreground mt-1">{(countryStats.totalUsers / 1000).toFixed(1)}K</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-orange-500/20 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Performance</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{countryStats.performance}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 border border-orange-500/20 p-1 flex-wrap">
          <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            Country Overview
          </TabsTrigger>
          <TabsTrigger value="areas" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            Regions & Areas
          </TabsTrigger>
          <TabsTrigger value="managers" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            Area Managers
          </TabsTrigger>
          <TabsTrigger value="region-ops" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <MapPin className="w-3 h-3 mr-1" />
            Region Operations
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            Country Users
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="escalations" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            Escalations
          </TabsTrigger>
        </TabsList>

        {/* Country Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Country Map */}
            <Card className="bg-card/50 border-orange-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Map className="w-5 h-5 text-orange-400" />
                  Country Map - {countryStats.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border border-orange-500/20">
                  <div className="text-center">
                    <span className="text-6xl">{countryStats.flag}</span>
                    <p className="text-muted-foreground mt-4">Interactive Country Map</p>
                    <p className="text-xs text-muted-foreground">{countryStats.totalAreas} Regions • {countryStats.totalManagers} Managers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-card/50 border-orange-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-orange-500/10">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.target}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Powers & Limits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Powers */}
            <Card className="bg-card/50 border-orange-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Country Head Powers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Users, label: "Manage Area Managers" },
                    { icon: UserCheck, label: "Manage Country Users" },
                    { icon: CheckCircle2, label: "Approve Local Operations" },
                    { icon: BarChart3, label: "View Country Analytics" },
                    { icon: MapPin, label: "Enable/Disable Areas" },
                    { icon: Briefcase, label: "Assign Local Staff" },
                    { icon: TrendingUp, label: "Monitor Performance" },
                    { icon: AlertTriangle, label: "Handle Escalations" },
                  ].map((power, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <power.icon className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-foreground">{power.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Limits */}
            <Card className="bg-card/50 border-red-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-400" />
                  Access Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm font-medium text-foreground">No access outside country</p>
                    <p className="text-xs text-muted-foreground">Scope limited to {countryStats.name}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm font-medium text-foreground">No role creation</p>
                    <p className="text-xs text-muted-foreground">Request from Continent Admin</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm font-medium text-foreground">No permission matrix access</p>
                    <p className="text-xs text-muted-foreground">View only assigned permissions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Regions & Areas Tab */}
        <TabsContent value="areas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countryAreas.map((area) => (
              <Card 
                key={area.id}
                className={`bg-card/50 border-orange-500/20 backdrop-blur-xl cursor-pointer transition-all hover:border-orange-400/50 ${
                  selectedArea?.id === area.id ? "ring-2 ring-orange-500" : ""
                }`}
                onClick={() => setSelectedArea(area)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{area.name}</h3>
                        <Badge className={area.status === "active" 
                          ? "bg-emerald-500/20 text-emerald-400 text-xs" 
                          : "bg-amber-500/20 text-amber-400 text-xs"
                        }>
                          {area.status}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-center mb-4">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold text-foreground">{area.cities}</p>
                      <p className="text-xs text-muted-foreground">Cities</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold text-foreground">{area.managers}</p>
                      <p className="text-xs text-muted-foreground">Managers</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Performance</span>
                      <span className="text-foreground">{area.performance}%</span>
                    </div>
                    <Progress value={area.performance} className="h-2" />
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 border-orange-500/50 text-orange-400">
                      <Eye className="w-3 h-3 mr-1" /> View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className={area.status === "active" 
                        ? "border-amber-500/50 text-amber-400" 
                        : "border-emerald-500/50 text-emerald-400"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnableArea(area.id);
                      }}
                    >
                      {area.status === "active" ? <Lock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Area Managers Tab */}
        <TabsContent value="managers" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <Input 
              placeholder="Search Area Managers..." 
              className="max-w-sm bg-muted border-orange-500/30"
            />
            <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
              <Plus className="w-4 h-4" />
              Assign Staff
            </Button>
          </div>

          <Card className="bg-card/50 border-orange-500/20">
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="divide-y divide-orange-500/10">
                  {areaManagers.map((manager) => (
                    <div key={manager.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                          <span className="text-white font-bold">{manager.name.split(" ").map(n => n[0]).join("")}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{manager.name}</h3>
                            <Badge className={manager.status === "active" 
                              ? "bg-emerald-500/20 text-emerald-400 text-xs" 
                              : "bg-amber-500/20 text-amber-400 text-xs"
                            }>
                              {manager.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {manager.area} • {manager.users.toLocaleString()} users
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Last active</p>
                          <p className="text-sm text-foreground">{manager.lastActive}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-orange-500/50 text-orange-400">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-muted-foreground text-muted-foreground">
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

        {/* Country Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card className="bg-card/50 border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-foreground">Country User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-orange-400/50 mx-auto mb-4" />
                <p className="text-muted-foreground">User management interface</p>
                <p className="text-sm text-muted-foreground">{countryStats.totalUsers.toLocaleString()} users in {countryStats.name}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-card/50 border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-400" />
                Country Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-orange-500/20">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">₹12.5M</p>
                  <p className="text-xs text-emerald-400">+15% from last month</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-orange-500/20">
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-foreground">38.2K</p>
                  <p className="text-xs text-emerald-400">+8% from last month</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-orange-500/20">
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold text-foreground">4.8%</p>
                  <p className="text-xs text-amber-400">-0.5% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Escalations Tab */}
        <TabsContent value="escalations" className="space-y-6">
          <Card className="bg-card/50 border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Local Escalations
              </CardTitle>
              <Button 
                variant="outline" 
                className="border-amber-500/50 text-amber-400 gap-2"
                onClick={handleEscalate}
              >
                <AlertTriangle className="w-4 h-4" />
                Raise to Continent Admin
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Payment Processing Issue</p>
                      <p className="text-sm text-muted-foreground">North Region • 2 hours pending</p>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-400">Pending</Badge>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">User Verification Backlog</p>
                      <p className="text-sm text-muted-foreground">South Region • Resolved</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400">Resolved</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Region Operations Tab - Merged from Area Manager */}
        <TabsContent value="region-ops" className="space-y-6">
          <Card className="bg-card/50 border-cyan-500/20 backdrop-blur-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Region Operations Control
                </CardTitle>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                  Live Operations
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Region Filter Panel */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    Filter by Region
                  </h3>
                  <div className="space-y-2">
                    {countryAreas.map((area) => (
                      <div 
                        key={area.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedArea?.id === area.id 
                            ? 'bg-cyan-500/20 border-cyan-500/50' 
                            : 'bg-muted/30 border-border hover:border-cyan-500/30'
                        }`}
                        onClick={() => setSelectedArea(area)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{area.name}</span>
                          <Badge variant={area.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {area.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{area.cities} cities</span>
                          <span>{area.managers} managers</span>
                          <span className="text-cyan-400">{area.performance}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Actions Panel */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    {selectedArea ? `${selectedArea.name} Users` : 'Select a Region'}
                  </h3>
                  
                  {selectedArea ? (
                    <div className="space-y-3">
                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" className="border-cyan-500/50 text-cyan-400">
                          <Eye className="w-3 h-3 mr-1" /> View All Users
                        </Button>
                        <Button size="sm" variant="outline" className="border-emerald-500/50 text-emerald-400">
                          <Plus className="w-3 h-3 mr-1" /> Add User
                        </Button>
                        <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-400">
                          <Lock className="w-3 h-3 mr-1" /> Suspend User
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Ban User
                        </Button>
                      </div>

                      {/* Region Stats */}
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                          <p className="text-xs text-muted-foreground">Active Users</p>
                          <p className="text-xl font-bold text-cyan-400">
                            {Math.round(countryStats.totalUsers / 5 * (selectedArea.performance / 100))}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <p className="text-xs text-muted-foreground">Conversions</p>
                          <p className="text-xl font-bold text-emerald-400">
                            {Math.round(selectedArea.performance * 1.5)}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <p className="text-xs text-muted-foreground">Pending</p>
                          <p className="text-xl font-bold text-amber-400">
                            {Math.round((100 - selectedArea.performance) / 5)}
                          </p>
                        </div>
                      </div>

                      {/* Sample Users */}
                      <ScrollArea className="h-48">
                        <div className="space-y-2">
                          {areaManagers.filter(m => m.area === selectedArea.name || true).slice(0, 4).map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-medium text-cyan-400">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.users} managed users</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                  {user.status}
                                </Badge>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                  <Eye className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-muted-foreground">
                      <p>Select a region to view operations</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CountryHeadDashboard;
