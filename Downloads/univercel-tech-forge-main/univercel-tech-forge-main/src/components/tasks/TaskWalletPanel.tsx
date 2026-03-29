import { motion } from "framer-motion";
import { 
  Wallet, TrendingUp, DollarSign, Clock, 
  CheckCircle, AlertCircle, ArrowUpRight, Minus, Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TaskWalletPanel = () => {
  const walletStats = {
    totalBilled: 18750,
    pending: 3240,
    thisMonth: 4850,
    deducted: 1250,
  };

  const billableTransactions = [
    { task: "POS Module Enhancement", type: "credit", amount: 450, status: "completed", date: "Today" },
    { task: "Hospital Dashboard Bug Fix", type: "credit", amount: 280, status: "pending", date: "Yesterday" },
    { task: "School ERP Integration", type: "credit", amount: 890, status: "completed", date: "2 days ago" },
    { task: "Client Revision Request", type: "debit", amount: 150, status: "deducted", date: "3 days ago" },
    { task: "Real Estate CRM Module", type: "credit", amount: 520, status: "completed", date: "4 days ago" },
  ];

  const pendingTasks = [
    { task: "Mobile App Testing", amount: 320, dueIn: "2 days" },
    { task: "API Integration Review", amount: 450, dueIn: "4 days" },
    { task: "Database Optimization", amount: 680, dueIn: "1 week" },
  ];

  const getTransactionStyle = (type: string) => {
    return type === "credit" 
      ? { color: "text-green-400", icon: Plus, bg: "bg-green-500/10" }
      : { color: "text-red-400", icon: Minus, bg: "bg-red-500/10" };
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "deducted":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Task Wallet</h2>
        <p className="text-slate-400">Billable tasks & commission tracking</p>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl border border-violet-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-violet-500/20 rounded-xl">
              <Wallet className="w-6 h-6 text-violet-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">${walletStats.totalBilled.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Total Billed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-400">${walletStats.pending.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Pending</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-400">${walletStats.thisMonth.toLocaleString()}</p>
          <p className="text-sm text-slate-400">This Month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-400">${walletStats.deducted.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Deducted</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Transaction History
          </h3>
          <div className="space-y-3">
            {billableTransactions.map((tx, index) => {
              const style = getTransactionStyle(tx.type);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 ${style.bg} rounded-xl flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${style.bg}`}>
                      <style.icon className={`w-4 h-4 ${style.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{tx.task}</p>
                      <p className="text-xs text-slate-400">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${style.color}`}>
                      {tx.type === "credit" ? "+" : "-"}${tx.amount}
                    </p>
                    <Badge className={getStatusStyle(tx.status)}>
                      {tx.status}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Pending Billable Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            Pending Billable Tasks
          </h3>
          <div className="space-y-3">
            {pendingTasks.map((task, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{task.task}</p>
                    <p className="text-xs text-slate-400">Due in {task.dueIn}</p>
                  </div>
                  <p className="text-lg font-bold text-yellow-400">${task.amount}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl border border-violet-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Total Pending</span>
              <span className="text-xl font-bold text-violet-400">
                ${pendingTasks.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-500">Auto-credited upon task completion</p>
          </div>

          <Button className="w-full mt-4 bg-gradient-to-r from-violet-500 to-purple-600">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            View Full Report
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default TaskWalletPanel;
