import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  MapPin, 
  PlayCircle, 
  UserPlus, 
  Bot, 
  HeadphonesIcon,
  Bell,
  Search,
  Menu,
  X,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users, badge: 23 },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'territory', label: 'Territory', icon: MapPin },
  { id: 'demos', label: 'Demo Manager', icon: PlayCircle },
  { id: 'resellers', label: 'Resellers', icon: UserPlus },
  { id: 'reports', label: 'AI Reports', icon: Bot },
  { id: 'support', label: 'Support', icon: HeadphonesIcon }
];

const metrics = [
  { label: 'Total Leads', value: '347', change: '+18 today', icon: Users, color: 'primary' },
  { label: 'Conversions', value: '89', change: '+12 this week', icon: TrendingUp, color: 'neon-green' },
  { label: 'Active Clients', value: '156', change: '98% satisfied', icon: CheckCircle, color: 'neon-teal' },
  { label: 'Pending Delivery', value: '7', change: '3 urgent', icon: Clock, color: 'neon-orange' },
  { label: 'Monthly Commission', value: '₹4.2L', change: '+23% vs last', icon: Wallet, color: 'neon-purple' },
  { label: 'Wallet Balance', value: '₹1.8L', change: 'Withdrawable', icon: Wallet, color: 'neon-blue' }
];

const recentActivity = [
  { time: '2 min ago', action: 'New lead assigned', detail: 'Rahul Verma - POS System', type: 'lead' },
  { time: '15 min ago', action: 'Demo completed', detail: 'School ERP - ABC Academy', type: 'demo' },
  { time: '1 hour ago', action: 'Payment received', detail: '₹45,000 - Hospital Management', type: 'payment' },
  { time: '2 hours ago', action: 'Developer assigned', detail: 'CRM Project - Tech Corp', type: 'developer' }
];

const developerStatus = [
  { name: 'Amit S.', project: 'POS System', progress: 85, status: 'active' },
  { name: 'Priya K.', project: 'School ERP', progress: 60, status: 'active' },
  { name: 'Rahul M.', project: 'Hospital', progress: 30, status: 'starting' }
];

const FranchiseDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(222,47%,4%)] via-[hsl(217,50%,8%)] to-[hsl(220,55%,6%)]">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} hidden lg:block`}>
        <div className="h-full glass-panel border-r border-border/30">
          {/* Logo */}
          <div className="p-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center cursor-pointer"
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
                    <p className="text-[10px] text-primary">Franchise Portal</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-3 space-y-1">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    activeItem === item.id
                      ? 'bg-primary/10 text-primary border-l-2 border-primary'
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
                    <span className="px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Collapse Button */}
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
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads, clients, projects..."
                  className="pl-10 bg-secondary/30 border-border/30"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* AI Help Button */}
              <motion.button
                className="relative p-2 rounded-lg bg-primary/10 border border-primary/30 text-primary"
                animate={{
                  boxShadow: [
                    '0 0 10px hsla(187, 100%, 50%, 0.2)',
                    '0 0 20px hsla(187, 100%, 50%, 0.4)',
                    '0 0 10px hsla(187, 100%, 50%, 0.2)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ scale: 1.05 }}
              >
                <Bot className="w-5 h-5" />
              </motion.button>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neon-red" />
              </button>

              {/* Avatar */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center text-background font-bold text-sm">
                  FV
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground">Franchise Partner</p>
                  <p className="text-xs text-muted-foreground">vala(franchise)***456</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-6 space-y-6">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl font-mono font-bold text-foreground">
                Welcome Back, <span className="text-primary">Partner</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your franchise is performing well. Here's your overview.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-primary/30 text-foreground">
                Export Report
              </Button>
              <Button className="bg-gradient-to-r from-primary to-neon-teal text-background">
                Add New Lead
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
                  className="glass-panel p-4 border border-border/30 hover:border-primary/30 transition-all group"
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
            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 glass-panel p-6 border border-border/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono font-semibold text-foreground">Recent Activity</h3>
                <Button variant="ghost" size="sm" className="text-primary">View All</Button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-4 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'lead' ? 'bg-primary' :
                      activity.type === 'demo' ? 'bg-neon-green' :
                      activity.type === 'payment' ? 'bg-neon-purple' :
                      'bg-neon-orange'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Developer Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6 border border-border/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono font-semibold text-foreground">Developer Status</h3>
                <motion.div
                  className="w-2 h-2 rounded-full bg-neon-green"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <div className="space-y-4">
                {developerStatus.map((dev, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-3 rounded-lg bg-secondary/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-neon-teal/50 flex items-center justify-center text-xs font-bold text-foreground">
                          {dev.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{dev.name}</p>
                          <p className="text-xs text-muted-foreground">{dev.project}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        dev.status === 'active' ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-orange/20 text-neon-orange'
                      }`}>
                        {dev.progress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-neon-teal rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${dev.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* AI Activity Indicator */}
          <motion.div
            className="fixed bottom-6 right-6 glass-panel px-4 py-3 rounded-full flex items-center gap-3 cursor-pointer hover:border-primary/50 border border-border/30 transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-3 h-3 rounded-full bg-neon-green"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm text-muted-foreground">AI Assistant Active</span>
            <Bot className="w-4 h-4 text-primary" />
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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center">
                    <Zap className="w-5 h-5 text-background" />
                  </div>
                  <div>
                    <p className="font-mono font-bold text-sm text-foreground">SOFTWARE VALA</p>
                    <p className="text-[10px] text-primary">Franchise Portal</p>
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
                            ? 'bg-primary/10 text-primary'
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

export default FranchiseDashboard;
