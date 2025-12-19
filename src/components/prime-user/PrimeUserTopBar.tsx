import { motion } from "framer-motion";
import { Bell, Search, Settings, Crown, Clock, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const PrimeUserTopBar = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-20 bg-stone-900/80 backdrop-blur-xl border-b border-amber-500/20 px-6 flex items-center justify-between"
    >
      {/* Welcome Message */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm text-amber-500/80">Welcome back,</p>
          <h2 className="text-xl font-semibold text-amber-100">Valued Prime Member</h2>
        </div>
        <Badge className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border-amber-500/40">
          <Crown className="w-3 h-3 mr-1" />
          VIP
        </Badge>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-6">
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-emerald-400 font-medium">Priority Active</span>
        </motion.div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-800/50 border border-stone-700/50">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-stone-300">Response: &lt;5 min</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-64 h-10 pl-10 pr-4 rounded-xl bg-stone-800/50 border border-stone-700/50 text-stone-300 placeholder:text-stone-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 rounded-xl bg-stone-800/50 border border-stone-700/50 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-stone-900 text-xs font-bold flex items-center justify-center">
            3
          </span>
        </motion.button>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-xl bg-stone-800/50 border border-stone-700/50 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-stone-700/50">
          <div className="text-right">
            <p className="text-sm font-medium text-amber-100">Enterprise Corp</p>
            <p className="text-xs text-stone-500">Prime Since 2023</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Avatar className="w-12 h-12 ring-2 ring-amber-500/50 ring-offset-2 ring-offset-stone-900">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-600 text-stone-900 font-bold">
                EC
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
              <Shield className="w-3 h-3 text-stone-900" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default PrimeUserTopBar;
