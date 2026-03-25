import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Monitor,
  Package,
  Code,
  Building2,
  Store,
  Megaphone,
  Search,
  ListTodo,
  HeadphonesIcon,
  TrendingUp,
  Lightbulb,
  Heart,
  BarChart3,
  DollarSign,
  Scale,
  UserPlus,
  MessageSquare,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Crown,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useShouldRenderSidebar } from "@/stores/sidebarStore";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/enterprise/dashboard", roles: ["all"] },
  { icon: Users, label: "Leads", path: "/enterprise/leads", roles: ["super_admin", "admin", "lead_manager", "franchise", "reseller", "sales"] },
  { icon: Monitor, label: "Demo Manager", path: "/enterprise/demos", roles: ["super_admin", "admin", "demo_manager", "product_manager"] },
  { icon: Package, label: "Products", path: "/enterprise/products", roles: ["super_admin", "admin", "product_manager"] },
  { icon: Code, label: "Developer Mgmt", path: "/enterprise/developers", roles: ["super_admin", "admin", "task_manager"] },
  { icon: Building2, label: "Franchise", path: "/enterprise/franchise", roles: ["super_admin", "admin", "franchise"] },
  { icon: Store, label: "Reseller", path: "/enterprise/reseller", roles: ["super_admin", "admin", "reseller"] },
  { icon: Star, label: "Influencer", path: "/enterprise/influencer", roles: ["super_admin", "admin", "influencer", "marketing_manager"] },
  { icon: Crown, label: "Prime Users", path: "/enterprise/prime", roles: ["super_admin", "admin", "client_success", "prime"] },
  { icon: Search, label: "SEO Manager", path: "/enterprise/seo", roles: ["super_admin", "admin", "seo_manager"] },
  { icon: ListTodo, label: "Task Manager", path: "/enterprise/tasks", roles: ["super_admin", "admin", "task_manager"] },
  { icon: HeadphonesIcon, label: "Support", path: "/enterprise/support", roles: ["super_admin", "admin", "support"] },
  { icon: Megaphone, label: "Marketing", path: "/enterprise/marketing", roles: ["super_admin", "admin", "marketing_manager"] },
  { icon: Lightbulb, label: "R&D", path: "/enterprise/rnd", roles: ["super_admin", "admin", "rd_department"] },
  { icon: Heart, label: "Client Success", path: "/enterprise/client-success", roles: ["super_admin", "admin", "client_success"] },
  { icon: BarChart3, label: "Performance", path: "/enterprise/performance", roles: ["super_admin", "admin", "performance_manager"] },
  { icon: DollarSign, label: "Finance", path: "/enterprise/finance", roles: ["super_admin", "admin", "finance_manager"] },
  { icon: Scale, label: "Legal", path: "/enterprise/legal", roles: ["super_admin", "admin", "legal_compliance"] },
  { icon: UserPlus, label: "HR / Hiring", path: "/enterprise/hr", roles: ["super_admin", "admin"] },
  { icon: MessageSquare, label: "Internal Chat", path: "/enterprise/chat", roles: ["all"] },
  { icon: Shield, label: "Auth & Security", path: "/enterprise/security", roles: ["super_admin", "admin"] },
  { icon: Settings, label: "Settings", path: "/enterprise/settings", roles: ["super_admin", "admin"] },
];

interface GlobalSidebarProps {
  userRole?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function GlobalSidebar({
  userRole = "super_admin",
  collapsed = false,
  onToggle,
}: GlobalSidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  
  // SINGLE SIDEBAR ENFORCEMENT: Only render when in global/boss context
  const shouldRender = useShouldRenderSidebar('global');

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle?.();
  };

  const filteredItems = menuItems.filter(
    (item) => item.roles.includes("all") || item.roles.includes(userRole)
  );
  
  // ISOLATION: Do not render if not in global context
  if (!shouldRender) {
    return null;
  }

  return (
    <aside
      className={cn(
        "h-[calc(100vh-64px)] bg-[hsl(var(--sv-navy-deep))] border-r border-[hsl(var(--sv-navy-light))] flex flex-col transition-all duration-300 sticky top-16",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <div className="p-2 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className="text-[hsl(var(--sv-gray))] hover:text-white hover:bg-[hsl(var(--sv-navy))]"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Menu Items */}
      <ScrollArea className="flex-1 px-2">
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            const menuButton = (
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  "text-[hsl(var(--sv-gray))] hover:text-white hover:bg-[hsl(var(--sv-navy))]",
                  isActive && "bg-[hsl(var(--sv-blue))]/20 text-[hsl(var(--sv-blue-bright))] border-l-2 border-[hsl(var(--sv-blue-bright))]",
                  isCollapsed && "justify-center"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-[hsl(var(--sv-blue-bright))]")} />
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>{menuButton}</TooltipTrigger>
                  <TooltipContent side="right" className="bg-[hsl(var(--sv-navy))] text-white border-[hsl(var(--sv-navy-light))]">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.path}>{menuButton}</div>;
          })}
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className="p-2 border-t border-[hsl(var(--sv-navy-light))]">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-[hsl(var(--sv-danger))] hover:text-[hsl(var(--sv-danger))] hover:bg-[hsl(var(--sv-danger))]/10",
            isCollapsed ? "justify-center" : "justify-start gap-3"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
