/**
 * Isolated Role Module Component
 * 
 * Generic isolated workspace for any role:
 * - Each role has its own isolated module
 * - Separate encryption key per role (simulated)
 * - Runtime UI uses masked / partial data
 * - All actions verified by checksum before forward
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Lock, CheckCircle, AlertTriangle, 
  Activity, FileText, Clock, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import SecureWorkspaceLayout from './SecureWorkspaceLayout';
import FlowStepIndicator from './FlowStepIndicator';
import useValaId from '@/hooks/useValaId';
import useVerticalFlow from '@/hooks/useVerticalFlow';
import useControlSecurity from '@/hooks/useControlSecurity';

type RoleType = 'operation' | 'front' | 'area_control' | 'regional_control';

interface IsolatedRoleModuleProps {
  roleType: RoleType;
  roleLabel: string;
}

const ROLE_DESCRIPTIONS = {
  operation: 'Front-line operations and task execution',
  front: 'Customer-facing operations and support',
  area_control: 'Area-level oversight and coordination',
  regional_control: 'Regional management and escalation handling'
};

export function IsolatedRoleModule({ roleType, roleLabel }: IsolatedRoleModuleProps) {
  const { valaId, maskedValaId, generateActionHash } = useValaId();
  const { validateCNSChecksum } = useControlSecurity();
  const { 
    currentAction, 
    flowProgress, 
    isProcessing, 
    executeFullFlow,
    canForward,
    getNextRole
  } = useVerticalFlow(roleType);

  const [actionInput, setActionInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit action through vertical flow
  const handleSubmitAction = useCallback(async () => {
    if (!actionInput.trim() || !valaId) {
      toast.error('Enter action details before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate action hash for verification
      const actionData = {
        content: actionInput,
        roleType,
        timestamp: Date.now()
      };

      // Validate CNS checksum
      const checksumResult = await validateCNSChecksum(actionData);
      
      if (!checksumResult.valid) {
        toast.error('Checksum validation failed');
        setIsSubmitting(false);
        return;
      }

      // Execute full vertical flow
      const result = await executeFullFlow(valaId, 'role_action', actionData);

      if (result.status === 'Forwarded') {
        setActionInput('');
        toast.success('Action processed and forwarded successfully');
      } else if (result.status === 'Blocked') {
        toast.error('Action blocked during validation');
      }
    } catch (error) {
      toast.error('Failed to process action');
    } finally {
      setIsSubmitting(false);
    }
  }, [actionInput, valaId, roleType, validateCNSChecksum, executeFullFlow]);

  return (
    <SecureWorkspaceLayout
      roleLabel={roleLabel}
      currentStage={flowProgress.currentStage}
      status={currentAction?.status || 'Pending'}
    >
      <div className="h-full p-6 space-y-6">
        {/* Role Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <h1 className="font-mono text-lg font-bold">{roleLabel}</h1>
                <p className="text-sm text-muted-foreground">
                  {ROLE_DESCRIPTIONS[roleType]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-muted-foreground font-mono">VALA ID</div>
                <div className="font-mono text-sm">{maskedValaId}</div>
              </div>
              {canForward() && (
                <Badge variant="outline" className="font-mono text-xs">
                  → {getNextRole().replace('_', ' ').toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Flow Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6"
        >
          <FlowStepIndicator 
            currentStage={flowProgress.currentStage}
            isProcessing={isProcessing}
          />
        </motion.div>

        {/* Action Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Input Panel */}
          <Card className="glass-panel border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-mono text-base">
                <FileText className="w-4 h-4 text-primary" />
                Action Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter action details... (No edit after submit)"
                value={actionInput}
                onChange={(e) => setActionInput(e.target.value)}
                disabled={isProcessing || isSubmitting || currentAction?.status === 'Locked'}
                className="min-h-[200px] font-mono text-sm bg-background/50 border-border/50 resize-none"
              />
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {actionInput.length > 0 && (
                    <span>{actionInput.length} characters</span>
                  )}
                </div>
                
                <Button
                  onClick={handleSubmitAction}
                  disabled={!actionInput.trim() || isProcessing || isSubmitting}
                  className={cn(
                    'gap-2 font-mono',
                    isProcessing && 'animate-pulse'
                  )}
                >
                  {isProcessing ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit & Forward
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Panel */}
          <Card className="glass-panel border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-mono text-base">
                <Activity className="w-4 h-4 text-primary" />
                Action Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {currentAction ? (
                  <motion.div
                    key="action-status"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Status Items */}
                    <div className="space-y-3">
                      <StatusItem
                        label="Action ID"
                        value={currentAction.id.slice(0, 8) + '...'}
                        icon={<FileText className="w-4 h-4" />}
                      />
                      <StatusItem
                        label="Stage"
                        value={currentAction.stage.toUpperCase()}
                        icon={<Activity className="w-4 h-4" />}
                        status={currentAction.stage === 'blocked' ? 'error' : 'success'}
                      />
                      <StatusItem
                        label="Status"
                        value={currentAction.status}
                        icon={currentAction.status === 'Locked' ? <Lock className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        status={
                          currentAction.status === 'Blocked' ? 'error' :
                          currentAction.status === 'Forwarded' ? 'success' :
                          currentAction.status === 'Locked' ? 'warning' : 'default'
                        }
                      />
                      {currentAction.lockHash && (
                        <StatusItem
                          label="Lock Hash"
                          value={currentAction.lockHash.slice(0, 16) + '...'}
                          icon={<Lock className="w-4 h-4" />}
                        />
                      )}
                      {currentAction.forwardedTo && (
                        <StatusItem
                          label="Forwarded To"
                          value={currentAction.forwardedTo.replace('_', ' ').toUpperCase()}
                          icon={<Send className="w-4 h-4" />}
                          status="success"
                        />
                      )}
                    </div>

                    {/* Debug/Check Results */}
                    {currentAction.debugResult && !currentAction.debugResult.passed && (
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                        <div className="flex items-center gap-2 text-destructive text-sm font-medium mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          Debug Issues
                        </div>
                        <ul className="text-xs text-destructive/80 list-disc list-inside">
                          {currentAction.debugResult.issues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentAction.checkResult && !currentAction.checkResult.passed && (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                        <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          Risk Warnings
                        </div>
                        <ul className="text-xs text-amber-400/80 list-disc list-inside">
                          {currentAction.checkResult.risks.map((risk, i) => (
                            <li key={i}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-action"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-[200px] text-muted-foreground"
                  >
                    <Clock className="w-10 h-10 mb-3 opacity-50" />
                    <p className="text-sm font-mono">No active action</p>
                    <p className="text-xs mt-1">Submit an action to begin flow</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-muted-foreground font-mono"
        >
          <Shield className="w-3 h-3 inline-block mr-1" />
          All actions are logged • No edit after submit • Append-only ledger
        </motion.div>
      </div>
    </SecureWorkspaceLayout>
  );
}

// Status Item Component
function StatusItem({ 
  label, 
  value, 
  icon, 
  status = 'default' 
}: { 
  label: string; 
  value: string; 
  icon: React.ReactNode;
  status?: 'default' | 'success' | 'warning' | 'error';
}) {
  const statusColors = {
    default: 'text-muted-foreground',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    error: 'text-destructive'
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-background/30">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-mono">{label}</span>
      </div>
      <span className={cn('text-xs font-mono font-medium', statusColors[status])}>
        {value}
      </span>
    </div>
  );
}

export default IsolatedRoleModule;
