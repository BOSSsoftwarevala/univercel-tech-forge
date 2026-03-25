import { motion } from 'framer-motion';
import { 
  Users, 
  Percent, 
  Wallet, 
  Clock, 
  Package, 
  Award,
  Share2,
  Link2,
  PlayCircle,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const metrics = [
  { icon: Users, label: 'Total Leads', value: '234', change: '+12 today', color: 'neon-blue' },
  { icon: Percent, label: 'Conversion %', value: '18%', change: '+3% this week', color: 'neon-teal' },
  { icon: Wallet, label: 'Commission Earned', value: '₹1.2L', change: 'Lifetime', color: 'neon-green' },
  { icon: Clock, label: 'Pending Commission', value: '₹45K', change: '3 deals', color: 'neon-orange' },
  { icon: Package, label: 'Active Products', value: '12', change: '5 hot selling', color: 'neon-purple' },
  { icon: Award, label: 'Ranking Badge', value: 'Silver', change: '₹20K to Gold', color: 'primary' }
];

const actions = [
  { icon: Share2, label: 'Share Product' },
  { icon: Link2, label: 'Create Link' },
  { icon: PlayCircle, label: 'Track Demo' },
  { icon: CreditCard, label: 'Withdraw to Wallet' }
];

const ResellerDashboardPreview = () => {
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
            Your <span className="text-neon-blue">Dashboard</span> Preview
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A powerful command center to track and maximize your earnings
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
            {/* Hologram Spark Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0" />
                  <stop offset="50%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map((i) => (
                <motion.line
                  key={i}
                  x1="0%"
                  y1={`${25 + i * 18}%`}
                  x2="100%"
                  y2={`${25 + i * 18}%`}
                  stroke="url(#sparkGrad)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: i * 0.2 }}
                />
              ))}
            </svg>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/30 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-primary flex items-center justify-center text-background font-bold text-sm">
                  RV
                </div>
                <div>
                  <p className="font-mono font-semibold text-foreground">Reseller Dashboard</p>
                  <p className="text-xs text-muted-foreground">vala(reseller)***789</p>
                </div>
              </div>
              
              {/* Ranking Badge */}
              <motion.div
                className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-blue/20 to-primary/20 border border-neon-blue/30"
                animate={{
                  boxShadow: [
                    '0 0 10px hsla(217, 91%, 60%, 0.2)',
                    '0 0 20px hsla(217, 91%, 60%, 0.4)',
                    '0 0 10px hsla(217, 91%, 60%, 0.2)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-sm font-mono font-bold text-neon-blue">🥈 Silver Reseller</span>
              </motion.div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 relative z-10">
              {metrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="glass-panel p-4 border border-border/30 group hover:border-neon-blue/50 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className={`w-4 h-4 text-${metric.color}`} />
                      <span className="text-xs text-muted-foreground truncate">{metric.label}</span>
                    </div>
                    <p className="text-xl font-mono font-bold text-foreground">{metric.value}</p>
                    <p className={`text-xs text-${metric.color}`}>{metric.change}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6 relative z-10">
              {actions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="border-neon-blue/30 text-foreground hover:bg-neon-blue/10 hover:border-neon-blue/50"
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {action.label}
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            {/* Live Commission Counter */}
            <motion.div
              className="glass-panel p-4 rounded-lg flex items-center justify-between relative z-10"
              animate={{
                borderColor: ['hsla(142, 76%, 50%, 0.2)', 'hsla(142, 76%, 50%, 0.5)', 'hsla(142, 76%, 50%, 0.2)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ border: '1px solid hsla(142, 76%, 50%, 0.3)' }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-3 h-3 rounded-full bg-neon-green"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm text-muted-foreground">Live Commission Tracker</span>
              </div>
              <motion.span
                className="font-mono font-bold text-neon-green"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                +₹7,500 this session
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResellerDashboardPreview;
