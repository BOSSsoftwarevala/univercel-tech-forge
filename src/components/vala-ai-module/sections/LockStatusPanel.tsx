/**
 * VALA AI - Lock Status Panel
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Shield, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const LockStatusPanel: React.FC = () => {
  const [locked, setLocked] = useState(true);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      toast.success('Lock status refreshed');
    }, 900);
  };

  const toggleLock = async () => {
    setLocked(v => !v);
    toast.success(`System ${locked ? 'unlocked' : 'locked'} (policy mode)`);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${locked ? 'bg-destructive/10' : 'bg-primary/15'}`}>
            {locked ? <Lock className="w-5 h-5 text-destructive" /> : <Unlock className="w-5 h-5 text-primary" />}
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Lock Status</h1>
            <p className="text-xs text-muted-foreground">Controls high-risk build operations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="h-8 px-3 text-xs gap-1.5" onClick={refresh} disabled={busy}>
            <RefreshCw className={`w-3.5 h-3.5 ${busy ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <Card className="bg-card/60 border-border/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/15">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Production Lock</p>
              <p className="text-xs text-muted-foreground">When enabled, blocks destructive actions and requires approval.</p>
            </div>
            <Switch checked={locked} onCheckedChange={toggleLock} />
          </CardContent>
        </Card>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-card/60 border-border/50">
            <CardContent className="p-5 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Current Policy</p>
                <ul className="text-xs text-muted-foreground list-disc pl-4 mt-1 space-y-1">
                  <li>UI builds allowed</li>
                  <li>Database migrations require approval</li>
                  <li>APK builds require approval</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LockStatusPanel;
