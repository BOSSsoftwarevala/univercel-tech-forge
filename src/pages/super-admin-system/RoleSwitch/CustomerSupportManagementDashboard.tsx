import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Headphones, Users, Ticket, MessageSquare, Clock, AlertTriangle,
  CheckCircle, XCircle, Eye, Play, RotateCcw, ChevronUp, Activity,
  BookOpen, FileText, Mail, Phone, UserCheck, Building2, Crown,
  ChevronRight, X, Filter, Search, Shield, Settings, Zap,
  ArrowUpRight, Flag, Timer, AlertCircle, Send, Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Country flags mapping
const countryFlags: Record<string, string> = {
  "United States": "🇺🇸",
  "United Kingdom": "🇬🇧",
  "Germany": "🇩🇪",
  "India": "🇮🇳",
  "Australia": "🇦🇺",
  "Canada": "🇨🇦",
  "Japan": "🇯🇵",
  "Singapore": "🇸🇬",
};

// Mock Support Manager Data
const supportManagers = [
  {
    id: "1",
    name: "Emily Thompson",
    email: "emily.thompson@company.com",
    region: "North America",
    country: "United States",
    status: "active",
    avatar: "👩‍💼",
    openTickets: 45,
    slaBreaches: 2,
    lastActive: "2 mins ago",
    avgResponseTime: "12 mins"
  },
  {
    id: "2",
    name: "James Wilson",
    email: "james.wilson@company.com",
    region: "Europe",
    country: "United Kingdom",
    status: "active",
    avatar: "👨‍💼",
    openTickets: 32,
    slaBreaches: 0,
    lastActive: "5 mins ago",
    avgResponseTime: "8 mins"
  },
  {
    id: "3",
    name: "Hans Mueller",
    email: "hans.mueller@company.com",
    region: "Europe",
    country: "Germany",
    status: "hold",
    avatar: "🧑‍💼",
    openTickets: 18,
    slaBreaches: 5,
    lastActive: "1 hour ago",
    avgResponseTime: "25 mins"
  },
  {
    id: "4",
    name: "Priya Patel",
    email: "priya.patel@company.com",
    region: "Asia Pacific",
    country: "India",
    status: "active",
    avatar: "👩‍💼",
    openTickets: 67,
    slaBreaches: 3,
    lastActive: "10 mins ago",
    avgResponseTime: "15 mins"
  },
  {
    id: "5",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    region: "Asia Pacific",
    country: "Singapore",
    status: "active",
    avatar: "👨‍💼",
    openTickets: 28,
    slaBreaches: 1,
    lastActive: "30 mins ago",
    avgResponseTime: "10 mins"
  }
];

// Powers list
const supportManagerPowers = [
  { power: "View all tickets", scope: "Assigned region", enabled: true },
  { power: "Assign tickets to agents", scope: "All agents", enabled: true },
  { power: "Change ticket priority", scope: "All tickets", enabled: true },
  { power: "Close / Reopen tickets", scope: "All tickets", enabled: true },
  { power: "Communicate with users", scope: "Direct messaging", enabled: true },
  { power: "Escalate to tech/legal/finance", scope: "All departments", enabled: true },
  { power: "Apply temporary restrictions", scope: "Account-level", enabled: true },
  { power: "View SLA & metrics", scope: "Full dashboard", enabled: true },
];

// Actions list
const supportManagerActions = [
  { action: "View Tickets", icon: Ticket, color: "text-blue-400" },
  { action: "Assign Ticket", icon: UserCheck, color: "text-cyan-400" },
  { action: "Reassign Ticket", icon: Users, color: "text-indigo-400" },
  { action: "Change Priority", icon: ChevronUp, color: "text-amber-400" },
  { action: "Close Ticket", icon: CheckCircle, color: "text-emerald-400" },
  { action: "Reopen Ticket", icon: RotateCcw, color: "text-purple-400" },
  { action: "Escalate Issue", icon: AlertTriangle, color: "text-orange-400" },
  { action: "Suspend Manager", icon: XCircle, color: "text-red-400" },
];

