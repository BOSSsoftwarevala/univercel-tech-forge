import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Bug,
  Rocket,
  Box,
  CheckSquare,
  Activity,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Code2,
  Bot,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DeveloperManagerSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onBackToControlPanel: () => void;
}

// Developer Manager Module Sidebar (Human + AI Tasks scope only)
const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "developers", label: "Developers", icon: Users },
  { id: "bugs", label: "Bugs / Issues", icon: Bug },
  { id: "releases", label: "Releases", icon: Rocket },
  { id: "products", label: "Products", icon: Box },
  { id: "ai-tasks", label: "AI Tasks", icon: Bot },
  { id: "approvals", label: "Approvals", icon: CheckSquare },
  { id: "activity-logs", label: "Activity Logs", icon: Activity },
];

const DeveloperManagerSidebar = ({
  activeSection,
  onSectionChange,
  collapsed,
  onCollapsedChange,
  onBackToControlPanel,
}: DeveloperManagerSidebarProps) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-[#0d0d14] via-[#12121a] to-[#0a0a10] backdrop-blur-xl border-r border-violet-500/15 z-40 flex flex-col"
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => onCollapsedChange(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-violet-500/20 border border-violet-500/40 rounded-full flex items-center justify-center text-violet-400 hover:bg-violet-500/30 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Back */}
      <div className="p-3 border-b border-violet-500/10">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onBackToControlPanel}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-violet-400 hover:bg-violet-500/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">Back</span>}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="bg-slate-900 border-violet-500/30 text-white">
              Back to Control Panel
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* Title */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Developer Manager</p>
              <p className="text-[11px] text-white/50">Human Operations</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 py-2 px-2 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;

            const button = (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left",
                  active
                    ? "bg-violet-500/20 text-violet-300 border border-violet-400/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    active ? "text-violet-400" : "text-violet-500/50"
                  )}
                />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </motion.button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="bg-slate-900 border-violet-500/30 text-white">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return button;
          })}
        </div>
      </nav>
    </motion.aside>
  );
};

export default DeveloperManagerSidebar;
