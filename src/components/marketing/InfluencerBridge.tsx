import { motion } from "framer-motion";
import { Users, Link, MousePointer, Target, AlertTriangle, TrendingUp, ExternalLink, Copy, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const InfluencerBridge = () => {
  const influencers = [
    {
      id: "INF-001",
      name: "TechGuru_IN",
      platform: "Instagram",
      followers: "125K",
      clicks: 3420,
      conversions: 89,
      commission: "₹44,500",
      status: "verified",
      fraudRisk: "low",
    },
    {
      id: "INF-002",
      name: "StartupDaily",
      platform: "YouTube",
      followers: "450K",
      clicks: 8920,
      conversions: 234,
      commission: "₹1,17,000",
      status: "verified",
      fraudRisk: "low",
    },
    {
      id: "INF-003",
      name: "BizTalk_Pro",
      platform: "LinkedIn",
      followers: "89K",
      clicks: 1240,
      conversions: 67,
      commission: "₹33,500",
      status: "verified",
      fraudRisk: "medium",
    },
    {
      id: "INF-004",
      name: "QuickReviews",
      platform: "Twitter",
      followers: "220K",
      clicks: 15600,
      conversions: 12,
      commission: "₹6,000",
      status: "flagged",
      fraudRisk: "high",
    },
  ];

  const platformStats = [
    { platform: "Instagram", clicks: 45000, conversions: 890, color: "pink" },
    { platform: "YouTube", clicks: 32000, conversions: 1240, color: "red" },
    { platform: "LinkedIn", clicks: 18000, conversions: 420, color: "cyan" },
    { platform: "Twitter", clicks: 28000, conversions: 340, color: "sky" },
  ];

  const getFraudColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-teal-100 flex items-center gap-2">
          <Users className="w-6 h-6 text-teal-400" />
          Influencer Bridge
        </h2>
        <Button className="bg-gradient-to-r from-teal-500 to-cyan-600">
          <Link className="w-4 h-4 mr-2" />
          Generate New Link
        </Button>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-4 gap-4">
        {platformStats.map((stat, index) => (
          <motion.div
            key={stat.platform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4">
                <h4 className={`text-sm font-medium text-${stat.color}-400`}>{stat.platform}</h4>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{(stat.clicks / 1000).toFixed(1)}K</span>
                  <span className="text-xs text-slate-500">clicks</span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm">
                  <Target className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">{stat.conversions}</span>
                  <span className="text-slate-500">conversions</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Influencer List */}
      <Card className="bg-slate-900/50 border-teal-500/20 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-teal-100">Active Influencers</CardTitle>
            <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/40">
              {influencers.length} Partners
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {influencers.map((influencer, index) => (
              <motion.div
                key={influencer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border ${
                  influencer.status === "flagged" 
                    ? "bg-red-500/5 border-red-500/30" 
                    : "bg-slate-800/50 border-slate-700/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold">
                      {influencer.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-200">{influencer.name}</h4>
                        {influencer.status === "verified" && (
                          <Shield className="w-4 h-4 text-emerald-400" />
                        )}
                        {influencer.status === "flagged" && (
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{influencer.platform} • {influencer.followers} followers</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-cyan-400">
                        <MousePointer className="w-4 h-4" />
                        <span className="font-semibold">{influencer.clicks.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-slate-500">Clicks</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-emerald-400">
                        <Target className="w-4 h-4" />
                        <span className="font-semibold">{influencer.conversions}</span>
                      </div>
                      <p className="text-xs text-slate-500">Conversions</p>
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-amber-400">{influencer.commission}</span>
                      <p className="text-xs text-slate-500">Earned</p>
                    </div>
                    <Badge className={getFraudColor(influencer.fraudRisk)}>
                      {influencer.fraudRisk} risk
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-teal-400">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-teal-400">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {influencer.status === "flagged" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                  >
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Fraud detected: Unusually high click rate with low conversions. Investigation recommended.</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencerBridge;
