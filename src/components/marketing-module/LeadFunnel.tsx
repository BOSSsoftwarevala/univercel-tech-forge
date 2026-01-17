import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  MousePointer, 
  Users, 
  UserCheck, 
  TrendingUp,
  Wand2,
  AlertTriangle,
  ArrowDown,
  CheckCircle2
} from "lucide-react";

const funnelStages = [
  { 
    stage: "Clicks", 
    count: 45678, 
    percentage: 100, 
    dropRate: null,
    icon: MousePointer,
    color: "from-blue-500 to-cyan-500"
  },
  { 
    stage: "Leads", 
    count: 12456, 
    percentage: 27.3, 
    dropRate: 72.7,
    icon: Users,
    color: "from-violet-500 to-purple-500"
  },
  { 
    stage: "Qualified", 
    count: 4567, 
    percentage: 10, 
    dropRate: 63.3,
    icon: UserCheck,
    color: "from-amber-500 to-orange-500"
  },
  { 
    stage: "Converted", 
    count: 1234, 
    percentage: 2.7, 
    dropRate: 73,
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-500"
  },
];

const dropIssues = [
  { 
    stage: "Clicks → Leads", 
    issue: "Landing page load time > 3s", 
    impact: "High",
    aiSuggestion: "Optimize images and enable CDN"
  },
  { 
    stage: "Leads → Qualified", 
    issue: "Form has too many fields", 
    impact: "Medium",
    aiSuggestion: "Reduce form fields to 4-5"
  },
  { 
    stage: "Qualified → Converted", 
    issue: "Follow-up delay > 24h", 
    impact: "High",
    aiSuggestion: "Enable auto-responder emails"
  },
];

const campaignFunnels = [
  { campaign: "Africa Expansion", clicks: 12500, leads: 3400, qualified: 890, converted: 245, convRate: "1.96%" },
  { campaign: "Franchise Program", clicks: 8900, leads: 2100, qualified: 567, converted: 156, convRate: "1.75%" },
  { campaign: "Product Launch SEO", clicks: 15600, leads: 4200, qualified: 1200, converted: 423, convRate: "2.71%" },
  { campaign: "Reseller Middle East", clicks: 6700, leads: 1800, qualified: 450, converted: 98, convRate: "1.46%" },
];

export const LeadFunnel = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Funnel</h1>
          <p className="text-muted-foreground">Track and optimize conversion journey</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Wand2 className="w-4 h-4" />
            Auto Fix Drops
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500">
            <Target className="w-4 h-4" />
            Optimize Funnel
          </Button>
        </div>
      </div>

      {/* Funnel Visualization */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Overall Funnel Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4">
            {funnelStages.map((stage, index) => {
              const Icon = stage.icon;
              const width = 100 - (index * 20);
              return (
                <div key={stage.stage} className="flex items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="relative"
                    style={{ width: `${width * 1.5}px` }}
                  >
                    <div 
                      className={`bg-gradient-to-br ${stage.color} rounded-lg p-4 text-center text-white`}
                      style={{ clipPath: index > 0 ? 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' : undefined }}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-lg font-bold">{stage.count.toLocaleString()}</div>
                      <div className="text-xs opacity-80">{stage.stage}</div>
                      <div className="text-xs mt-1">{stage.percentage}%</div>
                    </div>
                    {stage.dropRate && (
                      <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
                        <ArrowDown className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-red-400">-{stage.dropRate}%</span>
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Drop Issues */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Detected Drop Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dropIssues.map((issue, index) => (
              <motion.div
                key={issue.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{issue.stage}</div>
                    <div className="text-sm text-muted-foreground">{issue.issue}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant="outline" 
                    className={issue.impact === "High" ? "text-red-400 border-red-400/30" : "text-amber-400 border-amber-400/30"}
                  >
                    {issue.impact} Impact
                  </Badge>
                  <div className="max-w-[200px]">
                    <div className="text-xs text-muted-foreground">AI Suggestion:</div>
                    <div className="text-sm text-emerald-400">{issue.aiSuggestion}</div>
                  </div>
                  <Button size="sm" className="gap-1 bg-emerald-500 hover:bg-emerald-600">
                    <Wand2 className="w-3 h-3" />
                    Fix
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Funnels */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Campaign Funnels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaignFunnels.map((campaign, index) => (
              <motion.div
                key={campaign.campaign}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-foreground">{campaign.campaign}</div>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">
                    {campaign.convRate} conversion
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{campaign.clicks.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Clicks</div>
                    <Progress value={100} className="h-1 mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{campaign.leads.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Leads</div>
                    <Progress value={(campaign.leads / campaign.clicks) * 100} className="h-1 mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{campaign.qualified.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Qualified</div>
                    <Progress value={(campaign.qualified / campaign.clicks) * 100} className="h-1 mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-400">{campaign.converted}</div>
                    <div className="text-xs text-muted-foreground">Converted</div>
                    <Progress value={(campaign.converted / campaign.clicks) * 100} className="h-1 mt-2" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
