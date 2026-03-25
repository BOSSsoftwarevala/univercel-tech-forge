import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Scale,
  LayoutDashboard,
  Sparkles,
  Users,
  Package,
  DoorOpen,
  Globe,
  Copyright,
  Award,
  Shield,
  FileText,
  Brain,
  CheckCircle,
  History,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  ArrowLeft,
  Lock,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface LMSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onBack?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { id: string; label: string }[];
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Legal Dashboard",
    icon: LayoutDashboard,
    children: [
      { id: "dashboard-overview", label: "Total Active Agreements" },
      { id: "dashboard-pending", label: "Pending User Acceptances" },
      { id: "dashboard-violations", label: "Policy Violations" },
      { id: "dashboard-copyright", label: "Copyright Alerts" },
      { id: "dashboard-trademark", label: "Trademark Status" },
      { id: "dashboard-compliance", label: "Country-wise Compliance" },
    ],
  },
  {
    id: "agreement-engine",
    label: "Agreement Engine (AI)",
    icon: Sparkles,
    children: [
      { id: "ai-generator", label: "Auto Agreement Generator" },
      { id: "product-agreement", label: "Product-Based Agreement" },
      { id: "role-agreement", label: "Role-Based Agreement" },
      { id: "country-agreement", label: "Country-Based Agreement" },
      { id: "language-detection", label: "Language Auto Detection" },
      { id: "version-control", label: "Legal Version Control" },
    ],
  },
  {
    id: "user-role-agreements",
    label: "User & Role Agreements",
    icon: Users,
    children: [
      { id: "user-agreement", label: "User Agreement (End User)" },
      { id: "admin-agreement", label: "Admin Agreement" },
      { id: "reseller-agreement", label: "Reseller Agreement" },
      { id: "franchise-agreement", label: "Franchise Agreement" },
      { id: "developer-agreement", label: "Developer Agreement" },
      { id: "employee-agreement", label: "Employee Agreement" },
      { id: "partner-agreement", label: "Partner Agreement" },
    ],
  },
  {
    id: "product-legal",
    label: "Product Legal Binding",
    icon: Package,
    children: [
      { id: "software-mapping", label: "Software-wise Agreement Mapping" },
      { id: "mandatory-agreement", label: "Mandatory Agreement Per Product" },
      { id: "agreement-lock", label: "Agreement Lock on Software" },
      { id: "agreement-trigger", label: "Agreement Update Trigger" },
      { id: "agreement-expiry", label: "Agreement Expiry Control" },
    ],
  },
  {
    id: "login-gate",
    label: "Login Gate Control",
    icon: DoorOpen,
    children: [
      { id: "agreement-review", label: "Agreement Review Screen" },
      { id: "scroll-enforcement", label: "Scroll-to-End Enforcement" },
      { id: "mandatory-checkbox", label: "Mandatory Accept Checkbox" },
      { id: "accept-continue", label: "Accept & Continue" },
      { id: "reject-logout", label: "Reject → Logout" },
      { id: "re-accept", label: "Re-Accept on Update" },
    ],
  },
  {
    id: "international-law",
    label: "International Law Compliance",
    icon: Globe,
    children: [
      { id: "gdpr", label: "GDPR" },
      { id: "ccpa", label: "CCPA" },
      { id: "it-act", label: "IT Act (India)" },
      { id: "dmca", label: "DMCA" },
      { id: "consumer-protection", label: "Consumer Protection Laws" },
      { id: "data-privacy", label: "Data Privacy Regulations" },
      { id: "country-overrides", label: "Country-Specific Overrides" },
    ],
  },
  {
    id: "copyright",
    label: "Copyright Management",
    icon: Copyright,
    children: [
      { id: "software-copyright", label: "Software Copyright Declaration" },
      { id: "code-ownership", label: "Code Ownership Declaration" },
      { id: "asset-ownership", label: "Asset Ownership" },
      { id: "auto-copyright", label: "Auto Copyright Notice" },
      { id: "violation-detection", label: "Violation Detection" },
      { id: "legal-action-log", label: "Legal Action Log" },
    ],
  },
  {
    id: "trademark",
    label: "Trademark Management",
    icon: Award,
    children: [
      { id: "brand-protection", label: "Brand Name Protection" },
      { id: "logo-policy", label: "Logo Usage Policy" },
      { id: "trademark-status", label: "Trademark Registration Status" },
      { id: "unauthorized-alerts", label: "Unauthorized Usage Alerts" },
      { id: "notice-generator", label: "Auto Legal Notice Generator" },
    ],
  },
  {
    id: "brand-ip",
    label: "Brand & IP Protection",
    icon: Shield,
    children: [
      { id: "brand-agreement", label: "Brand Agreement" },
      { id: "whitelabel-restrictions", label: "White-Label Restrictions" },
      { id: "reseller-brand", label: "Reseller Brand Rules" },
      { id: "franchise-brand", label: "Franchise Brand Usage" },
      { id: "ip-abuse", label: "IP Abuse Monitoring" },
    ],
  },
  {
    id: "policy",
    label: "Policy Management",
    icon: FileText,
    children: [
      { id: "privacy-policy", label: "Privacy Policy" },
      { id: "terms-conditions", label: "Terms & Conditions" },
      { id: "refund-policy", label: "Refund Policy" },
      { id: "usage-policy", label: "Usage Policy" },
      { id: "ai-usage-policy", label: "AI Usage Policy" },
      { id: "data-retention", label: "Data Retention Policy" },
    ],
  },
  {
    id: "ai-legal",
    label: "AI Legal Intelligence",
    icon: Brain,
    children: [
      { id: "auto-draft", label: "Auto Draft Agreements" },
      { id: "risk-detection", label: "Auto Risk Detection" },
      { id: "clause-conflict", label: "Clause Conflict Detection" },
      { id: "law-mismatch", label: "Country Law Mismatch Alerts" },
      { id: "update-suggestions", label: "Auto Update Suggestions" },
    ],
  },
  {
    id: "approval",
    label: "Approval & Control",
    icon: CheckCircle,
    children: [
      { id: "ai-review", label: "AI Draft → Human Review" },
      { id: "manager-approval", label: "Legal Manager Approval" },
      { id: "boss-override", label: "Boss Override (Only)" },
      { id: "lock-agreement", label: "Lock Agreement" },
      { id: "publish-agreement", label: "Publish Agreement" },
    ],
  },
  {
    id: "audit",
    label: "Audit & Logs",
    icon: History,
    children: [
      { id: "acceptance-logs", label: "User Acceptance Logs" },
      { id: "version-history", label: "Agreement Version History" },
      { id: "legal-changes", label: "Legal Changes Log" },
      { id: "compliance-logs", label: "Compliance Logs" },
      { id: "export-audit", label: "Export for Court / Audit" },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    children: [
      { id: "expiry-alerts", label: "Agreement Expiry Alerts" },
      { id: "violation-alerts", label: "Violation Alerts" },
      { id: "pending-acceptances", label: "Pending Acceptances" },
      { id: "policy-change", label: "Policy Change Alerts" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    children: [
      { id: "legal-profile", label: "Legal Profile" },
      { id: "notification-rules", label: "Notification Rules" },
      { id: "security", label: "Security" },
      { id: "logout", label: "Logout" },
    ],
  },
];

const LMSidebar = ({ activeSection, setActiveSection, onBack }: LMSidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(["dashboard"]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleItemClick = (id: string, hasChildren: boolean) => {
    if (hasChildren) {
      toggleExpand(id);
    } else {
      setActiveSection(id);
      toast.success(`Navigated to ${id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`);
    }
  };

  const handleChildClick = (childId: string, parentId: string) => {
    setActiveSection(childId);
    toast.info(`Viewing: ${childId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`);
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-rose-900/30 flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-rose-900/30">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-10 h-10 ring-2 ring-rose-500/50">
            <AvatarFallback className="bg-gradient-to-br from-rose-500 to-rose-700 text-white font-bold text-sm">
              LM
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-white truncate">Legal Manager</h2>
            <p className="text-xs text-rose-400/70 font-mono">LGL-XXXX</p>
          </div>
        </div>

        <Badge className="w-full justify-center bg-rose-600/20 text-rose-400 border-rose-500/40 py-1.5 mb-3">
          <Scale className="w-3 h-3 mr-1.5" />
          LEGAL MANAGER
        </Badge>

        {onBack && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="w-full mb-2 bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Control Panel
          </Button>
        )}

        <motion.div
          className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
          animate={{
            boxShadow: [
              "0 0 10px rgba(16,185,129,0.1)",
              "0 0 20px rgba(16,185,129,0.2)",
              "0 0 10px rgba(16,185,129,0.1)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">AI Mode: 99% | Human: 1%</span>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-2">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedItems.includes(item.id);
            const hasChildren = item.children && item.children.length > 0;
            const isActive = activeSection === item.id || item.children?.some((c) => c.id === activeSection);

            return (
              <div key={item.id}>
                <motion.button
                  onClick={() => handleItemClick(item.id, hasChildren)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-left",
                    isActive
                      ? "bg-rose-600/20 text-rose-400 border border-rose-600/30"
                      : "text-slate-400 hover:text-rose-400 hover:bg-slate-800/50"
                  )}
                >
                  <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-rose-500" : "")} />
                  <span className="font-medium text-xs flex-1 truncate">{item.label}</span>
                  {hasChildren && (
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-3 h-3" />
                    </motion.div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {hasChildren && isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 mt-1 space-y-0.5 border-l border-slate-700/50 pl-2"
                    >
                      {item.children?.map((child) => (
                        <motion.button
                          key={child.id}
                          onClick={() => handleChildClick(child.id, item.id)}
                          whileHover={{ x: 2 }}
                          className={cn(
                            "w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-all duration-200",
                            activeSection === child.id
                              ? "bg-rose-600/10 text-rose-400"
                              : "text-slate-500 hover:text-rose-400 hover:bg-slate-800/30"
                          )}
                        >
                          <ChevronRight className="w-3 h-3" />
                          <span className="text-xs truncate">{child.label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-rose-900/30">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.warning("Logout clicked")}
          className="w-full bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
        >
          <LogOut className="w-3.5 h-3.5 mr-1.5" />
          Logout
        </Button>
      </div>
    </motion.aside>
  );
};

export default LMSidebar;
