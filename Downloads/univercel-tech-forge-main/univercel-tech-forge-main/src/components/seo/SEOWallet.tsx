import { motion } from "framer-motion";
import { 
  Wallet, TrendingUp, DollarSign, Target, 
  Link2, Wrench, Globe, PieChart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const SEOWallet = () => {
  const budget = {
    total: 5000,
    spent: 3250,
    remaining: 1750
  };

  const expenses = [
    { category: "Paid Ads", amount: 1200, icon: Target, color: "#06b6d4" },
    { category: "SEO Tools", amount: 450, icon: Wrench, color: "#8b5cf6" },
    { category: "Domains", amount: 300, icon: Globe, color: "#f59e0b" },
    { category: "Backlinks", amount: 800, icon: Link2, color: "#10b981" },
    { category: "Content", amount: 500, icon: DollarSign, color: "#ec4899" },
  ];

  const roiData = [
    { keyword: "pos software africa", spend: 200, leads: 45, roi: 225 },
    { keyword: "hospital software dubai", spend: 350, leads: 62, roi: 177 },
    { keyword: "school management kenya", spend: 150, leads: 38, roi: 253 },
    { keyword: "erp solutions india", spend: 280, leads: 51, roi: 182 },
  ];

  const monthlyData = [
    { month: "Jan", budget: 4500, spent: 4200 },
    { month: "Feb", budget: 4800, spent: 4600 },
    { month: "Mar", budget: 5000, spent: 4900 },
    { month: "Apr", budget: 5000, spent: 3800 },
    { month: "May", budget: 5200, spent: 4100 },
    { month: "Jun", budget: 5000, spent: 3250 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">SEO Wallet & Budget Tracking</h2>
        <p className="text-slate-400">Track costs, ROI, and optimize spending</p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <Wallet className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Budget</p>
              <p className="text-2xl font-bold text-white">${budget.total.toLocaleString()}</p>
            </div>
          </div>
          <Progress value={(budget.spent / budget.total) * 100} className="h-2" />
          <p className="text-xs text-slate-400 mt-2">{((budget.spent / budget.total) * 100).toFixed(0)}% utilized</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Spent</p>
              <p className="text-2xl font-bold text-red-400">${budget.spent.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Remaining</p>
              <p className="text-2xl font-bold text-green-400">${budget.remaining.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-400" />
            Expense Breakdown
          </h3>
          <div className="space-y-4">
            {expenses.map((expense, index) => (
              <motion.div
                key={expense.category}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${expense.color}20` }}
                >
                  <expense.icon className="w-5 h-5" style={{ color: expense.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">{expense.category}</span>
                    <span className="text-sm font-medium text-white">${expense.amount}</span>
                  </div>
                  <Progress 
                    value={(expense.amount / budget.spent) * 100} 
                    className="h-2"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Budget vs Spend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1e293b", 
                  border: "1px solid #334155",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="budget" fill="#06b6d4" name="Budget" />
              <Bar dataKey="spent" fill="#8b5cf6" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ROI per Keyword */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          ROI per Keyword
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {roiData.map((item, index) => (
            <motion.div
              key={item.keyword}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-slate-800/50 rounded-lg"
            >
              <p className="text-sm text-white mb-3 truncate">{item.keyword}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-red-400">${item.spend}</p>
                  <p className="text-xs text-slate-400">Spend</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-cyan-400">{item.leads}</p>
                  <p className="text-xs text-slate-400">Leads</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-400">{item.roi}%</p>
                  <p className="text-xs text-slate-400">ROI</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* AI Suggestion */}
        <div className="mt-4 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
          <p className="text-sm text-cyan-300">
            💡 <strong>AI Suggestion:</strong> Increase budget for "school management kenya" — highest ROI at 253%
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SEOWallet;
