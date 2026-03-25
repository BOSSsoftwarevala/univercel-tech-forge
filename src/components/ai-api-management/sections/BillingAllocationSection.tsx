/**
 * BILLING ALLOCATION SECTION
 * Cost per client, cost per feature, budget caps
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  DollarSign, Users, Layers, AlertTriangle, TrendingUp, 
  Building, PieChart, Edit, Plus, Bell
} from "lucide-react";
import { toast } from "sonner";

const clientCosts = [
  { client: 'Acme Corp', usage: '$2,450', budget: '$3,000', percent: 82, models: ['GPT-4', 'DALL-E'], alert: false },
  { client: 'TechStart Inc', usage: '$1,890', budget: '$2,500', percent: 76, models: ['Claude 3', 'Whisper'], alert: false },
  { client: 'GlobalMedia', usage: '$4,200', budget: '$4,500', percent: 93, models: ['GPT-4', 'Gemini'], alert: true },
  { client: 'Internal Use', usage: '$890', budget: '$1,500', percent: 59, models: ['All'], alert: false },
];

const featureCosts = [
  { feature: 'Content Generation', cost: '$3,240', requests: '45.2K', avgCost: '$0.072', growth: '+12%' },
  { feature: 'Image Creation', cost: '$1,890', requests: '12.8K', avgCost: '$0.148', growth: '+8%' },
  { feature: 'Voice Transcription', cost: '$780', requests: '8.9K', avgCost: '$0.088', growth: '-3%' },
  { feature: 'Code Assistant', cost: '$1,450', requests: '23.1K', avgCost: '$0.063', growth: '+25%' },
  { feature: 'Customer Support', cost: '$2,100', requests: '67.4K', avgCost: '$0.031', growth: '+5%' },
];

const budgetCaps = [
  { name: 'GPT-4 Turbo', monthly: 5000, current: 3240, hardLimit: true },
  { name: 'Claude 3 Opus', monthly: 3000, current: 1890, hardLimit: true },
  { name: 'DALL-E 3', monthly: 1500, current: 1200, hardLimit: false },
  { name: 'Total AI Spend', monthly: 15000, current: 9460, hardLimit: true },
];

export const BillingAllocationSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">$9,460</p>
            <p className="text-xs text-muted-foreground">Month-to-Date</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Users className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">4</p>
            <p className="text-xs text-muted-foreground">Billing Clients</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Layers className="w-5 h-5 text-violet-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">5</p>
            <p className="text-xs text-muted-foreground">Cost Centers</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">1</p>
            <p className="text-xs text-muted-foreground">Budget Alerts</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Cost by Client</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast.success('Adding new client')}>
            <Plus className="w-3 h-3 mr-2" />
            Add Client
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clientCosts.map((client, i) => (
              <div key={i} className={`p-4 rounded-lg ${client.alert ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-muted/20'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-medium text-white">{client.client}</p>
                      <p className="text-xs text-muted-foreground">{client.models.join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-white font-medium">{client.usage}</p>
                      <p className="text-xs text-muted-foreground">of {client.budget}</p>
                    </div>
                    {client.alert && (
                      <Badge className="bg-amber-500/20 text-amber-400">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Near Limit
                      </Badge>
                    )}
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast.info('Editing client budget')}>
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <Progress value={client.percent} className={`h-2 ${client.percent > 90 ? '[&>div]:bg-amber-500' : ''}`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Cost by Feature</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {featureCosts.map((feature, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/20">
                <p className="font-medium text-white text-sm mb-2">{feature.feature}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost</span>
                    <span className="text-emerald-400 font-medium">{feature.cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Requests</span>
                    <span className="text-white">{feature.requests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg/req</span>
                    <span className="text-white">{feature.avgCost}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-muted-foreground">Growth</span>
                    <span className={feature.growth.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}>
                      {feature.growth}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Budget Caps</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast.success('Configuring alerts')}>
            <Bell className="w-3 h-3 mr-2" />
            Configure Alerts
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {budgetCaps.map((cap, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-white">{cap.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {cap.hardLimit ? 'Hard Limit' : 'Soft Limit'}
                    </Badge>
                    <Switch defaultChecked={cap.hardLimit} onCheckedChange={() => toast.success('Limit type toggled')} />
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">${cap.current.toLocaleString()}</span>
                  <span className="text-white">${cap.monthly.toLocaleString()}/mo</span>
                </div>
                <Progress 
                  value={(cap.current / cap.monthly) * 100} 
                  className={`h-2 ${(cap.current / cap.monthly) > 0.9 ? '[&>div]:bg-amber-500' : ''}`} 
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round((cap.current / cap.monthly) * 100)}% used • ${(cap.monthly - cap.current).toLocaleString()} remaining
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
