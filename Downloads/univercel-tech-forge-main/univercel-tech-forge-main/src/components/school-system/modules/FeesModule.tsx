/**
 * Fees Management Module
 * Fee collection, tracking, and reporting
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, Receipt, CreditCard, Wallet,
  Search, Filter, Download, Plus, CheckCircle, AlertCircle, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSchoolData } from "@/hooks/useSchoolData";
import { toast } from "sonner";

export const FeesModule = () => {
  const { students, feePayments, stats } = useSchoolData();
  const [searchQuery, setSearchQuery] = useState("");

  const totalExpected = students.filter(s => s.is_active).length * 50000; // Assuming 50k per student
  const collectionProgress = totalExpected > 0 ? (stats.monthlyRevenue / totalExpected) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-amber-500" />
            Fee Management
          </h2>
          <p className="text-slate-400">Collect fees, track payments, and manage dues</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => toast.info('Collect fee form')}>
            <Plus className="w-4 h-4 mr-2" /> Collect Fee
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `₹${(stats.monthlyRevenue / 100000).toFixed(1)}L`, icon: Wallet, color: "from-green-500 to-green-600", status: "collected" },
          { label: "Pending Dues", value: `₹${((totalExpected - stats.monthlyRevenue) / 100000).toFixed(1)}L`, icon: Clock, color: "from-amber-500 to-orange-500", status: "pending" },
          { label: "Transactions", value: feePayments.length.toString(), icon: Receipt, color: "from-blue-500 to-blue-600", status: "total" },
          { label: "Collection Rate", value: `${collectionProgress.toFixed(0)}%`, icon: CreditCard, color: "from-purple-500 to-purple-600", status: "rate" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-slate-800 border-slate-700">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Collection Progress */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Monthly Collection Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Target: ₹{(totalExpected / 100000).toFixed(1)}L</span>
              <span className="text-white font-medium">{collectionProgress.toFixed(1)}% Collected</span>
            </div>
            <Progress value={collectionProgress} className="h-4 bg-slate-700" />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                <p className="text-green-400 text-sm">Paid</p>
                <p className="text-xl font-bold text-white">{feePayments.filter(p => p.status === 'completed').length}</p>
              </div>
              <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                <p className="text-amber-400 text-sm">Partial</p>
                <p className="text-xl font-bold text-white">0</p>
              </div>
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                <p className="text-red-400 text-sm">Unpaid</p>
                <p className="text-xl font-bold text-white">{students.filter(s => s.is_active).length - feePayments.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Recent Transactions</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search transactions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {feePayments.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No transactions yet</p>
              <Button className="mt-4 bg-amber-500" onClick={() => toast.info('Collect fee form')}>
                <Plus className="w-4 h-4 mr-2" /> Record First Payment
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {feePayments.slice(0, 10).map((payment, idx) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Payment #{payment.id.slice(0, 8)}</p>
                      <p className="text-sm text-slate-400">{payment.payment_date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">₹{payment.amount.toLocaleString()}</p>
                    <Badge className="bg-green-500/20 text-green-400">{payment.status}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
