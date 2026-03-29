import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Scale, User, Shield, Calendar, Clock, Activity,
  Eye, MapPin, Ban, Lock, ChevronRight, X,
  CheckCircle, AlertTriangle, Search, RefreshCw,
  Users, Phone, Mail, FileText, Upload, Gavel,
  Building2, Briefcase, Code2, Award, Sparkles,
  Plus, AlertCircle, ExternalLink
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for legal managers
const legalManagersData = [
  {
    id: "lg-001",
    name: "Sarah Collins",
    email: "s.collins@legal.com",
    phone: "+1 212 555 0188",
    jurisdiction: "Global",
    country: "USA",
    flag: "🇺🇸",
    status: "active",
    activeCases: 24,
    pendingCompliance: 8,
    roleLevel: "Senior Legal Manager",
    lastActive: "10 minutes ago",
  },
  {
    id: "lg-002",
    name: "Richard Blackwell",
    email: "r.blackwell@legal.uk",
    phone: "+44 20 7946 0123",
    jurisdiction: "EMEA",
    country: "United Kingdom",
    flag: "🇬🇧",
    status: "active",
    activeCases: 18,
    pendingCompliance: 5,
    roleLevel: "Legal Manager",
    lastActive: "30 minutes ago",
  },
  {
    id: "lg-003",
    name: "Priya Sharma",
    email: "priya@legal.in",
    phone: "+91 98765 43210",
    jurisdiction: "APAC",
    country: "India",
    flag: "🇮🇳",
    status: "active",
    activeCases: 31,
    pendingCompliance: 12,
    roleLevel: "Senior Legal Manager",
    lastActive: "1 hour ago",
  },
  {
    id: "lg-004",
    name: "Hans Weber",
    email: "h.weber@legal.de",
    phone: "+49 30 1234 5678",
    jurisdiction: "EU",
    country: "Germany",
    flag: "🇩🇪",
    status: "hold",
    activeCases: 9,
    pendingCompliance: 3,
    roleLevel: "Legal Manager",
    lastActive: "2 days ago",
  },
];

// Law categories with AI-generated rules
const lawCategories = {
  company: {
    label: "Company Law",
    icon: Building2,
    items: [
      { title: "Company Incorporation Records", status: "compliant", aiGenerated: true },
      { title: "Board Resolutions 2024", status: "pending", aiGenerated: false },
      { title: "Annual Compliance Filings", status: "compliant", aiGenerated: true },
      { title: "Government Notices", status: "action_required", aiGenerated: false },
    ]
  },
  franchise: {
    label: "Franchise Law",
    icon: Briefcase,
    items: [
      { title: "Franchise Agreement Template", status: "compliant", aiGenerated: true },
      { title: "Territory Rights Documentation", status: "compliant", aiGenerated: true },
      { title: "Franchise Compliance Checklist", status: "pending", aiGenerated: true },
      { title: "Dispute Resolution Protocol", status: "compliant", aiGenerated: true },
    ]
  },
  reseller: {
    label: "Reseller Law",
    icon: Users,
    items: [
      { title: "Reseller Agreement v3.0", status: "compliant", aiGenerated: true },
      { title: "Commission Structure Terms", status: "compliant", aiGenerated: true },
      { title: "Payment Dispute Process", status: "pending", aiGenerated: true },
      { title: "Contract Violation Penalties", status: "compliant", aiGenerated: true },
    ]
  },
  developer: {
    label: "Developer / Partner Law",
    icon: Code2,
    items: [
      { title: "Developer NDA Template", status: "compliant", aiGenerated: true },
      { title: "IP Ownership Clauses", status: "compliant", aiGenerated: true },
      { title: "SLA Agreement Terms", status: "pending", aiGenerated: true },
      { title: "Partnership Agreement", status: "compliant", aiGenerated: true },
    ]
  },
  trademark: {
    label: "Trademark & Brand",
    icon: Award,
    items: [
      { title: "Trademark Registry", status: "compliant", aiGenerated: false },
      { title: "Brand Usage Guidelines", status: "compliant", aiGenerated: true },
      { title: "DMCA Takedown Process", status: "compliant", aiGenerated: true },
      { title: "Copyright Protection Policy", status: "pending", aiGenerated: true },
    ]
  },
};

