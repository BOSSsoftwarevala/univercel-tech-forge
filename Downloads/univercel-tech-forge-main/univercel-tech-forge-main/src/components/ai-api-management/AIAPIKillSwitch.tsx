/**
 * Emergency Kill Switch Component
 * STOP all AI/API services immediately
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Power, AlertTriangle, Shield, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAIAPIManagement } from '@/hooks/useAIAPIManagement';
import { useEnterpriseAudit } from '@/hooks/useEnterpriseAudit';

export function AIAPIKillSwitch() {
  const { emergencyKillSwitch, loading, services } = useAIAPIManagement();
  const { logButtonClick } = useEnterpriseAudit();
  const [showConfirm, setShowConfirm] = useState<'all' | 'ai_only' | null>(null);
  const [executing, setExecuting] = useState(false);

  const runningCount = services.filter(s => s.status === 'running').length;
  const aiRunningCount = services.filter(s => s.status === 'running' && s.type === 'ai').length;

  const handleKillSwitch = async (type: 'all' | 'ai_only') => {
    setExecuting(true);
    await logButtonClick('btn_kill_switch', `Kill Switch - ${type}`, 'ai_system', { type });
    await emergencyKillSwitch(type);
    setExecuting(false);
    setShowConfirm(null);
  };

  return (
    <Card className="bg-destructive/5 border-destructive/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Power className="w-5 h-5 text-destructive" />
            Emergency Kill Switch
          </CardTitle>
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/50">
            <Shield className="w-3 h-3 mr-1" />
            Critical Control
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold text-sm">Warning: This action cannot be undone automatically</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Kill switch will immediately stop all running services. All pending requests will be cancelled.
            Manual restart required after activation.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="w-full h-16 border-amber-500/50 hover:bg-amber-500/10 hover:border-amber-500"
              onClick={() => setShowConfirm('ai_only')}
              disabled={loading || aiRunningCount === 0}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-amber-400">
                  <Power className="w-4 h-4" />
                  <span className="font-semibold">Stop AI Only</span>
                </div>
                <span className="text-xs text-muted-foreground">{aiRunningCount} AI services running</span>
              </div>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="w-full h-16 border-destructive/50 hover:bg-destructive/10 hover:border-destructive"
              onClick={() => setShowConfirm('all')}
              disabled={loading || runningCount === 0}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-destructive">
                  <Power className="w-4 h-4" />
                  <span className="font-semibold">Stop ALL Services</span>
                </div>
                <span className="text-xs text-muted-foreground">{runningCount} services running</span>
              </div>
            </Button>
          </motion.div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          This action is logged and requires Boss notification.
        </p>
      </CardContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!showConfirm} onOpenChange={() => setShowConfirm(null)}>
        <AlertDialogContent className="bg-card border-destructive/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Confirm Emergency Kill Switch
            </AlertDialogTitle>
            <AlertDialogDescription>
              {showConfirm === 'all' 
                ? `This will immediately STOP all ${runningCount} running services including AI, payments, and integrations.`
                : `This will immediately STOP all ${aiRunningCount} running AI services.`
              }
              <br /><br />
              <strong>All pending requests will be cancelled. Manual restart required.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={executing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => showConfirm && handleKillSwitch(showConfirm)}
              disabled={executing}
            >
              {executing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Power className="w-4 h-4 mr-1" />
                  Activate Kill Switch
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
