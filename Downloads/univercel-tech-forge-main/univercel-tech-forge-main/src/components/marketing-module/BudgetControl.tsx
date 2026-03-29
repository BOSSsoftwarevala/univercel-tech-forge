import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, DollarSign, TrendingUp, AlertTriangle,
  Zap, RefreshCw, PieChart, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { toast } from "sonner";

const budgetOverview = {
  daily: { limit: 500, spent: 342, remaining: 158 },
  monthly: { limit: 10000, spent: 6890, remaining: 3110 },
};

const channelBudgets = [
  { 
    channel: "Google Ads", 
    dailyLimit: 250, 
    spent: 187, 
    status: "active",
    autoRebalance: true,
    performance: 285
  },
  { 
    channel: "Meta Ads", 
    dailyLimit: 150, 
    spent: 112, 
    status: "active",
    autoRebalance: true,
    performance: 312
  },
  { 
    channel: "LinkedIn Ads", 
    dailyLimit: 50, 
    spent: 23, 
    status: "paused",
    autoRebalance: false,
    performance: 145
  },
  { 
    channel: "SEO Tools", 
    dailyLimit: 50, 
    spent: 20, 
    status: "active",
    autoRebalance: false,
    performance: 420
  },
];

const alerts = [
  { id: 1, type: "warning", message: "Google Ads approaching daily limit (75%)", time: "10 min ago" },
  { id: 2, type: "info", message: "AI rebalanced $50 from LinkedIn to Meta", time: "2 hours ago" },
  { id: 3, type: "success", message: "Monthly budget increased by 15%", time: "1 day ago" },
];

export const BudgetControl = () => {
  const [autoRebalanceGlobal, setAutoRebalanceGlobal] = useState(true);

  const handleUpdateBudget = (channel: string, newLimit: number) => {
    toast.success(`${channel} daily limit updated to $${newLimit}`);
  };

  const handleToggleRebalance = (channel: string, enabled: boolean) => {
    toast.success(`Auto-rebalance ${enabled ? "enabled" : "disabled"} for ${channel}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "paused": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "warning": return "border-amber-500/50 bg-amber-500/10";
      case "success": return "border-emerald-500/50 bg-emerald-500/10";
      default: return "border-blue-500/50 bg-blue-500/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Budget Control</h1>
          <p className="text-muted-foreground">Manage daily & monthly marketing spend</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <Zap className="w-3 h-3 mr-1" />
            AI Rebalance
          </Badge>
          <Switch
            checked={autoRebalanceGlobal}
            onCheckedChange={setAutoRebalanceGlobal}
          />
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Daily Budget</p>
                  <p className="text-xs text-muted-foreground">Resets at midnight</p>
                </div>
              </div>
              <Badge variant="outline">{Math.round((budgetOverview.daily.spent / budgetOverview.daily.limit) * 100)}%</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-semibold text-foreground">${budgetOverview.daily.spent}</span>
              </div>
              <Progress value={(budgetOverview.daily.spent / budgetOverview.daily.limit) * 100} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-semibold text-emerald-400">${budgetOverview.daily.remaining}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Monthly Budget</p>
                  <p className="text-xs text-muted-foreground">Resets on 1st</p>
                </div>
              </div>
              <Badge variant="outline">{Math.round((budgetOverview.monthly.spent / budgetOverview.monthly.limit) * 100)}%</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-semibold text-foreground">${budgetOverview.monthly.spent.toLocaleString()}</span>
              </div>
              <Progress value={(budgetOverview.monthly.spent / budgetOverview.monthly.limit) * 100} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-semibold text-emerald-400">${budgetOverview.monthly.remaining.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Budgets */}
        <div className="lg:col-span-2">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-400" />
                Channel Budgets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {channelBudgets.map((channel) => (
                  <div 
                    key={channel.channel}
                    className="flex items-center justify-between p-4 rounded-lg bg-accent/30"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium text-foreground">{channel.channel}</p>
                        <Badge className={getStatusColor(channel.status)}>
                          {channel.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress 
                          value={(channel.spent / channel.dailyLimit) * 100} 
                          className="h-2 flex-1 max-w-[200px]" 
                        />
                        <span className="text-sm text-muted-foreground">
                          ${channel.spent}/${channel.dailyLimit}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className={`font-semibold flex items-center gap-1 ${
                          channel.performance > 200 ? "text-emerald-400" : "text-amber-400"
                        }`}>
                          {channel.performance > 200 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {channel.performance}%
                        </p>
                        <p className="text-xs text-muted-foreground">ROI</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Auto</span>
                        <Switch
                          checked={channel.autoRebalance}
                          onCheckedChange={(checked) => handleToggleRebalance(channel.channel, checked)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-emerald-400" />
              Budget Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
                >
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
