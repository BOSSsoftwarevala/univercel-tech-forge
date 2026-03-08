/**
 * DEMO MANAGER MAIN CONTENT
 * ==========================
 * Dynamic content based on sidebar selection
 */

import { useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Terminal, Play, Pause, CheckCircle, AlertTriangle,
  Search, RefreshCw, Users, Activity, Clock, Eye,
  Globe2, Monitor, ChevronRight, Plus, Trash2, Copy,
  Heart, ArrowUpCircle, FolderOpen, Grid3X3, Building2,
  GraduationCap, Stethoscope, Briefcase, Landmark, Home,
  Truck, ShoppingCart, Code2, ExternalLink, Key, ToggleLeft,
  CheckSquare, FileEdit, ImageIcon, Database, FileText, Menu,
  Bug, ListChecks, Gauge, History, Bot, Wrench, Sparkles,
  Zap, ScanLine, CircleDot, Loader2, Store, EyeOff,
  DollarSign, FileStack, Brain, UserCog, Shield, Lock, BookLock,
  LayoutList, Tags, ShoppingBag, Wallet, KeySquare, Star,
  BarChart2, TrendingUp, Percent, HeadphonesIcon, Upload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ValaAICommandCenter from "@/components/vala-ai-module/ValaAICommandCenter";

// Lazy load marketplace screens
const MarketplaceProductListing = lazy(() => import("@/components/demo-manager/marketplace-ops/MPProductListing"));
const MarketplaceCategoriesManager = lazy(() => import("@/components/demo-manager/marketplace-ops/MPCategoriesManager"));
const MarketplacePricing = lazy(() => import("@/components/demo-manager/marketplace-ops/MPPricing"));
const MarketplaceOrders = lazy(() => import("@/components/demo-manager/marketplace-ops/MPOrders"));
const MarketplaceWallet = lazy(() => import("@/components/demo-manager/marketplace-ops/MPWallet"));
const MarketplaceLicenses = lazy(() => import("@/components/demo-manager/marketplace-ops/MPLicenses"));
const MarketplaceReviews = lazy(() => import("@/components/demo-manager/marketplace-ops/MPReviews"));
const MarketplaceAnalytics = lazy(() => import("@/components/demo-manager/marketplace-ops/MPAnalytics"));
const MarketplaceFeatured = lazy(() => import("@/components/demo-manager/marketplace-ops/MPFeatured"));
const MarketplaceDiscounts = lazy(() => import("@/components/demo-manager/marketplace-ops/MPDiscounts"));
const MarketplaceSupport = lazy(() => import("@/components/demo-manager/marketplace-ops/MPSupport"));
const MarketplaceImportExport = lazy(() => import("@/components/demo-manager/marketplace-ops/MPImportExport"));

// Marketplace view IDs
const MARKETPLACE_VIEWS: Record<string, React.LazyExoticComponent<any>> = {
  "mp-product-listing": MarketplaceProductListing,
  "mp-categories": MarketplaceCategoriesManager,
  "mp-pricing": MarketplacePricing,
  "mp-orders": MarketplaceOrders,
  "mp-wallet": MarketplaceWallet,
  "mp-licenses": MarketplaceLicenses,
  "mp-reviews": MarketplaceReviews,
  "mp-analytics": MarketplaceAnalytics,
  "mp-featured": MarketplaceFeatured,
  "mp-discounts": MarketplaceDiscounts,
  "mp-support": MarketplaceSupport,
  "mp-import": MarketplaceImportExport,
};

interface DemoManagerMainContentProps {
  activeView: string;
}

// Demo instances data
const demosData = [
  {
    id: "demo-001",
    name: "Enterprise Suite Demo",
    product: "Software Vala Enterprise",
    status: "running",
    activeUsers: 12,
    expiresIn: "7 days",
    createdBy: "Alex Chen",
    region: "North America",
    usagePercent: 78,
  },
  {
    id: "demo-002",
    name: "SMB Trial Instance",
    product: "Software Vala Pro",
    status: "running",
    activeUsers: 5,
    expiresIn: "14 days",
    createdBy: "Sarah Kim",
    region: "Europe",
    usagePercent: 45,
  },
  {
    id: "demo-003",
    name: "Healthcare Module Demo",
    product: "Software Vala Health",
    status: "paused",
    activeUsers: 0,
    expiresIn: "3 days",
    createdBy: "Marcus Johnson",
    region: "Asia Pacific",
    usagePercent: 92,
  },
  {
    id: "demo-004",
    name: "Retail Demo Environment",
    product: "Software Vala Retail",
    status: "expired",
    activeUsers: 0,
    expiresIn: "Expired",
    createdBy: "Emma Rodriguez",
    region: "South America",
    usagePercent: 100,
  },
  {
    id: "demo-005",
    name: "Education Platform Trial",
    product: "Software Vala Edu",
    status: "running",
    activeUsers: 28,
    expiresIn: "21 days",
    createdBy: "David Park",
    region: "Middle East",
    usagePercent: 35,
  },
];

// Demo request queue
const demoRequestsData = [
  { id: "req-001", company: "TechCorp Inc", product: "Enterprise Suite", requestedBy: "John Smith", priority: "high", requestDate: "2024-01-15" },
  { id: "req-002", company: "RetailMax", product: "Retail Module", requestedBy: "Sarah Lee", priority: "medium", requestDate: "2024-01-14" },
  { id: "req-003", company: "HealthPlus", product: "Health Module", requestedBy: "Dr. James", priority: "high", requestDate: "2024-01-13" },
  { id: "req-004", company: "EduWorld", product: "Education Platform", requestedBy: "Mary Johnson", priority: "low", requestDate: "2024-01-12" },
];

// View title mapping
const viewTitles: Record<string, { title: string; icon: React.ComponentType<{ className?: string }> }> = {
  "live-demo-count": { title: "Live Demo Count", icon: Monitor },
  "demo-health-status": { title: "Demo Health Status", icon: Heart },
  "pending-demo-fix": { title: "Pending Demo Fix", icon: AlertTriangle },
  "demo-upgrade-requests": { title: "Demo Upgrade Requests", icon: ArrowUpCircle },
  "all-demos": { title: "All Demos", icon: Grid3X3 },
  "category-wise-demo": { title: "Category-wise Demo", icon: FolderOpen },
  "industry-wise-demo": { title: "Industry-wise Demo", icon: Building2 },
  "role-wise-demo": { title: "Role-wise Demo", icon: Users },
  "cat-education": { title: "Education Demos", icon: GraduationCap },
  "cat-healthcare": { title: "Healthcare Demos", icon: Stethoscope },
  "cat-business": { title: "Business Demos", icon: Briefcase },
  "cat-government": { title: "Government Demos", icon: Landmark },
  "cat-society-property": { title: "Society / Property Demos", icon: Home },
  "cat-transport-logistics": { title: "Transport / Logistics Demos", icon: Truck },
  "cat-ecommerce": { title: "E-Commerce Demos", icon: ShoppingCart },
  "cat-custom-software": { title: "Custom Software Demos", icon: Code2 },
  "demo-url": { title: "Demo URL Manager", icon: ExternalLink },
  "login-credentials": { title: "Login Credentials", icon: Key },
  "role-login-switch": { title: "Role Login Switch", icon: ToggleLeft },
  "feature-coverage": { title: "Feature Coverage", icon: CheckSquare },
  "active-inactive-status": { title: "Active / Inactive Status", icon: Activity },
  "update-text-content": { title: "Update Text Content", icon: FileText },
  "update-images": { title: "Update Images", icon: ImageIcon },
  "update-dummy-data": { title: "Update Dummy Data", icon: Database },
  "update-pages": { title: "Update Pages", icon: FileStack },
  "update-menu-order": { title: "Update Menu Order", icon: Menu },
  "report-bug": { title: "Report Bug", icon: Bug },
  "view-bug-list": { title: "View Bug List", icon: ListChecks },
  "bug-severity": { title: "Bug Severity", icon: Gauge },
  "bug-status": { title: "Bug Status", icon: Clock },
  "fix-history": { title: "Fix History", icon: History },
  "ai-fix-demo-issue": { title: "AI: Fix Demo Issue", icon: Wrench },
  "ai-upgrade-demo-feature": { title: "AI: Upgrade Demo Feature", icon: Sparkles },
  "ai-optimize-demo-flow": { title: "AI: Optimize Demo Flow", icon: Zap },
  "ai-repair-broken-button": { title: "AI: Repair Broken Button", icon: Plus },
  "ai-health-scan-demo": { title: "AI: Health Scan Demo", icon: ScanLine },
  "pending-upgrade": { title: "Pending Upgrade", icon: CircleDot },
  "approved-upgrade": { title: "Approved Upgrade", icon: CheckCircle },
  "in-progress-upgrade": { title: "In-Progress Upgrade", icon: Loader2 },
  "completed-upgrade": { title: "Completed Upgrade", icon: CheckSquare },
  "button-click-test": { title: "Button Click Test", icon: Plus },
  "flow-test": { title: "Flow Test", icon: Activity },
  "role-access-test": { title: "Role Access Test", icon: Users },
  "ui-integrity-check": { title: "UI Integrity Check", icon: Monitor },
  "demo-visible-marketplace": { title: "Visible on Marketplace", icon: Eye },
  "hide-show-demo": { title: "Hide / Show Demo", icon: EyeOff },
  "sync-demo-data": { title: "Sync Demo Data", icon: RefreshCw },
  "pricing-preview": { title: "Pricing Preview", icon: DollarSign },
  "demo-changes-log": { title: "Demo Changes Log", icon: History },
  "ai-actions-log": { title: "AI Actions Log", icon: Brain },
  "manager-actions-log": { title: "Manager Actions Log", icon: UserCog },
  "demo-lock": { title: "Demo Lock", icon: Lock },
  "read-only-mode": { title: "Read-Only Mode", icon: BookLock },
  "copy-disable": { title: "Copy Disable", icon: Copy },
  "inspect-disable": { title: "Inspect Disable", icon: Search },
};

const DemoManagerMainContent = ({ activeView }: DemoManagerMainContentProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Render Dev Studio if selected
  if (activeView === "dev-studio") {
    return <ValaAICommandCenter />;
  }

  // Render Marketplace Operations screens
  const MarketplaceComponent = MARKETPLACE_VIEWS[activeView];
  if (MarketplaceComponent) {
    return (
      <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
        <MarketplaceComponent />
      </Suspense>
    );
  }

  const currentView = viewTitles[activeView] || { title: "Demo Overview", icon: Terminal };
  const ViewIcon = currentView.icon;

  // Action handlers
  const handleStartDemo = (demoId: string) => {
    toast.success(`Demo ${demoId} started`);
  };

  const handleStopDemo = (demoId: string) => {
    toast.info(`Demo ${demoId} stopped`);
  };

  const handleExtendDemo = (demoId: string) => {
    toast.success(`Demo ${demoId} extended by 7 days`);
  };

  const handleCloneDemo = (demoId: string) => {
    toast.success(`Demo ${demoId} cloned`);
  };

  const handleApproveRequest = (reqId: string) => {
    toast.success(`Request ${reqId} approved`);
  };

  const handleRejectRequest = (reqId: string) => {
    toast.error(`Request ${reqId} rejected`);
  };

  const handleRefresh = () => {
    toast.info("Refreshing data...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "paused": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "expired": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  const filteredDemos = demosData.filter(demo => {
    const matchesSearch = 
      demo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demo.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || demo.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalStats = {
    totalDemos: demosData.length,
    activeDemos: demosData.filter(d => d.status === "running").length,
    totalUsers: demosData.reduce((sum, d) => sum + d.activeUsers, 0),
    pendingRequests: demoRequestsData.length,
    expiringSoon: demosData.filter(d => d.expiresIn.includes("3") || d.expiresIn.includes("7")).length,
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <ViewIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{currentView.title}</h1>
              <p className="text-muted-foreground text-sm">Demo Manager • Live Software Control</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button size="sm" className="gap-2 bg-gradient-to-r from-teal-500 to-cyan-600">
              <Plus className="w-4 h-4" />
              Create Demo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Demos</p>
                  <p className="text-3xl font-bold text-teal-400">{totalStats.totalDemos}</p>
                </div>
                <Terminal className="w-10 h-10 text-teal-400/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/10 border-emerald-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Active Now</p>
                  <p className="text-3xl font-bold text-emerald-400">{totalStats.activeDemos}</p>
                </div>
                <Activity className="w-10 h-10 text-emerald-400/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Active Users</p>
                  <p className="text-3xl font-bold text-blue-400">{totalStats.totalUsers}</p>
                </div>
                <Users className="w-10 h-10 text-blue-400/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Pending Requests</p>
                  <p className="text-3xl font-bold text-amber-400">{totalStats.pendingRequests}</p>
                </div>
                <Clock className="w-10 h-10 text-amber-400/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Expiring Soon</p>
                  <p className="text-3xl font-bold text-red-400">{totalStats.expiringSoon}</p>
                </div>
                <AlertTriangle className="w-10 h-10 text-red-400/30" />
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
                  placeholder="Search demo or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 bg-background/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Demo Instances */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Terminal className="w-5 h-5 text-teal-400" />
              Demo Instances
            </h2>
            {filteredDemos.map((demo) => (
              <motion.div
                key={demo.id}
                whileHover={{ scale: 1.01 }}
                className={cn(
                  "relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 bg-card hover:bg-accent/20",
                  "border-border/50 hover:border-teal-500/30"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground">{demo.name}</h3>
                      <Badge className={cn("text-xs", getStatusColor(demo.status))}>
                        {demo.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{demo.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{demo.activeUsers} users</p>
                    <p className="text-xs text-muted-foreground">{demo.region}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Usage</span>
                    <span>{demo.usagePercent}%</span>
                  </div>
                  <Progress value={demo.usagePercent} className="h-2" />
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-border/30">
                  {demo.status === "running" ? (
                    <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => handleStopDemo(demo.id)}>
                      <Pause className="w-3 h-3" />
                      Stop
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => handleStartDemo(demo.id)}>
                      <Play className="w-3 h-3" />
                      Start
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => handleExtendDemo(demo.id)}>
                    <Clock className="w-3 h-3" />
                    Extend
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => handleCloneDemo(demo.id)}>
                    <Copy className="w-3 h-3" />
                    Clone
                  </Button>
                </div>

                <div className="absolute right-4 top-4 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {demo.expiresIn}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Demo Requests */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Pending Requests
            </h2>
            {demoRequestsData.map((req) => (
              <Card key={req.id} className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground">{req.company}</p>
                        <Badge className={cn("text-xs", getPriorityColor(req.priority))}>
                          {req.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{req.product} • {req.requestedBy}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="gap-1 text-xs text-emerald-400 border-emerald-500/50" onClick={() => handleApproveRequest(req.id)}>
                        <CheckCircle className="w-3 h-3" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 text-xs text-red-400 border-red-500/50" onClick={() => handleRejectRequest(req.id)}>
                        <AlertTriangle className="w-3 h-3" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default DemoManagerMainContent;
