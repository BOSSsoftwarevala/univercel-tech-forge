import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, MessageSquare, Image, Video, Mic, Sparkles, Settings,
  Play, Square, Plus, Trash2, CreditCard, AlertTriangle, CheckCircle2,
  Target, FileText, Database, Shield, Boxes, Smartphone, Bell,
  DollarSign, Calendar, Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Import all new sections
import {
  ModelEvaluationSection,
  PromptManagementSection,
  FineTuningSection,
  DataGovernanceSection,
  ModelRegistrySection,
  OnDeviceAISection,
  IncidentAlertsSection,
  BillingAllocationSection,
  VersionLifecycleSection,
  AISafetySection,
} from "./sections";

interface AIModel {
  id: string;
  name: string;
  type: 'text' | 'image' | 'video' | 'voice' | 'multimodal' | 'custom';
  provider: string;
  status: 'running' | 'stopped';
  payment: 'paid' | 'unpaid';
  usage: number;
  cost: string;
}

const AI_MODELS: AIModel[] = [
  { id: '1', name: 'GPT-4 Turbo', type: 'text', provider: 'OpenAI', status: 'running', payment: 'paid', usage: 78, cost: '$124' },
  { id: '2', name: 'Claude 3 Opus', type: 'text', provider: 'Anthropic', status: 'running', payment: 'paid', usage: 65, cost: '$89' },
  { id: '3', name: 'Gemini Pro', type: 'multimodal', provider: 'Google', status: 'running', payment: 'paid', usage: 45, cost: '$67' },
  { id: '4', name: 'DALL-E 3', type: 'image', provider: 'OpenAI', status: 'running', payment: 'paid', usage: 32, cost: '$45' },
  { id: '5', name: 'Stable Diffusion XL', type: 'image', provider: 'Stability', status: 'stopped', payment: 'unpaid', usage: 0, cost: '$0' },
  { id: '6', name: 'Whisper', type: 'voice', provider: 'OpenAI', status: 'running', payment: 'paid', usage: 25, cost: '$23' },
  { id: '7', name: 'ElevenLabs', type: 'voice', provider: 'ElevenLabs', status: 'stopped', payment: 'paid', usage: 0, cost: '$18' },
  { id: '8', name: 'Runway Gen-2', type: 'video', provider: 'Runway', status: 'stopped', payment: 'unpaid', usage: 0, cost: '$0' },
  { id: '9', name: 'Llama 3', type: 'text', provider: 'Meta', status: 'running', payment: 'paid', usage: 55, cost: '$0' },
  { id: '10', name: 'Custom RAG Model', type: 'custom', provider: 'Internal', status: 'running', payment: 'paid', usage: 40, cost: '$34' },
];

const TYPE_ICONS = {
  text: MessageSquare,
  image: Image,
  video: Video,
  voice: Mic,
  multimodal: Sparkles,
  custom: Settings,
};

const TYPE_COLORS = {
  text: 'violet',
  image: 'blue',
  video: 'orange',
  voice: 'emerald',
  multimodal: 'pink',
  custom: 'cyan',
};

const TABS = [
  { id: 'models', label: 'Models', icon: Brain },
  { id: 'evaluation', label: 'Evaluation', icon: Target },
  { id: 'prompts', label: 'Prompts', icon: FileText },
  { id: 'fine-tuning', label: 'Fine-Tuning', icon: Database },
  { id: 'governance', label: 'Governance', icon: Shield },
  { id: 'registry', label: 'Registry', icon: Boxes },
  { id: 'on-device', label: 'On-Device', icon: Smartphone },
  { id: 'incidents', label: 'Incidents', icon: Bell },
  { id: 'billing', label: 'Billing', icon: DollarSign },
  { id: 'lifecycle', label: 'Lifecycle', icon: Calendar },
  { id: 'safety', label: 'Safety', icon: Lock },
];