// Powers list with configuration details
const legalPowers = [
  { 
    id: "upload_docs",
    icon: Upload, 
    text: "Can upload legal documents",
    description: "Permission to upload and manage legal documents in the system",
    configItems: ["Allowed file types: PDF, DOCX, DOC", "Max file size: 25MB", "Auto-scan for compliance"],
    enabled: true
  },
  { 
    id: "review_contracts",
    icon: FileText, 
    text: "Can review contracts",
    description: "Permission to review and annotate contracts",
    configItems: ["View all contracts", "Add comments", "Request changes", "Access contract history"],
    enabled: true
  },
  { 
    id: "approve_agreements",
    icon: CheckCircle, 
    text: "Can approve / reject agreements",
    description: "Authority to approve or reject legal agreements",
    configItems: ["Approval limit: $500,000", "Requires dual approval above limit", "Auto-notify stakeholders"],
    enabled: true
  },
  { 
    id: "issue_notices",
    icon: Gavel, 
    text: "Can issue legal notices",
    description: "Permission to issue official legal notices",
    configItems: ["Notice templates available", "Delivery: Email + Registered Mail", "72hr response deadline"],
    enabled: true
  },
  { 
    id: "lock_accounts",
    icon: Lock, 
    text: "Can lock account for legal reasons",
    description: "Authority to lock user/entity accounts for legal compliance",
    configItems: ["Lock duration: 24hr - Permanent", "Requires documented reason", "Auto-escalate after 7 days"],
    enabled: false
  },
  { 
    id: "escalate_counsel",
    icon: ExternalLink, 
    text: "Can escalate to external counsel",
    description: "Permission to escalate matters to external legal counsel",
    configItems: ["Pre-approved counsel list", "Budget per case: $10,000", "Requires manager approval"],
    enabled: true
  },
  { 
    id: "mark_compliance",
    icon: Shield, 
    text: "Can mark compliance status",
    description: "Authority to update compliance status of entities",
    configItems: ["Status options: Compliant, Pending, Non-Compliant", "Add compliance notes", "Set review dates"],
    enabled: true
  },
];

// Activity logs
const activityLogs = [
  { id: "log-001", action: "Case Created", target: "Trademark Dispute #2024-089", time: "15 min ago", type: "case" },
  { id: "log-002", action: "Document Uploaded", target: "Franchise Agreement v4", time: "1 hour ago", type: "document" },
  { id: "log-003", action: "Notice Issued", target: "Reseller Violation Warning", time: "3 hours ago", type: "notice" },
  { id: "log-004", action: "Status Changed", target: "Resolved: IP Dispute", time: "1 day ago", type: "status" },
  { id: "log-005", action: "Account Locked", target: "Franchise #FR-0234", time: "2 days ago", type: "lock" },
];

