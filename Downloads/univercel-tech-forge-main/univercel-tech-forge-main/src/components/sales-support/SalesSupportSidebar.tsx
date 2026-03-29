import { cn } from "@/lib/utils";
import softwareValaLogo from '@/assets/software-vala-logo-transparent.png';
import { motion } from "framer-motion";
import {
  LayoutDashboard, Ticket, Users, Inbox, MessageCircle,
  Clock, AlertCircle, FileText, History, Headset,
  ChevronLeft, ChevronRight, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type SalesSupportSection =
  | "overview"
  | "live_tickets"
  | "team_members"
  | "leads_inbox"
  | "customer_chats"
  | "followups"
  | "escalations"
  | "performance_reports"
  | "activity_log";

interface SalesSupportSidebarProps {
  activeSection: SalesSupportSection;
  onSectionChange: (section: SalesSupportSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onBack?: () => void;
}

const sidebarItems: { id: SalesSupportSection; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "live_tickets", label: "Live Tickets", icon: Ticket },
  { id: "team_members", label: "Team Members", icon: Users },
  { id: "leads_inbox", label: "Leads Inbox", icon: Inbox },
  { id: "customer_chats", label: "Customer Chats", icon: MessageCircle },
  { id: "followups", label: "Follow-ups", icon: Clock },
  { id: "escalations", label: "Escalations", icon: AlertCircle },
  { id: "performance_reports", label: "Performance Reports", icon: FileText },
  { id: "activity_log", label: "Activity Log", icon: History },
];

const SalesSupportSidebar = ({
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse,
  onBack
}: SalesSupportSidebarProps) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      className="h-full bg-slate-900/95 border-r border-slate-700/50 flex flex-col shrink-0"
    >
      {/* Header */}
      <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
        <div className={cn("flex justify-center", collapsed ? "w-full" : "flex-1")}>
          <img src={softwareValaLogo} alt="Software Vala Logo" className="w-12 h-12 rounded-full object-contain border-2 border-cyan-500/30" />
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 text-slate-400 hover:text-white"
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
            className="w-full h-8 text-slate-400 hover:text-white"
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
                "w-full justify-start gap-3 h-10",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-teal-500/20 text-teal-400 hover:bg-teal-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-teal-400" : "text-slate-400"
                )}
              />
              {!collapsed && <span className="truncate text-sm">{item.label}</span>}
            </Button>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return button;
        })}
      </nav>

      {/* Back Button */}
      {onBack && (
        <div className="p-3 border-t border-slate-700/50">
          {collapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="w-full h-10 text-slate-400 hover:text-white hover:bg-slate-800/50"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                <p>Back</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              onClick={onBack}
              className="w-full justify-start gap-3 h-10 text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
              <ArrowLeft className="w-5 h-5 flex-shrink-0" />
              <span className="truncate text-sm">Back</span>
            </Button>
          )}
        </div>
      )}

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-700/50">
          <p className="text-[10px] text-slate-500 text-center">Sales & Support Scope</p>
        </div>
      )}
    </motion.aside>
  );
};

export default SalesSupportSidebar;
