import { motion } from "framer-motion";
import { Trophy, Star, Award, Medal, Crown, TrendingUp, Gift, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const LeaderboardRewards = () => {
  const leaderboard = [
    { rank: 1, name: "Alex Rivera", score: 125400, badge: "Elite", avatar: "AR", conversions: 856 },
    { rank: 2, name: "Sarah Kim", score: 112350, badge: "Gold", avatar: "SK", conversions: 742 },
    { rank: 3, name: "Mike Chen", score: 98700, badge: "Gold", avatar: "MC", conversions: 689 },
    { rank: 4, name: "You", score: 84200, badge: "Gold", avatar: "YO", conversions: 542, isYou: true },
    { rank: 5, name: "Emma Wilson", score: 76500, badge: "Silver", avatar: "EW", conversions: 498 },
  ];

  const badges = [
    { name: "Prime", requirement: "150K+ Score", icon: Crown, color: "amber", unlocked: false, progress: 56 },
    { name: "Elite", requirement: "100K+ Score", icon: Star, color: "purple", unlocked: false, progress: 84 },
    { name: "Gold", requirement: "50K+ Score", icon: Award, color: "yellow", unlocked: true, progress: 100 },
    { name: "Silver", requirement: "25K+ Score", icon: Medal, color: "slate", unlocked: true, progress: 100 },
  ];

  const rewards = [
    { name: "Monthly Bonus", value: "$500", status: "earned", description: "Top 10 performer" },
    { name: "Commission Boost", value: "+15%", status: "active", description: "Gold tier benefit" },
    { name: "Priority Support", value: "24/7", status: "active", description: "VIP access" },
    { name: "Event Entry", value: "Free", status: "pending", description: "Annual summit ticket" },
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Elite": return "bg-gradient-to-r from-purple-500 to-violet-500 text-white";
      case "Gold": return "bg-gradient-to-r from-amber-500 to-yellow-500 text-black";
      case "Silver": return "bg-gradient-to-r from-slate-400 to-slate-500 text-white";
      default: return "bg-slate-700 text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-violet-100">Leaderboard & Rewards</h2>
          <p className="text-slate-400">Monthly rankings, badges, and bonus tiers</p>
        </div>
        <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30 px-4 py-2">
          <Award className="w-4 h-4 mr-2" />
          Gold Tier
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-violet-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-violet-100">#4</div>
            <div className="text-xs text-slate-400">Current Rank</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">84,200</div>
            <div className="text-xs text-slate-400">Total Score</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">542</div>
            <div className="text-xs text-slate-400">Conversions</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Gift className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">$1,250</div>
            <div className="text-xs text-slate-400">Rewards Earned</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardHeader>
            <CardTitle className="text-violet-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-violet-400" />
              Monthly Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.map((member, index) => (
              <motion.div
                key={member.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  member.isYou ? "bg-violet-500/20 border border-violet-500/30" : "bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    member.rank === 1 ? "bg-amber-500 text-black" :
                    member.rank === 2 ? "bg-slate-400 text-white" :
                    member.rank === 3 ? "bg-amber-700 text-white" :
                    "bg-slate-700 text-slate-300"
                  }`}>
                    {member.rank}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center text-violet-300 font-medium">
                    {member.avatar}
                  </div>
                  <div>
                    <span className={`font-medium ${member.isYou ? "text-violet-300" : "text-slate-200"}`}>
                      {member.name}
                    </span>
                    {member.isYou && <Badge className="ml-2 bg-violet-500/20 text-violet-300 text-xs">You</Badge>}
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge className={`text-xs ${getBadgeColor(member.badge)}`}>{member.badge}</Badge>
                      <span className="text-xs text-slate-500">{member.conversions} conversions</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-violet-300">{member.score.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">points</div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-violet-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-violet-400" />
                Badge Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {badges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={badge.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg ${badge.unlocked ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-slate-800/50"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 text-${badge.color}-400`} />
                        <span className={`font-medium ${badge.unlocked ? "text-emerald-300" : "text-slate-300"}`}>{badge.name}</span>
                        {badge.unlocked && <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">Unlocked</Badge>}
                      </div>
                      <span className="text-xs text-slate-500">{badge.requirement}</span>
                    </div>
                    <Progress value={badge.progress} className="h-2 bg-slate-700" />
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-violet-100 flex items-center gap-2">
                <Gift className="w-5 h-5 text-violet-400" />
                Your Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rewards.map((reward, index) => (
                <motion.div
                  key={reward.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <div>
                    <span className="font-medium text-slate-200">{reward.name}</span>
                    <p className="text-xs text-slate-500">{reward.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-400">{reward.value}</div>
                    <Badge className={
                      reward.status === "earned" ? "bg-emerald-500/20 text-emerald-300" :
                      reward.status === "active" ? "bg-violet-500/20 text-violet-300" :
                      "bg-amber-500/20 text-amber-300"
                    }>{reward.status}</Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardRewards;
