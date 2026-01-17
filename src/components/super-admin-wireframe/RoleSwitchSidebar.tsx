import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Globe2, MapPin, Server, ChevronLeft, ChevronRight, ArrowLeft,
  Crown, LayoutDashboard, Users, Shield, Activity,
  Settings, LogOut, AlertCircle, Building2, Headphones, Handshake,
  Target, Star, Scale, ListTodo, Wallet, FileText, Receipt, 
  TrendingUp, CreditCard, PieChart, BarChart3, Clock, Code2,
  UserCheck, Briefcase, Award, MessageSquare, Phone, Mail,
  Package, Truck, Store, Map, Database, HardDrive, Cpu,
  Monitor, Zap, Lock, Key, Gavel, FileCheck, BookOpen,
  Bug, GitBranch, Rocket, Terminal, AlertTriangle, Radio,
  Megaphone, Image, Share2, BarChart, LineChart, Palette, Ticket,
  Flag, Box, ShoppingCart, Eye, Play, Layers,
  CheckCircle, XCircle, ArrowUpRight, Pause, Archive, Ban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { toast } from "sonner";


export type ActiveRole = "boss_owner" | "ceo" | "continent_super_admin" | "country_head" | "server_manager" | "franchise_manager" | "sales_support_manager" | "reseller_manager" | "lead_manager" | "pro_manager" | "legal_manager" | "task_management" | "finance_manager" | "developer_management" | "marketing_management" | "customer_support_management" | "role_manager" | "product_manager";

interface RoleSwitchSidebarProps {
  activeRole: ActiveRole;
  onRoleChange: (role: ActiveRole) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  activeNav?: string;
  onNavChange?: (navId: string) => void;
  onSubItemClick?: (subItemId: string) => void;
}

