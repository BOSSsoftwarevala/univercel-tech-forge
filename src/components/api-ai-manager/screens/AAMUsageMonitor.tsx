import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Gauge,
  Users,
  Package,
  AlertCircle,
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from "lucide-react";

interface AAMUsageMonitorProps {
  activeSubSection: string;
}

const AAMUsageMonitor = ({ activeSubSection }: AAMUsageMonitorProps) => {
  const handleAction = (action: string) => {
    toast.success(`${action} executed successfully`);
  };

  const realTimeStats = [
    { label: "Requests/Second", value: "247", change: "+12", icon: <Gauge className="w-5 h-5" />, color: "from-purple-500 to-indigo-500" },
    { label: "Active Users", value: "1,234", change: "+45", icon: <Users className="w-5 h-5" />, color: "from-blue-500 to-cyan-500" },
    { label: "Active Products", value: "28", change: "0", icon: <Package className="w-5 h-5" />, color: "from-green-500 to-emerald-500" },
    { label: "Failed Requests", value: "12", change: "-3", icon: <AlertCircle className="w-5 h-5" />, color: "from-red-500 to-pink-500" },
    { label: "Avg Latency", value: "145ms", change: "-8ms", icon: <Clock className="w-5 h-5" />, color: "from-orange-500 to-amber-500" },
    { label: "Queue Size", value: "89", change: "+5", icon: <Activity className="w-5 h-5" />, color: "from-slate-500 to-slate-600" },
  ];

  const topUsers = [
    { id: "USR001", name: "John Doe", role: "Admin", requests: "12,450", cost: "₹3,120" },
    { id: "USR002", name: "Jane Smith", role: "Developer", requests: "8,320", cost: "₹2,080" },
    { id: "USR003", name: "Bob Wilson", role: "Reseller", requests: "6,150", cost: "₹1,538" },
    { id: "USR004", name: "Alice Brown", role: "User", requests: "4,280", cost: "₹1,070" },
    { id: "USR005", name: "Charlie Davis", role: "Franchise", requests: "3,890", cost: "₹973" },
  ];

  const topProducts = [
    { name: "CRM System", requests: "45,230", cost: "₹11,308", trend: "up" },
    { name: "E-Commerce App", requests: "32,100", cost: "₹8,025", trend: "up" },
    { name: "Analytics Dashboard", requests: "28,450", cost: "₹7,113", trend: "down" },
    { name: "Mobile App", requests: "22,800", cost: "₹5,700", trend: "up" },
    { name: "Support Portal", requests: "18,500", cost: "₹4,625", trend: "stable" },
  ];

  const failedRequests = [
    { api: "OpenAI GPT-4", error: "Rate limit exceeded", count: 45, time: "2 min ago" },
    { api: "SMS API", error: "Timeout", count: 23, time: "5 min ago" },
    { api: "Payment Gateway", error: "Invalid token", count: 12, time: "12 min ago" },
    { api: "Email API", error: "Server error", count: 8, time: "1 hour ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">API Usage Monitor</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time API usage tracking and monitoring</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction("Refresh Data")}
          className="border-white/20 text-slate-300 hover:bg-white/10"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {realTimeStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="p-4">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} w-fit mb-3`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <Badge
                    variant="outline"
                    className={
                      stat.change.startsWith('+')
                        ? 'text-green-400 border-green-400/30'
                        : stat.change.startsWith('-')
                        ? 'text-red-400 border-red-400/30'
                        : 'text-slate-400 border-slate-400/30'
                    }
                  >
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Top Users by Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-sm font-medium w-6">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.role} • {user.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user.requests}</p>
                    <p className="text-xs text-slate-400">{user.cost}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              Top Products by Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-sm font-medium w-6">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{product.name}</p>
                      <p className="text-xs text-slate-400">{product.requests} requests</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{product.cost}</p>
                    {product.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                    {product.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Failed Requests */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            Recent Failed Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {failedRequests.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-white">{item.api}</p>
                  <Badge variant="outline" className="text-red-400 border-red-400/30">
                    {item.count}
                  </Badge>
                </div>
                <p className="text-xs text-red-300">{item.error}</p>
                <p className="text-xs text-slate-400 mt-2">{item.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AAMUsageMonitor;
