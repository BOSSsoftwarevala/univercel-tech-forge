import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ActionStepIndicator, ActionStep } from './ActionStepIndicator';
import { ActionStatusBadge, ActionStatus } from './ActionStatusBadge';
import { Shield, Send, Lock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface ActionItem {
  id: string;
  type: string;
  description: string;
  receivedAt: string;
  fromValaId: string;
  checksum: string;
  status: ActionStatus;
  currentStep: ActionStep;
}

interface IsolatedActionPanelProps {
  action: ActionItem;
  valaId: string;
  onProcess: (actionId: string, step: ActionStep) => void;
  onForward: (actionId: string) => void;
  disabled?: boolean;
}

export function IsolatedActionPanel({
  action,
  valaId,
  onProcess,
  onForward,
  disabled
}: IsolatedActionPanelProps) {
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleProcess = async (nextStep: ActionStep) => {
    if (disabled) {
      toast.error('SYSTEM FROZEN', { description: 'Actions are disabled' });
      return;
    }

    setProcessing(true);
    
    // Simulate checksum verification
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onProcess(action.id, nextStep);
    setProcessing(false);
    
    toast.success('Step Completed', {
      description: `Action ${action.id} moved to ${nextStep.toUpperCase()}`
    });
  };

  const handleForward = async () => {
    if (disabled) {
      toast.error('SYSTEM FROZEN', { description: 'Actions are disabled' });
      return;
    }

    if (action.currentStep !== 'lock') {
      toast.error('Cannot Forward', {
        description: 'Action must complete Debug → Check → Lock before forwarding'
      });
      return;
    }

    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onForward(action.id);
    setProcessing(false);
    
    toast.success('Action Forwarded', {
      description: `Action ${action.id} forwarded to next role`
    });
  };

  const getNextStep = (): ActionStep | null => {
    switch (action.currentStep) {
      case 'pending': return 'debug';
      case 'debug': return 'check';
      case 'check': return 'lock';
      case 'lock': return 'forward';
      default: return null;
    }
  };

  const nextStep = getNextStep();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="select-none"
    >
      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardHeader className="border-b border-neutral-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center">
                <Shield className="h-5 w-5 text-neutral-400" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-neutral-300">{action.id}</span>
                  <ActionStatusBadge status={action.status} />
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  From: {action.fromValaId} • Received: {action.receivedAt}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xs text-neutral-500 uppercase tracking-wider">Checksum</div>
              <div className="font-mono text-xs text-neutral-400">{action.checksum}</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Step Indicator */}
          <ActionStepIndicator currentStep={action.currentStep} />
          
          {/* Action Details */}
          <div className="space-y-4">
            <div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Action Type</div>
              <div className="text-sm text-neutral-300 font-medium">{action.type}</div>
            </div>
            
            <div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Description</div>
              <div className="text-sm text-neutral-400 p-3 rounded bg-neutral-950 border border-neutral-800">
                {action.description}
              </div>
            </div>
            
            {/* Notes - No edit after submit */}
            {action.status === 'pending' && (
              <div>
                <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                  Processing Notes (Read-Only After Submit)
                </div>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add processing notes..."
                  className="bg-neutral-950 border-neutral-800 text-neutral-300 resize-none"
                  rows={3}
                  disabled={disabled || processing}
                />
              </div>
            )}
          </div>
          
          {/* Action Buttons - Single action only */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
            <div className="text-xs text-neutral-500">
              <Lock className="h-3 w-3 inline mr-1" />
              No backward access • No edit after submit
            </div>
            
            {action.status === 'pending' && nextStep && (
              <div className="flex items-center gap-3">
                {nextStep !== 'forward' ? (
                  <Button
                    onClick={() => handleProcess(nextStep)}
                    disabled={disabled || processing}
                    className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                  >
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <>
                        Process → {nextStep.charAt(0).toUpperCase() + nextStep.slice(1)}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleForward}
                    disabled={disabled || processing}
                    className="bg-blue-900 hover:bg-blue-800 text-blue-100"
                  >
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        Forwarding...
                      </span>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Forward to Next Role
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
            
            {action.status === 'forwarded' && (
              <div className="text-xs text-purple-400 flex items-center gap-2">
                <Send className="h-3 w-3" />
                Forwarded • Awaiting upper role approval
              </div>
            )}
            
            {action.status === 'blocked' && (
              <div className="text-xs text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-3 w-3" />
                Blocked • Requires Master Admin review
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