// Role configurations with themes
export const roleConfigs = {
  boss_owner: {
    id: "boss_owner",
    label: "Boss / Owner",
    shortLabel: "BOSS",
    icon: Crown,
    themeColor: "from-amber-500 via-yellow-500 to-orange-600",
    accentColor: "text-amber-400",
    bgAccent: "bg-amber-500/10",
    borderAccent: "border-amber-500/50",
    description: "Final Authority • System Owner",
  },
  ceo: {
    id: "ceo",
    label: "CEO",
    shortLabel: "CEO",
    icon: Eye,
    themeColor: "from-emerald-500 via-teal-500 to-cyan-600",
    accentColor: "text-emerald-400",
    bgAccent: "bg-emerald-500/10",
    borderAccent: "border-emerald-500/50",
    description: "Vision & Oversight • Read-only",
  },
  continent_super_admin: {
    id: "continent_super_admin",
    label: "Continent Admin",
    shortLabel: "CA",
    icon: Globe2,
    themeColor: "from-blue-500 to-emerald-500",
    accentColor: "text-blue-400",
    bgAccent: "bg-blue-500/10",
    borderAccent: "border-blue-500/50",
    description: "Continent-level management",
  },
  country_head: {
    id: "country_head",
    label: "Country Head",
    shortLabel: "CH",
    icon: Flag,
    themeColor: "from-orange-500 to-amber-600",
    accentColor: "text-orange-400",
    bgAccent: "bg-orange-500/10",
    borderAccent: "border-orange-500/50",
    description: "Country & Region Operations",
  },
  server_manager: {
    id: "server_manager",
    label: "Server Manager",
    shortLabel: "SM",
    icon: Server,
    themeColor: "from-slate-600 to-zinc-700",
    accentColor: "text-emerald-400",
    bgAccent: "bg-emerald-500/10",
    borderAccent: "border-emerald-500/50",
    description: "Infrastructure & technical ops",
  },
  franchise_manager: {
    id: "franchise_manager",
    label: "Franchise Manager",
    shortLabel: "FM",
    icon: Building2,
    themeColor: "from-indigo-500 to-purple-600",
    accentColor: "text-indigo-400",
    bgAccent: "bg-indigo-500/10",
    borderAccent: "border-indigo-500/50",
    description: "Business & operations view",
  },
  sales_support_manager: {
    id: "sales_support_manager",
    label: "Sales & Support Manager",
    shortLabel: "SSM",
    icon: Headphones,
    themeColor: "from-teal-500 to-emerald-600",
    accentColor: "text-teal-400",
    bgAccent: "bg-teal-500/10",
    borderAccent: "border-teal-500/50",
    description: "CRM & ticketing view",
  },
  reseller_manager: {
    id: "reseller_manager",
    label: "Reseller Manager",
    shortLabel: "RM",
    icon: Handshake,
    themeColor: "from-amber-500 to-orange-600",
    accentColor: "text-amber-400",
    bgAccent: "bg-amber-500/10",
    borderAccent: "border-amber-500/50",
    description: "Partner & channel view",
  },
  lead_manager: {
    id: "lead_manager",
    label: "Lead Manager",
    shortLabel: "LM",
    icon: Target,
    themeColor: "from-violet-500 to-purple-600",
    accentColor: "text-violet-400",
    bgAccent: "bg-violet-500/10",
    borderAccent: "border-violet-500/50",
    description: "Sales pipeline & leads view",
  },
  pro_manager: {
    id: "pro_manager",
    label: "Pro Manager",
    shortLabel: "PM",
    icon: Crown,
    themeColor: "from-yellow-500 to-amber-600",
    accentColor: "text-yellow-400",
    bgAccent: "bg-yellow-500/10",
    borderAccent: "border-yellow-500/50",
    description: "Prime user management",
  },
  legal_manager: {
    id: "legal_manager",
    label: "Legal Manager",
    shortLabel: "LG",
    icon: Scale,
    themeColor: "from-rose-900 to-slate-800",
    accentColor: "text-rose-400",
    bgAccent: "bg-rose-900/10",
    borderAccent: "border-rose-900/50",
    description: "Legal & compliance view",
  },
  task_management: {
    id: "task_management",
    label: "Task Management",
    shortLabel: "TM",
    icon: ListTodo,
    themeColor: "from-blue-500 to-cyan-600",
    accentColor: "text-blue-400",
    bgAccent: "bg-blue-500/10",
    borderAccent: "border-blue-500/50",
    description: "Global task management",
  },
  finance_manager: {
    id: "finance_manager",
    label: "Finance Manager",
    shortLabel: "FIN",
    icon: Wallet,
    themeColor: "from-emerald-700 to-green-600",
    accentColor: "text-emerald-400",
    bgAccent: "bg-emerald-700/10",
    borderAccent: "border-emerald-600/50",
    description: "Financial operations & accounting",
  },
  developer_management: {
    id: "developer_management",
    label: "Developer Management",
    shortLabel: "DEV",
    icon: Terminal,
    themeColor: "from-slate-700 to-zinc-900",
    accentColor: "text-cyan-400",
    bgAccent: "bg-cyan-500/10",
    borderAccent: "border-cyan-500/50",
    description: "Tech & engineering operations",
  },
  marketing_management: {
    id: "marketing_management",
    label: "Marketing Management",
    shortLabel: "MKT",
    icon: Megaphone,
    themeColor: "from-pink-500 to-rose-600",
    accentColor: "text-pink-400",
    bgAccent: "bg-pink-500/10",
    borderAccent: "border-pink-500/50",
    description: "Marketing & growth operations",
  },
  customer_support_management: {
    id: "customer_support_management",
    label: "Customer Support Management",
    shortLabel: "CSM",
    icon: Headphones,
    themeColor: "from-blue-500 to-cyan-600",
    accentColor: "text-blue-400",
    bgAccent: "bg-blue-500/10",
    borderAccent: "border-blue-500/50",
    description: "Support & helpdesk operations",
  },
  role_manager: {
    id: "role_manager",
    label: "Role Manager",
    shortLabel: "RM",
    icon: Shield,
    themeColor: "from-violet-500 to-purple-600",
    accentColor: "text-violet-400",
    bgAccent: "bg-violet-500/10",
    borderAccent: "border-violet-500/50",
    description: "Role & permission management",
  },
  product_manager: {
    id: "product_manager",
    label: "Product Manager",
    shortLabel: "PM",
    icon: Box,
    themeColor: "from-indigo-500 to-violet-600",
    accentColor: "text-indigo-400",
    bgAccent: "bg-indigo-500/10",
    borderAccent: "border-indigo-500/50",
    description: "Product catalog & demo management",
  },
} as const;

