import { Search, TrendingUp, TrendingDown, DollarSign, CreditCard, AlertTriangle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import GlobalNotificationHeader from "@/components/shared/GlobalNotificationHeader";
import type { NotificationAlert } from "@/components/shared/GlobalNotificationHeader";

interface FinanceTopBarProps {
  onNotificationsClick: () => void;
  notifications?: NotificationAlert[];
  onDismissNotification?: (id: string) => void;
  onNotificationAction?: (id: string) => void;
}

const FinanceTopBar = ({ 
  onNotificationsClick,
  notifications = [],
  onDismissNotification = () => {},
  onNotificationAction = () => {}
}: FinanceTopBarProps) => {
  const metrics = [
    {
      label: "Total Revenue",
      value: "$847,293",
      trend: "+12.4%",
      positive: true,
      icon: DollarSign,
    },
    {
      label: "Pending Payouts",
      value: "$34,521",
      count: 23,
      icon: Clock,
    },
    {
      label: "Cleared Today",
      value: "$12,847",
      trend: "+8.2%",
      positive: true,
      icon: CreditCard,
    },
    {
      label: "Flagged",
      value: "3",
      urgent: true,
      icon: AlertTriangle,
    },
  ];

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
      {/* Live Metrics */}
      <div className="flex items-center gap-6">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800"
          >
            <metric.icon className={`w-4 h-4 ${metric.urgent ? 'text-red-500' : 'text-slate-400'}`} />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                {metric.label}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-semibold ${metric.urgent ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                  {metric.value}
                </span>
                {metric.trend && (
                  <span className={`flex items-center text-[10px] font-medium ${
                    metric.positive ? 'text-cyan-600' : 'text-red-500'
                  }`}>
                    {metric.positive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                    {metric.trend}
                  </span>
                )}
                {metric.count && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {metric.count} pending
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-9 w-64 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>

        {/* Global Notification Header */}
        <GlobalNotificationHeader
          userRole="finance"
          notifications={notifications}
          onDismiss={onDismissNotification}
          onAction={onNotificationAction}
        />

        <div className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white text-sm font-medium">
            FM
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900 dark:text-white">Finance Admin</span>
            <span className="text-[10px] text-slate-500">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default FinanceTopBar;
