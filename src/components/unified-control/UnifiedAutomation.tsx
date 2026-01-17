import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, AlertTriangle, Bug, TrendingUp, Server, Wrench,
  Search, Plus, Trash2, Play, Square, Settings, CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: 'active' | 'inactive';
  triggeredCount: number;
  lastTriggered: string;
  category: string;
}

const AUTOMATION_RULES: AutomationRule[] = [
  { id: 'unpaid-stop', name: 'Auto Stop Unpaid', trigger: 'IF payment = UNPAID', action: 'THEN auto STOP service', status: 'active', triggeredCount: 12, lastTriggered: '2 hours ago', category: 'Billing' },
  { id: 'error-debug', name: 'Auto Debug Errors', trigger: 'IF error detected', action: 'THEN auto DEBUG', status: 'active', triggeredCount: 45, lastTriggered: '10 min ago', category: 'Development' },
  { id: 'lead-scale', name: 'Auto Scale on Lead Spike', trigger: 'IF leads > 100/hour', action: 'THEN auto SCALE resources', status: 'active', triggeredCount: 3, lastTriggered: '1 day ago', category: 'Leads' },
  { id: 'server-add', name: 'Auto Add Server', trigger: 'IF server load > 80%', action: 'THEN auto ADD SERVER', status: 'active', triggeredCount: 8, lastTriggered: '3 hours ago', category: 'Server' },
  { id: 'demo-fix', name: 'Auto Fix Broken Demo', trigger: 'IF demo broken', action: 'THEN auto FIX', status: 'active', triggeredCount: 22, lastTriggered: '30 min ago', category: 'Development' },
  { id: 'seo-drop', name: 'Auto Run SEO', trigger: 'IF SEO score drops > 10%', action: 'THEN auto RUN SEO', status: 'active', triggeredCount: 5, lastTriggered: '6 hours ago', category: 'SEO' },
  { id: 'ai-cost', name: 'AI Cost Alert', trigger: 'IF AI cost > $500/day', action: 'THEN alert + suggest STOP', status: 'active', triggeredCount: 2, lastTriggered: '2 days ago', category: 'AI' },
  { id: 'api-fail', name: 'API Failover', trigger: 'IF API fails > 3x', action: 'THEN switch backup + alert', status: 'active', triggeredCount: 1, lastTriggered: '1 week ago', category: 'API' },
  { id: 'backup-auto', name: 'Auto Backup', trigger: 'Every 6 hours', action: 'THEN create backup', status: 'active', triggeredCount: 112, lastTriggered: '2 hours ago', category: 'Server' },
  { id: 'inactive-stop', name: 'Stop Inactive Services', trigger: 'IF inactive > 7 days', action: 'THEN recommend STOP', status: 'inactive', triggeredCount: 0, lastTriggered: 'Never', category: 'All' },
];

const CATEGORIES = ['All', 'Billing', 'Development', 'Leads', 'Server', 'SEO', 'AI', 'API'];

export const UnifiedAutomation = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [rules, setRules] = useState(AUTOMATION_RULES);

  const filteredRules = selectedCategory === 'All' 
    ? rules 
    : rules.filter(r => r.category === selectedCategory);

  const toggleRule = (id: string) => {
    setRules(rules.map(r => 
      r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            Automation Rules
          </h1>
          <p className="text-muted-foreground">AI-driven IF-THEN automation - No manual work</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-1" /> Add Rule
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
            className={selectedCategory === cat ? "bg-amber-600" : ""}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{rules.filter(r => r.status === 'active').length}</p>
            <p className="text-xs text-muted-foreground">Active Rules</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-400">{rules.filter(r => r.status === 'inactive').length}</p>
            <p className="text-xs text-muted-foreground">Inactive</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{rules.reduce((a, b) => a + b.triggeredCount, 0)}</p>
            <p className="text-xs text-muted-foreground">Total Triggers</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-violet-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-violet-400">100%</p>
            <p className="text-xs text-muted-foreground">AI Managed</p>
          </CardContent>
        </Card>
      </div>

      {/* Automation Rules */}
      <div className="grid gap-3">
        {filteredRules.map((rule) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={`bg-slate-900/50 border-border/50 ${rule.status === 'active' ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-slate-600'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className={`w-5 h-5 ${rule.status === 'active' ? 'text-amber-400' : 'text-slate-500'}`} />
                      <h3 className="text-base font-semibold text-white">{rule.name}</h3>
                      <Badge variant="outline" className="text-xs">{rule.category}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-mono text-xs bg-amber-500/10 px-2 py-1 rounded">
                          {rule.trigger}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">
                          {rule.action}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Triggered: {rule.triggeredCount}x</span>
                      <span>Last: {rule.lastTriggered}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={rule.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
                      {rule.status}
                    </Badge>
                    <Switch 
                      checked={rule.status === 'active'}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400">
                      <Trash2 className="w-3 h-3" />
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
};
