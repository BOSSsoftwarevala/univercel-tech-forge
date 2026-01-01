import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MapPin, User, Shield, Activity, Eye, Ban, Lock, ChevronRight, X,
  CheckCircle, AlertTriangle, Filter, Globe2, FileText, Users, Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data for Area Managers
const areaManagers = [
  {
    id: "am-001",
    name: "John Okafor",
    email: "j.okafor@system.com",
    avatar: "",
    country: "Nigeria",
    countryCode: "NG",
    flag: "🇳🇬",
    continent: "Africa",
    area: "Lagos Region",
    status: "active",
    reportsCount: 24,
    usersManaged: 156,
    lastAction: "5 min ago",
  },
  {
    id: "am-002",
    name: "Priya Sharma",
    email: "p.sharma@system.com",
    avatar: "",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    continent: "Asia",
    area: "Mumbai Metro",
    status: "active",
    reportsCount: 18,
    usersManaged: 234,
    lastAction: "12 min ago",
  },
  {
    id: "am-003",
    name: "Maria Garcia",
    email: "m.garcia@system.com",
    avatar: "",
    country: "Mexico",
    countryCode: "MX",
    flag: "🇲🇽",
    continent: "North America",
    area: "Mexico City",
    status: "active",
    reportsCount: 15,
    usersManaged: 189,
    lastAction: "30 min ago",
  },
  {
    id: "am-004",
    name: "Liu Wei",
    email: "l.wei@system.com",
    avatar: "",
    country: "China",
    countryCode: "CN",
    flag: "🇨🇳",
    continent: "Asia",
    area: "Shanghai District",
    status: "suspended",
    reportsCount: 8,
    usersManaged: 312,
    lastAction: "2 days ago",
  },
  {
    id: "am-005",
    name: "Emma Schmidt",
    email: "e.schmidt@system.com",
    avatar: "",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    continent: "Europe",
    area: "Berlin-Brandenburg",
    status: "active",
    reportsCount: 22,
    usersManaged: 178,
    lastAction: "1 hr ago",
  },
  {
    id: "am-006",
    name: "Ahmed Hassan",
    email: "a.hassan@system.com",
    avatar: "",
    country: "Egypt",
    countryCode: "EG",
    flag: "🇪🇬",
    continent: "Africa",
    area: "Cairo Region",
    status: "active",
    reportsCount: 19,
    usersManaged: 145,
    lastAction: "45 min ago",
  },
];

// Powers list for Area Manager
const amPowers = [
  "Can manage local users",
  "Can assign local staff",
  "Can view area analytics",
  "Can raise approvals to Continent Super Admin",
  "Can manage local operations",
  "Can generate area reports",
  "Can handle support escalations",
];

// Activity log sample
const activityLog = [
  { time: "5 min ago", action: "Updated user profile", target: "User #4521" },
  { time: "20 min ago", action: "Approved lead conversion", target: "Lead #892" },
  { time: "1 hr ago", action: "Raised approval request", target: "Budget #12" },
  { time: "2 hrs ago", action: "Assigned task", target: "Staff #23" },
];

