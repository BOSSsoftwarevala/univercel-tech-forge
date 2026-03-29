import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bug, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Wrench,
  MessageSquare,
  Upload,
  Sparkles
} from "lucide-react";

const BugChangeTracker = () => {
  const bugs = [
    {
      id: "BUG-001",
      title: "Payment form validation error",
      priority: "high",
      status: "in-progress",
      reported: "Dec 18, 2024",
      assignee: "Dev-A7X",
      sla: "2 hours"
    },
    {
      id: "BUG-002",
      title: "Mobile menu not responsive",
      priority: "medium",
      status: "resolved",
      reported: "Dec 17, 2024",
      assignee: "Dev-K2M",
      sla: "Completed"
    },
    {
      id: "BUG-003",
      title: "Dashboard loading slow",
      priority: "low",
      status: "pending",
      reported: "Dec 19, 2024",
      assignee: "Unassigned",
      sla: "4 hours"
    }
  ];

  const changeRequests = [
    {
      id: "CR-001",
      title: "Add dark mode toggle",
      impact: "low",
      status: "approved",
      submitted: "Dec 15, 2024",
      eta: "Dec 20, 2024"
    },
    {
      id: "CR-002",
      title: "Custom email templates",
      impact: "medium",
      status: "in-review",
      submitted: "Dec 18, 2024",
      eta: "Pending"
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/40">High</Badge>;
      case "medium":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
      case "approved":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "in-progress":
      case "in-review":
        return <Clock className="w-4 h-4 text-amber-400" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-stone-900/90 to-stone-950/90 border-amber-500/20 backdrop-blur-xl">
      <CardHeader className="border-b border-amber-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Bug className="w-5 h-5 text-amber-400" />
            Bug & Change Tracker
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
              <Upload className="w-4 h-4 mr-2" />
              Upload Recording
            </Button>
            <Button className="bg-amber-500 hover:bg-amber-600 text-stone-900">
              <Plus className="w-4 h-4 mr-2" />
              Report Issue
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs defaultValue="bugs" className="w-full">
          <TabsList className="bg-stone-800/50 border border-stone-700/50 mb-6">
            <TabsTrigger value="bugs" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">
              <Bug className="w-4 h-4 mr-2" />
              Bug Reports
            </TabsTrigger>
            <TabsTrigger value="changes" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">
              <Wrench className="w-4 h-4 mr-2" />
              Change Requests
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bugs" className="space-y-3">
            {bugs.map((bug, index) => (
              <motion.div
                key={bug.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-stone-800/30 border border-stone-700/30 hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      bug.priority === "high" ? "bg-red-500/20" : bug.priority === "medium" ? "bg-amber-500/20" : "bg-blue-500/20"
                    }`}>
                      <Bug className={`w-5 h-5 ${
                        bug.priority === "high" ? "text-red-400" : bug.priority === "medium" ? "text-amber-400" : "text-blue-400"
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 font-mono">{bug.id}</span>
                        {getPriorityBadge(bug.priority)}
                      </div>
                      <h5 className="text-stone-200 font-medium mt-1">{bug.title}</h5>
                      <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                        <span>Reported: {bug.reported}</span>
                        <span>Assignee: {bug.assignee}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(bug.status)}
                      <span className="text-sm text-stone-400 capitalize">{bug.status.replace("-", " ")}</span>
                    </div>
                    <p className="text-xs text-amber-400 mt-1">SLA: {bug.sla}</p>
                  </div>
                </div>
                
                {bug.status === "in-progress" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </motion.div>
                      <span className="text-sm text-amber-300">AI auto-reproducing bug from logs...</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-amber-400 hover:text-amber-300">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Add Comment
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </TabsContent>
          
          <TabsContent value="changes" className="space-y-3">
            {changeRequests.map((cr, index) => (
              <motion.div
                key={cr.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-stone-800/30 border border-stone-700/30 hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 font-mono">{cr.id}</span>
                        <Badge className={
                          cr.impact === "low" 
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                        }>
                          {cr.impact} impact
                        </Badge>
                      </div>
                      <h5 className="text-stone-200 font-medium mt-1">{cr.title}</h5>
                      <p className="text-sm text-stone-500 mt-1">Submitted: {cr.submitted}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(cr.status)}
                      <span className="text-sm text-stone-400 capitalize">{cr.status.replace("-", " ")}</span>
                    </div>
                    <p className="text-xs text-amber-400 mt-1">ETA: {cr.eta}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* AI Impact Calculator */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">AI Change Impact Calculator</span>
              </div>
              <p className="text-xs text-stone-400">
                Submit a change request and our AI will analyze the development impact, timeline, and resource requirements.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BugChangeTracker;
