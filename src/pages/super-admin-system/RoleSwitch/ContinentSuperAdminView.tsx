import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Globe2, User, Shield, Calendar, Clock, Activity,
  Eye, MapPin, Ban, Lock, Key, ChevronRight, X,
  CheckCircle, AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Sample data for Continent Super Admins
const continentSuperAdmins = [
  {
    id: "csa-001",
    name: "Victoria Mensah",
    email: "v.mensah@system.com",
    avatar: "",
    continent: "Africa",
    continentCode: "AF",
    flag: "🌍",
    status: "active",
    assignedSince: "2023-01-15",
    lastAction: "2 minutes ago",
    countries: ["Nigeria", "Kenya", "South Africa", "Ghana", "Egypt"],
  },
  {
    id: "csa-002",
    name: "Chen Wei",
    email: "c.wei@system.com",
    avatar: "",
    continent: "Asia",
    continentCode: "AS",
    flag: "🌏",
    status: "active",
    assignedSince: "2022-08-20",
    lastAction: "15 minutes ago",
    countries: ["China", "India", "Japan", "South Korea", "Singapore"],
  },
  {
    id: "csa-003",
    name: "Hans Mueller",
    email: "h.mueller@system.com",
    avatar: "",
    continent: "Europe",
    continentCode: "EU",
    flag: "🌍",
    status: "active",
    assignedSince: "2022-06-10",
    lastAction: "1 hour ago",
    countries: ["Germany", "France", "UK", "Spain", "Italy"],
  },
  {
    id: "csa-004",
    name: "Carlos Rodriguez",
    email: "c.rodriguez@system.com",
    avatar: "",
    continent: "South America",
    continentCode: "SA",
    flag: "🌎",
    status: "suspended",
    assignedSince: "2023-03-01",
    lastAction: "3 days ago",
    countries: ["Brazil", "Argentina", "Chile", "Colombia"],
  },
  {
    id: "csa-005",
    name: "James Wilson",
    email: "j.wilson@system.com",
    avatar: "",
    continent: "North America",
    continentCode: "NA",
    flag: "🌎",
    status: "active",
    assignedSince: "2022-04-15",
    lastAction: "30 minutes ago",
    countries: ["USA", "Canada", "Mexico"],
  },
];

// Powers list for Continent Super Admin
const csaPowers = [
  "Can manage countries in continent",
  "Can create Area Managers",
  "Can suspend Area Managers",
  "Can approve continent-level requests",
  "Can view continent security logs",
  "Can control continent modules",
  "Can access audit trails",
  "Can generate continent reports",
];

// Live actions sample
const liveActions = [
  { time: "2 min ago", action: "Approved Area Manager", target: "Nigeria" },
  { time: "15 min ago", action: "Reviewed Security Log", target: "Kenya" },
  { time: "1 hr ago", action: "Updated Module Access", target: "South Africa" },
  { time: "2 hrs ago", action: "Created Task", target: "Ghana" },
];

interface ContinentSuperAdminViewProps {
  onSelectAdmin?: (admin: typeof continentSuperAdmins[0]) => void;
}

const ContinentSuperAdminView = ({ onSelectAdmin }: ContinentSuperAdminViewProps) => {
  const [selectedAdmin, setSelectedAdmin] = useState<typeof continentSuperAdmins[0] | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);

  const handleSelectAdmin = (admin: typeof continentSuperAdmins[0]) => {
    setSelectedAdmin(admin);
    setDetailPanelOpen(true);
    onSelectAdmin?.(admin);
  };

  const handleClosePanel = () => {
    setDetailPanelOpen(false);
    setSelectedAdmin(null);
  };

  return (
    <div className="flex h-full">
      {/* Main List Panel */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <Globe2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Continent Super Admin Dashboard</h1>
              <p className="text-muted-foreground">Global continent-level management</p>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total CSAs</p>
                    <p className="text-2xl font-bold text-blue-400">{continentSuperAdmins.length}</p>
                  </div>
                  <Globe2 className="w-8 h-8 text-blue-400/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-500/10 border-emerald-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      {continentSuperAdmins.filter(a => a.status === "active").length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-emerald-400/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-orange-500/10 border-orange-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Suspended</p>
                    <p className="text-2xl font-bold text-orange-400">
                      {continentSuperAdmins.filter(a => a.status === "suspended").length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-400/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-500/10 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Continents</p>
                    <p className="text-2xl font-bold text-purple-400">5</p>
                  </div>
                  <MapPin className="w-8 h-8 text-purple-400/50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* List View */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              All Continent Super Admins (Global)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {continentSuperAdmins.map((admin) => (
                <motion.div
                  key={admin.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectAdmin(admin)}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    selectedAdmin?.id === admin.id
                      ? "bg-blue-500/10 border-blue-500/50"
                      : "bg-card hover:bg-accent/50 border-border/50 hover:border-border"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={admin.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white">
                        {admin.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{admin.name}</h3>
                        <Badge 
                          variant={admin.status === "active" ? "default" : "destructive"}
                          className={cn(
                            "text-xs",
                            admin.status === "active" 
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                              : ""
                          )}
                        >
                          {admin.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                    </div>

                    {/* Continent Info */}
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <span className="text-2xl">{admin.flag}</span>
                        <p className="text-xs text-muted-foreground mt-1">{admin.continent}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Last Action</p>
                        <p className="text-sm font-mono text-foreground">{admin.lastAction}</p>
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
        {detailPanelOpen && selectedAdmin && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-[420px] bg-card border-l border-border flex flex-col"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-emerald-500/10">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedAdmin.flag}</span>
                <div>
                  <h3 className="font-bold text-foreground">{selectedAdmin.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAdmin.continent}</p>
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
                        <span className="text-sm font-medium">{selectedAdmin.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Email</span>
                        <span className="text-sm font-medium">{selectedAdmin.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Continent</span>
                        <span className="text-sm font-medium">{selectedAdmin.flag} {selectedAdmin.continent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Assigned Since</span>
                        <span className="text-sm font-mono">{selectedAdmin.assignedSince}</span>
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
                  <Card className="bg-blue-500/5 border-blue-500/20">
                    <CardContent className="p-4">
                      <ul className="space-y-2">
                        {csaPowers.map((power, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
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
                      <Eye className="w-4 h-4" />
                      View Activity
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <MapPin className="w-4 h-4" />
                      Assign Country
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2 text-orange-400 border-orange-500/50 hover:bg-orange-500/10">
                      <Ban className="w-4 h-4" />
                      Remove Country
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/10">
                      <AlertTriangle className="w-4 h-4" />
                      Suspend
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2 text-red-400 border-red-500/50 hover:bg-red-500/10">
                      <Lock className="w-4 h-4" />
                      Lock
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <Key className="w-4 h-4" />
                      Reset Access
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Section 4: Live Actions Log */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    Live Actions Log
                  </h4>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {liveActions.map((action, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-sm">
                            <span className="text-xs text-muted-foreground font-mono min-w-[70px]">
                              {action.time}
                            </span>
                            <div>
                              <span className="text-foreground">{action.action}</span>
                              <span className="text-blue-400 ml-1">→ {action.target}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Countries List */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Assigned Countries ({selectedAdmin.countries.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAdmin.countries.map((country) => (
                      <Badge key={country} variant="outline" className="bg-muted/50">
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContinentSuperAdminView;
