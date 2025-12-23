import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, Send, Users, Clock, BarChart3, Plus,
  Eye, MousePointer, TrendingUp, ArrowUpRight, ArrowDownRight,
  Play, Pause, Edit, Trash2, RefreshCw, Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EmailAutomation = () => {
  const emailStats = [
    { label: "Emails Sent", value: "1,24,521", change: "+15%", trend: "up", icon: Send },
    { label: "Open Rate", value: "32.4%", change: "+2.8%", trend: "up", icon: Eye },
    { label: "Click Rate", value: "8.2%", change: "+1.2%", trend: "up", icon: MousePointer },
    { label: "Subscribers", value: "45,821", change: "+842", trend: "up", icon: Users },
  ];

  const campaigns = [
    { id: 1, name: "Welcome Series", type: "Automation", status: "active", sent: 8420, opened: 3452, clicked: 892, unsubscribed: 12 },
    { id: 2, name: "Product Launch - Q4", type: "Campaign", status: "scheduled", sent: 0, opened: 0, clicked: 0, unsubscribed: 0, scheduledAt: "Dec 25, 10:00 AM" },
    { id: 3, name: "Weekly Newsletter", type: "Automation", status: "active", sent: 42100, opened: 15420, clicked: 4521, unsubscribed: 89 },
    { id: 4, name: "Abandoned Demo Follow-up", type: "Automation", status: "active", sent: 2841, opened: 1452, clicked: 542, unsubscribed: 8 },
    { id: 5, name: "Win-back Campaign", type: "Campaign", status: "paused", sent: 12500, opened: 2840, clicked: 421, unsubscribed: 145 },
  ];

  const automationFlows = [
    { id: 1, name: "Lead Nurture Sequence", triggers: "New Lead Signup", emails: 5, status: "active", conversions: 124 },
    { id: 2, name: "Demo Request Follow-up", triggers: "Demo Scheduled", emails: 3, status: "active", conversions: 89 },
    { id: 3, name: "Post-Purchase Onboarding", triggers: "Payment Received", emails: 7, status: "active", conversions: 256 },
    { id: 4, name: "Re-engagement Series", triggers: "Inactive 30 days", emails: 4, status: "paused", conversions: 45 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "scheduled": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "paused": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30">
              <Mail className="h-6 w-6 text-orange-400" />
            </div>
            Email Automation
          </h1>
          <p className="text-muted-foreground mt-1">Automated email campaigns & sequences</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-orange-500/30 text-orange-400">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Lists
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {emailStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-orange-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <stat.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                    {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Campaigns & Automations */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="bg-slate-800/50 border border-orange-500/20">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="automations" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            Automation Flows
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card className="bg-slate-900/50 border-orange-500/20 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-orange-300">Email Campaigns</CardTitle>
                <Button variant="ghost" size="sm" className="text-orange-400">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <motion.div
                    key={campaign.id}
                    className="p-4 bg-slate-800/30 rounded-lg border border-orange-500/10 hover:border-orange-500/30 transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{campaign.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <Badge variant="outline" className="text-xs">{campaign.type}</Badge>
                            {campaign.scheduledAt && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{campaign.scheduledAt}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <p className="text-sm font-medium text-white">{campaign.sent.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Sent</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-cyan-400">{campaign.opened.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Opened</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-400">{campaign.clicked.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Clicked</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-red-400">{campaign.unsubscribed}</p>
                            <p className="text-xs text-muted-foreground">Unsub</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="text-orange-400">
                            {campaign.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-orange-400">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automations">
          <Card className="bg-slate-900/50 border-orange-500/20 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-orange-300">Automation Flows</CardTitle>
                <Button variant="outline" className="border-orange-500/30 text-orange-400">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Flow
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {automationFlows.map((flow) => (
                  <motion.div
                    key={flow.id}
                    className="p-4 bg-slate-800/30 rounded-lg border border-orange-500/10 hover:border-orange-500/30 transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{flow.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>Trigger: {flow.triggers}</span>
                            <span>{flow.emails} emails</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-400">{flow.conversions}</p>
                          <p className="text-xs text-muted-foreground">Conversions</p>
                        </div>
                        <Badge className={getStatusColor(flow.status)}>{flow.status}</Badge>
                        <Button variant="ghost" size="sm" className="text-orange-400">
                          <Edit className="w-4 h-4" />
                        </Button>
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

export default EmailAutomation;
