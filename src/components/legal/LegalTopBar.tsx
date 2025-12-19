import { motion } from "framer-motion";
import { Search, Settings, Scale, AlertTriangle, FileCheck, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import GlobalNotificationHeader from "@/components/shared/GlobalNotificationHeader";
import type { NotificationAlert } from "@/components/shared/GlobalNotificationHeader";

interface LegalTopBarProps {
  notifications?: NotificationAlert[];
  onDismissNotification?: (id: string) => void;
  onNotificationAction?: (id: string) => void;
}

const LegalTopBar = ({
  notifications = [],
  onDismissNotification = () => {},
  onNotificationAction = () => {}
}: LegalTopBarProps) => {
  const metrics = [
    { label: "Active Agreements", value: "147", icon: FileCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Pending Signatures", value: "23", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Signed Today", value: "8", icon: FileCheck, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Risk Alerts", value: "5", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-20 bg-stone-900/90 backdrop-blur-xl border-b border-amber-900/30 px-6 flex items-center justify-between"
    >
      {/* Welcome */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm text-amber-500/80">Legal & Compliance</p>
          <h2 className="text-xl font-semibold text-white">Manager Console</h2>
        </div>
        <Badge className="bg-amber-600/20 text-amber-400 border-amber-600/40">
          <Scale className="w-3 h-3 mr-1" />
          Authorized
        </Badge>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl ${metric.bg} border border-stone-700/50`}
          >
            <metric.icon className={`w-5 h-5 ${metric.color}`} />
            <div>
              <p className="text-lg font-bold text-white">{metric.value}</p>
              <p className="text-xs text-stone-500">{metric.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            placeholder="Search contracts..."
            className="w-56 h-10 pl-10 pr-4 rounded-xl bg-stone-800/50 border border-stone-700/50 text-stone-300 placeholder:text-stone-500 focus:outline-none focus:border-amber-600/50 transition-colors"
          />
        </div>

        {/* Global Notification Header */}
        <GlobalNotificationHeader
          userRole="legal"
          notifications={notifications}
          onDismiss={onDismissNotification}
          onAction={onNotificationAction}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-xl bg-stone-800/50 border border-stone-700/50 flex items-center justify-center text-stone-400 hover:text-amber-500 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        <div className="flex items-center gap-3 pl-4 border-l border-stone-700/50">
          <div className="text-right">
            <p className="text-sm font-medium text-white">Legal Admin</p>
            <p className="text-xs text-stone-500">Compliance Officer</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <Avatar className="w-11 h-11 ring-2 ring-amber-600/50 ring-offset-2 ring-offset-stone-900">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold">
                LA
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-stone-900" />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default LegalTopBar;