const AreaManagerView = () => {
  const [selectedManager, setSelectedManager] = useState<typeof areaManagers[0] | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [filterContinent, setFilterContinent] = useState<string>("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleSelectManager = (manager: typeof areaManagers[0]) => {
    setSelectedManager(manager);
    setDetailPanelOpen(true);
  };

  const handleClosePanel = () => {
    setDetailPanelOpen(false);
    setSelectedManager(null);
  };

  // Filter managers
  const filteredManagers = areaManagers.filter(m => {
    if (filterContinent !== "all" && m.continent !== filterContinent) return false;
    if (filterCountry !== "all" && m.country !== filterCountry) return false;
    if (filterStatus !== "all" && m.status !== filterStatus) return false;
    return true;
  });

  // Get unique values for filters
  const continents = [...new Set(areaManagers.map(m => m.continent))];
  const countries = [...new Set(areaManagers.map(m => m.country))];

  return (
    <div className="flex h-full">
      {/* Main List Panel */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Area Manager Dashboard (Worldwide)</h1>
              <p className="text-muted-foreground">Country/region operations management</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <Card className="bg-cyan-500/10 border-cyan-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Managers</p>
                    <p className="text-2xl font-bold text-cyan-400">{areaManagers.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-cyan-400/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-500/10 border-emerald-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      {areaManagers.filter(a => a.status === "active").length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-emerald-400/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Countries</p>
                    <p className="text-2xl font-bold text-blue-400">{countries.length}</p>
                  </div>
                  <Globe2 className="w-8 h-8 text-blue-400/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-500/10 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Reports</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {areaManagers.reduce((acc, m) => acc + m.reportsCount, 0)}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-purple-400/50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters:</span>
          </div>
          <Select value={filterContinent} onValueChange={setFilterContinent}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Continent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Continents</SelectItem>
              {continents.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCountry} onValueChange={setFilterCountry}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="ml-auto">
            Showing {filteredManagers.length} of {areaManagers.length}
          </Badge>
        </div>

        {/* List View */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              All Area Managers (Global)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredManagers.map((manager) => (
                <motion.div
                  key={manager.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectManager(manager)}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    selectedManager?.id === manager.id
                      ? "bg-cyan-500/10 border-cyan-500/50"
                      : "bg-card hover:bg-accent/50 border-border/50 hover:border-border"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={manager.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-sky-500 text-white">
                        {manager.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{manager.name}</h3>
                        <Badge 
                          variant={manager.status === "active" ? "default" : "destructive"}
                          className={cn(
                            "text-xs",
                            manager.status === "active" 
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                              : ""
                          )}
                        >
                          {manager.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{manager.area}</p>
                    </div>

                    {/* Country Info */}
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <span className="text-2xl">{manager.flag}</span>
                        <p className="text-xs text-muted-foreground mt-1">{manager.country}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{manager.reportsCount}</p>
                        <p className="text-xs text-muted-foreground">Reports</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Last Action</p>
                        <p className="text-sm font-mono text-foreground">{manager.lastAction}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {detailPanelOpen && selectedManager && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-[420px] bg-card border-l border-border flex flex-col"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-sky-500/10">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedManager.flag}</span>
                <div>
                  <h3 className="font-bold text-foreground">{selectedManager.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedManager.country} - {selectedManager.area}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClosePanel}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Section 1: Identity */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Identity
                  </h4>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Name</span>
                        <span className="text-sm font-medium">{selectedManager.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Email</span>
                        <span className="text-sm font-medium">{selectedManager.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Country</span>
                        <span className="text-sm font-medium">{selectedManager.flag} {selectedManager.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Area</span>
                        <span className="text-sm font-medium">{selectedManager.area}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Users Managed</span>
                        <span className="text-sm font-mono">{selectedManager.usersManaged}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                {/* Section 2: Powers */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Powers
                  </h4>
                  <Card className="bg-cyan-500/5 border-cyan-500/20">
                    <CardContent className="p-4">
                      <ul className="space-y-2">
                        {amPowers.map((power, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Shield className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">{power}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                {/* Section 3: Actions */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Actions
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <Activity className="w-4 h-4" />
                      View Area Activity
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <Users className="w-4 h-4" />
                      View Users
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <FileText className="w-4 h-4" />
                      Assign Task
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/10">
                      <AlertTriangle className="w-4 h-4" />
                      Suspend
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2 text-red-400 border-red-500/50 hover:bg-red-500/10" disabled={selectedManager.status === "suspended"}>
                      <Lock className="w-4 h-4" />
                      Lock
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Section 4: Activity Log */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    Activity Log
                  </h4>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {activityLog.map((action, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-sm">
                            <span className="text-xs text-muted-foreground font-mono min-w-[70px]">
                              {action.time}
                            </span>
                            <div>
                              <span className="text-foreground">{action.action}</span>
                              <span className="text-cyan-400 ml-1">→ {action.target}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AreaManagerView;
