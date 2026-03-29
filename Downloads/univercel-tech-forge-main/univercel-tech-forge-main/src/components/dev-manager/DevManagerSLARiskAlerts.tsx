import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, TrendingUp, Bell, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SLARisk {
  taskId: string;
  title: string;
  assignee: string;
  promiseId?: string;
  hoursRemaining: number;
  riskLevel: 'critical' | 'high' | 'moderate';
  escalatedAt?: string;
}

const mockRisks: SLARisk[] = [
  { taskId: 'TSK-4822', title: 'Database Migration', assignee: 'DEV-3291', promiseId: 'PRM-115', hoursRemaining: 2, riskLevel: 'critical' },
  { taskId: 'TSK-4825', title: 'Payment Gateway Fix', assignee: 'DEV-7842', promiseId: 'PRM-120', hoursRemaining: 4, riskLevel: 'high' },
  { taskId: 'TSK-4826', title: 'Report Generation', assignee: 'DEV-8877', hoursRemaining: 8, riskLevel: 'moderate' },
];

const getRiskColor = (level: SLARisk['riskLevel']) => {
  switch (level) {
    case 'critical': return 'border-red-500/50 bg-red-500/10';
    case 'high': return 'border-amber-500/50 bg-amber-500/10';
    case 'moderate': return 'border-yellow-500/50 bg-yellow-500/10';
  }
};

const getRiskBadgeColor = (level: SLARisk['riskLevel']) => {
  switch (level) {
    case 'critical': return 'bg-red-500/20 text-red-400';
    case 'high': return 'bg-amber-500/20 text-amber-400';
    case 'moderate': return 'bg-yellow-500/20 text-yellow-400';
  }
};

export default function DevManagerSLARiskAlerts() {
  const { toast } = useToast();

  const handleEscalate = (risk: SLARisk) => {
    // Log escalation
    console.log(`[AUDIT] Escalation triggered for ${risk.taskId} at ${new Date().toISOString()}`);

    toast({
      title: "Escalation Sent",
      description: `${risk.taskId} escalated to Area Manager`,
    });
  };

  const criticalCount = mockRisks.filter(r => r.riskLevel === 'critical').length;
  const highCount = mockRisks.filter(r => r.riskLevel === 'high').length;

  return (
    <div className="space-y-4">
      {/* Risk Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-mono font-bold text-red-400">{criticalCount}</p>
            <p className="text-xs text-red-400/70">CRITICAL</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-mono font-bold text-amber-400">{highCount}</p>
            <p className="text-xs text-amber-400/70">HIGH RISK</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-mono font-bold text-yellow-400">{mockRisks.length - criticalCount - highCount}</p>
            <p className="text-xs text-yellow-400/70">MODERATE</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk List */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-mono tracking-wider text-zinc-400 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              SLA / PROMISE RISK ALERTS
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockRisks.map((risk, idx) => (
            <motion.div
              key={risk.taskId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-lg border ${getRiskColor(risk.riskLevel)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs">{risk.taskId}</span>
                    <Badge className={`text-xs ${getRiskBadgeColor(risk.riskLevel)}`}>
                      {risk.riskLevel.toUpperCase()}
                    </Badge>
                    {risk.promiseId && (
                      <Badge variant="outline" className="text-xs font-mono border-purple-500/30 text-purple-400">
                        {risk.promiseId}
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-medium">{risk.title}</h4>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    <span className={risk.hoursRemaining <= 4 ? 'text-red-400 font-bold' : 'text-zinc-400'}>
                      {risk.hoursRemaining}h left
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500 font-mono">{risk.assignee}</span>
                
                {risk.riskLevel === 'critical' && !risk.escalatedAt && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1 text-xs"
                    onClick={() => handleEscalate(risk)}
                  >
                    <ArrowUpRight className="w-3 h-3" />
                    Escalate Now
                  </Button>
                )}
                
                {risk.escalatedAt && (
                  <Badge variant="outline" className="text-xs text-zinc-500">
                    Escalated
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}

          {mockRisks.length === 0 && (
            <div className="text-center py-8 text-zinc-500">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No SLA risks detected</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
