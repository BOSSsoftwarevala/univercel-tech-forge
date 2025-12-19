import { motion } from "framer-motion";
import { 
  Bell, 
  Search, 
  Settings, 
  Shield, 
  Users, 
  Activity,
  Zap,
  Globe,
  Server,
  Bot,
  MessageSquare,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AdminTopBarProps {
  onNotificationsClick: () => void;
}

const liveMetrics = [
  { label: "Active Users", value: "1,247", icon: Users, color: "text-neon-cyan" },
  { label: "System Load", value: "34%", icon: Server, color: "text-neon-green" },
  { label: "API Calls/min", value: "8.4K", icon: Activity, color: "text-neon-purple" },
  { label: "Regions Online", value: "12/12", icon: Globe, color: "text-neon-teal" },
];

const AdminTopBar = ({ onNotificationsClick }: AdminTopBarProps) => {
  const [buzzerActive, setBuzzerActive] = useState(true);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 glass-panel border-b border-border/30 px-6 flex items-center justify-between sticky top-0 z-40"
    >
      {/* Left Section - Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search modules, users, logs..."
            className="w-80 pl-10 bg-secondary/50 border-border/50 focus:border-primary/50"
          />
        </div>
      </div>

      {/* Center Section - Live Metrics */}
      <div className="flex items-center gap-6">
        {liveMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <Icon className={`w-4 h-4 ${metric.color}`} />
              <div>
                <div className={`text-sm font-mono font-bold ${metric.color}`}>
                  {metric.value}
                </div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider">
                  {metric.label}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        {/* Wallet Quick View */}
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20"
        >
          <Wallet className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-mono text-yellow-400">₹4.2L</span>
        </Button>

        {/* AI Assistant */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="relative bg-gradient-to-br from-primary/20 to-neon-purple/20 border border-primary/30"
          >
            <Bot className="w-5 h-5 text-primary" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </Button>
        </motion.div>

        {/* Masked Chat */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-purple text-white text-[10px] rounded-full flex items-center justify-center font-mono">
            3
          </span>
        </Button>

        {/* Security Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-green/10 border border-neon-green/30">
          <Shield className="w-4 h-4 text-neon-green" />
          <span className="text-xs font-mono text-neon-green">SECURE</span>
        </div>

        {/* Notifications with Buzzer State */}
        <motion.div
          animate={buzzerActive ? { 
            boxShadow: [
              "0 0 0 0 rgba(239, 68, 68, 0)",
              "0 0 0 8px rgba(239, 68, 68, 0.3)",
              "0 0 0 0 rgba(239, 68, 68, 0)"
            ]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="rounded-lg"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationsClick}
            className={`relative ${buzzerActive ? "bg-destructive/20 border border-destructive/50" : ""}`}
          >
            <Bell className={`w-5 h-5 ${buzzerActive ? "text-destructive animate-pulse" : ""}`} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center font-mono">
              7
            </span>
          </Button>
        </motion.div>

        {/* Settings */}
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>

        {/* Admin Avatar - Role Based */}
        <div className="flex items-center gap-3 pl-3 border-l border-border/50">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-neon-purple flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-medium">Super Admin</div>
            <div className="text-[10px] text-primary font-mono">FULL ACCESS</div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminTopBar;
