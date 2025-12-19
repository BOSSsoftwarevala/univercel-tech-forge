import { motion } from "framer-motion";
import { Globe, Search, Settings, Sparkles, Activity } from "lucide-react";
import GlobalNotificationHeader from "@/components/shared/GlobalNotificationHeader";
import type { NotificationAlert } from "@/components/shared/GlobalNotificationHeader";

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
      {/* Left Section */}
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

      {/* Center - Live Rankings Pulse */}
      <div className="flex items-center gap-6">
        <motion.div
          className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-lg border border-cyan-500/30"
          animate={{ boxShadow: ["0 0 0 0 rgba(6, 182, 212, 0)", "0 0 20px 5px rgba(6, 182, 212, 0.3)", "0 0 0 0 rgba(6, 182, 212, 0)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Activity className="w-5 h-5 text-cyan-400" />
          <div>
            <p className="text-xs text-slate-400">Live Rankings</p>
            <p className="text-sm font-bold text-green-400">+12.4% ↑</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-lg border border-emerald-500/30">
          <Search className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs text-slate-400">Keywords Tracked</p>
            <p className="text-sm font-bold text-emerald-400">2,847</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-lg border border-purple-500/30">
          <Globe className="w-5 h-5 text-purple-400" />
          <div>
            <p className="text-xs text-slate-400">Domain Authority</p>
            <p className="text-sm font-bold text-purple-400">72/100</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="text-right mr-4">
          <p className="text-sm font-medium text-white">vala(seo)***</p>
          <p className="text-xs text-cyan-400">SEO Manager</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAIClick}
          className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 transition-colors"
        >
          <Sparkles className="w-5 h-5 text-cyan-400" />
        </motion.button>

        {/* Global Notification Header */}
        <GlobalNotificationHeader
          userRole="seo"
          notifications={notifications}
          onDismiss={onDismissNotification}
          onAction={onNotificationAction}
        />

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
