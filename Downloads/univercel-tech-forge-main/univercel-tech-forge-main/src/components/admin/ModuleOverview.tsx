import { motion } from "framer-motion";
import { 
  Building2, 
  Users, 
  Code2, 
  TrendingUp, 
  HeadphonesIcon,
  Search,
  Megaphone,
  Heart,
  BarChart3,
  Wallet,
  Lightbulb,
  ListTodo,
  ExternalLink,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Module {
  id: string;
  name: string;
  path: string;
  icon: any;
  status: "online" | "warning" | "offline";
  activeUsers: number;
  tasksToday: number;
  revenue?: string;
  color: string;
}

const modules: Module[] = [
  { 
    id: "franchise", 
    name: "Franchise Management", 
    path: "/franchise",
    icon: Building2, 
    status: "online", 
    activeUsers: 42, 
    tasksToday: 18,
    revenue: "$127.4K",
    color: "from-neon-cyan to-neon-teal" 
  },
  { 
    id: "reseller", 
    name: "Reseller Dashboard", 
    path: "/reseller-dashboard",
    icon: Users, 
    status: "online", 
    activeUsers: 156, 
    tasksToday: 89,
    revenue: "$84.2K",
    color: "from-neon-teal to-neon-green" 
  },
  { 
    id: "developer", 
    name: "Developer Workforce", 
    path: "/developer-dashboard",
    icon: Code2, 
    status: "online", 
    activeUsers: 28, 
    tasksToday: 127,
    color: "from-neon-purple to-neon-blue" 
  },
  { 
    id: "sales", 
    name: "Sales Command", 
    path: "/lead-manager",
    icon: TrendingUp, 
    status: "warning", 
    activeUsers: 15, 
    tasksToday: 45,
    revenue: "$234.8K",
    color: "from-neon-orange to-neon-red" 
  },
  { 
    id: "support", 
    name: "Support Center", 
    path: "/support-dashboard",
    icon: HeadphonesIcon, 
    status: "online", 
    activeUsers: 12, 
    tasksToday: 67,
    color: "from-neon-red to-neon-orange" 
  },
  { 
    id: "seo", 
    name: "SEO & Marketing", 
    path: "/seo-dashboard",
    icon: Search, 
    status: "online", 
    activeUsers: 8, 
    tasksToday: 34,
    color: "from-neon-blue to-neon-cyan" 
  },
  { 
    id: "influencer", 
    name: "Influencer Portal", 
    path: "/influencer-dashboard",
    icon: Megaphone, 
    status: "online", 
    activeUsers: 89, 
    tasksToday: 156,
    revenue: "$45.6K",
    color: "from-neon-purple to-neon-cyan" 
  },
  { 
    id: "client-success", 
    name: "Client Success", 
    path: "/client-success",
    icon: Heart, 
    status: "online", 
    activeUsers: 6, 
    tasksToday: 23,
    color: "from-neon-green to-neon-teal" 
  },
  { 
    id: "performance", 
    name: "Performance Manager", 
    path: "/performance",
    icon: BarChart3, 
    status: "online", 
    activeUsers: 4, 
    tasksToday: 12,
    color: "from-neon-cyan to-neon-green" 
  },
  { 
    id: "finance", 
    name: "Finance & Wallet", 
    path: "/finance",
    icon: Wallet, 
    status: "online", 
    activeUsers: 3, 
    tasksToday: 45,
    revenue: "$1.2M",
    color: "from-neon-teal to-neon-blue" 
  },
  { 
    id: "rnd", 
    name: "R&D Innovation Lab", 
    path: "/rnd-dashboard",
    icon: Lightbulb, 
    status: "online", 
    activeUsers: 5, 
    tasksToday: 8,
    color: "from-neon-orange to-neon-purple" 
  },
  { 
    id: "tasks", 
    name: "Task Manager", 
    path: "/task-manager",
    icon: ListTodo, 
    status: "online", 
    activeUsers: 48, 
    tasksToday: 234,
    color: "from-neon-green to-neon-cyan" 
  },
];

const ModuleOverview = () => {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4 text-neon-green" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-neon-orange" />;
      case "offline":
        return <XCircle className="w-4 h-4 text-neon-red" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-neon-green/20 border-neon-green/50";
      case "warning":
        return "bg-neon-orange/20 border-neon-orange/50";
      case "offline":
        return "bg-neon-red/20 border-neon-red/50";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">Module Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time status of all system modules</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-green/10 border border-neon-green/30">
            <Activity className="w-4 h-4 text-neon-green animate-pulse" />
            <span className="text-sm font-mono text-neon-green">12/12 ONLINE</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Active Users", value: "416", change: "+12%", color: "text-neon-cyan" },
          { label: "Tasks Today", value: "858", change: "+8%", color: "text-neon-green" },
          { label: "Total Revenue", value: "$1.69M", change: "+15%", color: "text-neon-teal" },
          { label: "System Uptime", value: "99.97%", change: "30 days", color: "text-neon-purple" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-4"
          >
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className={`text-2xl font-mono font-bold mt-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-neon-green mt-1">{stat.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-3 gap-4">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel p-4 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(module.path)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${getStatusColor(module.status)}`}>
                  {getStatusIcon(module.status)}
                  <span className="text-[10px] font-mono uppercase">{module.status}</span>
                </div>
              </div>

              <h3 className="font-mono font-semibold text-foreground mb-3">{module.name}</h3>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Active Users</div>
                  <div className="font-mono font-bold text-primary">{module.activeUsers}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Tasks Today</div>
                  <div className="font-mono font-bold text-neon-teal">{module.tasksToday}</div>
                </div>
              </div>

              {module.revenue && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <div className="text-muted-foreground text-xs">Revenue</div>
                  <div className="font-mono font-bold text-neon-green">{module.revenue}</div>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span>Open Module</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleOverview;
