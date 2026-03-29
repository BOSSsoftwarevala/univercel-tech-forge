/**
 * AI SAFETY SECTION
 * Content filters, abuse detection, rate abuse rules
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, Filter, AlertTriangle, Ban, Eye, Lock,
  Flag, Users, Activity, Settings, CheckCircle, XCircle
} from "lucide-react";
import { toast } from "sonner";

const contentFilters = [
  { name: 'Hate Speech', level: 'strict', blocked: 234, status: 'active' },
  { name: 'Violence', level: 'strict', blocked: 89, status: 'active' },
  { name: 'Adult Content', level: 'strict', blocked: 156, status: 'active' },
  { name: 'Self-Harm', level: 'strict', blocked: 12, status: 'active' },
  { name: 'PII Detection', level: 'moderate', blocked: 567, status: 'active' },
  { name: 'Prompt Injection', level: 'strict', blocked: 45, status: 'active' },
];

const abuseDetections = [
  { type: 'Rate Abuse', user: 'user_****782', attempts: 450, action: 'Throttled', time: '2 hours ago', severity: 'medium' },
  { type: 'Jailbreak Attempt', user: 'user_****156', attempts: 12, action: 'Blocked', time: '5 hours ago', severity: 'high' },
  { type: 'Spam Detection', user: 'user_****923', attempts: 89, action: 'Warning', time: '1 day ago', severity: 'low' },
  { type: 'Token Abuse', user: 'user_****441', attempts: 25, action: 'Suspended', time: '2 days ago', severity: 'high' },
];

const rateRules = [
  { name: 'Requests per Minute', limit: 60, current: 45, scope: 'Per User', enforced: true },
  { name: 'Tokens per Hour', limit: 100000, current: 67000, scope: 'Per User', enforced: true },
  { name: 'Daily API Calls', limit: 10000, current: 4500, scope: 'Global', enforced: true },
  { name: 'Concurrent Sessions', limit: 5, current: 2, scope: 'Per User', enforced: false },
];

const safetyMetrics = {
  blockedRequests: 1103,
  flaggedUsers: 47,
  falsePositives: 23,
  accuracy: 97.8,
};

export const AISafetySection = () => {
  const [autoBlock, setAutoBlock] = useState(true);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      case 'low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{safetyMetrics.blockedRequests}</p>
            <p className="text-xs text-muted-foreground">Blocked Today</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Flag className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{safetyMetrics.flaggedUsers}</p>
            <p className="text-xs text-muted-foreground">Flagged Users</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{safetyMetrics.falsePositives}</p>
            <p className="text-xs text-muted-foreground">False Positives</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{safetyMetrics.accuracy}%</p>
            <p className="text-xs text-muted-foreground">Detection Accuracy</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Content Filters</CardTitle>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Auto-block violations</span>
            <Switch checked={autoBlock} onCheckedChange={(v) => { setAutoBlock(v); toast.success(`Auto-block ${v ? 'enabled' : 'disabled'}`); }} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {contentFilters.map((filter, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Filter className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="font-medium text-white text-sm">{filter.name}</p>
                    <p className="text-xs text-muted-foreground">{filter.blocked} blocked</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{filter.level}</Badge>
                  <Switch defaultChecked={filter.status === 'active'} onCheckedChange={() => toast.success(`${filter.name} toggled`)} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Abuse Detection</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast.info('Opening abuse report')}>
            <Eye className="w-3 h-3 mr-2" />
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {abuseDetections.map((detection, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {detection.severity === 'high' && <XCircle className="w-5 h-5 text-red-400" />}
                  {detection.severity === 'medium' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  {detection.severity === 'low' && <Flag className="w-5 h-5 text-blue-400" />}
                  <div>
                    <p className="font-medium text-white text-sm">{detection.type}</p>
                    <p className="text-xs text-muted-foreground">{detection.user} • {detection.attempts} attempts</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{detection.time}</span>
                  <Badge className={getSeverityBadge(detection.severity)}>{detection.action}</Badge>
                  <Button size="sm" variant="ghost" onClick={() => toast.info('Reviewing case')}>
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Rate Abuse Rules</CardTitle>
          <Button size="sm" variant="ghost" onClick={() => toast.info('Opening settings')}>
            <Settings className="w-3 h-3" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {rateRules.map((rule, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-white">{rule.name}</p>
                    <Badge variant="outline" className="text-[10px] mt-1">{rule.scope}</Badge>
                  </div>
                  <Switch defaultChecked={rule.enforced} onCheckedChange={() => toast.success(`${rule.name} toggled`)} />
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{rule.current.toLocaleString()}</span>
                  <span className="text-white">{rule.limit.toLocaleString()}</span>
                </div>
                <Progress value={(rule.current / rule.limit) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-emerald-500/10 border-emerald-500/30">
        <CardContent className="p-4 flex items-center gap-4">
          <Lock className="w-8 h-8 text-emerald-400" />
          <div className="flex-1">
            <p className="font-medium text-white">AI Safety Status: Protected</p>
            <p className="text-xs text-muted-foreground">All safety systems are operational. Last security audit: 2 days ago.</p>
          </div>
          <Button variant="outline" onClick={() => toast.success('Running safety audit')}>
            Run Audit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
