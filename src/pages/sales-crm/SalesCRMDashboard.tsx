import { motion } from "framer-motion";
import { 
  Users, 
  Trophy, 
  XCircle, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const stats = [
  { 
    label: "New Leads Today", 
    value: "24", 
    change: "+12%", 
    trend: "up",
    icon: Users,
    color: "blue"
  },
  { 
    label: "Deals Won", 
    value: "₹4.2L", 
    change: "+8%", 
    trend: "up",
    icon: Trophy,
    color: "green"
  },
  { 
    label: "Deals Lost", 
    value: "3", 
    change: "-2%", 
    trend: "down",
    icon: XCircle,
    color: "red"
  },
  { 
    label: "Pending Follow-ups", 
    value: "18", 
    change: "+5", 
    trend: "up",
    icon: Clock,
    color: "orange"
  },
];

const recentLeads = [
  { name: "Rahul Sharma", source: "Website", status: "New", time: "10 min ago" },
  { name: "Priya Patel", source: "WhatsApp", status: "Contacted", time: "25 min ago" },
  { name: "Amit Kumar", source: "Call", status: "Qualified", time: "1 hour ago" },
  { name: "Sneha Gupta", source: "Website", status: "New", time: "2 hours ago" },
];

const funnelData = [
  { stage: "Leads", count: 156, percentage: 100, color: "bg-blue-500" },
  { stage: "Contacted", count: 98, percentage: 63, color: "bg-indigo-500" },
  { stage: "Qualified", count: 54, percentage: 35, color: "bg-purple-500" },
  { stage: "Proposal", count: 28, percentage: 18, color: "bg-pink-500" },
  { stage: "Closed", count: 12, percentage: 8, color: "bg-green-500" },
];

const SalesCRMDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's your sales overview.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            This Month
          </Button>
          <Button className="gap-2 bg-blue-500 hover:bg-blue-600">
            <Users className="w-4 h-4" />
            Add Lead
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
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'green' ? 'bg-green-100' :
                    stat.color === 'red' ? 'bg-red-100' : 'bg-orange-100'
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'red' ? 'text-red-600' : 'text-orange-600'
                    }`} />
                  </div>
                  <span className={`flex items-center text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                    {stat.trend === 'up' ? 
                      <ArrowUpRight className="w-4 h-4 ml-1" /> : 
                      <ArrowDownRight className="w-4 h-4 ml-1" />
                    }
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Funnel */}
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Target className="w-5 h-5 text-blue-500" />
              Sales Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((item, index) => (
                <motion.div
                  key={item.stage}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{item.stage}</span>
                    <span className="text-sm text-slate-500">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="h-8 bg-slate-100 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full ${item.color} flex items-center justify-end pr-3`}
                    >
                      <span className="text-xs font-medium text-white">{item.count}</span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-slate-800">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Recent Leads
              </span>
              <Button variant="ghost" size="sm" className="text-blue-600">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                    {lead.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.source} • {lead.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.status === 'New' ? 'bg-blue-100 text-blue-600' :
                    lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {lead.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Target */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Monthly Sales Target
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Progress</span>
                <span className="text-sm font-medium text-slate-800">₹8.4L / ₹12L</span>
              </div>
              <Progress value={70} className="h-4 bg-slate-200" />
              <p className="text-sm text-slate-500 mt-2">70% achieved • 12 days remaining</p>
            </div>
            <div className="text-center px-8 border-l border-slate-200">
              <p className="text-4xl font-bold text-green-600">₹8.4L</p>
              <p className="text-sm text-slate-500 mt-1">Sales This Month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesCRMDashboard;
