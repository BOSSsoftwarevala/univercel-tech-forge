import { motion } from "framer-motion";
import { AlertTriangle, Server, FileCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlertCard {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeType: 'urgent' | 'critical' | 'important' | 'active';
  buttonText: string;
  icon: React.ReactNode;
  timestamp: Date;
  status: 'red' | 'yellow' | 'green';
}

const alerts: AlertCard[] = [
  {
    id: '1',
    title: 'LIVE LEAD ALERT',
    subtitle: '2 new high-priority leads unassigned',
    badge: 'URGENT',
    badgeType: 'urgent',
    buttonText: 'Assign Now',
    icon: <AlertTriangle className="w-6 h-6" />,
    timestamp: new Date(),
    status: 'red',
  },
  {
    id: '2',
    title: 'DEMO SERVER ALERT',
    subtitle: "Demo 'Matrix ERP' offline — action required",
    badge: 'CRITICAL',
    badgeType: 'critical',
    buttonText: 'View Status',
    icon: <Server className="w-6 h-6" />,
    timestamp: new Date(),
    status: 'red',
  },
  {
    id: '3',
    title: 'APPROVAL REQUIRED',
    subtitle: '3 developer submissions pending review',
    badge: 'IMPORTANT',
    badgeType: 'important',
    buttonText: 'Review Now',
    icon: <FileCheck className="w-6 h-6" />,
    timestamp: new Date(),
    status: 'yellow',
  },
  {
    id: '4',
    title: 'LIVE TEAM CHAT',
    subtitle: '5 unread system messages',
    badge: 'ACTIVE',
    badgeType: 'active',
    buttonText: 'Open Chat',
    icon: <MessageSquare className="w-6 h-6" />,
    timestamp: new Date(),
    status: 'green',
  },
];

const getBadgeStyles = (type: AlertCard['badgeType']) => {
  switch (type) {
    case 'urgent':
      return 'bg-red-500/20 text-red-400 border-red-500/50';
    case 'critical':
      return 'bg-pink-500/20 text-pink-400 border-pink-500/50';
    case 'important':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'active':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
  }
};

const getStatusColor = (status: AlertCard['status']) => {
  switch (status) {
    case 'red':
      return 'bg-red-500';
    case 'yellow':
      return 'bg-yellow-500';
    case 'green':
      return 'bg-emerald-500';
  }
};

const getCardGradient = (type: AlertCard['badgeType']) => {
  switch (type) {
    case 'urgent':
    case 'critical':
      return 'from-red-950/80 via-pink-950/60 to-background/90';
    case 'important':
      return 'from-yellow-950/60 via-amber-950/40 to-background/90';
    case 'active':
      return 'from-emerald-950/60 via-teal-950/40 to-background/90';
  }
};

const getGlowColor = (type: AlertCard['badgeType']) => {
  switch (type) {
    case 'urgent':
    case 'critical':
      return 'shadow-red-500/20 hover:shadow-red-500/40';
    case 'important':
      return 'shadow-yellow-500/20 hover:shadow-yellow-500/40';
    case 'active':
      return 'shadow-emerald-500/20 hover:shadow-emerald-500/40';
  }
};

const LiveAlertGrid = () => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {alerts.map((alert, index) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            relative overflow-hidden rounded-xl p-4
            bg-gradient-to-br ${getCardGradient(alert.badgeType)}
            border border-white/10
            shadow-lg ${getGlowColor(alert.badgeType)}
            transition-all duration-300 hover:scale-[1.02]
          `}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          {/* Status Indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className={`relative flex h-3 w-3`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${getStatusColor(alert.status)} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${getStatusColor(alert.status)}`} />
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full min-h-[140px]">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-white/10 text-white">
                {alert.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-sm">{alert.title}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeStyles(alert.badgeType)}`}>
                    {alert.badge}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{alert.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
              <span className="text-[10px] text-muted-foreground">
                {formatTime(alert.timestamp)}
              </span>
              <Button 
                size="sm" 
                variant="secondary"
                className="h-7 text-xs bg-white/10 hover:bg-white/20 text-white border-0"
              >
                {alert.buttonText}
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LiveAlertGrid;
