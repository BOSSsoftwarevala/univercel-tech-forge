import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Headphones, User, Shield, Calendar, Clock, Activity,
  Eye, MapPin, Ban, Lock, ChevronRight, X,
  CheckCircle, AlertTriangle, Search, RefreshCw,
  Ticket, UserCheck, MessageSquare, TrendingUp, Phone, Mail,
  AlertCircle, ArrowUpRight, BarChart3, Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for sales & support managers
const salesSupportManagersData = [
  {
    id: "ssm-001",
    name: "Priya Patel",
    email: "priya@support.com",
    phone: "+91 98765 12345",
    region: "South Asia",
    country: "India",
    flag: "🇮🇳",
    status: "active",
    activeTickets: 24,
    resolvedToday: 18,
    leadsCount: 45,
    leadConversion: 32,
    avgResponseTime: "15 min",
    joinedDate: "2023-02-10",
    lastActive: "Just now",
  },
  {
    id: "ssm-002",
    name: "Michael Chen",
    email: "michael@support.com",
    phone: "+1 555 123 4567",
    region: "North America",
    country: "USA",
    flag: "🇺🇸",
    status: "active",
    activeTickets: 12,
    resolvedToday: 28,
    leadsCount: 67,
    leadConversion: 45,
    avgResponseTime: "8 min",
    joinedDate: "2022-08-15",
    lastActive: "5 minutes ago",
  },
  {
    id: "ssm-003",
    name: "Emma Williams",
    email: "emma@support.com",
    phone: "+44 20 7890 1234",
    region: "Europe",
    country: "United Kingdom",
    flag: "🇬🇧",
    status: "active",
    activeTickets: 8,
    resolvedToday: 22,
    leadsCount: 38,
    leadConversion: 28,
    avgResponseTime: "12 min",
    joinedDate: "2023-01-05",
    lastActive: "15 minutes ago",
  },
  {
    id: "ssm-004",
    name: "Aisha Mohammed",
    email: "aisha@support.com",
    phone: "+234 801 567 8901",
    region: "West Africa",
    country: "Nigeria",
    flag: "🇳🇬",
    status: "away",
    activeTickets: 15,
    resolvedToday: 12,
    leadsCount: 29,
    leadConversion: 18,
    avgResponseTime: "20 min",
    joinedDate: "2023-04-20",
    lastActive: "1 hour ago",
  },
  {
    id: "ssm-005",
    name: "Kenji Tanaka",
    email: "kenji@support.com",
    phone: "+81 3 1234 5678",
    region: "East Asia",
    country: "Japan",
    flag: "🇯🇵",
    status: "active",
    activeTickets: 6,
    resolvedToday: 35,
    leadsCount: 52,
    leadConversion: 48,
    avgResponseTime: "5 min",
    joinedDate: "2022-11-10",
    lastActive: "2 minutes ago",
  },
  {
    id: "ssm-006",
    name: "Sofia Garcia",
    email: "sofia@support.com",
    phone: "+34 91 234 5678",
    region: "South Europe",
    country: "Spain",
    flag: "🇪🇸",
    status: "active",
    activeTickets: 10,
    resolvedToday: 19,
    leadsCount: 41,
    leadConversion: 35,
    avgResponseTime: "10 min",
    joinedDate: "2023-03-15",
    lastActive: "30 minutes ago",
  },
];

// Powers list for Sales & Support Manager
const salesSupportPowers = [
  { icon: Users, text: "Can manage leads" },
  { icon: Ticket, text: "Can assign support tickets" },
  { icon: CheckCircle, text: "Can close tickets" },
  { icon: MessageSquare, text: "Can communicate with clients" },
  { icon: ArrowUpRight, text: "Can escalate issues" },
  { icon: BarChart3, text: "Can generate sales reports" },
];

