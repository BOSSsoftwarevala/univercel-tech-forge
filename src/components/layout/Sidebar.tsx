import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Building2, 
  Users, 
  Code2, 
  TrendingUp, 
  HeadphonesIcon, 
  Search, 
  Megaphone,
  PlayCircle,
  ListTodo,
  Wallet,
  Heart,
  BarChart3,
  GraduationCap,
  Lightbulb,
  Bot,
  ShieldCheck,
  Scale,
  Eye,
  Plug,
  Globe,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import softwareValaLogo from '@/assets/software-vala-logo.png';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
  children?: MenuItem[];
  path?: string;
}

interface SidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
  collapsed: boolean;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard className="w-4 h-4" />, path: '/super-admin' },
  { 
    id: 'franchise', 
    label: 'Franchise Management', 
    icon: <Building2 className="w-4 h-4" />,
    badge: 42,
    badgeColor: 'bg-neon-cyan/20 text-neon-cyan',
    path: '/super-admin/franchise-manager'
  },
  { 
    id: 'reseller', 
    label: 'Reseller Management', 
    icon: <Users className="w-4 h-4" />,
    badge: 156,
    badgeColor: 'bg-neon-teal/20 text-neon-teal',
    path: '/super-admin/reseller-manager'
  },
  { 
    id: 'developer', 
    label: 'Developer Workforce', 
    icon: <Code2 className="w-4 h-4" />,
    badge: 28,
    badgeColor: 'bg-neon-purple/20 text-neon-purple',
    path: '/super-admin/developer-manager'
  },
  { 
    id: 'sales', 
    label: 'Sales Command Center', 
    icon: <TrendingUp className="w-4 h-4" />,
    badge: 'HOT',
    badgeColor: 'bg-neon-orange/20 text-neon-orange',
    path: '/sales-support'
  },
  { 
    id: 'support', 
    label: 'Support Command Center', 
    icon: <HeadphonesIcon className="w-4 h-4" />,
    badge: 23,
    badgeColor: 'bg-neon-red/20 text-neon-red',
    path: '/super-admin/support-center'
  },
  { id: 'seo', label: 'SEO & Marketing Hub', icon: <Search className="w-4 h-4" />, path: '/seo' },
  { id: 'influencer', label: 'Influencer Management', icon: <Megaphone className="w-4 h-4" />, path: '/super-admin/influencer-manager' },
  { 
    id: 'demo', 
    label: 'Demo Manager', 
    icon: <PlayCircle className="w-4 h-4" />,
    badge: '40+',
    badgeColor: 'bg-neon-green/20 text-neon-green',
    path: '/demo-manager'
  },
  { id: 'tasks', label: 'Task Manager & Timer', icon: <ListTodo className="w-4 h-4" />, path: '/task-manager' },
  { id: 'finance', label: 'Finance & Wallet Control', icon: <Wallet className="w-4 h-4" />, path: '/super-admin/finance-center' },
  { id: 'client-success', label: 'Client Success Center', icon: <Heart className="w-4 h-4" />, path: '/client-success' },
  { id: 'performance', label: 'Performance Manager', icon: <BarChart3 className="w-4 h-4" />, path: '/performance' },
  { id: 'talent', label: 'Talent & Training', icon: <GraduationCap className="w-4 h-4" />, path: '/hr' },
  { id: 'rnd', label: 'R&D Innovation Lab', icon: <Lightbulb className="w-4 h-4" />, path: '/rnd-dashboard' },
  { 
    id: 'ai', 
    label: 'AI Decision Engine', 
    icon: <Bot className="w-4 h-4" />,
    badge: 'AI',
    badgeColor: 'bg-primary/20 text-primary',
    path: '/ai-console'
  },
  { id: 'security', label: 'Security & Audit Logs', icon: <ShieldCheck className="w-4 h-4" />, path: '/super-admin/security-center' },
  { id: 'legal', label: 'Legal Compliance', icon: <Scale className="w-4 h-4" />, path: '/legal' },
  { id: 'data-masking', label: 'Data Masking & Identity', icon: <Eye className="w-4 h-4" />, path: '/super-admin/user-manager' },
  { id: 'integrations', label: 'Integrations & API', icon: <Plug className="w-4 h-4" />, path: '/api-integrations' },
  { id: 'language', label: 'Language & Currency', icon: <Globe className="w-4 h-4" />, path: '/system-settings' },
];

const Sidebar = ({ activeItem, onItemClick, collapsed }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      toggleExpand(item.id);
    } else {
      onItemClick(item.id);
      if (item.path) {
        navigate(item.path);
      }
    }
  };

  const isActive = (item: MenuItem) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    return activeItem === item.id;
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`fixed left-0 top-14 bottom-0 z-40 glass-panel border-r border-border/30 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <img 
            src={softwareValaLogo} 
            alt="Software Vala" 
            className={`${collapsed ? 'h-8' : 'h-10'} w-auto object-contain`}
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <div className="text-[10px] text-primary uppercase tracking-widest">Super Admin</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Menu Items */}
      <div className="overflow-y-auto h-[calc(100%-140px)] py-3 px-2 space-y-1">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <button
              onClick={() => handleItemClick(item)}
              className={`w-full ${isActive(item) ? 'sidebar-item-active' : 'sidebar-item'}`}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex items-center justify-between"
                  >
                    <span className="text-sm truncate">{item.label}</span>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                      {item.children && (
                        expandedItems.includes(item.id) 
                          ? <ChevronDown className="w-3.5 h-3.5" />
                          : <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Submenu */}
            <AnimatePresence>
              {!collapsed && item.children && expandedItems.includes(item.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-7 mt-1 space-y-1 overflow-hidden"
                >
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => onItemClick(child.id)}
                      className={`w-full ${activeItem === child.id ? 'sidebar-item-active' : 'sidebar-item'} text-sm`}
                    >
                      <div className="flex-shrink-0">{child.icon}</div>
                      <span className="truncate">{child.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-border/30 bg-background/80 backdrop-blur-sm">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;