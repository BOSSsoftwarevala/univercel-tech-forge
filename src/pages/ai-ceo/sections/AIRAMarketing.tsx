import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Megaphone, TrendingUp, Users, Target, BarChart3,
  Globe, Lightbulb, MessageSquare, Zap, DollarSign,
  ArrowUp, ArrowDown, Star, Eye, Shield, Calendar,
  Clock, CheckCircle2, AlertTriangle
} from "lucide-react";

const STRATEGIES = [
  { id: "1", title: "Launch Product Hunt Campaign", category: "Growth", impact: "high", confidence: 92, status: "recommended", description: "Schedule a Product Hunt launch for the Marketplace module to drive B2B signups." },
  { id: "2", title: "SEO Content Cluster: Enterprise Software", category: "Content", impact: "medium", confidence: 85, status: "recommended", description: "Create 15 interlinked blog posts targeting 'enterprise software distribution' keywords." },
  { id: "3", title: "Referral Program for Resellers", category: "Acquisition", impact: "high", confidence: 88, status: "in-review", description: "Implement tiered referral rewards for existing resellers bringing new clients." },
  { id: "4", title: "Email Nurture Sequence", category: "Engagement", impact: "medium", confidence: 79, status: "recommended", description: "7-day email sequence for trial users highlighting key platform features." },
  { id: "5", title: "Influencer Partnership Program", category: "Brand", impact: "medium", confidence: 76, status: "planned", description: "Partner with 5 tech influencers for platform reviews and tutorials." },
];

const METRICS = [
  { label: "Brand Reach", value: "2.4M", change: "+18%", trend: "up", icon: Globe },
  { label: "Lead Generation", value: "1,240", change: "+32%", trend: "up", icon: Users },
  { label: "Conversion Rate", value: "4.2%", change: "+0.8%", trend: "up", icon: Target },
  { label: "Customer LTV", value: "₹48,500", change: "+12%", trend: "up", icon: DollarSign },
  { label: "Content Engagement", value: "8.7K", change: "-3%", trend: "down", icon: MessageSquare },
  { label: "Market Position", value: "#3", change: "+1", trend: "up", icon: Star },
];

const CONTENT_IDEAS = [
  { title: "Why Enterprise Software Distribution Needs AI", type: "Blog", score: 94 },
  { title: "5 Ways to Scale Your SaaS Distribution", type: "Video", score: 89 },
  { title: "Software Vala vs Traditional Distribution", type: "Comparison", score: 87 },
  { title: "How AI Reduces Software Deployment Time by 80%", type: "Case Study", score: 85 },
  { title: "The Future of White-Label Software Markets", type: "Whitepaper", score: 82 },
];

const COMPETITORS = [
  { name: "Envato Market", strength: "Large marketplace", weakness: "No AI integration", threat: "medium", share: 28 },
  { name: "AppSumo", strength: "Deal-driven audience", weakness: "One-time deals only", threat: "low", share: 15 },
  { name: "Gumroad", strength: "Creator-friendly", weakness: "No enterprise features", threat: "low", share: 12 },
  { name: "FastSpring", strength: "Enterprise billing", weakness: "No marketplace", threat: "high", share: 22 },
];

const CAMPAIGNS = [
  { id: "1", name: "Q1 Enterprise Push", status: "active", budget: "₹5,00,000", spent: 62, leads: 340, roi: "+180%" },
  { id: "2", name: "Developer Outreach", status: "active", budget: "₹2,00,000", spent: 45, leads: 180, roi: "+120%" },
  { id: "3", name: "Reseller Recruitment", status: "planned", budget: "₹3,50,000", spent: 0, leads: 0, roi: "—" },
  { id: "4", name: "Product Launch — AI Suite", status: "completed", budget: "₹4,00,000", spent: 100, leads: 520, roi: "+240%" },
];

