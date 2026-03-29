import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Server, Layers, Database, HardDrive, Network, Activity,
  Gauge, Shield, Zap, Settings, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type ServerSection = 
  | "dashboard"
  | "all-servers"
  | "clusters"
  | "databases"
  | "storage"
  | "networking"
  | "monitoring"
  | "performance"
  | "security"
  | "tech-activity"
  | "settings";

interface ServerManagerSidebarProps {
  activeSection: ServerSection;
  onSectionChange: (section: ServerSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const sidebarItems: { id: ServerSection; label: string; icon: any }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "all-servers", label: "All Servers", icon: Server },
  { id: "clusters", label: "Clusters", icon: Layers },
  { id: "databases", label: "Databases", icon: Database },
  { id: "storage", label: "Storage", icon: HardDrive },
  { id: "networking", label: "Networking", icon: Network },
  { id: "monitoring", label: "Monitoring", icon: Activity },
  { id: "performance", label: "Performance", icon: Gauge },
  { id: "security", label: "Security", icon: Shield },
  { id: "tech-activity", label: "Tech Activity", icon: Zap },
  { id: "settings", label: "Settings", icon: Settings },
];

const ServerManagerSidebar = ({
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse
}: ServerManagerSidebarProps) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      className="h-full bg-zinc-950 border-r border-zinc-800 flex flex-col"
    >
      {/* Header */}
      <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-cyan-600 flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-white font-mono">SERVER MGMT</p>
              <p className="text-[10px] text-zinc-500 font-mono">Infrastructure Control</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-cyan-600 flex items-center justify-center mx-auto">
            <Server className="w-5 h-5 text-white" />
          </div>
        )}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 text-zinc-500 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {collapsed && (
        <div className="p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-full h-8 text-zinc-500 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = activeSection === item.id;
          
          const button = (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full justify-start gap-3 h-10 font-mono text-sm",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "text-emerald-400" : "text-zinc-500"
              )} />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Button>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  {button}
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-zinc-800 border-zinc-700 font-mono">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return button;
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-zinc-800">
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-zinc-500 font-mono">SYSTEM ONLINE</p>
          </div>
        </div>
      )}
    </motion.aside>
  );
};

export default ServerManagerSidebar;
