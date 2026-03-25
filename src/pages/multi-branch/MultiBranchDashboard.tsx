import {
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const stats = [
  {
    title: "Total Branches",
    value: "12",
    change: "+2",
    changeType: "positive",
    icon: Building2,
    color: "bg-blue-500",
  },
  {
    title: "Today's Revenue",
    value: "₹4,85,200",
    change: "+12.5%",
    changeType: "positive",
    icon: DollarSign,
    color: "bg-emerald-500",
  },
  {
    title: "Total Employees",
    value: "248",
    change: "+8",
    changeType: "positive",
    icon: Users,
    color: "bg-violet-500",
  },
  {
    title: "Monthly Growth",
    value: "23.5%",
    change: "+5.2%",
    changeType: "positive",
    icon: TrendingUp,
    color: "bg-amber-500",
  },
];

const revenueData = [
  { month: "Jan", branch1: 420000, branch2: 380000, branch3: 350000 },
  { month: "Feb", branch1: 450000, branch2: 400000, branch3: 380000 },
  { month: "Mar", branch1: 480000, branch2: 420000, branch3: 400000 },
  { month: "Apr", branch1: 520000, branch2: 450000, branch3: 420000 },
  { month: "May", branch1: 550000, branch2: 480000, branch3: 450000 },
  { month: "Jun", branch1: 600000, branch2: 520000, branch3: 480000 },
];

const branchPerformance = [
  {
    name: "Mumbai - HQ",
    revenue: "₹12,45,000",
    target: 85,
    status: "active",
    employees: 45,
    trend: "up",
  },
  {
    name: "Delhi Branch",
    revenue: "₹9,82,000",
    target: 72,
    status: "active",
    employees: 32,
    trend: "up",
  },
  {
    name: "Bangalore Branch",
    revenue: "₹8,56,000",
    target: 68,
    status: "active",
    employees: 28,
    trend: "down",
  },
  {
    name: "Chennai Branch",
    revenue: "₹7,24,000",
    target: 60,
    status: "hold",
    employees: 22,
    trend: "up",
  },
  {
    name: "Kolkata Branch",
    revenue: "₹6,18,000",
    target: 55,
    status: "active",
    employees: 18,
    trend: "down",
  },
];

const recentActivities = [
  { action: "New invoice created", branch: "Delhi", time: "2 min ago", type: "billing" },
  { action: "Employee added", branch: "Mumbai", time: "15 min ago", type: "employee" },
  { action: "Stock alert triggered", branch: "Bangalore", time: "1 hour ago", type: "inventory" },
  { action: "Branch status updated", branch: "Chennai", time: "2 hours ago", type: "branch" },
];

export default function MultiBranchDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Head Office Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of all branch operations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Download Report</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Add Branch</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={
                        stat.changeType === "positive"
                          ? "text-sm text-emerald-600"
                          : "text-sm text-red-600"
                      }
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-slate-400">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Revenue Comparison</CardTitle>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="branch1"
                    name="Mumbai"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="branch2"
                    name="Delhi"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="branch3"
                    name="Bangalore"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "billing"
                        ? "bg-blue-500"
                        : activity.type === "employee"
                        ? "bg-emerald-500"
                        : activity.type === "inventory"
                        ? "bg-amber-500"
                        : "bg-violet-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">{activity.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{activity.branch}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branch Performance */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Branch Performance</CardTitle>
            <Button variant="link" className="text-blue-600">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                    Branch
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                    Revenue
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                    Target Progress
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                    Employees
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {branchPerformance.map((branch, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-slate-900">{branch.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900">{branch.revenue}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Progress value={branch.target} className="h-2 w-24" />
                        <span className="text-sm text-slate-600">{branch.target}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">{branch.employees}</td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={branch.status === "active" ? "default" : "secondary"}
                        className={
                          branch.status === "active"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                        }
                      >
                        {branch.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {branch.trend === "up" ? (
                        <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
