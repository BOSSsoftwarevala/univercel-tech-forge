import { motion } from "framer-motion";
import { 
  Brain, Code2, Settings, Sparkles, Shield, Gauge,
  Eye, Mic, Volume2, Bug, TestTube, Cpu, TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AIModel {
  id: string;
  name: string;
  category: 'understanding' | 'development' | 'operations';
  icon: React.ComponentType<{ className?: string }>;
  status: 'active' | 'standby' | 'processing';
  usage: number;
  description: string;
}

const AI_MODELS: AIModel[] = [
  // Understanding AI
  { id: 'llm-core', name: 'LLM Core', category: 'understanding', icon: Brain, status: 'active', usage: 78, description: 'Reasoning & planning' },
  { id: 'multimodal', name: 'Multimodal AI', category: 'understanding', icon: Eye, status: 'active', usage: 65, description: 'Image/video/file understanding' },
  { id: 'speech-text', name: 'Speech-to-Text', category: 'understanding', icon: Mic, status: 'standby', usage: 0, description: 'Voice command processing' },
  { id: 'text-speech', name: 'Text-to-Speech', category: 'understanding', icon: Volume2, status: 'standby', usage: 0, description: 'Human-like responses' },
  
  // Development AI
  { id: 'code-gen', name: 'Code Generator', category: 'development', icon: Code2, status: 'processing', usage: 92, description: 'Production-ready code' },
  { id: 'ui-matcher', name: 'UI/UX Matcher', category: 'development', icon: Sparkles, status: 'active', usage: 45, description: 'Design matching' },
  { id: 'bug-detect', name: 'Bug Detector', category: 'development', icon: Bug, status: 'active', usage: 30, description: 'Auto issue detection' },
  { id: 'test-gen', name: 'Test Generator', category: 'development', icon: TestTube, status: 'standby', usage: 0, description: 'Auto test creation' },
  
  // Operations AI
  { id: 'cost-opt', name: 'Cost Optimizer', category: 'operations', icon: TrendingUp, status: 'active', usage: 55, description: 'Resource optimization' },
  { id: 'incident-pred', name: 'Incident Predictor', category: 'operations', icon: Shield, status: 'active', usage: 40, description: 'Failure prediction' },
  { id: 'auto-recover', name: 'Auto Recovery', category: 'operations', icon: Settings, status: 'standby', usage: 0, description: 'Self-healing systems' },
  { id: 'perf-tune', name: 'Performance Tuner', category: 'operations', icon: Gauge, status: 'active', usage: 62, description: 'Speed optimization' },
];

export const AIModelsPanel = () => {
  const categories = [
    { id: 'understanding', label: 'AI Core (Understanding)', icon: Brain, color: 'violet' },
    { id: 'development', label: 'AI Dev (Automation)', icon: Code2, color: 'blue' },
    { id: 'operations', label: 'AI Ops (Control)', icon: Cpu, color: 'emerald' },
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-zinc-900/80 border-violet-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-white">
          <Brain className="w-5 h-5 text-violet-400" />
          AI Models Active
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <category.icon className={cn(
                "w-4 h-4",
                category.color === 'violet' && "text-violet-400",
                category.color === 'blue' && "text-blue-400",
                category.color === 'emerald' && "text-emerald-400"
              )} />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {category.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AI_MODELS.filter(m => m.category === category.id).map((model) => (
                <motion.div
                  key={model.id}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "p-2 rounded-lg border transition-all",
                    model.status === 'active' && "bg-emerald-500/10 border-emerald-500/30",
                    model.status === 'processing' && "bg-blue-500/10 border-blue-500/30",
                    model.status === 'standby' && "bg-muted/30 border-border/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <model.icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium text-white">{model.name}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        model.status === 'active' && "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
                        model.status === 'processing' && "bg-blue-500/20 text-blue-400 border-blue-500/50 animate-pulse",
                        model.status === 'standby' && "bg-muted/50 text-muted-foreground border-border/50"
                      )}
                    >
                      {model.status}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-1">{model.description}</p>
                  {model.usage > 0 && (
                    <Progress value={model.usage} className="h-1" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
