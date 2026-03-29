import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Shield,
  Users,
  DollarSign,
  Activity,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface AdminNotificationsProps {
  open: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: "alert" | "success" | "info" | "warning";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: "security" | "users" | "finance" | "system";
}

const notifications: Notification[] = [
  { id: "1", type: "alert", title: "Security Alert", message: "Multiple failed login attempts detected from IP 203.45.67.89", timestamp: "2 min ago", read: false, category: "security" },
  { id: "2", type: "success", title: "Payout Completed", message: "Batch payout of $12,450 to 15 resellers completed", timestamp: "15 min ago", read: false, category: "finance" },
  { id: "3", type: "info", title: "New User Registration", message: "5 new franchise applications pending review", timestamp: "1 hour ago", read: false, category: "users" },
  { id: "4", type: "warning", title: "System Performance", message: "Analytics Engine response time exceeding threshold", timestamp: "2 hours ago", read: true, category: "system" },
  { id: "5", type: "success", title: "Task Milestone", message: "Developer team completed 100 tasks this week", timestamp: "3 hours ago", read: true, category: "system" },
  { id: "6", type: "info", title: "Revenue Update", message: "Monthly revenue target achieved - $234K", timestamp: "5 hours ago", read: true, category: "finance" },
  { id: "7", type: "alert", title: "Fraud Detection", message: "Suspicious transaction flagged for review", timestamp: "1 day ago", read: true, category: "security" },
];

const AdminNotifications = ({ open, onClose }: AdminNotificationsProps) => {
  const getIcon = (type: string, category: string) => {
    if (category === "security") return <Shield className="w-5 h-5" />;
    if (category === "users") return <Users className="w-5 h-5" />;
    if (category === "finance") return <DollarSign className="w-5 h-5" />;
    
    switch (type) {
      case "alert": return <AlertTriangle className="w-5 h-5" />;
      case "success": return <CheckCircle className="w-5 h-5" />;
      case "warning": return <AlertTriangle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "alert": return "text-neon-red bg-neon-red/20 border-neon-red/50";
      case "success": return "text-neon-green bg-neon-green/20 border-neon-green/50";
      case "warning": return "text-neon-orange bg-neon-orange/20 border-neon-orange/50";
      default: return "text-neon-cyan bg-neon-cyan/20 border-neon-cyan/50";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] bg-card border-border/30">
        <SheetHeader className="border-b border-border/30 pb-4">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <span className="font-mono">Notifications</span>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-primary/20 text-primary border-primary/50">
                {unreadCount} new
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-2 max-h-[calc(100vh-120px)] overflow-auto">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-lg border transition-all ${
                notification.read 
                  ? "bg-secondary/30 border-border/30" 
                  : "bg-secondary/50 border-primary/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${getColor(notification.type)}`}>
                  {getIcon(notification.type, notification.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground text-sm">{notification.title}</span>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {notification.timestamp}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" className="w-full" onClick={onClose}>
            <Activity className="w-4 h-4 mr-2" />
            View All Activity
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdminNotifications;
