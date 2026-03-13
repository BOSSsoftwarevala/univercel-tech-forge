/**
 * VALA AI - Rollback Panel
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Shield, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const MOCK_POINTS = [
  { id: 'r1', name: 'Stable checkpoint', time: 'Today 01:12', status: 'verified' as const },
  { id: 'r2', name: 'Before pipeline change', time: 'Yesterday 21:40', status: 'verified' as const },
  { id: 'r3', name: 'Pre-release snapshot', time: 'Yesterday 18:05', status: 'needs_review' as const },
];

const RollbackPanel: React.FC = () => {
  const [busyId, setBusyId] = useState<string | null>(null);

  const createPoint = async () => {
    toast.success('Restore point created');
  };

  const triggerRollback = async (id: string) => {
    setBusyId(id);
    setTimeout(() => {
      setBusyId(null);
      toast.success('Rollback triggered (safe mode)');
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/15">
            <RotateCcw className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Rollback Trigger</h1>
            <p className="text-xs text-muted-foreground">Only verified restore points can be applied</p>
          </div>
        </div>
        <Button size="sm" className="h-8 px-3 text-xs gap-1.5" onClick={createPoint}>
          <Shield className="w-3.5 h-3.5" />
          Create Restore Point
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-3">
          {MOCK_POINTS.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card/60 border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  {p.status === 'verified' ? (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {p.time}
                    </p>
                  </div>
                  <Button
                    variant={p.status === 'verified' ? 'default' : 'secondary'}
                    size="sm"
                    className="h-8 px-3 text-xs"
                    disabled={p.status !== 'verified' || busyId === p.id}
                    onClick={() => triggerRollback(p.id)}
                  >
                    {busyId === p.id ? 'Triggering...' : 'Trigger Rollback'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RollbackPanel;
