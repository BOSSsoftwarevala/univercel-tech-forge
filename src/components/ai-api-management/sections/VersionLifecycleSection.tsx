/**
 * VERSION LIFECYCLE SECTION
 * Deprecation date, migration notice, auto upgrade
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar, Clock, ArrowUpCircle, AlertTriangle, CheckCircle, 
  XCircle, Bell, Settings, ChevronRight, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

const modelVersions = [
  { 
    model: 'GPT-4 Turbo', 
    current: '0125', 
    latest: '0125', 
    status: 'current',
    deprecation: null,
    migration: null 
  },
  { 
    model: 'Claude 3 Opus', 
    current: '20240229', 
    latest: '20240315', 
    status: 'update-available',
    deprecation: null,
    migration: { deadline: '2024-04-01', progress: 0 }
  },
  { 
    model: 'GPT-3.5 Turbo', 
    current: '0613', 
    latest: '0125', 
    status: 'deprecated',
    deprecation: '2024-06-13',
    migration: { deadline: '2024-06-01', progress: 45 }
  },
  { 
    model: 'Gemini Pro', 
    current: '1.0', 
    latest: '1.5', 
    status: 'update-available',
    deprecation: null,
    migration: null
  },
];

const upcomingChanges = [
  { model: 'GPT-4', change: 'New version release', date: '2024-02-15', impact: 'low' },
  { model: 'Claude 2', change: 'End of support', date: '2024-03-01', impact: 'high' },
  { model: 'Whisper v2', change: 'Pricing change', date: '2024-02-28', impact: 'medium' },
  { model: 'DALL-E 2', change: 'Deprecation notice', date: '2024-04-15', impact: 'high' },
];

const autoUpgradeRules = [
  { name: 'Patch Updates', description: 'Auto-apply security patches', enabled: true },
  { name: 'Minor Updates', description: 'Auto-apply minor version updates', enabled: false },
  { name: 'Major Updates', description: 'Require manual approval', enabled: false },
  { name: 'Deprecation Migration', description: 'Auto-migrate before EOL', enabled: true },
];

export const VersionLifecycleSection = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current': return 'bg-emerald-500/20 text-emerald-400';
      case 'update-available': return 'bg-blue-500/20 text-blue-400';
      case 'deprecated': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      case 'low': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">2</p>
            <p className="text-xs text-muted-foreground">Up to Date</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <ArrowUpCircle className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">2</p>
            <p className="text-xs text-muted-foreground">Updates Available</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">1</p>
            <p className="text-xs text-muted-foreground">Deprecated</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Calendar className="w-5 h-5 text-violet-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">4</p>
            <p className="text-xs text-muted-foreground">Upcoming Changes</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Model Version Status</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast.success('Checking for updates')}>
            <RefreshCw className="w-3 h-3 mr-2" />
            Check Updates
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {modelVersions.map((model, i) => (
              <div key={i} className={`p-4 rounded-lg ${model.status === 'deprecated' ? 'bg-red-500/10 border border-red-500/30' : 'bg-muted/20'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-white">{model.model}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>Current: v{model.current}</span>
                      {model.current !== model.latest && (
                        <>
                          <ChevronRight className="w-3 h-3" />
                          <span className="text-blue-400">Latest: v{model.latest}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {model.deprecation && (
                      <div className="text-right">
                        <p className="text-xs text-red-400">EOL: {model.deprecation}</p>
                      </div>
                    )}
                    <Badge className={getStatusBadge(model.status)}>
                      {model.status === 'current' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {model.status === 'update-available' && <ArrowUpCircle className="w-3 h-3 mr-1" />}
                      {model.status === 'deprecated' && <XCircle className="w-3 h-3 mr-1" />}
                      {model.status}
                    </Badge>
                    {model.status !== 'current' && (
                      <Button size="sm" variant="outline" onClick={() => toast.success(`Upgrading ${model.model}`)}>
                        Upgrade
                      </Button>
                    )}
                  </div>
                </div>
                {model.migration && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Migration Progress</span>
                      <span className="text-white">Deadline: {model.migration.deadline}</span>
                    </div>
                    <Progress value={model.migration.progress} className="h-1.5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Upcoming Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingChanges.map((change, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-violet-400" />
                    <div>
                      <p className="font-medium text-white text-sm">{change.model}</p>
                      <p className="text-xs text-muted-foreground">{change.change}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{change.date}</span>
                    <Badge className={getImpactBadge(change.impact)}>{change.impact}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Auto-Upgrade Rules</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => toast.info('Opening settings')}>
              <Settings className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {autoUpgradeRules.map((rule, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="font-medium text-white text-sm">{rule.name}</p>
                    <p className="text-xs text-muted-foreground">{rule.description}</p>
                  </div>
                  <Switch defaultChecked={rule.enabled} onCheckedChange={() => toast.success(`${rule.name} toggled`)} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-amber-500/10 border-amber-500/30">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-amber-400" />
            <div>
              <p className="font-medium text-white">Migration Notice: GPT-3.5 Turbo</p>
              <p className="text-xs text-muted-foreground">This model will be deprecated on June 13, 2024. Please migrate to GPT-4 Turbo.</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => toast.success('Starting migration wizard')}>
            Start Migration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
