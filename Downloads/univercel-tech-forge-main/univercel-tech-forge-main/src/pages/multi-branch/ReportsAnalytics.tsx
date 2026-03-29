import { useState } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const monthlyRevenue = [
  { month: "Jan", revenue: 4200000, expenses: 2800000, profit: 1400000 },
  { month: "Feb", revenue: 4500000, expenses: 2900000, profit: 1600000 },
  { month: "Mar", revenue: 4800000, expenses: 3100000, profit: 1700000 },
  { month: "Apr", revenue: 5200000, expenses: 3300000, profit: 1900000 },
  { month: "May", revenue: 5500000, expenses: 3400000, profit: 2100000 },
  { month: "Jun", revenue: 6000000, expenses: 3600000, profit: 2400000 },
];

const branchComparison = [
  { branch: "Mumbai", revenue: 1245000, target: 1500000 },
  { branch: "Delhi", revenue: 982000, target: 1200000 },
  { branch: "Bangalore", revenue: 856000, target: 1000000 },
  { branch: "Chennai", revenue: 724000, target: 900000 },
  { branch: "Kolkata", revenue: 618000, target: 800000 },
];

const expenseBreakdown = [
  { name: "Salaries", value: 45, color: "#3b82f6" },
  { name: "Rent", value: 20, color: "#10b981" },
  { name: "Utilities", value: 10, color: "#f59e0b" },
  { name: "Marketing", value: 15, color: "#8b5cf6" },
  { name: "Others", value: 10, color: "#6b7280" },
];

const profitLoss = [
  {
    branch: "Mumbai - HQ",
    revenue: "₹12,45,000",
    expenses: "₹8,20,000",
    profit: "₹4,25,000",
    margin: "34.1%",
    trend: "up",
  },
  {
    branch: "Delhi Branch",
    revenue: "₹9,82,000",
    expenses: "₹6,50,000",
    profit: "₹3,32,000",
    margin: "33.8%",
    trend: "up",
  },
  {
    branch: "Bangalore Branch",
    revenue: "₹8,56,000",
    expenses: "₹5,80,000",
    profit: "₹2,76,000",
    margin: "32.2%",
    trend: "down",
  },
  {
    branch: "Chennai Branch",
    revenue: "₹7,24,000",
    expenses: "₹5,10,000",
    profit: "₹2,14,000",
    margin: "29.6%",
    trend: "up",
  },
  {
    branch: "Kolkata Branch",
    revenue: "₹6,18,000",
    expenses: "₹4,50,000",
    profit: "₹1,68,000",
    margin: "27.2%",
    trend: "down",
  },
];

export default function ReportsAnalytics() {
  const [period, setPeriod] = useState("month");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500 mt-1">Comprehensive business insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px] bg-white">
              <Calendar className="h-4 w-4 mr-2 text-slate-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₹44.25L</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-emerald-600">+18.2%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Expenses</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₹30.10L</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">+8.5%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Net Profit</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">₹14.15L</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-emerald-600">+24.3%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Profit Margin</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">31.9%</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-emerald-600">+2.1%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="branch">Branch Comparison</TabsTrigger>
          <TabsTrigger value="profit">Profit & Loss</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue vs Expenses Chart */}
            <Card className="lg:col-span-2 border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `₹${v / 100000}L`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`₹${(value / 100000).toFixed(1)}L`, ""]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        name="Expenses"
                        stroke="#ef4444"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        name="Profit"
                        stroke="#10b981"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Expense Breakdown */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseBreakdown}
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {expenseBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {expenseBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-slate-600">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branch" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Branch Revenue vs Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchComparison} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(v) => `₹${v / 100000}L`}
                    />
                    <YAxis type="category" dataKey="branch" stroke="#64748b" fontSize={12} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`₹${(value / 100000).toFixed(2)}L`, ""]}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Profit & Loss by Branch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Branch
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-medium text-slate-500">
                        Revenue
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-medium text-slate-500">
                        Expenses
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-medium text-slate-500">
                        Profit
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-medium text-slate-500">
                        Margin
                      </th>
                      <th className="text-center py-4 px-4 text-sm font-medium text-slate-500">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {profitLoss.map((item) => (
                      <tr key={item.branch} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="font-medium text-slate-900">{item.branch}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-slate-900">
                          {item.revenue}
                        </td>
                        <td className="py-4 px-4 text-right text-red-600">{item.expenses}</td>
                        <td className="py-4 px-4 text-right font-semibold text-emerald-600">
                          {item.profit}
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-slate-900">
                          {item.margin}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {item.trend === "up" ? (
                            <ArrowUpRight className="h-5 w-5 text-emerald-500 mx-auto" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5 text-red-500 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-semibold">
                      <td className="py-4 px-4 text-slate-900">Total</td>
                      <td className="py-4 px-4 text-right text-slate-900">₹44,25,000</td>
                      <td className="py-4 px-4 text-right text-red-600">₹30,10,000</td>
                      <td className="py-4 px-4 text-right text-emerald-600">₹14,15,000</td>
                      <td className="py-4 px-4 text-right text-slate-900">31.9%</td>
                      <td className="py-4 px-4 text-center">
                        <ArrowUpRight className="h-5 w-5 text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
