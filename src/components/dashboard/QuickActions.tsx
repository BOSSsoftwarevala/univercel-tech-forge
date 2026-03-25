import { motion } from 'framer-motion';
import { 
  Plus, 
  Send, 
  UserPlus, 
  FileText, 
  Wallet,
  Shield,
  Bot,
  Zap
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const actions: QuickAction[] = [
  { id: 'franchise', label: 'Add Franchise', icon: <Plus className="w-4 h-4" />, color: 'text-neon-cyan', bgColor: 'bg-neon-cyan/10 hover:bg-neon-cyan/20' },
  { id: 'broadcast', label: 'Broadcast', icon: <Send className="w-4 h-4" />, color: 'text-neon-orange', bgColor: 'bg-neon-orange/10 hover:bg-neon-orange/20' },
  { id: 'reseller', label: 'New Reseller', icon: <UserPlus className="w-4 h-4" />, color: 'text-neon-teal', bgColor: 'bg-neon-teal/10 hover:bg-neon-teal/20' },
  { id: 'report', label: 'Generate Report', icon: <FileText className="w-4 h-4" />, color: 'text-neon-purple', bgColor: 'bg-neon-purple/10 hover:bg-neon-purple/20' },
  { id: 'payout', label: 'Process Payout', icon: <Wallet className="w-4 h-4" />, color: 'text-neon-green', bgColor: 'bg-neon-green/10 hover:bg-neon-green/20' },
  { id: 'security', label: 'Security Scan', icon: <Shield className="w-4 h-4" />, color: 'text-neon-red', bgColor: 'bg-neon-red/10 hover:bg-neon-red/20' },
  { id: 'ai', label: 'AI Assistant', icon: <Bot className="w-4 h-4" />, color: 'text-primary', bgColor: 'bg-primary/10 hover:bg-primary/20' },
  { id: 'quick-task', label: 'Quick Task', icon: <Zap className="w-4 h-4" />, color: 'text-neon-blue', bgColor: 'bg-neon-blue/10 hover:bg-neon-blue/20' },
];

const QuickActions = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="glass-panel p-4"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-4 gap-2">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + (index * 0.05) }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl ${action.bgColor} ${action.color} transition-all duration-200`}
          >
            {action.icon}
            <span className="text-[10px] font-medium text-center leading-tight">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;