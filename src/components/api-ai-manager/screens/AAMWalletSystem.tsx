import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Wallet,
  DollarSign,
  CreditCard,
  FileText,
  Lock,
  Unlock,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  History,
  AlertTriangle
} from "lucide-react";

interface AAMWalletSystemProps {
  activeSubSection: string;
}

const AAMWalletSystem = ({ activeSubSection }: AAMWalletSystemProps) => {
  const handleAction = (action: string) => {
    toast.success(`${action} executed successfully`);
  };

  const walletStats = [
    { label: "Current Balance", value: "₹45,230", icon: <Wallet className="w-5 h-5" />, color: "from-emerald-500 to-teal-500" },
    { label: "Hold Amount", value: "₹5,000", icon: <Lock className="w-5 h-5" />, color: "from-yellow-500 to-orange-500" },
    { label: "Available Balance", value: "₹40,230", icon: <DollarSign className="w-5 h-5" />, color: "from-green-500 to-emerald-500" },
    { label: "This Month Spent", value: "₹78,230", icon: <ArrowUpRight className="w-5 h-5" />, color: "from-red-500 to-pink-500" },
  ];

  const recentTransactions = [
    { id: "TXN001", type: "debit", description: "OpenAI API Usage", amount: "-₹1,250", time: "2 hours ago", status: "completed" },
    { id: "TXN002", type: "credit", description: "UPI Add Money", amount: "+₹10,000", time: "5 hours ago", status: "completed" },
    { id: "TXN003", type: "debit", description: "WhatsApp API Usage", amount: "-₹820", time: "8 hours ago", status: "completed" },
    { id: "TXN004", type: "debit", description: "SMS API Usage", amount: "-₹450", time: "12 hours ago", status: "completed" },
    { id: "TXN005", type: "debit", description: "Vision AI Usage", amount: "-₹680", time: "1 day ago", status: "completed" },
    { id: "TXN006", type: "credit", description: "UPI Add Money", amount: "+₹25,000", time: "2 days ago", status: "completed" },
    { id: "TXN007", type: "hold", description: "Reserved for scheduled tasks", amount: "₹5,000", time: "3 days ago", status: "on_hold" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Wallet System</h1>
          <p className="text-slate-400 text-sm mt-1">UPI-based wallet for all API payments</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => handleAction("Add Money via UPI")}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Money (UPI)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("Lock Wallet")}
            className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
          >
            <Lock className="w-4 h-4 mr-2" />
            Lock Wallet
          </Button>
        </div>
      </div>

      {/* Wallet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {walletStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="p-4">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} w-fit mb-3`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Alert */}
      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-sm font-medium text-yellow-300">Wallet Rule Active</p>
              <p className="text-xs text-yellow-400/80">API costs are deducted from wallet. If balance reaches ₹0, all APIs will auto-stop.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Money Section */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-400" />
              Add Money via UPI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {["₹1,000", "₹5,000", "₹10,000", "₹25,000"].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  className="border-white/10 text-white hover:bg-purple-500/20 hover:border-purple-500/30"
                  onClick={() => handleAction(`Add ${amount}`)}
                >
                  {amount}
                </Button>
              ))}
            </div>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => handleAction("Custom Amount")}
            >
              Custom Amount
            </Button>
            <p className="text-xs text-slate-400 text-center">
              Payments via UPI only. No credit/debit cards or auto-debit.
            </p>
          </CardContent>
        </Card>

        {/* Wallet Actions */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              Wallet Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "View Wallet Ledger", icon: <FileText className="w-4 h-4" />, action: "View Ledger" },
              { label: "View Hold Amount", icon: <Lock className="w-4 h-4" />, action: "View Hold" },
              { label: "Lock Wallet", icon: <Lock className="w-4 h-4" />, action: "Lock Wallet" },
              { label: "Unlock Wallet", icon: <Unlock className="w-4 h-4" />, action: "Unlock Wallet" },
              { label: "Transaction History", icon: <History className="w-4 h-4" />, action: "View History" },
            ].map((item) => (
              <Button
                key={item.label}
                variant="outline"
                className="w-full justify-start border-white/10 text-slate-300 hover:bg-white/5"
                onClick={() => handleAction(item.action)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Low Balance Alert Config */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Alert Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
              <p className="text-xs text-slate-400 mb-2">Low Balance Alert</p>
              <p className="text-lg font-bold text-white">₹5,000</p>
              <p className="text-xs text-slate-500">Alert when balance falls below</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
              <p className="text-xs text-slate-400 mb-2">Critical Balance Alert</p>
              <p className="text-lg font-bold text-red-400">₹1,000</p>
              <p className="text-xs text-slate-500">Critical alert threshold</p>
            </div>
            <Button
              variant="outline"
              className="w-full border-white/10 text-slate-300 hover:bg-white/5"
              onClick={() => handleAction("Configure Alerts")}
            >
              Configure Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              Recent Transactions
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300"
              onClick={() => handleAction("View All Transactions")}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    txn.type === 'credit'
                      ? 'bg-green-500/20'
                      : txn.type === 'hold'
                      ? 'bg-yellow-500/20'
                      : 'bg-red-500/20'
                  }`}>
                    {txn.type === 'credit' ? (
                      <ArrowDownRight className={`w-4 h-4 text-green-400`} />
                    ) : txn.type === 'hold' ? (
                      <Lock className={`w-4 h-4 text-yellow-400`} />
                    ) : (
                      <ArrowUpRight className={`w-4 h-4 text-red-400`} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{txn.description}</p>
                    <p className="text-xs text-slate-400">{txn.id} • {txn.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    txn.type === 'credit'
                      ? 'text-green-400'
                      : txn.type === 'hold'
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}>
                    {txn.amount}
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      txn.status === 'completed'
                        ? 'text-green-400 border-green-400/30'
                        : 'text-yellow-400 border-yellow-400/30'
                    }
                  >
                    {txn.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AAMWalletSystem;