// Tickets mock data
const tickets = [
  { id: "TKT-001", title: "Payment not processed", type: "Billing", priority: "critical", status: "new", user: "John D.", slaRemaining: "2h 15m" },
  { id: "TKT-002", title: "Login issues on mobile", type: "Technical", priority: "high", status: "in_progress", user: "Sarah M.", slaRemaining: "4h 30m" },
  { id: "TKT-003", title: "Account verification pending", type: "General", priority: "medium", status: "waiting", user: "Mike R.", slaRemaining: "8h 00m" },
  { id: "TKT-004", title: "Refund request dispute", type: "Legal", priority: "high", status: "in_progress", user: "Emma W.", slaRemaining: "1h 45m" },
  { id: "TKT-005", title: "Feature request feedback", type: "General", priority: "low", status: "new", user: "Tom B.", slaRemaining: "24h 00m" },
];

// Users & Partners mock data
const usersPartners = [
  { id: "USR-001", name: "John Doe", type: "User", status: "active", tickets: 3 },
  { id: "PRO-001", name: "Premium Corp", type: "Pro User", status: "active", tickets: 12 },
  { id: "RSL-001", name: "Tech Reseller Inc", type: "Reseller", status: "active", tickets: 8 },
  { id: "FRN-001", name: "City Franchise", type: "Franchise", status: "warning", tickets: 15 },
];

// Escalations mock data
const escalations = [
  { id: "ESC-001", ticketId: "TKT-004", level: "L2", department: "Legal", status: "pending", assignee: "Legal Team" },
  { id: "ESC-002", ticketId: "TKT-001", level: "L3", department: "Finance", status: "in_progress", assignee: "Finance Lead" },
  { id: "ESC-003", ticketId: "TKT-002", level: "L2", department: "Tech", status: "resolved", assignee: "Dev Team" },
];

// Activity log
const activityLog = [
  { action: "Ticket TKT-005 created", time: "2 mins ago", type: "create" },
  { action: "Priority changed on TKT-001", time: "15 mins ago", type: "priority" },
  { action: "TKT-003 assigned to Agent Smith", time: "30 mins ago", type: "assign" },
  { action: "Escalation ESC-003 resolved", time: "1 hour ago", type: "escalation" },
  { action: "SLA breach on TKT-004", time: "2 hours ago", type: "breach" },
];

interface SupportManagerDetailProps {
  manager: typeof supportManagers[0];
  onClose: () => void;
}

