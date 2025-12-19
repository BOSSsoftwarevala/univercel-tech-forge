import { motion } from "framer-motion";
import { Search, Phone, MessageCircle, User, ChevronDown, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlobalNotificationHeader from "@/components/shared/GlobalNotificationHeader";
import type { NotificationAlert } from "@/components/shared/GlobalNotificationHeader";

interface SalesSupportTopBarProps {
  notifications?: NotificationAlert[];
  onDismissNotification?: (id: string) => void;
  onNotificationAction?: (id: string) => void;
}

const SalesSupportTopBar = ({
  notifications = [],
  onDismissNotification = () => {},
  onNotificationAction = () => {}
}: SalesSupportTopBarProps) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/20 px-6 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Search leads, tickets..." 
            className="w-80 pl-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/50"
          />
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Zap className="w-3 h-3 mr-1" />
          Hot Leads: 5
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-cyan-300">
          <Phone className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-cyan-300">
          <MessageCircle className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-[10px] text-white flex items-center justify-center">3</span>
        </Button>
        
        {/* Global Notification Header */}
        <GlobalNotificationHeader
          userRole="support"
          notifications={notifications}
          onDismiss={onDismissNotification}
          onAction={onNotificationAction}
        />
        
        <div className="h-8 w-px bg-slate-700 mx-2" />
        
        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-800/50 rounded-lg px-3 py-2 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-100">Sarah Chen</p>
            <p className="text-xs text-slate-500">Sales Executive</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </motion.header>
  );
};

export default SalesSupportTopBar;
