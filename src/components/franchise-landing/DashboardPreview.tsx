import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  PlayCircle, 
  MapPin, 
  Percent, 
  Wallet,
  Settings,
  UserPlus,
  Truck,
  MessageSquare,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const metrics = [
  { icon: TrendingUp, label: 'Monthly Earnings', value: '₹4.2L', trend: '+23%' },
  { icon: Users, label: 'Total Leads', value: '347', trend: '+18' },
  { icon: PlayCircle, label: 'Active Demos', value: '12', trend: '3 pending' },
  { icon: MapPin, label: 'Territory Status', value: 'Active', trend: 'Verified' },
  { icon: Percent, label: 'Conversion Rate', value: '34%', trend: '+5%' },
  { icon: Wallet, label: 'Wallet Balance', value: '₹1.8L', trend: 'Withdrawable' }
];

const actions = [
  { icon: Settings, label: 'Manage Leads' },
  { icon: UserPlus, label: 'Assign Developer' },
  { icon: Truck, label: 'Track Delivery' },
  { icon: MessageSquare, label: 'Support Chat' }
];

const DashboardPreview = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-mono font-bold text-foreground mb-4">
            Your <span className="text-primary">Dashboard</span> Preview
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A glimpse of your franchise command center
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Mock Dashboard */}
          <div className="relative glass-panel-glow rounded-2xl p-6 overflow-hidden">
            {/* Hologram Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Header Bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center text-background font-bold">
                  FV
                </div>
                <div>
                  <p className="font-mono font-semibold text-foreground">Franchise Dashboard</p>
                  <p className="text-xs text-muted-foreground">vala(franchise)***456</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center cursor-pointer"
                  animate={{ boxShadow: ['0 0 10px hsla(187, 100%, 50%, 0.3)', '0 0 20px hsla(187, 100%, 50%, 0.5)', '0 0 10px hsla(187, 100%, 50%, 0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Bot className="w-5 h-5 text-primary" />
                </motion.div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {metrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel p-4 border border-border/30 group hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground truncate">{metric.label}</span>
                    </div>
                    <p className="text-xl font-mono font-bold text-foreground">{metric.value}</p>
                    <p className="text-xs text-neon-green">{metric.trend}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {actions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/50"
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {action.label}
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            {/* Connection Lines Animation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(187, 100%, 50%)" stopOpacity="0" />
                  <stop offset="50%" stopColor="hsl(187, 100%, 50%)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(187, 100%, 50%)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1, 2].map((i) => (
                <motion.line
                  key={i}
                  x1="0%"
                  y1={`${30 + i * 20}%`}
                  x2="100%"
                  y2={`${30 + i * 20}%`}
                  stroke="url(#lineGrad)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, delay: i * 0.3 }}
                />
              ))}
            </svg>

            {/* AI Activity Pulse */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 glass-panel px-3 py-2 rounded-full">
              <motion.div
                className="w-2 h-2 rounded-full bg-neon-green"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs text-muted-foreground">AI Active</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
