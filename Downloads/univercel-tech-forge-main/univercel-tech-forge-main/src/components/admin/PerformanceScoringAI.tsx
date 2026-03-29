import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  Users,
  Star,
  Target,
  Zap,
  BarChart3,
  Lock,
  Lightbulb,
  Loader2,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PerformanceScoringAI = () => {
  const [activeTab, setActiveTab] = useState("developers");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const developerScores = [
    { 
      name: "Rahul S.", 
      score: 94, 
      trend: "up",
      breakdown: { quality: 96, speed: 92, communication: 94, reliability: 95 },
      bonus: "₹5,000",
      penalty: null,
      suggestion: "Consider for senior developer promotion"
    },
    { 
      name: "Priya M.", 
      score: 91, 
      trend: "up",
      breakdown: { quality: 94, speed: 88, communication: 92, reliability: 90 },
      bonus: "₹3,500",
      penalty: null,
      suggestion: "Improve task completion speed"
    },
    { 
      name: "Amit K.", 
      score: 78, 
      trend: "down",
      breakdown: { quality: 82, speed: 72, communication: 80, reliability: 78 },
      bonus: null,
      penalty: "-₹1,000",
      suggestion: "Address frequent task pauses and SLA breaches"
    },
    { 
      name: "Sneha R.", 
      score: 86, 
      trend: "stable",
      breakdown: { quality: 90, speed: 84, communication: 85, reliability: 85 },
      bonus: "₹2,000",
      penalty: null,
      suggestion: "Maintain current performance trajectory"
    },
  ];

  const resellerScores = [
    { name: "Reseller Mumbai", score: 89, trend: "up", conversions: 34, leads: 45, bonus: "₹8,500" },
    { name: "Reseller Delhi", score: 82, trend: "stable", conversions: 28, leads: 38, bonus: "₹5,200" },
    { name: "Reseller Pune", score: 75, trend: "down", conversions: 18, leads: 32, penalty: "-₹2,000" },
    { name: "Reseller Chennai", score: 91, trend: "up", conversions: 42, leads: 48, bonus: "₹12,000" },
  ];

  const franchiseScores = [
    { name: "Maharashtra Franchise", score: 92, trend: "up", revenue: "₹45L", growth: "+18%", bonus: "₹25,000" },
    { name: "Karnataka Franchise", score: 88, trend: "stable", revenue: "₹38L", growth: "+12%", bonus: "₹15,000" },
    { name: "Delhi NCR Franchise", score: 79, trend: "down", revenue: "₹28L", growth: "+5%", penalty: "-₹5,000" },
    { name: "Tamil Nadu Franchise", score: 85, trend: "up", revenue: "₹32L", growth: "+15%", bonus: "₹10,000" },
  ];

  const supportScores = [
    { name: "Support Agent 1", score: 88, trend: "up", tickets: 156, avgTime: "2.3h", satisfaction: 4.6 },
    { name: "Support Agent 2", score: 82, trend: "stable", tickets: 142, avgTime: "2.8h", satisfaction: 4.4 },
    { name: "Support Agent 3", score: 76, trend: "down", tickets: 98, avgTime: "3.5h", satisfaction: 4.1 },
  ];

  const handleRecalculateAll = async () => {
    setIsAnalyzing(true);
    setAiInsight(null);
    
    try {
      const performanceData = {
        developers: developerScores,
        resellers: resellerScores,
        franchises: franchiseScores,
        support: supportScores
      };

      const { data, error } = await supabase.functions.invoke('ai-performance-analyzer', {
        body: { performanceData, type: 'recalculate' }
      });

      if (error) throw error;

      setAiInsight(data.analysis);
      toast.success("AI analysis complete", {
        description: "Performance scores have been recalculated"
      });
    } catch (error: any) {
      console.error("AI analysis error:", error);
      toast.error("Analysis failed", {
        description: error.message || "Could not complete AI analysis"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-yellow-400";
    if (score >= 70) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return "from-green-500/20 to-green-500/5";
    if (score >= 80) return "from-yellow-500/20 to-yellow-500/5";
    if (score >= 70) return "from-orange-500/20 to-orange-500/5";
    return "from-red-500/20 to-red-500/5";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <span className="text-yellow-400">—</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
            Performance Scoring AI
          </h1>
          <p className="text-muted-foreground mt-1">AI-powered performance analysis with bonuses & penalties</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10">
            <Lock className="w-4 h-4 mr-2" />
            Rating Override Lock
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={handleRecalculateAll}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Recalculate All
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Insight Panel */}
      {aiInsight && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-2">AI Analysis Results</h3>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {aiInsight}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiInsight(null)}
                  className="text-muted-foreground"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Avg Dev Score", value: "87.3", icon: Users, color: "text-primary" },
          { label: "Avg Reseller Score", value: "84.2", icon: Target, color: "text-neon-teal" },
          { label: "Total Bonuses", value: "₹1.2L", icon: Award, color: "text-green-400" },
          { label: "Total Penalties", value: "₹18K", icon: AlertTriangle, color: "text-red-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-white/10">
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-background/50 border border-white/10">
          <TabsTrigger value="developers">Developers</TabsTrigger>
          <TabsTrigger value="resellers">Resellers</TabsTrigger>
          <TabsTrigger value="franchises">Franchises</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="developers" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {developerScores.map((dev, index) => (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`glass-card border-white/10 bg-gradient-to-br ${getScoreGradient(dev.score)}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-background/50 flex items-center justify-center">
                          <span className="font-bold text-lg">{dev.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-semibold">{dev.name}</div>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(dev.trend)}
                            <span className="text-sm text-muted-foreground">{dev.trend}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(dev.score)}`}>
                          {dev.score}
                        </div>
                        <div className="text-xs text-muted-foreground">AI Score</div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {Object.entries(dev.breakdown).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize text-muted-foreground">{key}</span>
                            <span>{value}%</span>
                          </div>
                          <Progress value={value} className="h-1.5" />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        {dev.bonus && (
                          <Badge className="bg-green-500/20 text-green-400">
                            <Award className="w-3 h-3 mr-1" />
                            {dev.bonus}
                          </Badge>
                        )}
                        {dev.penalty && (
                          <Badge className="bg-red-500/20 text-red-400">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {dev.penalty}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 p-3 rounded-lg bg-background/30 border border-white/5">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{dev.suggestion}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resellers" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardContent className="p-4">
              <div className="space-y-4">
                {resellerScores.map((reseller, index) => (
                  <motion.div
                    key={reseller.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-background/50 border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`text-3xl font-bold ${getScoreColor(reseller.score)}`}>
                          {reseller.score}
                        </div>
                        <div>
                          <div className="font-semibold">{reseller.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {reseller.conversions}/{reseller.leads} conversions
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getTrendIcon(reseller.trend)}
                        {reseller.bonus && (
                          <Badge className="bg-green-500/20 text-green-400">{reseller.bonus}</Badge>
                        )}
                        {reseller.penalty && (
                          <Badge className="bg-red-500/20 text-red-400">{reseller.penalty}</Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="franchises" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardContent className="p-4">
              <div className="space-y-4">
                {franchiseScores.map((franchise, index) => (
                  <motion.div
                    key={franchise.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-background/50 border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`text-3xl font-bold ${getScoreColor(franchise.score)}`}>
                          {franchise.score}
                        </div>
                        <div>
                          <div className="font-semibold">{franchise.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Revenue: {franchise.revenue} • Growth: {franchise.growth}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getTrendIcon(franchise.trend)}
                        {franchise.bonus && (
                          <Badge className="bg-green-500/20 text-green-400">{franchise.bonus}</Badge>
                        )}
                        {franchise.penalty && (
                          <Badge className="bg-red-500/20 text-red-400">{franchise.penalty}</Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardContent className="p-4">
              <div className="space-y-4">
                {supportScores.map((agent, index) => (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-background/50 border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`text-3xl font-bold ${getScoreColor(agent.score)}`}>
                          {agent.score}
                        </div>
                        <div>
                          <div className="font-semibold">{agent.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {agent.tickets} tickets • Avg: {agent.avgTime}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getTrendIcon(agent.trend)}
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span>{agent.satisfaction}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceScoringAI;