const SupportManagerDetail = ({ manager, onClose }: SupportManagerDetailProps) => {
  const [activeTab, setActiveTab] = useState("tickets");
  const { toast } = useToast();

  const handleAction = (actionName: string) => {
    toast({
      title: `Action: ${actionName}`,
      description: `${actionName} for ${manager.name} initiated successfully.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-[650px] bg-gradient-to-br from-blue-950/98 via-slate-900/98 to-indigo-950/98 border-l border-blue-400/30 shadow-2xl z-50 overflow-hidden"
    >
      <ScrollArea className="h-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl shadow-lg">
                {manager.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{manager.name}</h2>
                  <span className="text-2xl">{countryFlags[manager.country]}</span>
                </div>
                <p className="text-sm text-blue-300/70">{manager.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 text-xs">
                    {manager.region}
                  </Badge>
                  <Badge className={cn(
                    "text-xs",
                    manager.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                  )}>
                    {manager.status}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-blue-300 hover:bg-blue-900/50">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Section 1: Identity */}
          <div className="mb-6 p-4 rounded-xl bg-blue-900/30 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Identity</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-blue-400/50 text-xs">Name</p>
                <p className="text-white">{manager.name}</p>
              </div>
              <div>
                <p className="text-blue-400/50 text-xs">Email</p>
                <p className="text-blue-200">{manager.email}</p>
              </div>
              <div>
                <p className="text-blue-400/50 text-xs">Region</p>
                <p className="text-white flex items-center gap-2">
                  <span>{countryFlags[manager.country]}</span>
                  {manager.region}
                </p>
              </div>
              <div>
                <p className="text-blue-400/50 text-xs">Role Level</p>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                  Support Manager
                </Badge>
              </div>
            </div>
          </div>

          {/* Section 2: Powers */}
          <div className="mb-6 p-4 rounded-xl bg-blue-900/30 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Powers</span>
            </div>
            <div className="space-y-2">
              {supportManagerPowers.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-blue-950/50 border border-blue-800/30">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-sm text-white">{item.power}</span>
                  </div>
                  <span className="text-xs text-blue-400/70">{item.scope}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Actions */}
          <div className="mb-6 p-4 rounded-xl bg-blue-900/30 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Quick Actions</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {supportManagerActions.map((item, idx) => (
                <Button
                  key={idx}
                  type="button"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(item.action);
                  }}
                  className={cn(
                    "justify-start gap-2 h-10 bg-blue-950/50 hover:bg-blue-800/50 border border-blue-800/30 text-xs",
                    item.color
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.action}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Section 4: Support Modules Tabs */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Headphones className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Support Modules</span>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-blue-950/50 border border-blue-500/20 grid grid-cols-3 h-auto p-1">
                <TabsTrigger value="tickets" className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                  Tickets
                </TabsTrigger>
                <TabsTrigger value="users" className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                  Users
                </TabsTrigger>
                <TabsTrigger value="sla" className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                  SLA
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tickets" className="mt-3">
                <div className="space-y-2">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="p-3 rounded-lg bg-blue-950/50 border border-blue-800/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-blue-300">{ticket.id}</span>
                          <Badge className={cn(
                            "text-xs",
                            ticket.priority === "critical" && "bg-red-500/20 text-red-400",
                            ticket.priority === "high" && "bg-orange-500/20 text-orange-400",
                            ticket.priority === "medium" && "bg-amber-500/20 text-amber-400",
                            ticket.priority === "low" && "bg-blue-500/20 text-blue-400"
                          )}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Timer className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-300">{ticket.slaRemaining}</span>
                        </div>
                      </div>
                      <p className="text-sm text-white">{ticket.title}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-blue-400/70">{ticket.type} • {ticket.user}</span>
                        <Badge className={cn(
                          "text-xs",
                          ticket.status === "new" && "bg-cyan-500/20 text-cyan-400",
                          ticket.status === "in_progress" && "bg-blue-500/20 text-blue-400",
                          ticket.status === "waiting" && "bg-amber-500/20 text-amber-400"
                        )}>
                          {ticket.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="users" className="mt-3">
                <div className="space-y-2">
                  {usersPartners.map((user) => (
                    <div key={user.id} className="p-3 rounded-lg bg-blue-950/50 border border-blue-800/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                          user.type === "User" && "bg-blue-500/20 text-blue-400",
                          user.type === "Pro User" && "bg-amber-500/20 text-amber-400",
                          user.type === "Reseller" && "bg-purple-500/20 text-purple-400",
                          user.type === "Franchise" && "bg-indigo-500/20 text-indigo-400"
                        )}>
                          {user.type === "User" && <Users className="w-4 h-4" />}
                          {user.type === "Pro User" && <Crown className="w-4 h-4" />}
                          {user.type === "Reseller" && <Building2 className="w-4 h-4" />}
                          {user.type === "Franchise" && <Building2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm text-white">{user.name}</p>
                          <p className="text-xs text-blue-400/70">{user.type} • {user.tickets} tickets</p>
                        </div>
                      </div>
                      <Badge className={cn(
                        "text-xs",
                        user.status === "active" && "bg-emerald-500/20 text-emerald-400",
                        user.status === "warning" && "bg-amber-500/20 text-amber-400"
                      )}>
                        {user.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sla" className="mt-3">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-950/50 border border-blue-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white">Response Time</span>
                      <span className="text-sm font-mono text-emerald-400">95.2%</span>
                    </div>
                    <Progress value={95} className="h-2 bg-blue-900" />
                    <p className="text-xs text-blue-400/70 mt-1">Target: 15 min avg</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-950/50 border border-blue-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white">Resolution Time</span>
                      <span className="text-sm font-mono text-amber-400">87.5%</span>
                    </div>
                    <Progress value={87} className="h-2 bg-blue-900" />
                    <p className="text-xs text-blue-400/70 mt-1">Target: 4 hours avg</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-red-300">SLA Breaches Today</span>
                    </div>
                    <p className="text-2xl font-bold text-red-400">{manager.slaBreaches}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Second row of tabs */}
            <Tabs defaultValue="communication" className="w-full mt-4">
              <TabsList className="w-full bg-blue-950/50 border border-blue-500/20 grid grid-cols-3 h-auto p-1">
                <TabsTrigger value="communication" className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                  Comms
                </TabsTrigger>
                <TabsTrigger value="escalations" className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                  Escalations
                </TabsTrigger>
                <TabsTrigger value="knowledge" className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                  Knowledge
                </TabsTrigger>
              </TabsList>

              <TabsContent value="communication" className="mt-3">
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-blue-950/50 border border-blue-800/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">Email Queue</span>
                      <Badge className="bg-blue-500/20 text-blue-300 text-xs ml-auto">24 pending</Badge>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-950/50 border border-blue-800/30">
                    <div className="flex items-center gap-3 mb-2">
                      <MessageSquare className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-white">Live Chat</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 text-xs ml-auto">5 active</Badge>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-950/50 border border-blue-800/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white">Call History</span>
                      <Badge className="bg-purple-500/20 text-purple-300 text-xs ml-auto">156 today</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="escalations" className="mt-3">
                <div className="space-y-2">
                  {escalations.map((esc) => (
                    <div key={esc.id} className="p-3 rounded-lg bg-blue-950/50 border border-blue-800/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-orange-400">{esc.id}</span>
                          <Badge className="bg-orange-500/20 text-orange-400 text-xs">{esc.level}</Badge>
                        </div>
                        <Badge className={cn(
                          "text-xs",
                          esc.status === "pending" && "bg-amber-500/20 text-amber-400",
                          esc.status === "in_progress" && "bg-blue-500/20 text-blue-400",
                          esc.status === "resolved" && "bg-emerald-500/20 text-emerald-400"
                        )}>
                          {esc.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-blue-400/70">Ticket: {esc.ticketId} • {esc.department} → {esc.assignee}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="knowledge" className="mt-3">
                <div className="space-y-2">
                  {[
                    { title: "Payment Troubleshooting", type: "FAQ", status: "published" },
                    { title: "Account Recovery Guide", type: "Article", status: "published" },
                    { title: "New Feature Documentation", type: "Internal", status: "draft" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-blue-950/50 border border-blue-800/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="text-sm text-white">{item.title}</p>
                          <p className="text-xs text-blue-400/70">{item.type}</p>
                        </div>
                      </div>
                      <Badge className={cn(
                        "text-xs",
                        item.status === "published" && "bg-emerald-500/20 text-emerald-400",
                        item.status === "draft" && "bg-amber-500/20 text-amber-400"
                      )}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Section 5: Support Activity Log */}
          <div className="p-4 rounded-xl bg-blue-900/30 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Support Activity Log</span>
            </div>
            <div className="space-y-2">
              {activityLog.map((log, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-blue-950/30">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    log.type === "create" && "bg-cyan-400",
                    log.type === "priority" && "bg-amber-400",
                    log.type === "assign" && "bg-blue-400",
                    log.type === "escalation" && "bg-orange-400",
                    log.type === "breach" && "bg-red-400"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm text-white">{log.action}</p>
                  </div>
                  <span className="text-xs text-blue-400/70">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
};

const CustomerSupportManagementDashboard = () => {
  const [selectedManager, setSelectedManager] = useState<typeof supportManagers[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredManagers = supportManagers.filter((manager) => {
    const matchesSearch = manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manager.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = filterCountry === "all" || manager.country === filterCountry;
    const matchesStatus = filterStatus === "all" || manager.status === filterStatus;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)' }}>
            <Headphones className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Support Manager Dashboard</h1>
            <p className="text-sm text-blue-300/70">Customer Support & Helpdesk Operations</p>
          </div>
        </div>
        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
          <Headphones className="w-3 h-3 mr-1.5" />
          SUPPORT THEME ACTIVE
        </Badge>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        {[
          { label: "Open Tickets", value: "190", icon: Ticket, trend: "+12", color: "border-blue-500/50", textColor: "text-blue-400" },
          { label: "SLA Breaches", value: "11", icon: AlertTriangle, trend: "-3", color: "border-red-500/50", textColor: "text-red-400" },
          { label: "Avg Response", value: "12m", icon: Clock, trend: "-2m", color: "border-emerald-500/50", textColor: "text-emerald-400" },
          { label: "Satisfaction", value: "94.2%", icon: CheckCircle, trend: "+1.5%", color: "border-cyan-500/50", textColor: "text-cyan-400" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className={cn("p-4 rounded-xl bg-blue-900/30 border backdrop-blur-xl", stat.color)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-blue-400/70 mb-1 uppercase">{stat.label}</p>
                <p className={cn("text-2xl font-bold", stat.textColor)}>{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400">{stat.trend}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-950/50 border border-blue-800/50 flex items-center justify-center">
                <stat.icon className={cn("w-5 h-5", stat.textColor)} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center gap-3 mb-6"
      >
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/50" />
          <Input
            placeholder="Search managers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-blue-900/30 border-blue-700/50 text-white placeholder:text-blue-400/50"
          />
        </div>
        <Select value={filterCountry} onValueChange={setFilterCountry}>
          <SelectTrigger className="w-44 bg-blue-900/30 border-blue-700/50 text-white">
            <Flag className="w-4 h-4 mr-2 text-blue-400" />
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-blue-700/50">
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="United States">🇺🇸 United States</SelectItem>
            <SelectItem value="United Kingdom">🇬🇧 United Kingdom</SelectItem>
            <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
            <SelectItem value="India">🇮🇳 India</SelectItem>
            <SelectItem value="Singapore">🇸🇬 Singapore</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32 bg-blue-900/30 border-blue-700/50 text-white">
            <Filter className="w-4 h-4 mr-2 text-blue-400" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-blue-700/50">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Support Manager List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-cyan-500" />
          <h2 className="text-lg font-bold text-white">All Support Managers</h2>
          <Badge variant="outline" className="text-blue-300 border-blue-500/50">
            {filteredManagers.length} found
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredManagers.map((manager, idx) => (
            <motion.div
              key={manager.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              onClick={() => setSelectedManager(manager)}
              className="p-4 rounded-xl bg-blue-900/30 border border-blue-700/30 hover:border-blue-500/50 cursor-pointer transition-all group hover:scale-[1.01]"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl shadow-lg">
                  {manager.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-white truncate">{manager.name}</h3>
                    <span className="text-lg">{countryFlags[manager.country]}</span>
                    <Badge className={cn(
                      "text-xs",
                      manager.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                    )}>
                      {manager.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-300/70 mb-2">{manager.region} • {manager.country}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Ticket className="w-3 h-3 text-blue-400" />
                      <span className="text-blue-300">{manager.openTickets} tickets</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className={cn(
                        "w-3 h-3",
                        manager.slaBreaches > 0 ? "text-red-400" : "text-emerald-400"
                      )} />
                      <span className={manager.slaBreaches > 0 ? "text-red-400" : "text-emerald-400"}>
                        {manager.slaBreaches} breaches
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-500/50 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedManager && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setSelectedManager(null)}
            />
            <SupportManagerDetail manager={selectedManager} onClose={() => setSelectedManager(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerSupportManagementDashboard;
