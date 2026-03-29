import { motion } from 'framer-motion';
import { 
  UserPlus, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Bot,
  Code2,
  ShoppingCart
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'user' | 'sale' | 'alert' | 'success' | 'ai' | 'code' | 'order';
  message: string;
  time: string;
  highlight?: boolean;
}

const activities: Activity[] = [
  { id: '1', type: 'sale', message: 'New franchise purchased - Delhi NCR', time: '2m ago', highlight: true },
  { id: '2', type: 'user', message: 'Reseller onboarded: TechPro Solutions', time: '5m ago' },
  { id: '3', type: 'ai', message: 'AI detected potential lead: Manufacturing sector', time: '8m ago' },
  { id: '4', type: 'code', message: 'Developer task completed: Invoice Module v2.3', time: '12m ago' },
  { id: '5', type: 'success', message: 'Client success: SLA exceeded for Enterprise tier', time: '15m ago' },
  { id: '6', type: 'order', message: 'Demo request: Healthcare CRM by Apollo Group', time: '18m ago' },
  { id: '7', type: 'alert', message: 'API rate limit warning: Payment Gateway', time: '22m ago' },
  { id: '8', type: 'sale', message: 'Subscription renewed: Annual Enterprise Plan', time: '28m ago' },
];

const ActivityFeed = ({ delay = 0 }: { delay?: number }) => {
  const getIcon = (type: Activity['type']) => {
    const iconClass = "w-3.5 h-3.5";
    switch (type) {
      case 'user': return <UserPlus className={iconClass} />;
      case 'sale': return <DollarSign className={iconClass} />;
      case 'alert': return <AlertTriangle className={iconClass} />;
      case 'success': return <CheckCircle className={iconClass} />;
      case 'ai': return <Bot className={iconClass} />;
      case 'code': return <Code2 className={iconClass} />;
      case 'order': return <ShoppingCart className={iconClass} />;
      default: return <CheckCircle className={iconClass} />;
    }
  };

  const getTypeStyles = (type: Activity['type']) => {
    switch (type) {
      case 'user': return 'bg-neon-blue/20 text-neon-blue';
      case 'sale': return 'bg-neon-green/20 text-neon-green';
      case 'alert': return 'bg-neon-orange/20 text-neon-orange';
      case 'success': return 'bg-neon-teal/20 text-neon-teal';
      case 'ai': return 'bg-primary/20 text-primary';
      case 'code': return 'bg-neon-purple/20 text-neon-purple';
      case 'order': return 'bg-neon-cyan/20 text-neon-cyan';
      default: return 'bg-secondary text-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="glass-panel p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Live Activity Feed</h3>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Real-time</span>
        </div>
      </div>

      <div className="space-y-3 max-h-[320px] overflow-y-auto">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + (index * 0.05) }}
            className={`flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-secondary/30 ${
              activity.highlight ? 'bg-primary/5 border-l-2 border-primary' : ''
            }`}
          >
            <div className={`p-1.5 rounded-md flex-shrink-0 ${getTypeStyles(activity.type)}`}>
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{activity.message}</p>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ActivityFeed;