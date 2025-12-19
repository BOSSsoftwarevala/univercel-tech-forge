import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Receipt, 
  Download,
  CreditCard,
  Building2,
  Clock
} from "lucide-react";

const WalletHistory = () => {
  const transactions = [
    { id: 1, type: "credit", amount: 50000, description: "Wallet Top-up", date: "Dec 18, 2024", status: "completed" },
    { id: 2, type: "debit", amount: 25000, description: "Payment Gateway Module", date: "Dec 15, 2024", status: "completed" },
    { id: 3, type: "debit", amount: 15000, description: "UI Customization", date: "Dec 10, 2024", status: "completed" },
    { id: 4, type: "debit", amount: 5000, description: "Priority Hosting - 1 Month", date: "Dec 5, 2024", status: "completed" },
    { id: 5, type: "pending", amount: 8000, description: "AI Feature Add-on", date: "Dec 19, 2024", status: "pending" },
  ];

  return (
    <Card className="bg-gradient-to-br from-stone-900/90 to-stone-950/90 border-amber-500/20 backdrop-blur-xl">
      <CardHeader className="border-b border-amber-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-400" />
            Wallet & Invoices
          </CardTitle>
          <Button className="bg-amber-500 hover:bg-amber-600 text-stone-900">
            <Plus className="w-4 h-4 mr-2" />
            Add Funds
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <Wallet className="w-8 h-8 text-amber-400" />
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40">Prime</Badge>
            </div>
            <p className="text-sm text-amber-500/70">Available Balance</p>
            <p className="text-3xl font-bold text-amber-200">₹42,500</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-stone-800/50 border border-stone-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <ArrowUpRight className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-sm text-stone-500">Total Spent</p>
            <p className="text-3xl font-bold text-stone-200">₹1,25,000</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-stone-800/50 border border-stone-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-sm text-stone-500">Pending</p>
            <p className="text-3xl font-bold text-stone-200">₹8,000</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <Button variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Invoice
          </Button>
          <Button variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
            <Receipt className="w-4 h-4 mr-2" />
            View All Invoices
          </Button>
          <Button variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
            <Building2 className="w-4 h-4 mr-2" />
            GST Documents
          </Button>
        </div>

        {/* Transaction History */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-stone-400 uppercase tracking-wide">Recent Transactions</h4>
          
          {transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-stone-800/30 border border-stone-700/30 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tx.type === "credit" 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : tx.type === "pending"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : tx.type === "pending" ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-stone-200 font-medium">{tx.description}</h5>
                    <p className="text-sm text-stone-500">{tx.date}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold ${
                    tx.type === "credit" ? "text-emerald-400" : tx.type === "pending" ? "text-blue-400" : "text-stone-300"
                  }`}>
                    {tx.type === "credit" ? "+" : tx.type === "pending" ? "" : "-"}₹{tx.amount.toLocaleString()}
                  </p>
                  <Badge className={
                    tx.status === "completed" 
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" 
                      : "bg-blue-500/20 text-blue-400 border-blue-500/40"
                  }>
                    {tx.status}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Invoice Download Section */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-amber-200 font-medium">Latest Invoice Ready</h4>
              <p className="text-sm text-stone-500">Invoice #INV-2024-1218 • ₹25,000</p>
            </div>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-stone-900">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletHistory;