// Extended navigation items per role - role-specific features
const roleNavItems: Record<ActiveRole, Array<{ id: string; label: string; icon: any; subItems?: Array<{ id: string; label: string; status: string }> }>> = {
  boss_owner: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "approvals", label: "Approvals", icon: CheckCircle },
    { id: "server-control", label: "Server Control", icon: Server },
    { id: "dev-control", label: "Development Control", icon: Code2 },
    { id: "franchise-control", label: "Franchise Control", icon: Building2 },
    { id: "reseller-control", label: "Reseller Control", icon: Handshake },
    { id: "finance", label: "Finance & Wallet", icon: Wallet },
    { id: "marketing", label: "Marketing / Leads", icon: Target },
    { id: "product-demo", label: "Product & Demo", icon: Box },
    { id: "support-overview", label: "Support Overview", icon: Headphones },
    { id: "security", label: "Security / Black Box", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  ceo: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "overview", label: "Business Overview", icon: Eye },
    { id: "revenue", label: "Revenue Insights", icon: TrendingUp },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  continent_super_admin: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      subItems: [
        { id: "csa-asia", label: "Asia Super Admin", status: "active" },
        { id: "csa-africa", label: "Africa Super Admin", status: "active" },
        { id: "csa-europe", label: "Europe Super Admin", status: "active" },
        { id: "csa-north-america", label: "North America Super Admin", status: "active" },
        { id: "csa-south-america", label: "South America Super Admin", status: "active" },
        { id: "csa-australia", label: "Australia Super Admin", status: "active" },
        { id: "csa-antarctica", label: "Antarctica Super Admin", status: "locked" },
      ],
    },
    { id: "continents", label: "All Continents", icon: Globe2 },
    { id: "admins", label: "Continent Admins", icon: Users },
    { id: "countries", label: "Country Overview", icon: Map },
    { id: "activity", label: "Live Activity", icon: Activity },
    { id: "reports", label: "Global Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  server_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "servers", label: "All Servers", icon: Server },
    { id: "databases", label: "Databases", icon: Database },
    { id: "storage", label: "Storage", icon: HardDrive },
    { id: "monitoring", label: "Monitoring", icon: Monitor },
    { id: "performance", label: "Performance", icon: Cpu },
    { id: "security", label: "Security", icon: Shield },
    { id: "activity", label: "Tech Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  franchise_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "franchises", label: "All Franchises", icon: Building2 },
    { id: "branches", label: "Branch Network", icon: Store },
    { id: "operations", label: "Operations", icon: Briefcase },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "activity", label: "Franchise Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  sales_support_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "team", label: "Support Team", icon: Users },
    { id: "tickets", label: "Support Tickets", icon: MessageSquare },
    { id: "calls", label: "Call Center", icon: Phone },
    { id: "emails", label: "Email Queue", icon: Mail },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "activity", label: "Support Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  reseller_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "resellers", label: "All Resellers", icon: Handshake },
    { id: "tiers", label: "Reseller Tiers", icon: Award },
    { id: "commissions", label: "Commissions", icon: CreditCard },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "payouts", label: "Payouts", icon: Wallet },
    { id: "activity", label: "Partner Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  lead_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leads", label: "All Leads", icon: Target },
    { id: "pipeline", label: "Sales Pipeline", icon: TrendingUp },
    { id: "sources", label: "Lead Sources", icon: Zap },
    { id: "assignments", label: "Assignments", icon: UserCheck },
    { id: "activity", label: "Lead Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  pro_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pros", label: "All Pro Users", icon: Crown },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { id: "benefits", label: "Pro Benefits", icon: Award },
    { id: "upgrades", label: "Upgrades", icon: TrendingUp },
    { id: "activity", label: "Pro Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  legal_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "cases", label: "Legal Cases", icon: Gavel },
    { id: "contracts", label: "Contracts", icon: FileCheck },
    { id: "compliance", label: "Compliance", icon: Shield },
    { id: "documents", label: "Documents", icon: BookOpen },
    { id: "activity", label: "Legal Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  task_management: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tasks", label: "All Tasks", icon: ListTodo },
    { id: "developers", label: "Developers", icon: Code2 },
    { id: "projects", label: "Projects", icon: Package },
    { id: "sprints", label: "Sprints", icon: Zap },
    { id: "activity", label: "Task Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  finance_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "managers", label: "All Finance Managers", icon: Users },
    { id: "transactions", label: "Transactions", icon: Receipt },
    { id: "revenue", label: "Revenue", icon: TrendingUp },
    { id: "expenses", label: "Expenses", icon: CreditCard },
    { id: "commissions", label: "Commissions", icon: PieChart },
    { id: "payouts", label: "Payouts", icon: Wallet },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "tax", label: "Tax & Compliance", icon: Scale },
    { id: "activity", label: "Finance Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  developer_management: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "managers", label: "All Dev Managers", icon: Users },
    { id: "developers", label: "Developers", icon: Code2 },
    { id: "tasks", label: "Tasks & Sprints", icon: ListTodo },
    { id: "bugs", label: "Bug Tracker", icon: Bug },
    { id: "apis", label: "API Management", icon: Radio },
    { id: "releases", label: "Releases", icon: Rocket },
    { id: "monitoring", label: "System Monitoring", icon: Monitor },
    { id: "security", label: "Security & Access", icon: Key },
    { id: "activity", label: "Tech Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  marketing_management: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "managers", label: "All Marketing Managers", icon: Users },
    { id: "campaigns", label: "Campaigns", icon: Megaphone },
    { id: "leads", label: "Lead Sources", icon: Target },
    { id: "content", label: "Content Library", icon: Image },
    { id: "ads", label: "Ad Accounts", icon: Share2 },
    { id: "analytics", label: "Analytics & Insights", icon: LineChart },
    { id: "brand", label: "Brand & Compliance", icon: Palette },
    { id: "activity", label: "Marketing Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  customer_support_management: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "managers", label: "All Support Managers", icon: Users },
    { id: "tickets", label: "Tickets", icon: MessageSquare },
    { id: "users", label: "Users & Partners", icon: UserCheck },
    { id: "sla", label: "SLA Management", icon: Clock },
    { id: "communication", label: "Communication", icon: Mail },
    { id: "escalations", label: "Escalations", icon: AlertCircle },
    { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
    { id: "activity", label: "Support Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  role_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "roles", label: "All Roles", icon: Shield },
    { id: "approvals", label: "Pending Approvals", icon: Clock },
    { id: "matrix", label: "Permission Matrix", icon: Key },
    { id: "assignments", label: "Role Assignments", icon: UserCheck },
    { id: "versions", label: "Role Versions", icon: FileText },
    { id: "audit", label: "Audit Log", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  country_head: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "areas", label: "Regions & Areas", icon: Map },
    { id: "managers", label: "Area Managers", icon: Users },
    { id: "users", label: "Country Users", icon: UserCheck },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "escalations", label: "Escalations", icon: AlertTriangle },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  product_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "All Products", icon: Box },
    { id: "demos", label: "Demo Management", icon: Play },
    { id: "catalog", label: "Product Catalog", icon: Layers },
    { id: "pricing", label: "Pricing & Plans", icon: CreditCard },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "analytics", label: "Product Analytics", icon: BarChart3 },
    { id: "activity", label: "Product Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
};

// ============================================
// ENTERPRISE: Global Actions Panel Component
// Context-aware actions for selected cards
// ============================================
const GlobalActionsPanel = ({ collapsed }: { collapsed: boolean }) => {
  const { selectedCard, clearSelection } = useDashboardContext();
  
  // Action handlers
  const handleAction = useCallback((actionType: string) => {
    if (!selectedCard) return;
    
    const actionMessages: Record<string, { title: string; type: 'success' | 'error' | 'warning' | 'info' }> = {
      approve: { title: `✓ Approved: ${selectedCard.label}`, type: 'success' },
      reject: { title: `✕ Rejected: ${selectedCard.label}`, type: 'error' },
      override: { title: `⚡ Override Applied: ${selectedCard.label}`, type: 'warning' },
      assign: { title: `👤 Assigned: ${selectedCard.label}`, type: 'info' },
      lock: { title: `🔒 Locked: ${selectedCard.label}`, type: 'error' },
      freeze: { title: `❄️ Frozen: ${selectedCard.label}`, type: 'warning' },
      escalate: { title: `⬆ Escalated: ${selectedCard.label}`, type: 'warning' },
      archive: { title: `📦 Archived: ${selectedCard.label}`, type: 'info' },
    };
    
    const msg = actionMessages[actionType] || { title: `Action: ${actionType}`, type: 'info' as const };
    toast[msg.type](msg.title, { description: `Applied to ${selectedCard.value} items` });
    clearSelection();
  }, [selectedCard, clearSelection]);

  const actions = [
    { id: 'approve', label: 'Approve', icon: CheckCircle, color: 'bg-emerald-500 hover:bg-emerald-600', textColor: 'text-white' },
    { id: 'reject', label: 'Reject', icon: XCircle, color: 'bg-red-500 hover:bg-red-600', textColor: 'text-white' },
    { id: 'override', label: 'Override', icon: Zap, color: 'bg-orange-500 hover:bg-orange-600', textColor: 'text-white' },
    { id: 'assign', label: 'Assign', icon: UserCheck, color: 'bg-blue-500 hover:bg-blue-600', textColor: 'text-white' },
    { id: 'lock', label: 'Lock', icon: Lock, color: 'bg-slate-600 hover:bg-slate-700', textColor: 'text-white' },
    { id: 'freeze', label: 'Freeze', icon: Pause, color: 'bg-cyan-500 hover:bg-cyan-600', textColor: 'text-white' },
    { id: 'escalate', label: 'Escalate', icon: ArrowUpRight, color: 'bg-purple-500 hover:bg-purple-600', textColor: 'text-white' },
    { id: 'archive', label: 'Archive', icon: Archive, color: 'bg-amber-500 hover:bg-amber-600', textColor: 'text-white' },
  ];

  if (collapsed) {
    return (
      <div className="p-2 border-t border-white/20">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className={cn(
              "w-full h-8 rounded-lg flex items-center justify-center",
              selectedCard ? "bg-emerald-500/30" : "bg-white/10"
            )}>
              <Zap className={cn("w-4 h-4", selectedCard ? "text-emerald-300" : "text-white/50")} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            {selectedCard ? `Actions for: ${selectedCard.label}` : 'Select a card first'}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="border-t border-white/20 bg-white/5">
      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">
            Global Actions
          </span>
        </div>
        {selectedCard && (
          <button 
            onClick={clearSelection}
            className="text-[9px] text-white/60 hover:text-white/90 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Context Info */}
      {selectedCard ? (
        <div className="px-3 pb-2">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
            <p className="text-[10px] text-blue-200 font-medium truncate">{selectedCard.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] text-white/70">{selectedCard.value} items</span>
              <span className={cn(
                "text-[8px] font-semibold px-1.5 py-0.5 rounded",
                selectedCard.severity === 'critical' ? 'bg-red-500/30 text-red-300' :
                selectedCard.severity === 'high' ? 'bg-orange-500/30 text-orange-300' :
                selectedCard.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                'bg-green-500/30 text-green-300'
              )}>
                {selectedCard.severity.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-3 pb-2">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <p className="text-[9px] text-white/50 text-center">Select a card to enable actions</p>
          </div>
        </div>
      )}

      {/* Action Buttons Grid */}
      <div className="px-3 pb-3 grid grid-cols-2 gap-1.5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              disabled={!selectedCard}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-medium transition-all",
                selectedCard 
                  ? `${action.color} ${action.textColor} shadow-sm`
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              )}
            >
              <Icon className="w-3 h-3" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const RoleSwitchSidebar = ({
  activeRole,
  onRoleChange,
  collapsed,
  onToggleCollapse,
  onLogout,
  activeNav: externalActiveNav,
  onNavChange,
  onSubItemClick,
}: RoleSwitchSidebarProps) => {
  const currentConfig = roleConfigs[activeRole] ?? roleConfigs.boss_owner;
  const currentNavItems = roleNavItems[activeRole] ?? [];
  const [internalActiveNav, setInternalActiveNav] = useState("dashboard");
  
  // STEP 2 FIX: Auto drill-down when a role is active (Boss should start drilled in)
  const [isDrilledDown, setIsDrilledDown] = useState(true);
  
  // Use external activeNav if provided, otherwise use internal state
  const activeNav = externalActiveNav ?? internalActiveNav;
  
  // STEP 2 FIX: When role changes, auto drill-down to show that role's features
  useEffect(() => {
    setIsDrilledDown(true);
  }, [activeRole]);

  const handleNavClick = (navId: string) => {
    if (onNavChange) {
      onNavChange(navId);
    } else {
      setInternalActiveNav(navId);
    }
  };

  const handleRoleSelect = (roleId: ActiveRole) => {
    onRoleChange(roleId);
    setIsDrilledDown(true);
    handleNavClick("dashboard");
  };

  const handleBackToRoles = () => {
    setIsDrilledDown(false);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 60 : 240 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "flex flex-col border-r transition-colors duration-200",
        "border-blue-400/30"
      )}
      style={{ background: 'linear-gradient(180deg, hsl(217 91% 50%) 0%, hsl(226 71% 45%) 100%)' }}
    >
      {/* Header - Compact Control Panel */}
      <div className="p-3 border-b border-white/15 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white shadow-md flex-shrink-0">
            <currentConfig.icon className="w-4 h-4 text-blue-600" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <h2 className="text-sm font-bold text-white tracking-tight truncate">Control Panel</h2>
                <p className="text-[10px] text-white/70 font-medium">Super Admin</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isDrilledDown ? (
          /* Role Switch Section - Show all roles */
          <motion.div
            key="role-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-hidden"
          >
            <ScrollArea className="h-full">
              <div className="p-2">
                <AnimatePresence>
                  {!collapsed && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px] font-semibold text-white/70 uppercase tracking-wider mb-2 px-2"
                    >
                      Switch Role
                    </motion.p>
                  )}
                </AnimatePresence>
                
                <div className="space-y-0.5">
                  {Object.values(roleConfigs).map((role) => {
                    const Icon = role.icon;
                    const isActive = activeRole === role.id;

                    return (
                      <Tooltip key={role.id} delayDuration={0}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleRoleSelect(role.id as ActiveRole);
                            }}
                            className={cn(
                              "w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-150",
                              // FIX-05: Active state uses ONLY border indicator, NO background fill
                              isActive
                                ? "border-l-2 border-white text-white"
                                : "text-white/90 hover:bg-white/15 hover:text-white border-l-2 border-transparent"
                            )}
                          >
                            <div className={cn(
                              "w-6 h-6 rounded-md flex items-center justify-center transition-all flex-shrink-0",
                              isActive 
                                ? "bg-white"
                                : "bg-white/20"
                            )}>
                              <Icon className={cn("w-3 h-3", isActive ? "text-primary" : "text-white")} />
                            </div>
                            <AnimatePresence>
                              {!collapsed && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="flex-1 text-left min-w-0"
                                >
                                  <span className="text-xs font-medium block text-white truncate">{role.label}</span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            {!collapsed && (
                              <ChevronRight className="w-3 h-3 text-white/70 flex-shrink-0" />
                            )}
                          </button>
                        </TooltipTrigger>
                        {collapsed && (
                          <TooltipContent side="right" sideOffset={8}>
                            <div>
                              <p className="font-medium text-sm">{role.label}</p>
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        ) : (
          /* Drilled-down view - Show only active role's features */
          <motion.div
            key="role-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 overflow-hidden flex flex-col"
          >
            {/* Back button and active role header */}
            <div className="p-3 border-b border-white/20">
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToRoles}
                    className={cn(
                      "w-full gap-2 mb-3 text-white hover:bg-white/20 hover:text-white",
                      collapsed ? "justify-center px-0" : "justify-start"
                    )}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {!collapsed && <span>Back to Roles</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" sideOffset={10}>
                    Back to Roles
                  </TooltipContent>
                )}
              </Tooltip>

              {/* Current Role Badge */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/20 border border-white/30">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white">
                  <currentConfig.icon className="w-5 h-5 text-primary" />
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1"
                    >
                      <span className="text-sm font-bold block text-white">
                        {currentConfig.label}
                      </span>
                      <Badge variant="outline" className="text-xs mt-1 text-white border-white/50">
                        Active
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Role-specific Navigation */}
            <ScrollArea className="flex-1 py-4">
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3 px-5"
                  >
                    {currentConfig.shortLabel} Features
                  </motion.p>
                )}
              </AnimatePresence>
              
              <nav className="space-y-1 px-3">
                {currentNavItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;
                  const hasSubItems = 'subItems' in item && Array.isArray(item.subItems);

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavClick(item.id);
                            }}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                              // FIX: Active state uses ONLY border indicator, no bg fill
                              isActive
                                ? "text-white border-l-2 border-white"
                                : "text-white/90 hover:text-white hover:bg-white/10"
                            )}
                          >
                            <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-white/80")} />
                            <AnimatePresence>
                              {!collapsed && (
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="text-sm font-medium truncate"
                                >
                                  {item.label}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </button>
                        </TooltipTrigger>
                        {collapsed && (
                          <TooltipContent side="right" sideOffset={10}>
                            {item.label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                      
                      {/* Sub-items for Dashboard */}
                      {hasSubItems && isActive && !collapsed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 space-y-1.5"
                        >
                          {(item as any).subItems.map((subItem: { id: string; label: string; status: string }, subIdx: number) => (
                            <motion.button
                              key={subItem.id}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: subIdx * 0.02 }}
                              onClick={() => onSubItemClick?.(subItem.id)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all group",
                                "bg-sidebar-accent/35 border-sidebar-border/40 hover:bg-sidebar-accent/55 hover:border-sidebar-border/60"
                              )}
                            >
                              {/* Globe Icon */}
                              <div className="w-8 h-8 rounded-lg bg-aurora-gold/15 flex items-center justify-center text-lg flex-shrink-0">
                                🌍
                              </div>

                              {/* Name */}
                              <div className="flex-1 text-left min-w-0">
                                <span className="text-sm text-sidebar-foreground font-medium truncate block">
                                  {subItem.label.replace(" Super Admin", "")}
                                </span>
                                <span className="text-xs text-muted-foreground">Super Admin</span>
                              </div>

                              {/* Status & Arrow */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="relative">
                                  <div
                                    className={cn(
                                      "w-3 h-3 rounded-full",
                                      subItem.status === "active" ? "bg-status-success" : "bg-muted-foreground/40"
                                    )}
                                  />
                                  {subItem.status === "active" && (
                                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-status-success animate-ping opacity-40" />
                                  )}
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground/70 group-hover:text-aurora-gold transition-colors" />
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </nav>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ENTERPRISE: Global Actions Panel - Context Aware */}
      <GlobalActionsPanel collapsed={collapsed} />

      {/* Footer */}
      <div className="p-3 border-t border-white/20 space-y-2">
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className={cn("w-full text-white hover:bg-white/20 hover:text-white", collapsed ? "justify-center" : "justify-start")}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="ml-2">Collapse</span>}
        </Button>

        {/* Logout */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={onLogout}
              className={cn(
                "w-full text-white/80 hover:text-white hover:bg-red-500/30",
                collapsed ? "justify-center px-0" : "justify-start gap-3"
              )}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span>Logout</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" sideOffset={10}>
              Logout
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </motion.aside>
  );
};

export default RoleSwitchSidebar;
