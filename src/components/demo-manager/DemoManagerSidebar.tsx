import { useState } from "react";
import softwareValaLogo from '@/assets/software-vala-logo-transparent.png';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Store, Package, PlusCircle, FileEdit, Trash2,
  FolderOpen, Tags, Layers, GitBranch, FolderArchive,
  MonitorPlay, DollarSign, ToggleLeft, Star, TrendingUp,
  LayoutList, Image, MessageSquare, Heart,
  ShoppingBag, ListOrdered, CreditCard, RotateCcw,
  Users, KeySquare, Rocket, BarChart3, Eye,
  Search, Sparkles, Bell, FileText, Settings,
  LogOut, ArrowLeft, Globe, ChevronDown, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface DemoManagerSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | null;
  subItems?: SubMenuItem[];
}

const menuSections: MenuItem[] = [
  {
    id: "products",
    label: "Product Management",
    icon: Package,
    badge: "CORE",
    subItems: [
      { id: "mp-product-listing", label: "Product List", icon: Package },
      { id: "mp-create-product", label: "Create Product", icon: PlusCircle },
      { id: "mp-edit-product", label: "Edit Product", icon: FileEdit },
      { id: "mp-delete-product", label: "Delete Product", icon: Trash2 },
    ],
  },
  {
    id: "catalog",
    label: "Catalog & Structure",
    icon: FolderOpen,
    subItems: [
      { id: "mp-categories", label: "Product Categories", icon: FolderOpen },
      { id: "mp-tags", label: "Product Tags", icon: Tags },
      { id: "mp-modules", label: "Product Modules", icon: Layers },
      { id: "mp-versions", label: "Product Versions", icon: GitBranch },
      { id: "mp-product-assets", label: "Product Assets", icon: FolderArchive },
      { id: "mp-product-demos", label: "Product Demos", icon: MonitorPlay },
    ],
  },
  {
    id: "storefront",
    label: "Storefront & Display",
    icon: Store,
    badge: "LIVE",
    subItems: [
      { id: "mp-pricing", label: "Product Pricing", icon: DollarSign },
      { id: "mp-visibility", label: "Product Visibility", icon: ToggleLeft },
      { id: "mp-featured", label: "Featured Products", icon: Star },
      { id: "mp-trending", label: "Trending Products", icon: TrendingUp },
      { id: "mp-homepage", label: "Homepage Rows", icon: LayoutList },
      { id: "mp-banners", label: "Banner Management", icon: Image },
    ],
  },
  {
    id: "engagement",
    label: "Reviews & Engagement",
    icon: MessageSquare,
    subItems: [
      { id: "mp-reviews", label: "Product Reviews", icon: MessageSquare },
      { id: "mp-ratings", label: "Product Ratings", icon: Star },
      { id: "mp-favorites", label: "Product Favorites", icon: Heart },
    ],
  },
  {
    id: "commerce",
    label: "Orders & Payments",
    icon: ShoppingBag,
    subItems: [
      { id: "mp-orders", label: "Orders Management", icon: ShoppingBag },
      { id: "mp-order-items", label: "Order Items", icon: ListOrdered },
      { id: "mp-payments", label: "Payments", icon: CreditCard },
      { id: "mp-refunds", label: "Refunds", icon: RotateCcw },
    ],
  },
  {
    id: "users",
    label: "User & Licenses",
    icon: Users,
    subItems: [
      { id: "mp-user-products", label: "User Products", icon: Users },
      { id: "mp-licenses", label: "User Licenses", icon: KeySquare },
    ],
  },
  {
    id: "ops",
    label: "Operations & Logs",
    icon: Rocket,
    subItems: [
      { id: "mp-deployment-logs", label: "Deployment Logs", icon: Rocket },
    ],
  },
  {
    id: "analytics-section",
    label: "Analytics",
    icon: BarChart3,
    subItems: [
      { id: "mp-product-analytics", label: "Product Views", icon: BarChart3 },
      { id: "mp-demo-views", label: "Demo Views", icon: Eye },
      { id: "mp-analytics", label: "Sales Analytics", icon: BarChart3 },
    ],
  },
  {
    id: "discovery",
    label: "Search & Discovery",
    icon: Search,
    subItems: [
      { id: "mp-search", label: "Search Management", icon: Search },
      { id: "mp-recommendations", label: "Recommendations", icon: Sparkles },
    ],
  },
  {
    id: "system",
    label: "System",
    icon: Settings,
    subItems: [
      { id: "mp-notifications", label: "Notifications", icon: Bell },
      { id: "mp-audit-logs", label: "Audit Logs", icon: FileText },
      { id: "mp-settings", label: "Settings", icon: Settings },
    ],
  },
];

