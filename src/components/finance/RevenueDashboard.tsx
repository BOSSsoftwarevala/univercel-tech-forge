import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  RefreshCcw,
  Calendar,
  Download
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

const RevenueDashboard = () => {
  const revenueData = [
    { month: "Jan", revenue: 45000, expenses: 28000 },
    { month: "Feb", revenue: 52000, expenses: 31000 },
    { month: "Mar", revenue: 48000, expenses: 27000 },
    { month: "Apr", revenue: 61000, expenses: 34000 },
    { month: "May", revenue: 55000, expenses: 29000 },
    { month: "Jun", revenue: 67000, expenses: 36000 },
    { month: "Jul", revenue: 72000, expenses: 38000 },
    { month: "Aug", revenue: 69000, expenses: 35000 },
    { month: "Sep", revenue: 78000, expenses: 41000 },
    { month: "Oct", revenue: 84000, expenses: 44000 },
    { month: "Nov", revenue: 91000, expenses: 47000 },
    { month: "Dec", revenue: 98000, expenses: 52000 },
  ];

  const incomeBreakdown = [
    { name: "Lifetime Software", value: 398000, color: "#10b981" },
    { name: "SaaS Subscriptions", value: 284000, color: "#0ea5e9" },
    { name: "Services", value: 165000, color: "#8b5cf6" },
  ];

  const recentTransactions = [
    { id: "TXN-2035-001", type: "Income", description: "Lifetime License - ABC Corp", amount: 249, status: "completed", time: "2 min ago" },
    { id: "TXN-2035-002", type: "Commission", description: "Reseller Commission - John D.", amount: -37.35, status: "pending", time: "15 min ago" },
    { id: "TXN-2035-003", type: "Income", description: "SaaS Annual - XYZ Ltd", amount: 730, status: "completed", time: "1 hr ago" },
    { id: "TXN-2035-004", type: "Payout", description: "Developer Payment - Task #4521", amount: -150, status: "processing", time: "2 hr ago" },
    { id: "TXN-2035-005", type: "Income", description: "Lifetime License - DEF Inc", amount: 249, status: "completed", time: "3 hr ago" },
  ];

  const keyMetrics = [
    { 
      label: "Total Revenue", 
      value: "$847,293", 
      change: "+12.4%", 
      positive: true,
      icon: DollarSign,
      description: "All time revenue"
    },
    { 
      label: "Monthly Revenue", 
      value: "$98,421", 
      change: "+8.7%", 
      positive: true,
      icon: TrendingUp,
      description: "December 2035"
    },
    { 
      label: "Net Profit", 
      value: "$612,847", 
      change: "+15.2%", 
      positive: true,
      icon: ArrowUpRight,
      description: "After all deductions"
    },
    { 
      label: "Pending Collection", 
      value: "$24,150", 
      change: "-3.1%", 
      positive: false,
      icon: RefreshCcw,
      description: "Awaiting payment"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Revenue Dashboard</h1>
          <p className="text-slate-500 text-sm">Complete financial overview with real-time analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            This Month
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20">
                  <metric.icon className="w-5 h-5 text-cyan-600" />
                </div>
                <Badge 
                  variant={metric.positive ? "default" : "destructive"} 
                  className={`text-xs ${metric.positive ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' : ''}`}
                >
                  {metric.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {metric.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
                <p className="text-sm text-slate-500 mt-1">{metric.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', strokeWidth: 2 }}
                  name="Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2 }}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Income Breakdown */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Income Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={incomeBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {incomeBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {incomeBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">${(item.value / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" className="text-cyan-600">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((tx, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      tx.amount > 0 
                        ? 'bg-cyan-100 dark:bg-cyan-900/30' 
                        : 'bg-orange-100 dark:bg-orange-900/30'
                    }`}>
                      {tx.amount > 0 ? (
                        <ArrowDownRight className="w-4 h-4 text-cyan-600" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{tx.description}</p>
                    <p className="text-xs text-slate-500">{tx.id} • {tx.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        tx.status === 'completed' ? 'border-cyan-500 text-cyan-600' :
                      tx.status === 'pending' ? 'border-yellow-500 text-yellow-600' :
                      'border-blue-500 text-blue-600'
                    }`}
                  >
                    {tx.status}
                  </Badge>
                    <span className={`text-sm font-semibold ${
                      tx.amount > 0 ? 'text-cyan-600' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueDashboard;