const AIRAMarketing = () => {
  const impactStyle = (i: string) => {
    if (i === "high") return "bg-red-500/20 text-red-400 border-red-500/30";
    if (i === "medium") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-600 to-red-600 flex items-center justify-center shadow-xl shadow-pink-500/20">
          <Megaphone className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Marketing Intelligence</h1>
          <p className="text-pink-400/80">AI-Powered Strategy • Growth Insights • Content Engine</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-6 gap-4">
        {METRICS.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <m.icon className="w-4 h-4 text-pink-400" />
                </div>
                <p className="text-lg font-bold text-white">{m.value}</p>
                <div className="flex items-center gap-1">
                  {m.trend === "up" ? <ArrowUp className="w-3 h-3 text-emerald-400" /> : <ArrowDown className="w-3 h-3 text-red-400" />}
                  <span className={`text-xs ${m.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>{m.change}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{m.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* AI Strategy Recommendations */}
        <Card className="col-span-2 bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              AI Strategy Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[340px]">
              <div className="space-y-3">
                {STRATEGIES.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/20 hover:border-pink-500/20 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-medium text-white">{s.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{s.description}</p>
                      </div>
                      <Badge className={impactStyle(s.impact)}>{s.impact}</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-slate-700/50 text-slate-300 text-xs">{s.category}</Badge>
                        <div className="flex items-center gap-2">
                          <Progress value={s.confidence} className="h-1 w-16" />
                          <span className="text-xs text-cyan-400">{s.confidence}%</span>
                        </div>
                      </div>
                      <Badge className={
                        s.status === "recommended" ? "bg-emerald-500/20 text-emerald-400 text-xs" :
                        s.status === "in-review" ? "bg-yellow-500/20 text-yellow-400 text-xs" :
                        "bg-slate-500/20 text-slate-400 text-xs"
                      }>{s.status}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Content Ideas */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Zap className="w-4 h-4 text-pink-400" />
              Content Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {CONTENT_IDEAS.map((idea, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/20"
                >
                  <p className="text-sm text-white font-medium">{idea.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge className="bg-pink-500/20 text-pink-400 text-xs">{idea.type}</Badge>
                    <div className="flex items-center gap-2">
                      <Progress value={idea.score} className="h-1 w-12" />
                      <span className="text-xs text-cyan-400">{idea.score}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitor Analysis + Campaign Tracker */}
      <div className="grid grid-cols-2 gap-6">
        {/* Competitor Analysis */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Shield className="w-4 h-4 text-orange-400" />
              Competitor Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {COMPETITORS.map((comp, i) => (
                <motion.div
                  key={comp.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">{comp.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        comp.threat === "high" ? "bg-red-500/20 text-red-400 text-xs" :
                        comp.threat === "medium" ? "bg-yellow-500/20 text-yellow-400 text-xs" :
                        "bg-emerald-500/20 text-emerald-400 text-xs"
                      }>{comp.threat} threat</Badge>
                      <span className="text-xs text-slate-400">{comp.share}% share</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-emerald-500/5 border border-emerald-500/10">
                      <p className="text-slate-500">Strength</p>
                      <p className="text-emerald-400">{comp.strength}</p>
                    </div>
                    <div className="p-2 rounded bg-red-500/5 border border-red-500/10">
                      <p className="text-slate-500">Weakness</p>
                      <p className="text-red-400">{comp.weakness}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Tracker */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4 text-violet-400" />
              Campaign Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {CAMPAIGNS.map((camp, i) => (
                <motion.div
                  key={camp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">{camp.name}</h4>
                    <Badge className={
                      camp.status === "active" ? "bg-emerald-500/20 text-emerald-400 text-xs" :
                      camp.status === "completed" ? "bg-cyan-500/20 text-cyan-400 text-xs" :
                      "bg-slate-500/20 text-slate-400 text-xs"
                    }>{camp.status}</Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-slate-500">Budget</p>
                      <p className="text-white font-medium">{camp.budget}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Spent</p>
                      <Progress value={camp.spent} className="h-1 mt-1" />
                    </div>
                    <div>
                      <p className="text-slate-500">Leads</p>
                      <p className="text-emerald-400 font-medium">{camp.leads}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">ROI</p>
                      <p className="text-cyan-400 font-medium">{camp.roi}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AIRA Marketing Notice */}
      <div className="p-4 rounded-lg bg-pink-500/5 border border-pink-500/20">
        <div className="flex items-center gap-3">
          <Megaphone className="w-5 h-5 text-pink-400" />
          <p className="text-sm text-pink-400/80">
            <strong>AIRA Marketing:</strong> All strategies, competitor insights, and campaign plans are AI-generated. Execution requires CEO or Boss approval.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIRAMarketing;