const DemoManagerSidebar = ({ activeView, onViewChange }: DemoManagerSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["products"]);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Marketplace Manager';
  const maskedId = `MM-${user?.id?.slice(0, 4).toUpperCase() || 'XXXX'}`;

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleItemClick = (itemId: string, hasSubItems: boolean) => {
    if (hasSubItems) {
      toggleSection(itemId);
    } else {
      onViewChange(itemId);
    }
  };

  const isActiveParent = (section: MenuItem) => {
    if (activeView === section.id) return true;
    return section.subItems?.some(sub => activeView === sub.id) || false;
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="h-screen w-64 bg-card border-r border-border/30 flex flex-col sticky top-0"
    >
      {/* Logo */}
      <div className="p-4 border-b border-border/30 flex justify-center">
        <img
          src={softwareValaLogo}
          alt="Software Vala Logo"
          className="w-14 h-14 rounded-full object-contain border-2 border-cyan-500/30"
        />
      </div>

      {/* Title */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Marketplace Manager</h2>
            <p className="text-[10px] text-muted-foreground">34 Features • Full Control</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <ScrollArea className="flex-1">
        <div className="py-2 px-2 space-y-0.5">
          {menuSections.map((section, index) => {
            const Icon = section.icon;
            const isExpanded = expandedSections.includes(section.id);
            const hasSubItems = section.subItems && section.subItems.length > 0;
            const isActive = isActiveParent(section);

            return (
              <div key={section.id}>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleItemClick(section.id, !!hasSubItems)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-left",
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-medium truncate flex-1">{section.label}</span>
                  {section.badge && (
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded-full font-mono",
                      section.badge === "LIVE"
                        ? "bg-emerald-500/20 text-emerald-400 animate-pulse"
                        : section.badge === "CORE"
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {section.badge}
                    </span>
                  )}
                  {hasSubItems && (
                    isExpanded
                      ? <ChevronDown className="w-3 h-3 flex-shrink-0" />
                      : <ChevronRight className="w-3 h-3 flex-shrink-0" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {hasSubItems && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-6 py-1 space-y-0.5">
                        {section.subItems?.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = activeView === subItem.id;

                          return (
                            <button
                              key={subItem.id}
                              onClick={() => onViewChange(subItem.id)}
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 text-left",
                                isSubActive
                                  ? "bg-primary/15 text-primary"
                                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                              )}
                            >
                              <SubIcon className="w-3 h-3 flex-shrink-0" />
                              <span className="text-[11px] truncate">{subItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* User Info & Actions */}
      <div className="p-3 border-t border-border/30 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 bg-secondary/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{userName}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[8px] px-1 py-0 bg-primary/10 text-primary border-primary/30">
                MARKETPLACE MGR
              </Badge>
              <span className="text-[8px] text-muted-foreground font-mono">{maskedId}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="flex-1 text-[10px] gap-1 h-7 border-border/50"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/settings')}
            className="text-[10px] gap-1 h-7 border-border/50 px-2"
          >
            <Settings className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-[10px] gap-1 h-7 text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
          >
            <LogOut className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.aside>
  );
};

export default DemoManagerSidebar;
