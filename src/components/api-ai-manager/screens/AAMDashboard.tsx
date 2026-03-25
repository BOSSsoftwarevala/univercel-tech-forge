import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plug,
  Power,
  Bot,
  Clock,
  DollarSign,
  Wallet,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  History,
  BarChart3
} from "lucide-react";

interface AAMDashboardProps {
  activeSubSection: string;
}

const AAMDashboard = ({ activeSubSection }: AAMDashboardProps) => {
  const handleAction = (action: string) => {
    toast.success(`${action} executed successfully`);
  };

  const stats = [
    { label: "Total APIs Connected", value: "47", icon: <Plug className="w-5 h-5" />, color: "from-blue-500 to-cyan-500", change: "+3" },
    { label: "Active APIs", value: "42", icon: <Power className="w-5 h-5" />, color: "from-green-500 to-emerald-500", change: "+2" },
    { label: "Inactive APIs", value: "5", icon: <Power className="w-5 h-5" />, color: "from-slate-500 to-slate-600", change: "-1" },
    { label: "AI APIs", value: "18", icon: <Bot className="w-5 h-5" />, color: "from-purple-500 to-indigo-500", change: "+1" },
    { label: "Today Usage", value: "12,450", icon: <Clock className="w-5 h-5" />, color: "from-orange-500 to-amber-500", change: "+15%" },
    { label: "Monthly Cost", value: "₹78,230", icon: <DollarSign className="w-5 h-5" />, color: "from-red-500 to-pink-500", change: "+8%" },
    { label: "Wallet Balance", value: "₹45,230", icon: <Wallet className="w-5 h-5" />, color: "from-emerald-500 to-teal-500", change: "-₹2,100" },
    { label: "Risk Alerts", value: "3", icon: <AlertTriangle className="w-5 h-5" />, color: "from-yellow-500 to-orange-500", change: "+1" },
  ];

  const topAPIs = [
    { name: "OpenAI GPT-4", requests: "45,230", cost: "₹12,450", status: "active" },
    { name: "WhatsApp Business", requests: "32,100", cost: "₹8,200", status: "active" },
    { name: "Razorpay", requests: "28,450", cost: "₹5,600", status: "active" },
    { name: "Vision AI", requests: "15,200", cost: "₹4,300", status: "active" },
    { name: "SendGrid Email", requests: "12,800", cost: "₹2,100", status: "warning" },
  ];

  const recentAlerts = [
    { type: "warning", message: "OpenAI usage 85% of daily limit", time: "5 min ago" },
    { type: "error", message: "SMS API rate limit exceeded", time: "12 min ago" },
    { type: "info", message: "Wallet balance low - Add funds", time: "1 hour ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">API & AI Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Complete API & AI management overview</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("Refresh Dashboard")}
            className="border-white/20 text-slate-300 hover:bg-white/10"
          >
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => handleAction("View Full Report")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Full Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-white/10 hover:border-purple-500/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <Badge variant="outline" className={`text-xs ${stat.change.startsWith('+') ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}>
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top APIs */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Top APIs by Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topAPIs.map((api, index) => (
                <div
                  key={api.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-sm font-medium">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{api.name}</p>
                      <p className="text-xs text-slate-400">{api.requests} requests</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{api.cost}</p>
                    <Badge
                      variant="outline"
                      className={api.status === 'active' ? 'text-green-400 border-green-400/30' : 'text-yellow-400 border-yellow-400/30'}
                    >
                      {api.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              onClick={() => handleAction("View All APIs")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View All APIs
            </Button>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    alert.type === 'error'
                      ? 'bg-red-500/10 border-red-500/30'
                      : alert.type === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-white">{alert.message}</p>
                    <span className="text-xs text-slate-400">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              onClick={() => handleAction("View All Alerts")}
            >
              <History className="w-4 h-4 mr-2" />
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: "Add Money", icon: <Wallet className="w-4 h-4" /> },
              { label: "View Usage", icon: <Activity className="w-4 h-4" /> },
              { label: "API Settings", icon: <Plug className="w-4 h-4" /> },
              { label: "Cost Report", icon: <DollarSign className="w-4 h-4" /> },
              { label: "Kill Switch", icon: <Power className="w-4 h-4" /> },
              { label: "View Logs", icon: <History className="w-4 h-4" /> },
            ].map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto py-3 flex-col gap-2 border-white/10 text-slate-300 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-white"
                onClick={() => handleAction(action.label)}
              >
                {action.icon}
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AAMDashboard;