// Activity log data
const activityLogs = [
  { id: "log-001", action: "Ticket Resolved", target: "TKT-45892", time: "2 min ago", type: "ticket" },
  { id: "log-002", action: "Lead Converted", target: "Lead ID: LD-234", time: "15 min ago", type: "lead" },
  { id: "log-003", action: "Client Call", target: "TechCorp India", time: "45 min ago", type: "communication" },
  { id: "log-004", action: "Issue Escalated", target: "Critical: Server Down", time: "1 hour ago", type: "escalation" },
  { id: "log-005", action: "Report Generated", target: "Weekly Sales Report", time: "3 hours ago", type: "report" },
];

const SalesSupportManagerView = () => {
  const [selectedManager, setSelectedManager] = useState<typeof salesSupportManagersData[0] | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleSelectManager = (manager: typeof salesSupportManagersData[0]) => {
    setSelectedManager(manager);
    setDetailPanelOpen(true);
  };

  const handleClosePanel = () => {
    setDetailPanelOpen(false);
    setSelectedManager(null);
  };

  const filteredManagers = salesSupportManagersData.filter(ssm => {
    const matchesSearch = 
      ssm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ssm.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = filterCountry === "all" || ssm.country === filterCountry;
    const matchesStatus = filterStatus === "all" || ssm.status === filterStatus;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const uniqueCountries = [...new Set(salesSupportManagersData.map(ssm => ssm.country))];

  const totalStats = {
    total: salesSupportManagersData.length,
    active: salesSupportManagersData.filter(ssm => ssm.status === "active").length,
    away: salesSupportManagersData.filter(ssm => ssm.status === "away").length,
    totalTickets: salesSupportManagersData.reduce((sum, ssm) => sum + ssm.activeTickets, 0),
    totalLeads: salesSupportManagersData.reduce((sum, ssm) => sum + ssm.leadsCount, 0),
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={cn("flex-1 overflow-hidden flex flex-col transition-all duration-300", detailPanelOpen ? "mr-0" : "")}>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <Headphones className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Sales & Support Manager Dashboard</h1>
                  <p className="text-muted-foreground">Manage all Sales & Support Managers worldwide</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button size="sm" className="gap-2 bg-gradient-to-r from-teal-500 to-emerald-600">
                  <Activity className="w-4 h-4" />
                  Live Mode
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border-teal-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Managers</p>
                      <p className="text-3xl font-bold text-teal-400">{totalStats.total}</p>
                    </div>
                    <Headphones className="w-10 h-10 text-teal-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-500/10 border-emerald-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Online</p>
                      <p className="text-3xl font-bold text-emerald-400">{totalStats.active}</p>
                    </div>
                    <CheckCircle className="w-10 h-10 text-emerald-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-yellow-500/10 border-yellow-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Away</p>
                      <p className="text-3xl font-bold text-yellow-400">{totalStats.away}</p>
                    </div>
                    <Clock className="w-10 h-10 text-yellow-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-orange-500/10 border-orange-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Active Tickets</p>
                      <p className="text-3xl font-bold text-orange-400">{totalStats.totalTickets}</p>
                    </div>
                    <Ticket className="w-10 h-10 text-orange-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Leads</p>
                      <p className="text-3xl font-bold text-blue-400">{totalStats.totalLeads}</p>
                    </div>
                    <Users className="w-10 h-10 text-blue-400/30" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search manager or region..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                  <Select value={filterCountry} onValueChange={setFilterCountry}>
                    <SelectTrigger className="w-48 bg-background/50">
                      <SelectValue placeholder="Filter by Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {uniqueCountries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 bg-background/50">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="away">Away</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Sales & Support Managers List - CRM Style Table */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-400" />
                  All Sales & Support Managers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Manager</th>
                        <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Region</th>
                        <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase">Tickets</th>
                        <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase">Leads</th>
                        <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase">Conversion</th>
                        <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                        <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredManagers.map((manager) => (
                        <motion.tr
                          key={manager.id}
                          whileHover={{ backgroundColor: "rgba(20, 184, 166, 0.05)" }}
                          className="border-b border-border/30 cursor-pointer transition-colors"
                          onClick={() => handleSelectManager(manager)}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10 border-2 border-teal-500/30">
                                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-sm">
                                  {manager.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{manager.name}</p>
                                <p className="text-xs text-muted-foreground">{manager.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{manager.flag}</span>
                              <div>
                                <p className="text-sm font-medium">{manager.region}</p>
                                <p className="text-xs text-muted-foreground">{manager.country}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 text-orange-400">
                              <Ticket className="w-3 h-3" />
                              <span className="text-sm font-medium">{manager.activeTickets}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className="text-sm font-medium text-blue-400">{manager.leadsCount}</span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-sm font-medium text-emerald-400">{manager.leadConversion}%</span>
                              <TrendingUp className="w-3 h-3 text-emerald-400" />
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <Badge 
                              className={cn(
                                "text-xs",
                                manager.status === "active" 
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                                  : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                              )}
                            >
                              {manager.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <Button variant="ghost" size="sm" className="gap-1 text-teal-400 hover:text-teal-300">
                              View
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {detailPanelOpen && selectedManager && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-[480px] border-l border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden flex flex-col"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-teal-500/10 to-emerald-500/10">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/50">
                  Manager Details
                </Badge>
                <Button variant="ghost" size="icon" onClick={handleClosePanel}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-teal-500">
                  <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-xl font-bold">
                    {selectedManager.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedManager.name}</h2>
                  <p className="text-muted-foreground">{selectedManager.region}</p>
                  <Badge 
                    className={cn(
                      "mt-1",
                      selectedManager.status === "active" 
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    )}
                  >
                    {selectedManager.status}
                  </Badge>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Section 1: Identity */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Identity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <Mail className="w-4 h-4 text-teal-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{selectedManager.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <Phone className="w-4 h-4 text-teal-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium">{selectedManager.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <MapPin className="w-4 h-4 text-teal-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Region</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          <span className="text-lg">{selectedManager.flag}</span>
                          {selectedManager.region}, {selectedManager.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Section 2: Powers */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Powers
                  </h3>
                  <div className="space-y-2">
                    {salesSupportPowers.map((power, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-teal-500/5">
                        <power.icon className="w-4 h-4 text-teal-400" />
                        <span className="text-sm text-foreground">{power.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Section 3: Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="gap-2 justify-start">
                      <Users className="w-4 h-4" />
                      View Leads
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start">
                      <Ticket className="w-4 h-4" />
                      View Tickets
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start">
                      <UserCheck className="w-4 h-4" />
                      Assign Ticket
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start">
                      <CheckCircle className="w-4 h-4" />
                      Close Ticket
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-orange-400 hover:text-orange-400">
                      <ArrowUpRight className="w-4 h-4" />
                      Escalate Issue
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-red-400 hover:text-red-400">
                      <Ban className="w-4 h-4" />
                      Suspend Access
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Section 4: Activity Log */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Activity Log
                  </h3>
                  <div className="space-y-2">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          log.type === "ticket" && "bg-orange-500/20 text-orange-400",
                          log.type === "lead" && "bg-blue-500/20 text-blue-400",
                          log.type === "communication" && "bg-purple-500/20 text-purple-400",
                          log.type === "escalation" && "bg-red-500/20 text-red-400",
                          log.type === "report" && "bg-emerald-500/20 text-emerald-400",
                        )}>
                          {log.type === "ticket" && <Ticket className="w-4 h-4" />}
                          {log.type === "lead" && <Users className="w-4 h-4" />}
                          {log.type === "communication" && <MessageSquare className="w-4 h-4" />}
                          {log.type === "escalation" && <ArrowUpRight className="w-4 h-4" />}
                          {log.type === "report" && <BarChart3 className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-muted-foreground">{log.target}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{log.time}</span>
                      </div>
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

export default SalesSupportManagerView;
