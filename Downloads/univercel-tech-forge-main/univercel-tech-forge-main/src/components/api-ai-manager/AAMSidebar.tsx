import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Bot,
  Plug,
  Activity,
  Package,
  Users,
  Wallet,
  Receipt,
  AlertTriangle,
  TrendingDown,
  Shield,
  FileText,
  Zap,
  Settings,
  Brain,
  Eye,
  Mic,
  Image,
  Video,
  MessageSquare,
  Cpu,
  CreditCard,
  MessageCircle,
  Mail,
  Phone,
  Map,
  Cloud,
  BarChart3,
  Key,
  RotateCcw,
  Power,
  Clock,
  DollarSign,
  Gauge,
  AlertCircle,
  Lock,
  History,
  Download,
  Skull,
  Play,
  FileWarning,
  Bell,
  LogOut
} from "lucide-react";

interface AAMSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onBack?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: { id: string; label: string; icon?: React.ReactNode }[];
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "API & AI Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    children: [
      { id: "dashboard-total", label: "Total APIs Connected", icon: <Plug className="w-3 h-3" /> },
      { id: "dashboard-active", label: "Active APIs", icon: <Power className="w-3 h-3" /> },
      { id: "dashboard-inactive", label: "Inactive APIs", icon: <Power className="w-3 h-3" /> },
      { id: "dashboard-ai-vs-non", label: "AI APIs vs Non-AI APIs", icon: <Bot className="w-3 h-3" /> },
      { id: "dashboard-today", label: "Today Usage", icon: <Clock className="w-3 h-3" /> },
      { id: "dashboard-monthly", label: "Monthly Cost", icon: <DollarSign className="w-3 h-3" /> },
      { id: "dashboard-wallet", label: "Wallet Balance", icon: <Wallet className="w-3 h-3" /> },
      { id: "dashboard-risk", label: "Risk Alerts", icon: <AlertTriangle className="w-3 h-3" /> },
    ],
  },
  {
    id: "ai-api",
    label: "AI API Management",
    icon: <Bot className="w-4 h-4" />,
    children: [
      { id: "ai-openai", label: "OpenAI", icon: <Brain className="w-3 h-3" /> },
      { id: "ai-vision", label: "Vision AI", icon: <Eye className="w-3 h-3" /> },
      { id: "ai-voice", label: "Voice / TTS / STT", icon: <Mic className="w-3 h-3" /> },
      { id: "ai-image", label: "Image Generation", icon: <Image className="w-3 h-3" /> },
      { id: "ai-video", label: "Video AI", icon: <Video className="w-3 h-3" /> },
      { id: "ai-nlp", label: "NLP / Chat AI", icon: <MessageSquare className="w-3 h-3" /> },
      { id: "ai-custom", label: "Custom AI Models", icon: <Cpu className="w-3 h-3" /> },
    ],
  },
  {
    id: "external-api",
    label: "External API Management",
    icon: <Plug className="w-4 h-4" />,
    children: [
      { id: "ext-payment", label: "Payment APIs", icon: <CreditCard className="w-3 h-3" /> },
      { id: "ext-sms", label: "SMS APIs", icon: <MessageCircle className="w-3 h-3" /> },
      { id: "ext-email", label: "Email APIs", icon: <Mail className="w-3 h-3" /> },
      { id: "ext-whatsapp", label: "WhatsApp APIs", icon: <Phone className="w-3 h-3" /> },
      { id: "ext-maps", label: "Maps APIs", icon: <Map className="w-3 h-3" /> },
      { id: "ext-cloud", label: "Cloud APIs", icon: <Cloud className="w-3 h-3" /> },
      { id: "ext-analytics", label: "Analytics APIs", icon: <BarChart3 className="w-3 h-3" /> },
    ],
  },
  {
    id: "usage-monitor",
    label: "API Usage Monitor",
    icon: <Activity className="w-4 h-4" />,
    children: [
      { id: "usage-rps", label: "Requests per Second", icon: <Gauge className="w-3 h-3" /> },
      { id: "usage-per-user", label: "Requests per User", icon: <Users className="w-3 h-3" /> },
      { id: "usage-per-product", label: "Requests per Product", icon: <Package className="w-3 h-3" /> },
      { id: "usage-per-role", label: "Requests per Role", icon: <Users className="w-3 h-3" /> },
      { id: "usage-failed", label: "Failed Requests", icon: <AlertCircle className="w-3 h-3" /> },
      { id: "usage-latency", label: "Latency Monitor", icon: <Clock className="w-3 h-3" /> },
    ],
  },
  {
    id: "product-api",
    label: "Product-wise API Control",
    icon: <Package className="w-4 h-4" />,
    children: [
      { id: "product-mapping", label: "Product → API Mapping", icon: <Plug className="w-3 h-3" /> },
      { id: "product-enable", label: "Enable APIs per Product", icon: <Power className="w-3 h-3" /> },
      { id: "product-disable", label: "Disable APIs per Product", icon: <Power className="w-3 h-3" /> },
      { id: "product-cost", label: "Product API Cost Breakdown", icon: <DollarSign className="w-3 h-3" /> },
      { id: "product-graph", label: "Product Usage Graph", icon: <BarChart3 className="w-3 h-3" /> },
    ],
  },
  {
    id: "role-api",
    label: "Role-wise API Control",
    icon: <Users className="w-4 h-4" />,
    children: [
      { id: "role-admin", label: "Admin API Access", icon: <Shield className="w-3 h-3" /> },
      { id: "role-reseller", label: "Reseller API Access", icon: <Users className="w-3 h-3" /> },
      { id: "role-franchise", label: "Franchise API Access", icon: <Users className="w-3 h-3" /> },
      { id: "role-developer", label: "Developer API Access", icon: <Cpu className="w-3 h-3" /> },
      { id: "role-user", label: "User API Access", icon: <Users className="w-3 h-3" /> },
    ],
  },
  {
    id: "wallet",
    label: "Wallet System",
    icon: <Wallet className="w-4 h-4" />,
    children: [
      { id: "wallet-central", label: "Central Wallet", icon: <Wallet className="w-3 h-3" /> },
      { id: "wallet-balance", label: "Wallet Balance", icon: <DollarSign className="w-3 h-3" /> },
      { id: "wallet-upi", label: "UPI Add Money", icon: <CreditCard className="w-3 h-3" /> },
      { id: "wallet-ledger", label: "Wallet Ledger", icon: <FileText className="w-3 h-3" /> },
      { id: "wallet-hold", label: "Wallet Hold Amount", icon: <Lock className="w-3 h-3" /> },
      { id: "wallet-lock", label: "Wallet Lock / Unlock", icon: <Lock className="w-3 h-3" /> },
    ],
  },
  {
    id: "billing",
    label: "Billing Engine",
    icon: <Receipt className="w-4 h-4" />,
    children: [
      { id: "billing-api", label: "Per API Billing", icon: <Plug className="w-3 h-3" /> },
      { id: "billing-product", label: "Per Product Billing", icon: <Package className="w-3 h-3" /> },
      { id: "billing-role", label: "Per Role Billing", icon: <Users className="w-3 h-3" /> },
      { id: "billing-daily", label: "Daily Billing Summary", icon: <Clock className="w-3 h-3" /> },
      { id: "billing-monthly", label: "Monthly Billing Summary", icon: <Clock className="w-3 h-3" /> },
      { id: "billing-invoice", label: "Invoice Generator", icon: <FileText className="w-3 h-3" /> },
    ],
  },
  {
    id: "alerts",
    label: "Alert & Safety System",
    icon: <AlertTriangle className="w-4 h-4" />,
    children: [
      { id: "alert-low-wallet", label: "Low Wallet Balance Alert", icon: <Wallet className="w-3 h-3" /> },
      { id: "alert-overuse", label: "API Overuse Alert", icon: <AlertCircle className="w-3 h-3" /> },
      { id: "alert-cost-spike", label: "Cost Spike Alert", icon: <TrendingDown className="w-3 h-3" /> },
      { id: "alert-abnormal", label: "Abnormal Usage Alert", icon: <AlertTriangle className="w-3 h-3" /> },
      { id: "alert-failure", label: "API Failure Alert", icon: <AlertCircle className="w-3 h-3" /> },
      { id: "alert-security", label: "Security Breach Alert", icon: <Shield className="w-3 h-3" /> },
    ],
  },
  {
    id: "optimizer",
    label: "AI Cost Optimizer",
    icon: <TrendingDown className="w-4 h-4" />,
    children: [
      { id: "opt-high-cost", label: "Detect High-Cost APIs", icon: <DollarSign className="w-3 h-3" /> },
      { id: "opt-cheaper", label: "Suggest Cheaper Alternative", icon: <TrendingDown className="w-3 h-3" /> },
      { id: "opt-token", label: "Auto Reduce Token Usage", icon: <Cpu className="w-3 h-3" /> },
      { id: "opt-downgrade", label: "Auto Downgrade Speed Mode", icon: <Gauge className="w-3 h-3" /> },
      { id: "opt-recommendations", label: "Cost Saving Recommendations", icon: <TrendingDown className="w-3 h-3" /> },
    ],
  },
  {
    id: "security",
    label: "Security & Access",
    icon: <Shield className="w-4 h-4" />,
    children: [
      { id: "sec-logs", label: "API Access Logs", icon: <FileText className="w-3 h-3" /> },
      { id: "sec-ip", label: "IP Restriction", icon: <Shield className="w-3 h-3" /> },
      { id: "sec-region", label: "Region Restriction", icon: <Map className="w-3 h-3" /> },
      { id: "sec-abuse", label: "Abuse Detection", icon: <AlertTriangle className="w-3 h-3" /> },
      { id: "sec-block", label: "Manual Block Option", icon: <Lock className="w-3 h-3" /> },
    ],
  },
  {
    id: "audit",
    label: "Audit & Logs",
    icon: <FileText className="w-4 h-4" />,
    children: [
      { id: "audit-api", label: "API On/Off Logs", icon: <Power className="w-3 h-3" /> },
      { id: "audit-wallet", label: "Wallet Transaction Logs", icon: <Wallet className="w-3 h-3" /> },
      { id: "audit-billing", label: "Billing Logs", icon: <Receipt className="w-3 h-3" /> },
      { id: "audit-usage", label: "Usage Logs", icon: <Activity className="w-3 h-3" /> },
      { id: "audit-admin", label: "Admin Action Logs", icon: <Shield className="w-3 h-3" /> },
      { id: "audit-export", label: "Export Logs (CSV / PDF)", icon: <Download className="w-3 h-3" /> },
    ],
  },
  {
    id: "emergency",
    label: "Emergency Controls",
    icon: <Zap className="w-4 h-4" />,
    children: [
      { id: "emg-kill-all", label: "Kill All APIs", icon: <Skull className="w-3 h-3" /> },
      { id: "emg-kill-ai", label: "Kill AI APIs Only", icon: <Bot className="w-3 h-3" /> },
      { id: "emg-lock-wallet", label: "Lock Wallet", icon: <Lock className="w-3 h-3" /> },
      { id: "emg-resume", label: "Resume System", icon: <Play className="w-3 h-3" /> },
      { id: "emg-incident", label: "Incident Report", icon: <FileWarning className="w-3 h-3" /> },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
    children: [
      { id: "settings-limits", label: "Default Limits", icon: <Gauge className="w-3 h-3" /> },
      { id: "settings-thresholds", label: "Alert Thresholds", icon: <AlertTriangle className="w-3 h-3" /> },
      { id: "settings-notifications", label: "Notification Preferences", icon: <Bell className="w-3 h-3" /> },
      { id: "settings-logout", label: "Logout", icon: <LogOut className="w-3 h-3" /> },
    ],
  },
];

const AAMSidebar = ({ activeSection, setActiveSection, onBack }: AAMSidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(["dashboard"]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isActive = (id: string) => activeSection === id;
  const isParentActive = (item: MenuItem) =>
    item.children?.some((child) => activeSection === child.id) || activeSection === item.id;

  return (
    <div className="w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">API & AI Manager</h2>
              <p className="text-xs text-slate-400">Control Center</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.children) {
                    toggleExpand(item.id);
                  }
                  setActiveSection(item.id);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200",
                  isParentActive(item)
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.children && (
                  <motion.div
                    animate={{ rotate: expandedItems.includes(item.id) ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                )}
              </button>

              <AnimatePresence>
                {item.children && expandedItems.includes(item.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => setActiveSection(child.id)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all duration-200",
                            isActive(child.id)
                              ? "bg-purple-500/30 text-purple-200"
                              : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                          )}
                        >
                          {child.icon}
                          <span>{child.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Wallet Balance</p>
            <p className="text-sm font-semibold text-white">₹45,230.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AAMSidebar;
