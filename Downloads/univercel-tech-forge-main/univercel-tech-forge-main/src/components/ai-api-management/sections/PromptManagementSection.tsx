/**
 * PROMPT MANAGEMENT SECTION
 * System prompts, versioning, rollback, environment
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FileText, GitBranch, RotateCcw, Server, Plus, Edit, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const prompts = [
  { id: '1', name: 'Main System Prompt', version: 'v3.2', env: 'prod', model: 'GPT-4', tokens: 2400, lastUpdated: '2 hours ago' },
  { id: '2', name: 'Customer Support', version: 'v2.1', env: 'prod', model: 'Claude 3', tokens: 1800, lastUpdated: '1 day ago' },
  { id: '3', name: 'Code Assistant', version: 'v4.0', env: 'dev', model: 'GPT-4', tokens: 3200, lastUpdated: '3 hours ago' },
  { id: '4', name: 'Content Moderation', version: 'v1.5', env: 'staging', model: 'Gemini Pro', tokens: 1200, lastUpdated: '5 days ago' },
];

const versions = [
  { version: 'v3.2', date: '2024-01-15', author: 'Admin', status: 'active', changes: 'Improved response clarity' },
  { version: 'v3.1', date: '2024-01-10', author: 'Admin', status: 'archived', changes: 'Added safety guidelines' },
  { version: 'v3.0', date: '2024-01-05', author: 'System', status: 'archived', changes: 'Major restructure' },
];

export const PromptManagementSection = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>('1');

  const getEnvBadge = (env: string) => {
    switch (env) {
      case 'prod': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'staging': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'dev': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <FileText className="w-5 h-5 text-violet-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">12</p>
            <p className="text-xs text-muted-foreground">Total Prompts</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <GitBranch className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">47</p>
            <p className="text-xs text-muted-foreground">Total Versions</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Server className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">8</p>
            <p className="text-xs text-muted-foreground">In Production</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <RotateCcw className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-xs text-muted-foreground">Rollbacks Today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">System Prompts</CardTitle>
            <Button size="sm" variant="outline" onClick={() => toast.success('Creating new prompt')}>
              <Plus className="w-3 h-3 mr-2" />
              New Prompt
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {prompts.map((prompt) => (
                <div 
                  key={prompt.id} 
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedPrompt === prompt.id ? 'bg-primary/20 border border-primary/50' : 'bg-muted/20 hover:bg-muted/30'
                  }`}
                  onClick={() => setSelectedPrompt(prompt.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-white text-sm">{prompt.name}</p>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-[10px]">{prompt.version}</Badge>
                      <Badge variant="outline" className={`text-[10px] ${getEnvBadge(prompt.env)}`}>
                        {prompt.env}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{prompt.model} • {prompt.tokens} tokens</span>
                    <span>{prompt.lastUpdated}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Version History</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => toast.info('Comparing versions')}>
              <GitBranch className="w-3 h-3 mr-2" />
              Compare
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {versions.map((v, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/20 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-white text-sm">{v.version}</p>
                      {v.status === 'active' && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Active</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{v.changes}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{v.date} by {v.author}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast.success(`Rolled back to ${v.version}`)}>
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast.info('Copied prompt')}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Environment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {['Development', 'Staging', 'Production'].map((env) => (
              <div key={env} className="p-4 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-white">{env}</p>
                  <Switch defaultChecked={env === 'Production'} onCheckedChange={() => toast.success(`${env} toggled`)} />
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Active Prompts: {env === 'Production' ? 8 : env === 'Staging' ? 3 : 5}</p>
                  <p>Last Deploy: {env === 'Production' ? '2 hours ago' : env === 'Staging' ? '1 day ago' : '30 mins ago'}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
