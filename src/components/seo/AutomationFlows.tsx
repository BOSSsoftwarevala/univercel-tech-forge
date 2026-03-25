import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Workflow, Play, Pause, Plus, Settings, Zap, Clock,
  ArrowRight, CheckCircle2, AlertCircle, TrendingUp,
  Mail, MessageSquare, Target, Users, BarChart3, Edit, Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const AutomationFlows = () => {
  const flowStats = [
    { label: "Active Flows", value: "12", change: "+3", icon: Workflow },
    { label: "Executions Today", value: "1,247", change: "+18%", icon: Zap },
    { label: "Success Rate", value: "98.4%", change: "+0.8%", icon: CheckCircle2 },
    { label: "Time Saved", value: "48 hrs", change: "+12 hrs", icon: Clock },
  ];

  const automationFlows = [
    { 
      id: 1, 
      name: "Lead Qualification Pipeline", 
      description: "Score and route incoming leads automatically",
      trigger: "New Lead Created",
      steps: ["Score Lead", "Assign to Rep", "Send Welcome Email", "Create Task"],
      status: "active",
      executions: 842,
      successRate: 99.2,
      lastRun: "2 min ago"
    },
    { 
      id: 2, 
      name: "Demo Follow-up Sequence", 
      description: "Automated follow-up after demo scheduling",
      trigger: "Demo Scheduled",
      steps: ["Send Confirmation", "Wait 1 Day", "Send Prep Email", "Create Reminder"],
      status: "active",
      executions: 328,
      successRate: 98.8,
      lastRun: "15 min ago"
    },
    { 
      id: 3, 
      name: "Content Distribution", 
      description: "Publish content across all channels",
      trigger: "Content Approved",
      steps: ["Format for Platforms", "Schedule Posts", "Notify Team", "Track Performance"],
      status: "active",
      executions: 156,
      successRate: 97.4,
      lastRun: "1 hour ago"
    },
    { 
      id: 4, 
      name: "Re-engagement Campaign", 
      description: "Win back inactive leads",
      trigger: "Lead Inactive 30 Days",
      steps: ["Segment Lead", "Send Re-engage Email", "Wait 3 Days", "Create Alert"],
      status: "paused",
      executions: 524,
      successRate: 94.2,
      lastRun: "3 days ago"
    },
    { 
      id: 5, 
      name: "Deal Won Automation", 
      description: "Onboarding workflow after deal closure",
      trigger: "Deal Status = Won",
      steps: ["Create Project", "Assign Team", "Send Onboarding Email", "Schedule Kickoff"],
      status: "active",
      executions: 89,
      successRate: 100,
      lastRun: "4 hours ago"
    },
  ];

  const recentExecutions = [
    { id: 1, flow: "Lead Qualification Pipeline", status: "success", lead: "Amit Sharma", time: "2 min ago", duration: "1.2s" },
    { id: 2, flow: "Demo Follow-up Sequence", status: "success", lead: "Priya Patel", time: "15 min ago", duration: "2.8s" },
    { id: 3, flow: "Content Distribution", status: "success", lead: "Blog Post #124", time: "1 hour ago", duration: "4.5s" },
    { id: 4, flow: "Lead Qualification Pipeline", status: "failed", lead: "Invalid Lead Data", time: "2 hours ago", duration: "0.3s" },
    { id: 5, flow: "Deal Won Automation", status: "success", lead: "CloudWorks Deal", time: "4 hours ago", duration: "3.2s" },
  ];

  const getTriggerIcon = (trigger: string) => {
    if (trigger.includes("Lead")) return <Target className="w-4 h-4" />;
    if (trigger.includes("Demo")) return <Users className="w-4 h-4" />;
    if (trigger.includes("Content")) return <MessageSquare className="w-4 h-4" />;
    if (trigger.includes("Deal")) return <BarChart3 className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-xl border border-violet-500/30">
              <Workflow className="h-6 w-6 text-violet-400" />
            </div>
            Automation Flows
          </h1>
          <p className="text-muted-foreground mt-1">Create and manage automated workflows</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Flow
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {flowStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-violet-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-violet-500/10 rounded-lg">
                    <stat.icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-400">
                    <TrendingUp className="w-4 h-4" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flows List */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-violet-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-violet-300">Automation Flows</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {automationFlows.map((flow) => (
                <motion.div
                  key={flow.id}
                  className="p-4 bg-slate-800/30 rounded-lg border border-violet-500/10 hover:border-violet-500/30 transition-all"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-violet-500/10 rounded-lg mt-1">
                        <Workflow className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{flow.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{flow.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {getTriggerIcon(flow.trigger)}
                          <span className="text-xs text-slate-400">Trigger: {flow.trigger}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-3">
                          {flow.steps.map((step, index) => (
                            <div key={index} className="flex items-center">
                              <Badge variant="outline" className="text-xs bg-slate-800/50">{step}</Badge>
                              {index < flow.steps.length - 1 && <ArrowRight className="w-3 h-3 text-violet-400 mx-1" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <Badge className={flow.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                          {flow.status}
                        </Badge>
                        <Switch checked={flow.status === "active"} />
                      </div>
                      <div className="text-right mt-2">
                        <p className="text-sm text-white font-medium">{flow.executions.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">executions</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        {flow.successRate}% success
                      </div>
                      <p className="text-xs text-muted-foreground">Last: {flow.lastRun}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Button variant="ghost" size="sm" className="text-violet-400 h-7 w-7 p-0">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-violet-400 h-7 w-7 p-0">
                          <Settings className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Executions */}
        <Card className="bg-slate-900/50 border-violet-500/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-violet-300">Recent Executions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentExecutions.map((exec) => (
              <motion.div
                key={exec.id}
                className="p-3 bg-slate-800/30 rounded-lg border border-violet-500/10"
                whileHover={{ x: 3 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {exec.status === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-sm font-medium text-white">{exec.flow}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{exec.lead}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{exec.time}</p>
                    <p className="text-xs text-violet-400">{exec.duration}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutomationFlows;
