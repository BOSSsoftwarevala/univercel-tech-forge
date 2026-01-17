import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, Eye, Mic, Volume2, Code2, Sparkles, Bug, TestTube,
  TrendingUp, Shield, Settings, Gauge, Plus, Trash2, Play, Square, CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

interface AIModel {
  id: string;
  name: string;
  category: string;
  provider: string;
  status: 'running' | 'stopped';
  payment: 'paid' | 'unpaid';
  usage: number;
  cost: string;
  risk: 'low' | 'medium' | 'high';
  icon: any;
}

const AI_MODELS: AIModel[] = [
  // Text AI (LLM)
  { id: 'gpt-5', name: 'GPT-5 LLM', category: 'Text AI', provider: 'OpenAI', status: 'running', payment: 'paid', usage: 78, cost: '$450', risk: 'low', icon: Brain },
  { id: 'gemini', name: 'Gemini Pro', category: 'Text AI', provider: 'Google', status: 'running', payment: 'paid', usage: 65, cost: '$320', risk: 'low', icon: Brain },
  { id: 'claude', name: 'Claude 3', category: 'Text AI', provider: 'Anthropic', status: 'stopped', payment: 'unpaid', usage: 0, cost: '$0', risk: 'medium', icon: Brain },
  
  // Image AI
  { id: 'dalle', name: 'DALL-E 3', category: 'Image AI', provider: 'OpenAI', status: 'running', payment: 'paid', usage: 45, cost: '$180', risk: 'low', icon: Eye },
  { id: 'midjourney', name: 'Midjourney', category: 'Image AI', provider: 'Midjourney', status: 'running', payment: 'paid', usage: 52, cost: '$96', risk: 'low', icon: Eye },
  
  // Video AI
  { id: 'runway', name: 'Runway Gen-3', category: 'Video AI', provider: 'Runway', status: 'stopped', payment: 'unpaid', usage: 0, cost: '$0', risk: 'medium', icon: Sparkles },
  
  // Voice AI
  { id: 'whisper', name: 'Whisper STT', category: 'Voice AI', provider: 'OpenAI', status: 'running', payment: 'paid', usage: 30, cost: '$75', risk: 'low', icon: Mic },
  { id: 'elevenlabs', name: 'ElevenLabs TTS', category: 'Voice AI', provider: 'ElevenLabs', status: 'running', payment: 'paid', usage: 25, cost: '$50', risk: 'low', icon: Volume2 },
  
  // Multimodal AI
  { id: 'gpt4v', name: 'GPT-4 Vision', category: 'Multimodal AI', provider: 'OpenAI', status: 'running', payment: 'paid', usage: 40, cost: '$200', risk: 'low', icon: Eye },
  
  // Custom Internal AI
  { id: 'custom-code', name: 'Code Generator', category: 'Custom AI', provider: 'Internal', status: 'running', payment: 'paid', usage: 92, cost: '$0', risk: 'low', icon: Code2 },
  { id: 'custom-bug', name: 'Bug Detector', category: 'Custom AI', provider: 'Internal', status: 'running', payment: 'paid', usage: 85, cost: '$0', risk: 'low', icon: Bug },
  { id: 'custom-test', name: 'Test Generator', category: 'Custom AI', provider: 'Internal', status: 'stopped', payment: 'paid', usage: 0, cost: '$0', risk: 'low', icon: TestTube },
];

const CATEGORIES = ['All', 'Text AI', 'Image AI', 'Video AI', 'Voice AI', 'Multimodal AI', 'Custom AI'];

export const UnifiedAIManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [models, setModels] = useState(AI_MODELS);

  const filteredModels = selectedCategory === 'All' 
    ? models 
    : models.filter(m => m.category === selectedCategory);

  const toggleStatus = (id: string) => {
    setModels(models.map(m => 
      m.id === id ? { ...m, status: m.status === 'running' ? 'stopped' : 'running' } : m
    ));
  };

  const togglePayment = (id: string) => {
    setModels(models.map(m => 
      m.id === id ? { ...m, payment: m.payment === 'paid' ? 'unpaid' : 'paid' } : m
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-violet-400" />
            AI Management
          </h1>
          <p className="text-muted-foreground">Manage all AI models with 4 simple actions</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-1" /> Add AI
          </Button>
          <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <Button
            key={cat}
            size="sm"
            variant={selectedCategory === cat ? "default" : "outline"}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? "bg-violet-600" : ""}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{models.filter(m => m.status === 'running').length}</p>
            <p className="text-xs text-muted-foreground">Running</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-400">{models.filter(m => m.status === 'stopped').length}</p>
            <p className="text-xs text-muted-foreground">Stopped</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{models.filter(m => m.payment === 'paid').length}</p>
            <p className="text-xs text-muted-foreground">Paid</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{models.filter(m => m.payment === 'unpaid').length}</p>
            <p className="text-xs text-muted-foreground">Unpaid</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Models Table */}
      <Card className="bg-slate-900/50 border-border/50">
        <CardContent className="p-0">
          <div className="rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">AI Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Category</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Provider</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Payment</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Usage</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Cost</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Risk</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredModels.map((model) => (
                  <motion.tr 
                    key={model.id} 
                    className="hover:bg-slate-800/30 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <model.icon className="w-4 h-4 text-violet-400" />
                        <span className="text-sm font-medium text-white">{model.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">{model.category}</Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{model.provider}</td>
                    <td className="p-3">
                      <Badge className={model.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
                        {model.status === 'running' ? '● RUN' : '○ STOP'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={model.payment === 'paid' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}>
                        {model.payment.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3 w-24">
                      <div className="flex items-center gap-2">
                        <Progress value={model.usage} className="h-2" />
                        <span className="text-xs text-muted-foreground">{model.usage}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm font-medium text-white">{model.cost}</td>
                    <td className="p-3">
                      <Badge className={
                        model.risk === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                        model.risk === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }>
                        {model.risk}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-xs"
                          onClick={() => toggleStatus(model.id)}
                        >
                          {model.status === 'running' ? <Square className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                          {model.status === 'running' ? 'Stop' : 'Run'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-xs"
                          onClick={() => togglePayment(model.id)}
                        >
                          <CreditCard className="w-3 h-3 mr-1" />
                          {model.payment === 'paid' ? 'Unpay' : 'Pay'}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
