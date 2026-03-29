import { motion } from "framer-motion";
import { 
  Wallet, TrendingUp, DollarSign, Clock, 
  CheckCircle, AlertCircle, ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LeadWalletPanel = () => {
  const walletStats = {
    totalEarned: 12450,
    pending: 2340,
    thisMonth: 3250,
    withdrawn: 8560,
  };

  const recentCredits = [
    { lead: "Ahmed Hassan", software: "POS System", amount: 150, status: "credited", date: "2 hours ago" },
    { lead: "Priya Sharma", software: "School Management", amount: 200, status: "pending", date: "Yesterday" },
    { lead: "Mohammed Al-Rashid", software: "Hospital ERP", amount: 350, status: "credited", date: "2 days ago" },
    { lead: "Sarah Chen", software: "Inventory System", amount: 120, status: "processing", date: "3 days ago" },
    { lead: "James Okonkwo", software: "Real Estate CRM", amount: 180, status: "credited", date: "4 days ago" },
  ];

  const pendingCommissions = [
    { lead: "Fatima Al-Said", software: "School Management", amount: 250, expectedDate: "In 3 days" },
    { lead: "Chen Wei", software: "POS System", amount: 180, expectedDate: "In 5 days" },
    { lead: "Abdul Rahman", software: "ERP Solutions", amount: 320, expectedDate: "In 7 days" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "credited":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "processing":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Wallet & Commissions</h2>
        <p className="text-slate-400">Track your earnings from lead conversions</p>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <Wallet className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">${walletStats.totalEarned.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Total Earned</p>
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
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-400">${walletStats.withdrawn.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Withdrawn</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Credits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Recent Credits
          </h3>
          <div className="space-y-3">
            {recentCredits.map((credit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-slate-800/50 rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-white">{credit.lead}</p>
                  <p className="text-xs text-slate-400">{credit.software}</p>
                  <p className="text-xs text-slate-500">{credit.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-400">+${credit.amount}</p>
                  <Badge className={getStatusStyle(credit.status)}>
                    {credit.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pending Commissions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            Pending Commissions
          </h3>
          <div className="space-y-3">
            {pendingCommissions.map((commission, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-white">{commission.lead}</p>
                  <p className="text-xs text-slate-400">{commission.software}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-yellow-400">${commission.amount}</p>
                  <p className="text-xs text-slate-500">{commission.expectedDate}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <Button className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-500">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Request Withdrawal
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default LeadWalletPanel;