export const AIModelsView = () => {
  const [models, setModels] = useState(AI_MODELS);
  const [activeTab, setActiveTab] = useState('models');

  const handleToggleStatus = (id: string) => {
    setModels(prev => prev.map(m => 
      m.id === id ? { ...m, status: m.status === 'running' ? 'stopped' : 'running' } : m
    ));
    const model = models.find(m => m.id === id);
    toast.success(`${model?.name} ${model?.status === 'running' ? 'stopped' : 'started'}`);
  };

  const handleTogglePayment = (id: string) => {
    setModels(prev => prev.map(m => 
      m.id === id ? { ...m, payment: m.payment === 'paid' ? 'unpaid' : 'paid' } : m
    ));
    const model = models.find(m => m.id === id);
    toast.success(`${model?.name} marked as ${model?.payment === 'paid' ? 'unpaid' : 'paid'}`);
  };

  const handleDelete = (id: string) => {
    const model = models.find(m => m.id === id);
    setModels(prev => prev.filter(m => m.id !== id));
    toast.success(`${model?.name} deleted`);
  };

  const categories = ['text', 'image', 'video', 'voice', 'multimodal', 'custom'] as const;

  const ModelsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Active Models</h2>
          <p className="text-sm text-muted-foreground">Manage all AI model integrations</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add AI Model
        </Button>
      </div>

      {categories.map((category) => {
        const categoryModels = models.filter(m => m.type === category);
        if (categoryModels.length === 0) return null;
        
        const Icon = TYPE_ICONS[category];
        const color = TYPE_COLORS[category];

        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className={cn(
                "w-5 h-5",
                color === 'violet' && "text-violet-400",
                color === 'blue' && "text-blue-400",
                color === 'orange' && "text-orange-400",
                color === 'emerald' && "text-emerald-400",
                color === 'pink' && "text-pink-400",
                color === 'cyan' && "text-cyan-400",
              )} />
              <span className="text-sm font-medium text-white capitalize">{category} AI</span>
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                {categoryModels.length}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categoryModels.map((model) => (
                <motion.div key={model.id} whileHover={{ scale: 1.01 }}>
                  <Card className={cn(
                    "bg-slate-900/50 border transition-all",
                    model.status === 'running' ? "border-emerald-500/30" : "border-border/50"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-white">{model.name}</h3>
                          <p className="text-xs text-muted-foreground">{model.provider}</p>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="outline" className={cn(
                            "text-[10px]",
                            model.status === 'running' 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50" 
                              : "bg-slate-500/10 text-slate-400 border-slate-500/50"
                          )}>
                            {model.status === 'running' ? 'RUN' : 'STOP'}
                          </Badge>
                          <Badge variant="outline" className={cn(
                            "text-[10px]",
                            model.payment === 'paid' 
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/50" 
                              : "bg-amber-500/10 text-amber-400 border-amber-500/50"
                          )}>
                            {model.payment === 'paid' ? 'PAID' : 'UNPAID'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Progress value={model.usage} className="flex-1 h-1.5" />
                        <span className="text-xs text-muted-foreground">{model.usage}%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-emerald-400">{model.cost}/mo</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-7 w-7",
                              model.status === 'running' 
                                ? "text-amber-400 hover:bg-amber-500/20" 
                                : "text-emerald-400 hover:bg-emerald-500/20"
                            )}
                            onClick={() => handleToggleStatus(model.id)}
                          >
                            {model.status === 'running' ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-blue-400 hover:bg-blue-500/20"
                            onClick={() => handleTogglePayment(model.id)}
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-400 hover:bg-red-500/20"
                            onClick={() => handleDelete(model.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-violet-400" />
            AI Models
          </h1>
          <p className="text-sm text-muted-foreground">Complete AI model management & governance</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex h-10 bg-slate-900/50 p-1">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium",
                  "data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="mt-6">
          <TabsContent value="models" className="mt-0">
            <ModelsContent />
          </TabsContent>
          <TabsContent value="evaluation" className="mt-0">
            <ModelEvaluationSection />
          </TabsContent>
          <TabsContent value="prompts" className="mt-0">
            <PromptManagementSection />
          </TabsContent>
          <TabsContent value="fine-tuning" className="mt-0">
            <FineTuningSection />
          </TabsContent>
          <TabsContent value="governance" className="mt-0">
            <DataGovernanceSection />
          </TabsContent>
          <TabsContent value="registry" className="mt-0">
            <ModelRegistrySection />
          </TabsContent>
          <TabsContent value="on-device" className="mt-0">
            <OnDeviceAISection />
          </TabsContent>
          <TabsContent value="incidents" className="mt-0">
            <IncidentAlertsSection />
          </TabsContent>
          <TabsContent value="billing" className="mt-0">
            <BillingAllocationSection />
          </TabsContent>
          <TabsContent value="lifecycle" className="mt-0">
            <VersionLifecycleSection />
          </TabsContent>
          <TabsContent value="safety" className="mt-0">
            <AISafetySection />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
