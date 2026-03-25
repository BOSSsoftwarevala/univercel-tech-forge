import { useState } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Brain, Plug, Search, Users, Code2, 
  Zap, Server, CreditCard, Settings, Shield, Mic, FileText,
  Bell, Smartphone, CheckSquare, FileSearch, Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UnifiedOverview } from "@/components/unified-control/UnifiedOverview";
import { UnifiedAIManagement } from "@/components/unified-control/UnifiedAIManagement";
import { UnifiedAPIManagement } from "@/components/unified-control/UnifiedAPIManagement";
import { UnifiedSEOManagement } from "@/components/unified-control/UnifiedSEOManagement";
import { UnifiedLeadManagement } from "@/components/unified-control/UnifiedLeadManagement";
import { UnifiedDevControl } from "@/components/unified-control/UnifiedDevControl";
import { UnifiedAutomation } from "@/components/unified-control/UnifiedAutomation";
import { UnifiedServerInfra } from "@/components/unified-control/UnifiedServerInfra";
import { UnifiedBilling } from "@/components/unified-control/UnifiedBilling";
import { UnifiedSettings } from "@/components/unified-control/UnifiedSettings";
import { UnifiedVoiceCommand } from "@/components/unified-control/UnifiedVoiceCommand";
import { UnifiedFileManager } from "@/components/unified-control/UnifiedFileManager";
import { UnifiedNotifications } from "@/components/unified-control/UnifiedNotifications";
import { UnifiedAPKBuilder } from "@/components/unified-control/UnifiedAPKBuilder";
import { UnifiedApprovals } from "@/components/unified-control/UnifiedApprovals";
import { UnifiedAuditLogs } from "@/components/unified-control/UnifiedAuditLogs";
import { UnifiedProductDemo } from "@/components/unified-control/UnifiedProductDemo";

const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Global Dashboard', icon: LayoutDashboard, color: 'orange' },
  { id: 'ai', label: 'AI Management', icon: Brain, color: 'violet' },
  { id: 'api', label: 'API Management', icon: Plug, color: 'blue' },
  { id: 'seo', label: 'SEO & Growth', icon: Search, color: 'emerald' },
  { id: 'leads', label: 'Lead Management', icon: Users, color: 'cyan' },
  { id: 'products', label: 'Product & Demo', icon: Package, color: 'indigo' },
  { id: 'dev', label: 'Development Control', icon: Code2, color: 'pink' },
  { id: 'automation', label: 'Automation Engine', icon: Zap, color: 'amber' },
  { id: 'server', label: 'Server & Infra', icon: Server, color: 'red' },
  { id: 'billing', label: 'Billing & Payments', icon: CreditCard, color: 'green' },
  { id: 'notifications', label: 'Notification Center', icon: Bell, color: 'yellow' },
  { id: 'voice', label: 'Voice & Command', icon: Mic, color: 'purple' },
  { id: 'files', label: 'File & Media', icon: FileText, color: 'teal' },
  { id: 'apk', label: 'Mobile / APK Builder', icon: Smartphone, color: 'lime' },
  { id: 'approvals', label: 'Approvals (Boss)', icon: CheckSquare, color: 'rose' },
  { id: 'logs', label: 'Logs & Audit Trail', icon: FileSearch, color: 'gray' },
  { id: 'settings', label: 'System Settings', icon: Settings, color: 'slate' },
];

const UnifiedControlDashboard = () => {
  const [activeView, setActiveView] = useState('overview');

  const renderContent = () => {
    switch (activeView) {
      case 'overview': return <UnifiedOverview />;
      case 'ai': return <UnifiedAIManagement />;
      case 'api': return <UnifiedAPIManagement />;
      case 'seo': return <UnifiedSEOManagement />;
      case 'leads': return <UnifiedLeadManagement />;
      case 'products': return <UnifiedProductDemo />;
      case 'dev': return <UnifiedDevControl />;
      case 'automation': return <UnifiedAutomation />;
      case 'server': return <UnifiedServerInfra />;
      case 'billing': return <UnifiedBilling />;
      case 'notifications': return <UnifiedNotifications />;
      case 'voice': return <UnifiedVoiceCommand />;
      case 'files': return <UnifiedFileManager />;
      case 'apk': return <UnifiedAPKBuilder />;
      case 'approvals': return <UnifiedApprovals />;
      case 'logs': return <UnifiedAuditLogs />;
      case 'settings': return <UnifiedSettings />;
      default: return <UnifiedOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-950 to-slate-950 flex">
      {/* Left Sidebar */}
      <div className="w-72 border-r border-border/50 bg-slate-900/50 p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">GLOBAL COMMAND</h1>
            <p className="text-xs text-orange-400">World Control • Real-Time • Self-Heal</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {SIDEBAR_ITEMS.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                activeView === item.id
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "text-muted-foreground hover:text-white hover:bg-muted/20"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Boss Only Badge */}
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-400" />
            <span className="text-xs font-medium text-red-400">Boss / Owner Only</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Full system control. Audit enabled.
          </p>
        </div>

        {/* 4 Actions Rule */}
        <div className="mt-3 p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
          <p className="text-[10px] text-violet-300 font-medium mb-2">4 Global Actions:</p>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">✓ Add</span>
            <span className="flex items-center gap-1">✓ Delete</span>
            <span className="flex items-center gap-1">✓ Run/Stop</span>
            <span className="flex items-center gap-1">✓ Pay/Unpay</span>
          </div>
        </div>

        {/* Power Statement */}
        <div className="mt-3 p-2 rounded bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
          <p className="text-[9px] text-center text-orange-300 font-medium">
            SYSTEM BRAIN • EVERY EVENT TRACKED • ZERO FAILURE
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default UnifiedControlDashboard;
