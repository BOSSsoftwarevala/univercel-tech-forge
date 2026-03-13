import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Activity, 
  Brain, 
  CheckSquare, 
  ShieldAlert, 
  TrendingUp, 
  Lightbulb, 
  FileText, 
  Database, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot,
  Mic,
  Cpu,
  ScanSearch,
  ListTodo,
  Megaphone,
  Globe,
  Handshake,
  Wrench,
  HeartPulse
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AICEOSidebarProps {
  activeSection: string;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/ai-ceo" },
  { id: "live-monitor", label: "Live Action Monitor", icon: Activity, path: "/ai-ceo/live-monitor" },
  { id: "voice-commands", label: "Voice Command Center", icon: Mic, path: "/ai-ceo/voice-commands" },
  { id: "language", label: "Language Intelligence", icon: Globe, path: "/ai-ceo/language" },
  { id: "sales", label: "Sales Intelligence", icon: Handshake, path: "/ai-ceo/sales" },
  { id: "ai-providers", label: "AI Providers Hub", icon: Cpu, path: "/ai-ceo/ai-providers" },
  { id: "tool-stack", label: "Tool Stack", icon: Wrench, path: "/ai-ceo/tool-stack" },
  { id: "project-scanner", label: "Project Scanner", icon: ScanSearch, path: "/ai-ceo/project-scanner" },
  { id: "task-engine", label: "Autonomous Tasks", icon: ListTodo, path: "/ai-ceo/task-engine" },
  { id: "decision-engine", label: "Decision Engine", icon: Brain, path: "/ai-ceo/decision-engine" },
  { id: "approvals", label: "Approval Suggestions", icon: CheckSquare, path: "/ai-ceo/approvals" },
  { id: "risk", label: "Risk & Self-Healing", icon: ShieldAlert, path: "/ai-ceo/risk" },
  { id: "performance", label: "Performance Intelligence", icon: TrendingUp, path: "/ai-ceo/performance" },
  { id: "marketing", label: "Marketing Intelligence", icon: Megaphone, path: "/ai-ceo/marketing" },
  { id: "predictions", label: "Predictive Insights", icon: Lightbulb, path: "/ai-ceo/predictions" },
  { id: "reports", label: "AI Reports", icon: FileText, path: "/ai-ceo/reports" },
  { id: "learning", label: "System Learning Log", icon: Database, path: "/ai-ceo/learning" },
  { id: "auto-healing", label: "Auto Healing Engine", icon: HeartPulse, path: "/ai-ceo/auto-healing" },
  { id: "settings", label: "Settings (Read-Only)", icon: Settings, path: "/ai-ceo/settings" },
];
const AICEOSidebar = ({ activeSection, collapsed, onCollapsedChange }: AICEOSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (item: typeof menuItems[0]) => {
    if (item.path === "/ai-ceo" && location.pathname === "/ai-ceo") return true;
    if (item.path !== "/ai-ceo" && location.pathname.startsWith(item.path)) return true;
    return false;
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-[#0d0d14] via-[#12121a] to-[#0a0a10] backdrop-blur-xl border-r border-cyan-500/15 z-40 flex flex-col"
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => onCollapsedChange(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-cyan-500/20 border border-cyan-500/40 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/30 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Menu Items */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            const button = (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left",
                  active 
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", active ? "text-cyan-400" : "text-cyan-500/50")} />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </motion.button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="bg-slate-900 border-cyan-500/30 text-white">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return button;
          })}
        </div>
      </nav>

      {/* AI Status Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-cyan-500/10">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
            <Bot className="w-8 h-8 text-cyan-400" />
            <div>
              <p className="text-xs text-cyan-400 font-medium">AIRA v3.0</p>
              <p className="text-[10px] text-cyan-500/60">Autonomous • Executive AI</p>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
};

export default AICEOSidebar;
