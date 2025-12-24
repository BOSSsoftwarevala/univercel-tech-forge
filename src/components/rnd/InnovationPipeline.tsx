import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRnDAI } from "@/hooks/useRnDAI";
import {
  Lightbulb,
  FlaskConical,
  Code,
  TestTube,
  Rocket,
  CheckCircle,
  ArrowRight,
  Brain,
  Loader2,
  Plus,
  Eye,
  Sparkles
} from "lucide-react";

interface PipelineItem {
  id: string;
  title: string;
  description: string;
  stage: "ideation" | "research" | "prototype" | "testing" | "launch" | "completed";
  progress: number;
  priority: "low" | "medium" | "high" | "critical";
  assignee: string;
  dueDate: string;
  aiScore?: number;
}

const mockPipelineItems: PipelineItem[] = [
  {
    id: "1",
    title: "AI-Powered Code Review",
    description: "Automated code review with AI suggestions",
    stage: "prototype",
    progress: 65,
    priority: "high",
    assignee: "vala(rnd)2341",
    dueDate: "2024-02-15",
    aiScore: 87
  },
  {
    id: "2",
    title: "Real-Time Collaboration",
    description: "Multi-cursor editing with presence",
    stage: "testing",
    progress: 85,
    priority: "critical",
    assignee: "vala(dev)4412",
    dueDate: "2024-02-10",
    aiScore: 92
  },
  {
    id: "3",
    title: "Visual Database Designer",
    description: "Drag-and-drop schema builder",
    stage: "research",
    progress: 35,
    priority: "medium",
    assignee: "vala(design)8892",
    dueDate: "2024-03-01",
    aiScore: 78
  },
  {
    id: "4",
    title: "Smart Task Automation",
    description: "AI-driven task distribution",
    stage: "ideation",
    progress: 15,
    priority: "high",
    assignee: "vala(rnd)2341",
    dueDate: "2024-03-15",
    aiScore: 81
  },
  {
    id: "5",
    title: "Predictive Analytics Dashboard",
    description: "ML-powered business insights",
    stage: "launch",
    progress: 95,
    priority: "high",
    assignee: "vala(data)5567",
    dueDate: "2024-01-30",
    aiScore: 89
  },
];

const stages = [
  { id: "ideation", label: "Ideation", icon: Lightbulb, color: "amber" },
  { id: "research", label: "Research", icon: FlaskConical, color: "purple" },
  { id: "prototype", label: "Prototype", icon: Code, color: "blue" },
  { id: "testing", label: "Testing", icon: TestTube, color: "cyan" },
  { id: "launch", label: "Launch", icon: Rocket, color: "emerald" },
  { id: "completed", label: "Completed", icon: CheckCircle, color: "green" },
];

export const InnovationPipeline = () => {
  const [items, setItems] = useState<PipelineItem[]>(mockPipelineItems);
  const [selectedItem, setSelectedItem] = useState<PipelineItem | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const { isLoading, assessImpact } = useRnDAI();

  const getStageItems = (stageId: string) => items.filter(item => item.stage === stageId);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "low": return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default: return "";
    }
  };

  const handleAnalyzeItem = async (item: PipelineItem) => {
    setSelectedItem(item);
    const response = await assessImpact(
      item.title,
      `Currently in ${item.stage} stage with ${item.progress}% progress`,
      item.description
    );
    if (response) {
      setAiAnalysis(response);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-cyan-600/30 border border-emerald-500/30">
            <Rocket className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Innovation Pipeline
            </h2>
            <p className="text-slate-400 text-sm">Track R&D projects from ideation to launch</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-violet-600 to-cyan-600">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </motion.div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-6 gap-4">
        {stages.map((stage, idx) => {
          const count = getStageItems(stage.id).length;
          const Icon = stage.icon;
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-slate-900/50 border-violet-500/20 p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${stage.color}-500/20`}>
                    <Icon className={`w-4 h-4 text-${stage.color}-400`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{count}</p>
                    <p className="text-xs text-slate-500">{stage.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-6 gap-4">
        {stages.map((stage, stageIdx) => {
          const stageItems = getStageItems(stage.id);
          const Icon = stage.icon;
          
          return (
            <div key={stage.id} className="space-y-4">
              {/* Stage Header */}
              <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
                <Icon className={`w-4 h-4 text-${stage.color}-400`} />
                <span className="text-sm font-semibold text-slate-300">{stage.label}</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {stageItems.length}
                </Badge>
              </div>

              {/* Stage Items */}
              <ScrollArea className="h-[500px]">
                <div className="space-y-3 pr-2">
                  <AnimatePresence>
                    {stageItems.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        layoutId={item.id}
                      >
                        <Card 
                          className="bg-slate-800/50 border-slate-700 p-3 cursor-pointer hover:border-violet-500/50 transition-all"
                          onClick={() => handleAnalyzeItem(item)}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-sm font-semibold text-white line-clamp-2">
                              {item.title}
                            </h4>
                            {item.aiScore && (
                              <Badge className="bg-violet-500/20 text-violet-400 text-xs shrink-0">
                                {item.aiScore}
                              </Badge>
                            )}
                          </div>
                          
                          <Badge className={`text-xs mb-2 ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </Badge>

                          <Progress value={item.progress} className="h-1 mb-2" />
                          
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{item.assignee.split('(')[1]?.replace(')', '')}</span>
                            <span>{item.progress}%</span>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {stageItems.length === 0 && (
                    <div className="text-center py-8 text-slate-600">
                      <Icon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-xs">No items</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>

      {/* AI Analysis Panel */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-slate-900/50 border-violet-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-violet-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedItem.title}</h3>
                  <p className="text-sm text-slate-500">AI Impact Analysis</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedItem(null);
                  setAiAnalysis(null);
                }}
              >
                Close
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
                <span className="ml-3 text-slate-400">Analyzing project impact...</span>
              </div>
            ) : aiAnalysis ? (
              <ScrollArea className="h-[300px]">
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{aiAnalysis}</p>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Click on a project to get AI analysis</p>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
};
