import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Link2, 
  Wallet, 
  MessageSquare, 
  GraduationCap, 
  HeadphonesIcon,
  Bell,
  Search,
  Menu,
  X,
  TrendingUp,
  Clock,
  Share2,
  Target,
  Zap,
  ChevronRight,
  Bot,
  PlayCircle,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Product Library', icon: Package, badge: 40 },
  { id: 'leads', label: 'Lead Manager', icon: Users, badge: 12 },
  { id: 'links', label: 'Create Link', icon: Link2 },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'messages', label: 'AI Messages', icon: MessageSquare, badge: 5 },
  { id: 'training', label: 'Training', icon: GraduationCap },
  { id: 'support', label: 'Support', icon: HeadphonesIcon }
];

const metrics = [
  { label: 'Total Leads', value: '234', change: '+18 this week', icon: Users, color: 'neon-blue' },
  { label: 'Conversions', value: '42', change: '18% rate', icon: TrendingUp, color: 'neon-green' },
  { label: 'Commission', value: '₹1.26L', change: '+₹15K pending', icon: Wallet, color: 'neon-purple' },
  { label: 'Active Shares', value: '89', change: '12 today', icon: Share2, color: 'neon-teal' },
  { label: 'Wallet Balance', value: '₹85K', change: 'Withdrawable', icon: Wallet, color: 'neon-orange' },
  { label: 'Monthly Target', value: '78%', change: '₹22K to go', icon: Target, color: 'primary' }
];

const topProducts = [
  { name: 'POS System', shares: 156, conversions: 23, earnings: '₹34.5K' },
  { name: 'School ERP', shares: 98, conversions: 12, earnings: '₹18K' },
  { name: 'Hospital Management', shares: 67, conversions: 8, earnings: '₹12K' }
];

const recentActivity = [
  { time: '5 min ago', action: 'Lead clicked your link', detail: 'POS System - Delhi', type: 'click' },
  { time: '1 hour ago', action: 'Demo started', detail: 'School ERP - Pune', type: 'demo' },
  { time: '3 hours ago', action: 'Commission credited', detail: '₹7,500 - CRM Sale', type: 'earning' },
  { time: '5 hours ago', action: 'AI replied to lead', detail: 'Hospital - Mumbai', type: 'ai' }
];

const ResellerDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(222,47%,4%)] via-[hsl(220,50%,7%)] to-[hsl(217,55%,5%)]">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} hidden lg:block`}>
        <div className="h-full glass-panel border-r border-border/30">
          <div className="p-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-primary flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/')}
              >
                <Zap className="w-5 h-5 text-background" />
              </motion.div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <p className="font-mono font-bold text-sm text-foreground">SOFTWARE VALA</p>
                    <p className="text-[10px] text-neon-blue">Reseller Portal</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    activeItem === item.id
                      ? 'bg-neon-blue/10 text-neon-blue border-l-2 border-neon-blue'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                  whileHover={{ x: 3 }}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium flex-1 text-left"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {sidebarOpen && item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-neon-blue/20 text-neon-blue">
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute bottom-4 right-4 p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass-panel border-b border-border/30">
          <div className="flex items-center justify-between px-4 h-16">
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="hidden md:flex items-center flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, leads..."
                  className="pl-10 bg-secondary/30 border-border/30"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* AI Help */}
              <motion.button
                className="relative p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/30 text-neon-blue"
                animate={{
                  boxShadow: [
                    '0 0 10px hsla(217, 91%, 60%, 0.2)',
                    '0 0 20px hsla(217, 91%, 60%, 0.4)',
                    '0 0 10px hsla(217, 91%, 60%, 0.2)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Bot className="w-5 h-5" />
              </motion.button>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neon-red" />
              </button>

              {/* Avatar */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-blue to-primary flex items-center justify-center text-background font-bold text-sm">
                  RV
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground">Reseller</p>
                  <p className="text-xs text-muted-foreground">vala(reseller)***789</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-6 space-y-6">
          {/* Welcome + Ranking */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl font-mono font-bold text-foreground">
                Reseller <span className="text-neon-blue">Dashboard</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track your performance and earnings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.div
                className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-blue/20 to-primary/20 border border-neon-blue/30 flex items-center gap-2"
                animate={{
                  boxShadow: [
                    '0 0 10px hsla(217, 91%, 60%, 0.2)',
                    '0 0 20px hsla(217, 91%, 60%, 0.3)',
                    '0 0 10px hsla(217, 91%, 60%, 0.2)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Award className="w-4 h-4 text-neon-blue" />
                <span className="text-sm font-mono font-bold text-neon-blue">Silver Reseller</span>
              </motion.div>
              <Button className="bg-gradient-to-r from-neon-blue to-primary text-background">
                <Link2 className="w-4 h-4 mr-2" />
                Create Link
              </Button>
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-panel p-4 border border-border/30 hover:border-neon-blue/30 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className={`w-4 h-4 text-${metric.color}`} />
                    <span className="text-xs text-muted-foreground truncate">{metric.label}</span>
                  </div>
                  <p className="text-2xl font-mono font-bold text-foreground">{metric.value}</p>
                  <p className={`text-xs text-${metric.color}`}>{metric.change}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Top Products */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 glass-panel p-6 border border-border/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono font-semibold text-foreground flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-neon-blue" />
                  Top Performing Products
                </h3>
                <Button variant="ghost" size="sm" className="text-neon-blue">View All</Button>
              </div>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue/30 to-primary/30 flex items-center justify-center">
                          <Package className="w-5 h-5 text-neon-blue" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.shares} shares</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-neon-green">{product.earnings}</p>
                        <p className="text-xs text-muted-foreground">{product.conversions} conversions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={(product.conversions / product.shares) * 100} className="flex-1 h-1.5" />
                      <span className="text-xs text-muted-foreground">
                        {Math.round((product.conversions / product.shares) * 100)}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6 border border-border/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono font-semibold text-foreground">Activity</h3>
                <motion.div
                  className="w-2 h-2 rounded-full bg-neon-green"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/20 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      activity.type === 'click' ? 'bg-neon-blue' :
                      activity.type === 'demo' ? 'bg-neon-teal' :
                      activity.type === 'earning' ? 'bg-neon-green' :
                      'bg-neon-purple'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{activity.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Incentive Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 border border-neon-blue/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-mono font-semibold text-foreground">Monthly Incentive Progress</h3>
                <p className="text-sm text-muted-foreground">₹22,000 more to unlock Gold tier bonus</p>
              </div>
              <span className="text-2xl font-mono font-bold text-neon-blue">78%</span>
            </div>
            <div className="relative">
              <Progress value={78} className="h-3" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>₹0</span>
                <span className="text-neon-green">Current: ₹78K</span>
                <span>Target: ₹1L</span>
              </div>
            </div>
          </motion.div>

          {/* AI Indicator */}
          <motion.div
            className="fixed bottom-6 right-6 glass-panel px-4 py-3 rounded-full flex items-center gap-3 cursor-pointer hover:border-neon-blue/50 border border-border/30"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-3 h-3 rounded-full bg-neon-green"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm text-muted-foreground">AI Replying to 3 leads</span>
            <Bot className="w-4 h-4 text-neon-blue" />
          </motion.div>
        </div>
      </main>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="absolute left-0 top-0 bottom-0 w-64 glass-panel border-r border-border/30"
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-primary flex items-center justify-center">
                    <Zap className="w-5 h-5 text-background" />
                  </div>
                  <div>
                    <p className="font-mono font-bold text-sm text-foreground">SOFTWARE VALA</p>
                    <p className="text-[10px] text-neon-blue">Reseller Portal</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  {sidebarItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveItem(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                          activeItem === item.id
                            ? 'bg-neon-blue/10 text-neon-blue'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResellerDashboard;