const LegalManagerView = () => {
  const [selectedManager, setSelectedManager] = useState<typeof legalManagersData[0] | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("company");
  const [selectedPower, setSelectedPower] = useState<typeof legalPowers[0] | null>(null);
  const [powerPanelOpen, setPowerPanelOpen] = useState(false);
  const [powerStates, setPowerStates] = useState<Record<string, boolean>>(
    legalPowers.reduce((acc, p) => ({ ...acc, [p.id]: p.enabled }), {})
  );

  const handlePowerClick = (power: typeof legalPowers[0]) => {
    setSelectedPower(power);
    setPowerPanelOpen(true);
  };

  const handleClosePowerPanel = () => {
    setPowerPanelOpen(false);
    setSelectedPower(null);
  };

  const togglePowerState = (powerId: string) => {
    setPowerStates(prev => ({ ...prev, [powerId]: !prev[powerId] }));
  };

  const handleSelectManager = (manager: typeof legalManagersData[0]) => {
    setSelectedManager(manager);
    setDetailPanelOpen(true);
  };

  const handleClosePanel = () => {
    setDetailPanelOpen(false);
    setSelectedManager(null);
  };

  const filteredManagers = legalManagersData.filter(lm => {
    const matchesSearch = 
      lm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lm.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = filterCountry === "all" || lm.country === filterCountry;
    const matchesStatus = filterStatus === "all" || lm.status === filterStatus;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const uniqueCountries = [...new Set(legalManagersData.map(lm => lm.country))];

  const totalStats = {
    total: legalManagersData.length,
    active: legalManagersData.filter(lm => lm.status === "active").length,
    totalCases: legalManagersData.reduce((sum, lm) => sum + lm.activeCases, 0),
    pendingCompliance: legalManagersData.reduce((sum, lm) => sum + lm.pendingCompliance, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant": return "bg-emerald-500/20 text-emerald-400";
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "action_required": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={cn("flex-1 overflow-hidden flex flex-col transition-all duration-300")}>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-900 to-slate-800 flex items-center justify-center shadow-lg shadow-rose-900/20">
                  <Scale className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Legal Manager Dashboard</h1>
                  <p className="text-muted-foreground">Manage all Legal & Compliance matters globally</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2 border-rose-900/50 text-rose-400 hover:bg-rose-900/20">
                  <Sparkles className="w-4 h-4" />
                  AI Generate Rules
                </Button>
                <Button size="sm" className="gap-2 bg-gradient-to-r from-rose-900 to-slate-800">
                  <Activity className="w-4 h-4" />
                  Live Mode
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-rose-900/20 to-slate-800/20 border-rose-900/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Legal Managers</p>
                      <p className="text-3xl font-bold text-rose-400">{totalStats.total}</p>
                    </div>
                    <Scale className="w-10 h-10 text-rose-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-500/10 border-emerald-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Active</p>
                      <p className="text-3xl font-bold text-emerald-400">{totalStats.active}</p>
                    </div>
                    <CheckCircle className="w-10 h-10 text-emerald-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-orange-500/10 border-orange-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Active Cases</p>
                      <p className="text-3xl font-bold text-orange-400">{totalStats.totalCases}</p>
                    </div>
                    <Gavel className="w-10 h-10 text-orange-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-yellow-500/10 border-yellow-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Pending Compliance</p>
                      <p className="text-3xl font-bold text-yellow-400">{totalStats.pendingCompliance}</p>
                    </div>
                    <AlertTriangle className="w-10 h-10 text-yellow-400/30" />
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
                      placeholder="Search legal manager or jurisdiction..."
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
                      <SelectItem value="hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Legal Managers List */}
            <div className="grid grid-cols-2 gap-4">
              {filteredManagers.map((manager) => (
                <motion.div
                  key={manager.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectManager(manager)}
                  className={cn(
                    "relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 bg-card hover:bg-accent/20",
                    selectedManager?.id === manager.id
                      ? "border-rose-900/50 bg-rose-900/10"
                      : "border-border/50 hover:border-rose-900/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14 border-2 border-rose-900/30">
                      <AvatarFallback className="bg-gradient-to-br from-rose-900 to-slate-800 text-white font-bold">
                        {manager.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{manager.name}</h3>
                        <Badge 
                          className={cn(
                            "text-xs",
                            manager.status === "active" 
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                              : "bg-orange-500/20 text-orange-400 border-orange-500/50"
                          )}
                        >
                          {manager.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{manager.roleLevel}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="text-lg">{manager.flag}</span>
                          {manager.jurisdiction}
                        </span>
                      </div>
                    </div>

                    {/* Case Stats */}
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2 justify-end">
                        <Gavel className="w-3 h-3 text-rose-400" />
                        <span className="text-sm font-medium">{manager.activeCases} cases</span>
                      </div>
                      <p className="text-xs text-yellow-400 flex items-center justify-end gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {manager.pendingCompliance} pending
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {detailPanelOpen && selectedManager && (
          <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-[560px] border-l border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden flex flex-col"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-rose-900/10 to-slate-800/10">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-rose-900/20 text-rose-400 border-rose-900/50">
                  <Scale className="w-3 h-3 mr-1" />
                  Legal Manager Details
                </Badge>
                <Button variant="ghost" size="icon" onClick={handleClosePanel}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-rose-900">
                  <AvatarFallback className="bg-gradient-to-br from-rose-900 to-slate-800 text-white text-xl font-bold">
                    {selectedManager.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedManager.name}</h2>
                  <p className="text-muted-foreground">{selectedManager.roleLevel}</p>
                  <Badge className="mt-1 bg-rose-900/20 text-rose-400">
                    {selectedManager.jurisdiction} Jurisdiction
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
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <Mail className="w-4 h-4 text-rose-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{selectedManager.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <Phone className="w-4 h-4 text-rose-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium">{selectedManager.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Section 2: Law Categories with Tabs */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Law Categories
                    </h3>
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      <Sparkles className="w-3 h-3" />
                      AI Auto-Fill
                    </Button>
                  </div>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-5 h-auto p-1 bg-background/50">
                      {Object.entries(lawCategories).map(([key, cat]) => (
                        <TabsTrigger key={key} value={key} className="text-xs py-2 px-2">
                          <cat.icon className="w-3 h-3 mr-1" />
                          {key === "trademark" ? "TM" : key.charAt(0).toUpperCase() + key.slice(1, 4)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {Object.entries(lawCategories).map(([key, cat]) => (
                      <TabsContent key={key} value={key} className="mt-3 space-y-2">
                        {cat.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{item.title}</span>
                              {item.aiGenerated && (
                                <Badge variant="outline" className="text-xs bg-violet-500/10 text-violet-400 border-violet-500/50">
                                  <Sparkles className="w-2 h-2 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </div>
                            <Badge className={cn("text-xs", getStatusColor(item.status))}>
                              {item.status.replace("_", " ")}
                            </Badge>
                          </div>
                        ))}
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>

                <Separator />

                {/* Section 3: Powers */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Powers
                  </h3>
                  <div className="space-y-2">
                    {legalPowers.map((power) => (
                      <div 
                        key={power.id} 
                        onClick={() => handlePowerClick(power)}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg bg-rose-900/5 cursor-pointer transition-all duration-200",
                          "hover:bg-rose-900/15 hover:scale-[1.01]",
                          !powerStates[power.id] && "opacity-50"
                        )}
                      >
                        <power.icon className="w-4 h-4 text-rose-400" />
                        <span className="text-sm text-foreground flex-1">{power.text}</span>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          powerStates[power.id] ? "bg-emerald-400" : "bg-muted-foreground"
                        )} />
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Section 4: Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="gap-2 justify-start">
                      <Eye className="w-4 h-4" />
                      View Case
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start">
                      <Plus className="w-4 h-4" />
                      Add Case
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start">
                      <Upload className="w-4 h-4" />
                      Upload Doc
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-orange-400">
                      <Gavel className="w-4 h-4" />
                      Issue Notice
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      Mark Resolved
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-red-400">
                      <Lock className="w-4 h-4" />
                      Lock Entity
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Section 5: Activity Log */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Legal Activity Log
                  </h3>
                  <div className="space-y-2">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          log.type === "case" && "bg-blue-500/20 text-blue-400",
                          log.type === "document" && "bg-violet-500/20 text-violet-400",
                          log.type === "notice" && "bg-orange-500/20 text-orange-400",
                          log.type === "status" && "bg-emerald-500/20 text-emerald-400",
                          log.type === "lock" && "bg-red-500/20 text-red-400",
                        )}>
                          {log.type === "case" && <Gavel className="w-4 h-4" />}
                          {log.type === "document" && <FileText className="w-4 h-4" />}
                          {log.type === "notice" && <AlertCircle className="w-4 h-4" />}
                          {log.type === "status" && <CheckCircle className="w-4 h-4" />}
                          {log.type === "lock" && <Lock className="w-4 h-4" />}
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

      {/* Power Configuration Panel */}
      <AnimatePresence>
        {powerPanelOpen && selectedPower && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 h-full w-[420px] border-l border-border/50 bg-card/95 backdrop-blur-xl overflow-hidden flex flex-col z-50 shadow-2xl"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-rose-900/10 to-slate-800/10">
              <div className="flex items-center justify-between mb-3">
                <Badge className="bg-rose-900/20 text-rose-400 border-rose-900/50">
                  <Shield className="w-3 h-3 mr-1" />
                  Power Configuration
                </Badge>
                <Button variant="ghost" size="icon" onClick={handleClosePowerPanel}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-900/30 to-slate-800/30 flex items-center justify-center">
                  <selectedPower.icon className="w-6 h-6 text-rose-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{selectedPower.text}</h3>
                  <p className="text-xs text-muted-foreground">{selectedPower.description}</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Status Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50">
                  <div>
                    <p className="font-medium text-foreground">Permission Status</p>
                    <p className="text-xs text-muted-foreground">Toggle this permission on/off</p>
                  </div>
                  <Button
                    variant={powerStates[selectedPower.id] ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePowerState(selectedPower.id)}
                    className={cn(
                      "gap-2 min-w-[100px]",
                      powerStates[selectedPower.id] 
                        ? "bg-emerald-600 hover:bg-emerald-700" 
                        : "text-muted-foreground"
                    )}
                  >
                    {powerStates[selectedPower.id] ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Enabled
                      </>
                    ) : (
                      <>
                        <Ban className="w-4 h-4" />
                        Disabled
                      </>
                    )}
                  </Button>
                </div>

                {/* Configuration Items */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Configuration
                  </h4>
                  <div className="space-y-2">
                    {selectedPower.configItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Audit Info */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Audit Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 rounded bg-background/30">
                      <span className="text-muted-foreground">Last Modified</span>
                      <span className="text-foreground">2 days ago</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-background/30">
                      <span className="text-muted-foreground">Modified By</span>
                      <span className="text-foreground">Admin-SA-01</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-background/30">
                      <span className="text-muted-foreground">Usage Count</span>
                      <span className="text-foreground">47 times this month</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="space-y-2">
                  <Button className="w-full gap-2 bg-gradient-to-r from-rose-900 to-slate-800">
                    <CheckCircle className="w-4 h-4" />
                    Save Configuration
                  </Button>
                  <Button variant="outline" className="w-full gap-2" onClick={handleClosePowerPanel}>
                    Cancel
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LegalManagerView;
