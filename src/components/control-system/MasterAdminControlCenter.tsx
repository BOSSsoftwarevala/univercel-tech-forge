/**
 * Master Admin Control Center
 * 
 * Master Admin View:
 * - Summary only
 * - Drill-down only on AI flag
 * - Unlock / override available only here
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Eye, Lock, Unlock, AlertTriangle, 
  CheckCircle, Activity, Bot, TrendingUp, FileSearch
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import SecureWorkspaceLayout from './SecureWorkspaceLayout';
import AIObserverPanel from './AIObserverPanel';
import useValaId from '@/hooks/useValaId';

interface FlaggedItem {
  id: string;
  valaId: string;
  actionType: string;
  riskScore: number;
  aiFlags: string[];
  stage: string;
  timestamp: number;
}

// Mock data for demo
const MOCK_FLAGGED: FlaggedItem[] = [
  { id: '1', valaId: 'V-ABC1-XY23', actionType: 'role_action', riskScore: 35, aiFlags: ['unusual_timing', 'high_frequency'], stage: 'locked', timestamp: Date.now() - 3600000 },
  { id: '2', valaId: 'V-DEF2-ZW45', actionType: 'escalation', riskScore: 28, aiFlags: ['pattern_deviation'], stage: 'forwarded', timestamp: Date.now() - 7200000 },
];

export function MasterAdminControlCenter() {
  const { maskedValaId } = useValaId();
  const [selectedItem, setSelectedItem] = useState<FlaggedItem | null>(null);
  const [showDrilldown, setShowDrilldown] = useState(false);

  const handleDrilldown = (item: FlaggedItem) => {
    setSelectedItem(item);
    setShowDrilldown(true);
  };

  const handleOverride = (action: 'unlock' | 'approve' | 'reject') => {
    setShowDrilldown(false);
    setSelectedItem(null);
  };

  return (
    <SecureWorkspaceLayout roleLabel="Master Admin" currentStage="completed" status="Locked">
      <div className="h-full p-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <h1 className="font-mono text-lg font-bold">Master Control Center</h1>
                <p className="text-sm text-muted-foreground">Final Authority • Summary View</p>
              </div>
            </div>
            <Badge className="font-mono text-xs bg-primary/20 text-primary border-primary/50">
              SUPREME ACCESS
            </Badge>
          </div>
        </motion.div>

        {/* Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Actions', value: '247', icon: Activity, color: 'text-primary' },
            { label: 'AI Flagged', value: MOCK_FLAGGED.length.toString(), icon: AlertTriangle, color: 'text-amber-400' },
            { label: 'Locked', value: '12', icon: Lock, color: 'text-muted-foreground' },
            { label: 'Completed', value: '235', icon: CheckCircle, color: 'text-emerald-400' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="glass-panel border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <stat.icon className={cn('w-5 h-5', stat.color)} />
                    <span className="text-2xl font-mono font-bold">{stat.value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mt-2">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Flagged Items - Drill-down only */}
          <div className="lg:col-span-2">
            <Card className="glass-panel border-border/50 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-mono text-base">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  AI Flagged Items
                  <Badge variant="outline" className="text-xs ml-2">Drill-down Only</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {MOCK_FLAGGED.map(item => (
                      <div key={item.id} className="p-3 rounded-lg bg-background/30 border border-border/30 hover:border-amber-500/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Bot className="w-4 h-4 text-amber-400" />
                            <div>
                              <div className="font-mono text-sm">{item.valaId}</div>
                              <div className="text-xs text-muted-foreground">{item.actionType}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="text-xs font-mono bg-amber-500/20 text-amber-400">
                              Risk: {item.riskScore}
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => handleDrilldown(item)} className="gap-1 text-xs">
                              <FileSearch className="w-3 h-3" />
                              Drill
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {item.aiFlags.map((flag, i) => (
                            <Badge key={i} variant="outline" className="text-xs font-mono">{flag}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* AI Observer Panel */}
          <AIObserverPanel behaviorScore={78} riskFlags={['pattern_deviation', 'timing_anomaly']} anomalyCount={2} observationCount={156} />
        </div>

        {/* Drilldown Dialog */}
        <Dialog open={showDrilldown} onOpenChange={setShowDrilldown}>
          <DialogContent className="glass-panel border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-mono flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-primary" />
                Action Details
              </DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 rounded bg-background/30">
                    <div className="text-xs text-muted-foreground">Vala ID</div>
                    <div className="font-mono">{selectedItem.valaId}</div>
                  </div>
                  <div className="p-2 rounded bg-background/30">
                    <div className="text-xs text-muted-foreground">Risk Score</div>
                    <div className="font-mono text-amber-400">{selectedItem.riskScore}/100</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleOverride('unlock')} className="flex-1 gap-1" variant="outline">
                    <Unlock className="w-4 h-4" /> Unlock
                  </Button>
                  <Button onClick={() => handleOverride('approve')} className="flex-1 gap-1 bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle className="w-4 h-4" /> Override Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SecureWorkspaceLayout>
  );
}

export default MasterAdminControlCenter;
