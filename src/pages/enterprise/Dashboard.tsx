import { 
  Users, Activity, Clock, Monitor, Building2, DollarSign, Brain, Heart, 
  Scale, HeadphonesIcon, Search, Megaphone, Lightbulb, AlertTriangle,
  Timer, CreditCard, Globe, Zap, Crown, MapPin, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const kpiCards = [
  { title: "Total Leads", value: "12,847", change: "+12.5%", trend: "up", icon: Users },
  { title: "Active Developers", value: "156", change: "+3", trend: "up", icon: Activity },
  { title: "Pending Tasks", value: "89", change: "-15", trend: "down", icon: Clock },
  { title: "Completed Tasks", value: "1,247", change: "+28", trend: "up", icon: Activity },
  { title: "Demo Status", value: "98.5%", change: "Uptime", trend: "up", icon: Monitor },
  { title: "Active Resellers", value: "342", change: "+18", trend: "up", icon: Building2 },
  { title: "Franchise Earnings", value: "₹24.5L", change: "+22%", trend: "up", icon: DollarSign },
  { title: "Wallet Summary", value: "₹1.2Cr", change: "Total", trend: "up", icon: CreditCard },
  { title: "AI Performance", value: "94.2%", change: "+2.1%", trend: "up", icon: Brain },
  { title: "Client Satisfaction", value: "4.8/5", change: "+0.2", trend: "up", icon: Heart },
  { title: "Legal Cases", value: "3", change: "Open", trend: "neutral", icon: Scale },
  { title: "Support Tickets", value: "47", change: "-12", trend: "down", icon: HeadphonesIcon },
  { title: "SEO Score", value: "87/100", change: "+5", trend: "up", icon: Search },
  { title: "Marketing ROI", value: "3.2x", change: "+0.4x", trend: "up", icon: Megaphone },
  { title: "R&D Pipeline", value: "24", change: "Ideas", trend: "neutral", icon: Lightbulb },
  { title: "Fraud Alerts", value: "2", change: "Active", trend: "neutral", icon: AlertTriangle },
  { title: "Timer Alerts", value: "5", change: "Overdue", trend: "down", icon: Timer },
  { title: "Subscriptions", value: "1,892", change: "Active", trend: "up", icon: CreditCard },
  { title: "Regions Active", value: "28", change: "States", trend: "up", icon: Globe },
  { title: "Buzzer Queue", value: "8", change: "Pending", trend: "neutral", icon: Zap },
  { title: "Prime Users", value: "234", change: "+15", trend: "up", icon: Crown },
];

const activityFeed = [
  { id: 1, type: "lead", message: "New lead assigned to Franchise #FR-2847", time: "2m ago" },
  { id: 2, type: "task", message: "Developer DEV-****-9X2K completed task #TSK-8291", time: "5m ago" },
  { id: 3, type: "demo", message: "Demo site CRM-Pro experiencing latency", time: "8m ago" },
  { id: 4, type: "payment", message: "Commission ₹45,000 credited to RES-****-3K7L", time: "12m ago" },
  { id: 5, type: "alert", message: "Fraud detection triggered for IP 192.***.***.45", time: "15m ago" },
];

const aiInsights = [
  { type: "suggestion", title: "Lead Quality", description: "15 high-quality leads from Maharashtra need immediate follow-up" },
  { type: "risk", title: "Churn Risk", description: "3 Prime users showing decreased engagement patterns" },
  { type: "prediction", title: "Revenue Forecast", description: "Expected 18% increase in Q1 based on current pipeline" },
];

export default function EnterpriseDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[hsl(var(--sv-blue))] to-[hsl(var(--sv-navy))] p-8">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Boss</h1>
          <p className="text-[hsl(var(--sv-white-soft))] opacity-80">
            Here's your enterprise command center overview for today
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-32 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))] hover:border-[hsl(var(--sv-blue))]/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-4 h-4 text-[hsl(var(--sv-blue-bright))]" />
                  {kpi.trend === "up" && <ArrowUpRight className="w-4 h-4 text-[hsl(var(--sv-success))]" />}
                  {kpi.trend === "down" && <ArrowDownRight className="w-4 h-4 text-[hsl(var(--sv-danger))]" />}
                </div>
                <p className="text-2xl font-bold text-white">{kpi.value}</p>
                <p className="text-xs text-[hsl(var(--sv-gray))]">{kpi.title}</p>
                <Badge 
                  variant="outline" 
                  className={`mt-2 text-xs ${
                    kpi.trend === "up" ? "border-[hsl(var(--sv-success))]/50 text-[hsl(var(--sv-success))]" :
                    kpi.trend === "down" ? "border-[hsl(var(--sv-danger))]/50 text-[hsl(var(--sv-danger))]" :
                    "border-[hsl(var(--sv-gray))]/50 text-[hsl(var(--sv-gray))]"
                  }`}
                >
                  {kpi.change}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* World Map */}
        <Card className="lg:col-span-2 bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[hsl(var(--sv-blue-bright))]" />
              Live Branch Map
            </CardTitle>
            <Button variant="ghost" size="icon" className="text-[hsl(var(--sv-gray))]">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-80 rounded-lg bg-[hsl(var(--sv-navy-deep))] border border-[hsl(var(--sv-navy-light))] flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-16 h-16 text-[hsl(var(--sv-blue))] mx-auto mb-4 animate-pulse" />
                <p className="text-[hsl(var(--sv-gray))]">Interactive India Map</p>
                <p className="text-xs text-[hsl(var(--sv-gray))]">28 States • 156 Branches • Real-time tracking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[hsl(var(--sv-blue-bright))]" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityFeed.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-[hsl(var(--sv-navy-deep))] border border-[hsl(var(--sv-navy-light))]">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === "lead" ? "bg-[hsl(var(--sv-blue-bright))]" :
                  activity.type === "task" ? "bg-[hsl(var(--sv-success))]" :
                  activity.type === "demo" ? "bg-[hsl(var(--sv-warning))]" :
                  activity.type === "payment" ? "bg-emerald-400" :
                  "bg-[hsl(var(--sv-danger))]"
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-[hsl(var(--sv-white-soft))]">{activity.message}</p>
                  <p className="text-xs text-[hsl(var(--sv-gray))]">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-[hsl(var(--sv-blue-bright))]" />
            AI Insights & Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  insight.type === "suggestion" ? "bg-[hsl(var(--sv-blue))]/10 border-[hsl(var(--sv-blue))]/30" :
                  insight.type === "risk" ? "bg-[hsl(var(--sv-warning))]/10 border-[hsl(var(--sv-warning))]/30" :
                  "bg-[hsl(var(--sv-success))]/10 border-[hsl(var(--sv-success))]/30"
                }`}
              >
                <Badge 
                  className={`mb-2 ${
                    insight.type === "suggestion" ? "bg-[hsl(var(--sv-blue))]" :
                    insight.type === "risk" ? "bg-[hsl(var(--sv-warning))]" :
                    "bg-[hsl(var(--sv-success))]"
                  }`}
                >
                  {insight.type}
                </Badge>
                <h4 className="text-white font-medium mb-1">{insight.title}</h4>
                <p className="text-sm text-[hsl(var(--sv-gray))]">{insight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
