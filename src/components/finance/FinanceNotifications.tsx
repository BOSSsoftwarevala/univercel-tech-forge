import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign,
  FileText,
  Shield,
  Clock,
  X
} from "lucide-react";

interface FinanceNotificationsProps {
  open: boolean;
  onClose: () => void;
}

const FinanceNotifications = ({ open, onClose }: FinanceNotificationsProps) => {
  const notifications = [
    {
      id: 1,
      type: "success",
      icon: DollarSign,
      title: "Commission Released",
      message: "$37.35 released to John Smith (Reseller)",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      icon: AlertTriangle,
      title: "Suspicious Transaction Detected",
      message: "TXN-2035-F001 flagged for duplicate payment pattern",
      time: "15 min ago",
      read: false,
    },
    {
      id: 3,
      type: "info",
      icon: FileText,
      title: "GST Invoice Generated",
      message: "INV-2035-001247 auto-generated for ABC Corporation",
      time: "30 min ago",
      read: false,
    },
    {
      id: 4,
      type: "success",
      icon: CheckCircle,
      title: "Payout Approved",
      message: "PAY-2035-0890 approved for Mumbai Franchise ($4,820.00)",
      time: "1 hr ago",
      read: true,
    },
    {
      id: 5,
      type: "warning",
      icon: Clock,
      title: "Payout on Hold",
      message: "PAY-2035-0887 requires verification - Delhi Franchise",
      time: "2 hr ago",
      read: true,
    },
    {
      id: 6,
      type: "info",
      icon: DollarSign,
      title: "Wallet Updated",
      message: "Developer Pool credited $150 for Task #4521",
      time: "3 hr ago",
      read: true,
    },
    {
      id: 7,
      type: "success",
      icon: Shield,
      title: "Fraud Scan Complete",
      message: "847 transactions scanned - No new threats",
      time: "4 hr ago",
      read: true,
    },
  ];

  const getTypeStyles = (type: string) => {
    const styles: Record<string, string> = {
      success: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600",
      warning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
      info: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
      error: "bg-red-100 dark:bg-red-900/30 text-red-600",
    };
    return styles[type] || styles.info;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[450px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
        <SheetHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                Finance Alerts
              </SheetTitle>
              {unreadCount > 0 && (
                <Badge className="bg-cyan-600">{unreadCount} new</Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" className="text-slate-500">
              Mark all read
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-4">
          <div className="space-y-3 pr-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read 
                    ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700' 
                    : 'bg-white dark:bg-slate-800 border-cyan-200 dark:border-cyan-800 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getTypeStyles(notification.type)}`}>
                    <notification.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-medium ${
                        notification.read 
                          ? 'text-slate-600 dark:text-slate-400' 
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{notification.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Sound Settings */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Bell className="w-4 h-4" />
              <span>Subtle chime enabled</span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              Settings
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FinanceNotifications;
