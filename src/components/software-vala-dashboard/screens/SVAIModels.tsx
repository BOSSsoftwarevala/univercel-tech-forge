/**
 * AI MODELS SCREEN
 * Model cards with toggles, versions, status
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Mic, 
  Languages, 
  ScanLine,
  DollarSign,
  Settings2,
  CheckCircle2,
  AlertCircle,
  PauseCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AIModel {
  id: string;
  name: string;
  type: 'LLM' | 'Speech' | 'Translation' | 'OCR';
  provider: string;
  version: string;
  versions: string[];
  costPerRequest: string;
  status: 'active' | 'paused' | 'error';
  enabled: boolean;
}

const initialModels: AIModel[] = [
  {
    id: '1',
    name: 'GPT-5',
    type: 'LLM',
    provider: 'OpenAI',
    version: 'v5.0',
    versions: ['v5.0', 'v5.0-mini', 'v5.0-nano'],
    costPerRequest: '$0.0025',
    status: 'active',
    enabled: true
  },
  {
    id: '2',
    name: 'Gemini 3 Pro',
    type: 'LLM',
    provider: 'Google',
    version: 'v3.0-preview',
    versions: ['v3.0-preview', 'v2.5-pro', 'v2.5-flash'],
    costPerRequest: '$0.0018',
    status: 'active',
    enabled: true
  },
  {
    id: '3',
    name: 'Whisper Large',
    type: 'Speech',
    provider: 'OpenAI',
    version: 'v3',
    versions: ['v3', 'v2', 'v1'],
    costPerRequest: '$0.0060',
    status: 'active',
    enabled: true
  },
  {
    id: '4',
    name: 'LLaMA 3.1',
    type: 'LLM',
    provider: 'Meta',
    version: '70B',
    versions: ['70B', '13B', '7B'],
    costPerRequest: '$0.0012',
    status: 'paused',
    enabled: false
  },
  {
    id: '5',
    name: 'Neural Translation',
    type: 'Translation',
    provider: 'Custom',
    version: 'v2.1',
    versions: ['v2.1', 'v2.0', 'v1.5'],
    costPerRequest: '$0.0008',
    status: 'active',
    enabled: true
  },
  {
    id: '6',
    name: 'DocOCR Pro',
    type: 'OCR',
    provider: 'Custom',
    version: 'v4.0',
    versions: ['v4.0', 'v3.5', 'v3.0'],
    costPerRequest: '$0.0015',
    status: 'error',
    enabled: false
  }
];

const typeIcons: Record<string, React.ElementType> = {
  LLM: Brain,
  Speech: Mic,
  Translation: Languages,
  OCR: ScanLine
};

const statusConfig = {
  active: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  paused: { icon: PauseCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  error: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
};

export const SVAIModels: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>(initialModels);

  const handleToggle = (id: string) => {
    setModels(prev => prev.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled, status: !m.enabled ? 'active' : 'paused' } : m
    ));
    toast({ title: 'Model Updated', description: 'Model status has been changed' });
  };

  const handleVersionChange = (id: string, version: string) => {
    setModels(prev => prev.map(m => m.id === id ? { ...m, version } : m));
    toast({ title: 'Version Changed', description: `Model updated to ${version}` });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AI Models</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and configure AI model providers</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Settings2 className="w-4 h-4 mr-2" />
          Configure Defaults
        </Button>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {models.map((model) => {
          const TypeIcon = typeIcons[model.type];
          const statusInfo = statusConfig[model.status];
          const StatusIcon = statusInfo.icon;

          return (
            <Card 
              key={model.id} 
              className={`bg-white border-slate-200 shadow-sm hover:shadow-md transition-all rounded-xl ${
                !model.enabled ? 'opacity-75' : ''
              }`}
            >
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <TypeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{model.name}</h3>
                      <p className="text-xs text-slate-500">{model.provider}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={model.enabled}
                    onCheckedChange={() => handleToggle(model.id)}
                  />
                </div>

                {/* Type Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                    {model.type}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                  </Badge>
                </div>

                {/* Version Selector */}
                <div className="mb-4">
                  <label className="text-xs text-slate-500 mb-1.5 block">Version</label>
                  <Select value={model.version} onValueChange={(v) => handleVersionChange(model.id, v)}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {model.versions.map((v) => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cost */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">Cost per request</span>
                  <div className="flex items-center gap-1 text-sm font-medium text-slate-800">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    {model.costPerRequest.replace('$', '')}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
