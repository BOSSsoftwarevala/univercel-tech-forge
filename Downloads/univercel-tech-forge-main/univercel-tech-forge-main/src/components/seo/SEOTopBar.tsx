import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Search, Settings, Sparkles, Activity, Wallet, Bell, Power, User } from "lucide-react";
import GlobalNotificationHeader from "@/components/shared/GlobalNotificationHeader";
import type { NotificationAlert } from "@/components/shared/GlobalNotificationHeader";
import { Switch } from "@/components/ui/switch";

interface SEOTopBarProps {
  onAIClick: () => void;
  activeRegion: string;
  notifications?: NotificationAlert[];
  onDismissNotification?: (id: string) => void;
  onNotificationAction?: (id: string) => void;
}

const SEOTopBar = ({ 
  onAIClick, 
  activeRegion,
  notifications = [],
  onDismissNotification = () => {},
  onNotificationAction = () => {}
}: SEOTopBarProps) => {
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [walletBalance] = useState(12450.00);

  const regionLabels: Record<string, string> = {
    global: "🌍 Global",
    africa: "🌍 Africa Mode",
    asia: "🌏 Asia Mode",
    middleeast: "🌍 Middle East Mode"
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/20 z-50 flex items-center justify-between px-6"
    >
      {/* Left Section - Logo */}
      <div className="flex items-center gap-4">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"
            >
              <Globe className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">SEO Command Center</h1>
            <p className="text-xs text-cyan-400">{regionLabels[activeRegion]}</p>
          </div>
        </motion.div>
      </div>

      {/* Center - Global Search */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search keywords, pages, campaigns..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Right Section - Status & Actions */}
      <div className="flex items-center gap-4">
        {/* Automation Status Toggle */}
        <motion.div
          className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${
            automationEnabled 
              ? "bg-emerald-500/10 border-emerald-500/30" 
              : "bg-slate-800/50 border-slate-700"
          }`}
          animate={automationEnabled ? { 
            boxShadow: ["0 0 0 0 rgba(16, 185, 129, 0)", "0 0 15px 3px rgba(16, 185, 129, 0.2)", "0 0 0 0 rgba(16, 185, 129, 0)"] 
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Power className={`w-4 h-4 ${automationEnabled ? "text-emerald-400" : "text-slate-500"}`} />
          <span className={`text-xs font-medium ${automationEnabled ? "text-emerald-400" : "text-slate-500"}`}>
            Automation
          </span>
          <Switch
            checked={automationEnabled}
            onCheckedChange={setAutomationEnabled}
            className="data-[state=checked]:bg-emerald-500"
          />
        </motion.div>

        {/* Wallet Balance */}
        <motion.div
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/30"
          whileHover={{ scale: 1.02 }}
        >
          <Wallet className="w-4 h-4 text-amber-400" />
          <div>
            <p className="text-xs text-slate-400">Wallet</p>
            <p className="text-sm font-bold text-amber-400">₹{walletBalance.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Notifications */}
        <GlobalNotificationHeader
          userRole="seo"
          notifications={notifications}
          onDismiss={onDismissNotification}
          onAction={onNotificationAction}
        />

        {/* AI Assistant */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAIClick}
          className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 transition-colors"
        >
          <Sparkles className="w-5 h-5 text-cyan-400" />
        </motion.button>

        {/* Profile */}
        <motion.div
          className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/30 transition-colors cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white">SEO Manager</p>
            <p className="text-xs text-cyan-400">vala(seo)***</p>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/30 transition-colors"
        >
          <Settings className="w-5 h-5 text-slate-400" />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default SEOTopBar;
