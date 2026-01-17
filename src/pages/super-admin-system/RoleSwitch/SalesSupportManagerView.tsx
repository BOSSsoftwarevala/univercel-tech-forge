import { useState, useCallback } from "react";
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
import { useSystemActions } from "@/hooks/useSystemActions";
import { toast } from "sonner";

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
  
  // System actions hook for audit logging and API connections
  const { executeAction, actions } = useSystemActions();

  const handleSelectManager = (manager: typeof salesSupportManagersData[0]) => {
    setSelectedManager(manager);
    setDetailPanelOpen(true);
  };

  const handleClosePanel = () => {
    setDetailPanelOpen(false);
    setSelectedManager(null);
  };

  // Action handlers with audit logging
  const handleViewLeads = useCallback(async () => {
    if (!selectedManager) return;
    await executeAction({
      module: 'support',
      action: 'read',
      entityType: 'Leads',
      entityId: selectedManager.id,
      entityName: selectedManager.name,
      successMessage: `${selectedManager.leadsCount} leads assigned to ${selectedManager.name}`
    });
  }, [selectedManager, executeAction]);

  const handleViewTickets = useCallback(async () => {
    if (!selectedManager) return;
    await executeAction({
      module: 'support',
      action: 'read',
      entityType: 'Tickets',
      entityId: selectedManager.id,
      entityName: selectedManager.name,
      successMessage: `${selectedManager.activeTickets} active tickets`
    });
  }, [selectedManager, executeAction]);

  const handleAssignTicket = useCallback(async () => {
    if (!selectedManager) return;
    await actions.assign('support', 'Ticket', selectedManager.id, 'unassigned', selectedManager.name);
  }, [selectedManager, actions]);

  const handleCloseTicket = useCallback(async () => {
    if (!selectedManager) return;
    await actions.update('support', 'Ticket', selectedManager.id, { status: 'closed' }, selectedManager.name);
  }, [selectedManager, actions]);

  const handleEscalateIssue = useCallback(async () => {
    if (!selectedManager) return;
    await actions.escalate('support', 'Issue', selectedManager.id, 'critical', selectedManager.name);
  }, [selectedManager, actions]);

  const handleSuspendAccess = useCallback(async () => {
    if (!selectedManager) return;
    actions.suspend('support', 'Support Access', selectedManager.id, selectedManager.name);
  }, [selectedManager, actions]);

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
            {/* Header - Compact Premium */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Sales & Support</h1>
                  <p className="text-xs text-muted-foreground">Global Team Management</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Sync
                </Button>
                <Button size="sm" className="h-8 px-3 text-xs bg-emerald-500 hover:bg-emerald-600 text-white">
                  <Activity className="w-3.5 h-3.5 mr-1.5" />
                  Live
                </Button>
              </div>
            </div>

            {/* Stats Cards - Clean White Design */}
            <div className="grid grid-cols-5 gap-3">
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Managers</p>
                      <p className="text-2xl font-bold text-slate-800">{totalStats.total}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                      <Headphones className="w-4 h-4 text-teal-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Online</p>
                      <p className="text-2xl font-bold text-emerald-600">{totalStats.active}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Away</p>
                      <p className="text-2xl font-bold text-amber-600">{totalStats.away}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Tickets</p>
                      <p className="text-2xl font-bold text-orange-600">{totalStats.totalTickets}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Ticket className="w-4 h-4 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Leads</p>
                      <p className="text-2xl font-bold text-blue-600">{totalStats.totalLeads}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters - Clean & Compact */}
            <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search manager..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-slate-50 border-slate-200 text-sm"
                />
              </div>
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="w-40 h-9 bg-slate-50 border-slate-200 text-sm">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {uniqueCountries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32 h-9 bg-slate-50 border-slate-200 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="away">Away</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Managers Table - Clean White Design */}
            <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="py-3 px-4 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-500" />
                  Team Members
                  <Badge className="ml-2 bg-slate-100 text-slate-600 text-[10px]">{filteredManagers.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Manager</th>
                        <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Region</th>
                        <th className="text-center py-2.5 px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Tickets</th>
                        <th className="text-center py-2.5 px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Leads</th>
                        <th className="text-center py-2.5 px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Conv%</th>
                        <th className="text-center py-2.5 px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                        <th className="text-center py-2.5 px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredManagers.map((manager) => (
                        <motion.tr
                          key={manager.id}
                          whileHover={{ backgroundColor: "#f8fafc" }}
                          className="border-b border-slate-100 cursor-pointer"
                          onClick={() => handleSelectManager(manager)}
                        >
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white text-xs font-semibold">
                                  {manager.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-slate-800">{manager.name}</p>
                                <p className="text-[11px] text-slate-500">{manager.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{manager.flag}</span>
                              <div>
                                <p className="text-xs font-medium text-slate-700">{manager.region}</p>
                                <p className="text-[10px] text-slate-400">{manager.country}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-medium">
                              <Ticket className="w-3 h-3" />
                              {manager.activeTickets}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="text-sm font-medium text-blue-600">{manager.leadsCount}</span>
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-sm font-medium text-emerald-600">{manager.leadConversion}%</span>
                              <TrendingUp className="w-3 h-3 text-emerald-500" />
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <Badge 
                              className={cn(
                                "text-[10px] font-medium px-2 py-0.5",
                                manager.status === "active" 
                                  ? "bg-emerald-100 text-emerald-700 border-0"
                                  : "bg-amber-100 text-amber-700 border-0"
                              )}
                            >
                              {manager.status}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                              View
                              <ChevronRight className="w-3.5 h-3.5 ml-1" />
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

      {/* Detail Panel - Clean White Design */}
      <AnimatePresence>
        {detailPanelOpen && selectedManager && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-[420px] border-l border-slate-200 bg-white overflow-hidden flex flex-col shadow-xl"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-teal-50 to-emerald-50">
              <div className="flex items-center justify-between mb-3">
                <Badge className="bg-teal-100 text-teal-700 border-0 text-[10px] font-medium">
                  Manager Profile
                </Badge>
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-slate-100" onClick={handleClosePanel}>
                  <X className="w-4 h-4 text-slate-500" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-teal-400">
                  <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white text-base font-bold">
                    {selectedManager.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">{selectedManager.name}</h2>
                  <p className="text-xs text-slate-500">{selectedManager.region}</p>
                  <Badge 
                    className={cn(
                      "mt-1 text-[10px] border-0",
                      selectedManager.status === "active" 
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    )}
                  >
                    {selectedManager.status}
                  </Badge>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-5">
                {/* Section 1: Contact */}
                <div>
                  <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Contact Info
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50">
                      <Mail className="w-4 h-4 text-teal-500" />
                      <div>
                        <p className="text-[10px] text-slate-400">Email</p>
                        <p className="text-xs font-medium text-slate-700">{selectedManager.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50">
                      <Phone className="w-4 h-4 text-teal-500" />
                      <div>
                        <p className="text-[10px] text-slate-400">Phone</p>
                        <p className="text-xs font-medium text-slate-700">{selectedManager.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50">
                      <MapPin className="w-4 h-4 text-teal-500" />
                      <div>
                        <p className="text-[10px] text-slate-400">Location</p>
                        <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                          <span>{selectedManager.flag}</span>
                          {selectedManager.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                {/* Section 2: Powers */}
                <div>
                  <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Permissions
                  </h3>
                  <div className="grid grid-cols-2 gap-1.5">
                    {salesSupportPowers.map((power, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-teal-50/50">
                        <power.icon className="w-3.5 h-3.5 text-teal-600" />
                        <span className="text-[11px] text-slate-600">{power.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                {/* Section 3: Actions */}
                <div>
                  <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" className="h-8 text-xs bg-teal-500 hover:bg-teal-600 text-white gap-1.5" onClick={handleViewLeads}>
                      <Users className="w-3.5 h-3.5" />
                      Leads
                    </Button>
                    <Button size="sm" className="h-8 text-xs bg-blue-500 hover:bg-blue-600 text-white gap-1.5" onClick={handleViewTickets}>
                      <Ticket className="w-3.5 h-3.5" />
                      Tickets
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200 gap-1.5" onClick={handleAssignTicket}>
                      <UserCheck className="w-3.5 h-3.5" />
                      Assign
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200 gap-1.5" onClick={handleCloseTicket}>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Close
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-orange-200 text-orange-600 hover:bg-orange-50 gap-1.5" onClick={handleEscalateIssue}>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      Escalate
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50 gap-1.5" onClick={handleSuspendAccess}>
                      <Ban className="w-3.5 h-3.5" />
                      Suspend
                    </Button>
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                {/* Section 4: Activity */}
                <div>
                  <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Recent Activity
                  </h3>
                  <div className="space-y-1.5">
                    {activityLogs.slice(0, 4).map((log) => (
                      <div key={log.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center",
                          log.type === "ticket" && "bg-orange-100 text-orange-600",
                          log.type === "lead" && "bg-blue-100 text-blue-600",
                          log.type === "communication" && "bg-purple-100 text-purple-600",
                          log.type === "escalation" && "bg-red-100 text-red-600",
                          log.type === "report" && "bg-emerald-100 text-emerald-600",
                        )}>
                          {log.type === "ticket" && <Ticket className="w-3 h-3" />}
                          {log.type === "lead" && <Users className="w-3 h-3" />}
                          {log.type === "communication" && <MessageSquare className="w-3 h-3" />}
                          {log.type === "escalation" && <ArrowUpRight className="w-3 h-3" />}
                          {log.type === "report" && <BarChart3 className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-700 truncate">{log.action}</p>
                          <p className="text-[10px] text-slate-400 truncate">{log.target}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{log.time}</span>
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
