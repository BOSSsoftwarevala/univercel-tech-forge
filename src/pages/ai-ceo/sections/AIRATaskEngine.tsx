import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  ListTodo, Play, CheckCircle2, Clock, AlertTriangle,
  Zap, Brain, Code, Database, Server, Rocket,
  FileCode, Shield, TestTube, BarChart3, Send
} from "lucide-react";

interface AutonomousTask {
  id: string;
  title: string;
  prompt: string;
  status: "queued" | "planning" | "executing" | "testing" | "complete" | "failed";
  progress: number;
  steps: { name: string; status: "done" | "active" | "pending" }[];
  created: string;
}

const PIPELINE_STEPS = [
  "Requirement Analysis",
  "Feature Planning",
  "UI Generation",
  "Database Schema",
  "API Architecture",
  "Code Generation",
  "Testing",
  "Deployment"
];

const MOCK_TASKS: AutonomousTask[] = [
  {
    id: "1",
    title: "Build Customer Feedback Module",
    prompt: "Create a feedback collection system with ratings, comments, and analytics dashboard",
    status: "executing",
    progress: 62,
    steps: [
      { name: "Requirement Analysis", status: "done" },
      { name: "Feature Planning", status: "done" },
      { name: "UI Generation", status: "done" },
      { name: "Database Schema", status: "done" },
      { name: "API Architecture", status: "active" },
      { name: "Code Generation", status: "pending" },
      { name: "Testing", status: "pending" },
      { name: "Deployment", status: "pending" },
    ],
    created: "10 min ago"
  },
  {
    id: "2",
    title: "Add Multi-Currency Support",
    prompt: "Implement multi-currency support for the marketplace with real-time exchange rates",
    status: "planning",
    progress: 15,
    steps: [
      { name: "Requirement Analysis", status: "done" },
      { name: "Feature Planning", status: "active" },
      { name: "UI Generation", status: "pending" },
      { name: "Database Schema", status: "pending" },
      { name: "API Architecture", status: "pending" },
      { name: "Code Generation", status: "pending" },
      { name: "Testing", status: "pending" },
      { name: "Deployment", status: "pending" },
    ],
    created: "25 min ago"
  },
  {
    id: "3",
    title: "Generate Analytics Report API",
    prompt: "Build REST API for generating downloadable PDF analytics reports",
    status: "complete",
    progress: 100,
    steps: PIPELINE_STEPS.map(s => ({ name: s, status: "done" as const })),
    created: "2 hr ago"
  },
];

const AIRATaskEngine = () => {
  const [newPrompt, setNewPrompt] = useState("");

  const statusStyle = (s: string) => {
    if (s === "complete") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (s === "executing") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (s === "planning") return "bg-violet-500/20 text-violet-400 border-violet-500/30";
    if (s === "queued") return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    if (s === "testing") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const stepIcon = (s: string) => {
    if (s === "done") return <CheckCircle2 className="w-3 h-3 text-emerald-400" />;
    if (s === "active") return <Zap className="w-3 h-3 text-blue-400 animate-pulse" />;
    return <Clock className="w-3 h-3 text-slate-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/20">
            <ListTodo className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Autonomous Task Engine</h1>
            <p className="text-emerald-400/80">AI-Driven Development Pipeline • Auto Execution</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-2">
            <Brain className="w-3 h-3 mr-2" />
            {MOCK_TASKS.filter(t => t.status === "executing" || t.status === "planning").length} Active
          </Badge>
        </div>
      </div>

      {/* New Task Input */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Brain className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50" />
              <Input
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="Describe what to build... e.g. 'Create CRM software with lead tracking'"
                className="pl-10 bg-slate-800/50 border-slate-700/30 text-white focus:border-emerald-500/50"
              />
            </div>
            <Button className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30">
              <Send className="w-4 h-4 mr-2" />
              Execute
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">AIRA will autonomously plan, build, test, and deploy</p>
        </CardContent>
      </Card>

      {/* Pipeline Visual */}
      <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
        <p className="text-xs text-emerald-400/80 mb-3 uppercase tracking-wider font-medium">Autonomous Pipeline</p>
        <div className="flex items-center justify-between">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-1">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-300">
                  {i + 1}
                </div>
                <span className="text-[10px] text-slate-400 text-center max-w-[70px]">{step}</span>
              </div>
              {i < PIPELINE_STEPS.length - 1 && <span className="text-emerald-500/30 mb-4">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {MOCK_TASKS.map((task, i) => (
          <motion.div key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="bg-slate-900/50 border-slate-700/50 hover:border-emerald-500/20 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{task.prompt}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusStyle(task.status)}>{task.status}</Badge>
                    <span className="text-xs text-slate-500">{task.created}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <Progress value={task.progress} className="h-2 flex-1" />
                  <span className="text-sm font-medium text-emerald-400">{task.progress}%</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {task.steps.map((step, si) => (
                    <div key={si} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
                      step.status === "done" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      step.status === "active" ? "bg-blue-500/10 text-blue-400 border border-blue-500/30" :
                      "bg-slate-800/50 text-slate-500 border border-slate-700/20"
                    }`}>
                      {stepIcon(step.status)}
                      {step.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIRATaskEngine;
