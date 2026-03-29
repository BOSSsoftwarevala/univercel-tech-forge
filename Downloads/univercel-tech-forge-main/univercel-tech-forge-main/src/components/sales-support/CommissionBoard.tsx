import { motion } from "framer-motion";
import { Wallet, DollarSign, TrendingUp, Award, Calendar, Target, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const CommissionBoard = () => {
  const commissions = [
    { id: "COM-001", deal: "Tech Solutions Ltd", amount: 1250, status: "paid", date: "Dec 15, 2024" },
    { id: "COM-002", deal: "Healthcare Plus", amount: 890, status: "pending", date: "Dec 18, 2024" },
    { id: "COM-003", deal: "EduLearn Academy", amount: 650, status: "processing", date: "Dec 19, 2024" },
    { id: "COM-004", deal: "Retail Mart", amount: 1100, status: "paid", date: "Dec 12, 2024" },
  ];

  const milestones = [
    { name: "5 Sales", reward: "$250 Bonus", progress: 100, achieved: true },
    { name: "10 Sales", reward: "$600 Bonus", progress: 80, achieved: false },
    { name: "$50K Revenue", reward: "1% Extra Commission", progress: 72, achieved: false },
    { name: "Top Performer", reward: "VIP Status + $1000", progress: 45, achieved: false },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "pending": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "processing": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Commission Board</h2>
          <p className="text-slate-400">Track earnings, payouts, and incentive milestones</p>
        </div>
        <Badge className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2">
          <TrendingUp className="w-4 h-4 mr-2" />
          +15% This Month
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-900/50 to-cyan-900/50 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-100">$4,890</div>
                <div className="text-xs text-slate-400">Total Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-100">$1,540</div>
                <div className="text-xs text-slate-400">Pending Payout</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-100">Dec 25</div>
                <div className="text-xs text-slate-400">Next Payout</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-100">8%</div>
                <div className="text-xs text-slate-400">Commission Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              Recent Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commissions.map((commission, index) => (
                <motion.div
                  key={commission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 text-sm">{commission.id}</span>
                      <span className="font-medium text-slate-200">{commission.deal}</span>
                    </div>
                    <span className="text-xs text-slate-500">{commission.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-emerald-400">${commission.amount}</span>
                    <Badge className={getStatusBadge(commission.status)}>{commission.status}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              Incentive Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg ${milestone.achieved ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-slate-800/50"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {milestone.achieved ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-slate-500" />
                    )}
                    <span className={`font-medium ${milestone.achieved ? "text-emerald-300" : "text-slate-200"}`}>
                      {milestone.name}
                    </span>
                  </div>
                  <Badge className={milestone.achieved ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-300"}>
                    {milestone.reward}
                  </Badge>
                </div>
                <Progress value={milestone.progress} className="h-2 bg-slate-800" />
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-slate-500">Progress</span>
                  <span className={milestone.achieved ? "text-emerald-400" : "text-cyan-400"}>{milestone.progress}%</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-amber-900/30 to-red-900/30 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="font-medium text-amber-100">Performance Bonus Available!</h3>
                <p className="text-sm text-slate-400">Close 2 more deals this week to unlock $500 bonus</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-400">$500</div>
              <div className="text-xs text-slate-400">Potential Bonus</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionBoard;
