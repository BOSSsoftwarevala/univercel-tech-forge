import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Search,
  Megaphone,
  PenTool,
  FileSearch,
  Globe2,
  Wallet,
  Link2,
  BarChart3,
  Settings,
  TrendingUp
} from "lucide-react";

interface MarketingModuleSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "seo-manager", label: "SEO Manager", icon: Search },
  { id: "ads-manager", label: "Ads Manager", icon: Megaphone },
  { id: "content-studio", label: "Content Studio", icon: PenTool },
  { id: "keyword-research", label: "Keyword Research", icon: FileSearch },
  { id: "geo-targeting", label: "Geo Targeting", icon: Globe2 },
  { id: "budget-control", label: "Budget Control", icon: Wallet },
  { id: "lead-attribution", label: "Lead Attribution", icon: Link2 },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export const MarketingModuleSidebar = ({ activeSection, setActiveSection }: MarketingModuleSidebarProps) => {
  return (
    <div className="w-64 min-h-full border-r border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Marketing & SEO</h2>
            <p className="text-xs text-muted-foreground">AI-Powered Growth</p>
          </div>
        </div>
      </div>
      
      <nav className="p-3 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : ""}`} />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="marketing-sidebar-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};
