import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, Plug, BarChart3, Settings, LayoutDashboard,
  Play, Square, Plus, Trash2, CreditCard, AlertTriangle,
  Activity, DollarSign, Zap, Shield, TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AIAPIOverview } from "@/components/ai-api-management/AIAPIOverview";
import { AIModelsView } from "@/components/ai-api-management/AIModelsView";
import { APIServicesView } from "@/components/ai-api-management/APIServicesView";
import { BillingUsageView } from "@/components/ai-api-management/BillingUsageView";
import { AIAPISettingsView } from "@/components/ai-api-management/AIAPISettingsView";

const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ai-models', label: 'AI Models', icon: Brain },
  { id: 'api-services', label: 'API Services', icon: Plug },
  { id: 'billing', label: 'Billing & Usage', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const AIAPIManagementDashboard = () => {
  const [activeView, setActiveView] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-950 to-slate-950 flex">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-border/50 bg-slate-900/50 p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AI & API</h1>
            <p className="text-xs text-orange-400">Management</p>
          </div>
        </div>

        <nav className="space-y-1">
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
        <div className="mt-8 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-400" />
            <span className="text-xs font-medium text-red-400">Boss Only Access</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Full control. Audit enabled.
          </p>
        </div>

        {/* 4 Actions Rule */}
        <div className="mt-4 p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
          <p className="text-[10px] text-violet-300 font-medium mb-2">4 Actions Only:</p>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
            <span>✓ Add</span>
            <span>✓ Delete</span>
            <span>✓ Run/Stop</span>
            <span>✓ Pay/Unpay</span>
          </div>
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
          {activeView === 'overview' && <AIAPIOverview />}
          {activeView === 'ai-models' && <AIModelsView />}
          {activeView === 'api-services' && <APIServicesView />}
          {activeView === 'billing' && <BillingUsageView />}
          {activeView === 'settings' && <AIAPISettingsView />}
        </motion.div>
      </div>
    </div>
  );
};

export default AIAPIManagementDashboard;
