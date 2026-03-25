import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, CreditCard, ArrowUpRight, ArrowDownRight, TrendingUp,
  DollarSign, IndianRupee, RefreshCw, Download, Plus,
  BarChart3, PieChart, Calendar, Filter, Eye, EyeOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CombinedWallet = () => {
  const [showBalance, setShowBalance] = useState(true);

  const walletStats = [
    { label: "Total Balance", value: "₹12,45,892", change: "+₹2,45,000", trend: "up", icon: Wallet },
    { label: "Ad Spend (MTD)", value: "₹4,52,840", change: "-₹52,840", trend: "down", icon: CreditCard },
    { label: "Revenue Generated", value: "₹28,42,500", change: "+₹8,42,500", trend: "up", icon: TrendingUp },
    { label: "ROI", value: "628%", change: "+48%", trend: "up", icon: BarChart3 },
  ];

  const transactions = [
    { id: 1, type: "credit", description: "Lead Conversion Commission", amount: "₹15,000", date: "Dec 23, 2024", status: "completed", category: "commission" },
    { id: 2, type: "debit", description: "Meta Ads - Campaign Q4", amount: "₹25,420", date: "Dec 22, 2024", status: "completed", category: "ads" },
    { id: 3, type: "debit", description: "Google Ads - Search", amount: "₹18,500", date: "Dec 22, 2024", status: "completed", category: "ads" },
    { id: 4, type: "credit", description: "SEO Performance Bonus", amount: "₹50,000", date: "Dec 21, 2024", status: "completed", category: "bonus" },
    { id: 5, type: "debit", description: "Email Marketing Tool", amount: "₹4,999", date: "Dec 20, 2024", status: "completed", category: "tools" },
    { id: 6, type: "credit", description: "Content Monetization", amount: "₹8,500", date: "Dec 19, 2024", status: "pending", category: "revenue" },
  ];

  const budgetAllocations = [
    { category: "Meta Ads", allocated: 200000, spent: 152840, remaining: 47160, color: "bg-blue-500" },
    { category: "Google Ads", allocated: 180000, spent: 142520, remaining: 37480, color: "bg-yellow-500" },
    { category: "Content Marketing", allocated: 50000, spent: 32500, remaining: 17500, color: "bg-green-500" },
    { category: "Email Marketing", allocated: 30000, spent: 24999, remaining: 5001, color: "bg-orange-500" },
    { category: "Tools & Software", allocated: 40000, spent: 28400, remaining: 11600, color: "bg-purple-500" },
  ];

  const monthlySpend = [
    { month: "Jul", amount: 285000 },
    { month: "Aug", amount: 312000 },
    { month: "Sep", amount: 298000 },
    { month: "Oct", amount: 345000 },
    { month: "Nov", amount: 380000 },
    { month: "Dec", amount: 452840 },
  ];

  const maxSpend = Math.max(...monthlySpend.map(m => m.amount));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30">
              <Wallet className="h-6 w-6 text-emerald-400" />
            </div>
            Combined Wallet
          </h1>
          <p className="text-muted-foreground mt-1">Unified financial overview for SEO & Marketing</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-emerald-500/30 text-emerald-400" onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showBalance ? "Hide" : "Show"} Balance
          </Button>
          <Button variant="outline" className="border-emerald-500/30 text-emerald-400">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950">
            <Plus className="w-4 h-4 mr-2" />
            Add Funds
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {walletStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-emerald-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <stat.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                    {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-white">
                    {showBalance ? stat.value : "••••••"}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-emerald-500/20 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-emerald-300">Recent Transactions</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-emerald-400">
                    <Filter className="w-4 h-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="ghost" size="sm" className="text-emerald-400">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  className="p-4 bg-slate-800/30 rounded-lg border border-emerald-500/10 hover:border-emerald-500/30 transition-all"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${tx.type === "credit" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                        {tx.type === "credit" ? (
                          <ArrowDownRight className="w-5 h-5 text-green-400" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{tx.description}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{tx.category}</Badge>
                          <span className="text-xs text-muted-foreground">{tx.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                        {tx.type === "credit" ? "+" : "-"}{showBalance ? tx.amount : "••••"}
                      </p>
                      <Badge className={tx.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Budget & Spend */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-emerald-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-emerald-300">Budget Allocation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgetAllocations.map((budget) => (
                <div key={budget.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{budget.category}</span>
                    <span className="text-emerald-400">₹{(budget.remaining / 1000).toFixed(1)}K left</span>
                  </div>
                  <Progress 
                    value={(budget.spent / budget.allocated) * 100} 
                    className="h-2 bg-slate-700"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>₹{(budget.spent / 1000).toFixed(0)}K spent</span>
                    <span>₹{(budget.allocated / 1000).toFixed(0)}K budget</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-emerald-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-emerald-300">Monthly Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-40 gap-2">
                {monthlySpend.map((month) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center">
                    <motion.div
                      className="w-full bg-gradient-to-t from-emerald-500/50 to-teal-500/50 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${(month.amount / maxSpend) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                    <span className="text-xs text-muted-foreground mt-2">{month.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CombinedWallet;
