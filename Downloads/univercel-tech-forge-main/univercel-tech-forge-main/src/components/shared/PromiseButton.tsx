import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Handshake, Clock, AlertTriangle, Check, X, Timer, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import promiseHandshakeIcon from '@/assets/promise-handshake-icon.jpg';

export type PromiseStatus = 'assigned' | 'promised' | 'in_progress' | 'breached' | 'completed';

interface PromiseButtonProps {
  taskId: string;
  developerId?: string;
  currentStatus: PromiseStatus;
  deadline?: string;
  onPromiseStart?: (taskId: string, deadline: Date) => void;
  onPromiseComplete?: (taskId: string) => void;
  disabled?: boolean;
  hasOverlappingPromise?: boolean;
  exceedsWorkload?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

const statusConfig: Record<PromiseStatus, { color: string; bgColor: string; icon: React.ElementType; label: string }> = {
  assigned: { color: 'text-slate-400', bgColor: 'bg-slate-500/20', icon: Clock, label: 'Assigned' },
  promised: { color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', icon: Handshake, label: 'Promised' },
  in_progress: { color: 'text-amber-400', bgColor: 'bg-amber-500/20', icon: Timer, label: 'In Progress' },
  breached: { color: 'text-red-400', bgColor: 'bg-red-500/20', icon: AlertTriangle, label: 'Breached' },
  completed: { color: 'text-green-400', bgColor: 'bg-green-500/20', icon: Check, label: 'Completed' },
};

const PromiseButton: React.FC<PromiseButtonProps> = ({
  taskId,
  developerId,
  currentStatus,
  deadline,
  onPromiseStart,
  onPromiseComplete,
  disabled = false,
  hasOverlappingPromise = false,
  exceedsWorkload = false,
  size = 'md',
  showBadge = true,
  className = '',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [customDeadline, setCustomDeadline] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const config = statusConfig[currentStatus];
  const StatusIcon = config.icon;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const isDisabled = disabled || hasOverlappingPromise || exceedsWorkload || 
    currentStatus === 'completed' || currentStatus === 'breached';

  const getDisabledReason = () => {
    if (hasOverlappingPromise) return 'You have overlapping promises';
    if (exceedsWorkload) return 'Workload threshold exceeded (max 3 active promises)';
    if (currentStatus === 'completed') return 'Task already completed';
    if (currentStatus === 'breached') return 'Promise was breached';
    return '';
  };

  const handlePromiseClick = () => {
    if (currentStatus === 'assigned') {
      setShowModal(true);
    } else if (currentStatus === 'promised' || currentStatus === 'in_progress') {
      // Show completion modal
      setShowModal(true);
    }
  };

  const handleStartPromise = async () => {
    if (!agreed) {
      toast.error('Please agree to the promise terms');
      return;
    }

    setIsProcessing(true);
    try {
      const deadlineDate = customDeadline 
        ? new Date(customDeadline) 
        : new Date(Date.now() + 2 * 60 * 60 * 1000); // Default 2 hours

      if (onPromiseStart) {
        await onPromiseStart(taskId, deadlineDate);
      }
      
      toast.success('Promise started! Timer is now running.', {
        icon: <Handshake className="w-4 h-4 text-cyan-400" />,
      });
      setShowModal(false);
      setAgreed(false);
      setCustomDeadline('');
    } catch (error) {
      toast.error('Failed to start promise');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompletePromise = async () => {
    setIsProcessing(true);
    try {
      if (onPromiseComplete) {
        await onPromiseComplete(taskId);
      }
      toast.success('Promise completed! Great work.', {
        icon: <Check className="w-4 h-4 text-green-400" />,
      });
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to complete promise');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Promise Button */}
        <motion.button
          whileHover={!isDisabled ? { scale: 1.05 } : {}}
          whileTap={!isDisabled ? { scale: 0.95 } : {}}
          onClick={handlePromiseClick}
          disabled={isDisabled}
          className={`
            relative ${sizeClasses[size]} rounded-full overflow-hidden
            border-2 transition-all duration-300
            ${isDisabled 
              ? 'border-slate-600 opacity-50 cursor-not-allowed' 
              : `border-cyan-500/50 hover:border-cyan-400 cursor-pointer shadow-lg hover:shadow-cyan-500/30`
            }
          `}
          title={isDisabled ? getDisabledReason() : `Promise Status: ${config.label}`}
        >
          {/* Handshake Icon Background */}
          <img
            src={promiseHandshakeIcon}
            alt="Promise"
            className="w-full h-full object-cover"
          />
          
          {/* Status Overlay */}
          <div className={`absolute inset-0 ${config.bgColor} flex items-center justify-center`}>
            {currentStatus !== 'assigned' && (
              <StatusIcon className={`w-1/2 h-1/2 ${config.color}`} />
            )}
          </div>

          {/* Pulsing ring for active promises */}
          {(currentStatus === 'promised' || currentStatus === 'in_progress') && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-400"
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>

        {/* Status Badge */}
        {showBadge && (
          <Badge 
            className={`${config.bgColor} ${config.color} border-0 text-xs font-medium`}
          >
            {config.label}
          </Badge>
        )}
      </div>

      {/* Promise Modal */}
      <AnimatePresence>
        {showModal && (
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="bg-slate-900 border border-cyan-500/30 max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-500/50">
                    <img
                      src={promiseHandshakeIcon}
                      alt="Promise Handshake"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <DialogTitle className="text-white text-xl">
                      {currentStatus === 'assigned' ? 'Confirm Promise' : 'Complete Promise'}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                      {currentStatus === 'assigned' 
                        ? 'You are about to commit to this task' 
                        : 'Mark this promise as completed'
                      }
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {currentStatus === 'assigned' ? (
                <div className="space-y-4 py-4">
                  {/* Deadline Input */}
                  <div className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      Set Deadline
                    </Label>
                    <Input
                      type="datetime-local"
                      value={customDeadline}
                      onChange={(e) => setCustomDeadline(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="bg-slate-800 border-cyan-500/30 text-white"
                    />
                    <p className="text-xs text-slate-500">Default: 2 hours from now</p>
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-lg border border-cyan-500/20">
                    <Checkbox
                      id="promise-agree"
                      checked={agreed}
                      onCheckedChange={(checked) => setAgreed(checked as boolean)}
                      className="border-cyan-500 data-[state=checked]:bg-cyan-500"
                    />
                    <Label htmlFor="promise-agree" className="text-sm text-slate-300 leading-relaxed cursor-pointer">
                      I promise to complete this task within the deadline. I understand that:
                      <ul className="mt-2 space-y-1 text-slate-400 text-xs">
                        <li>• Timer will start immediately</li>
                        <li>• Missing deadline affects my performance score</li>
                        <li>• I cannot pause without a valid reason</li>
                        <li>• This commitment is logged and audited</li>
                      </ul>
                    </Label>
                  </div>

                  {/* Warning for constraints */}
                  {(hasOverlappingPromise || exceedsWorkload) && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="text-sm text-red-400">{getDisabledReason()}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-cyan-500/20 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Deadline:</span>
                      <span className="text-white">{deadline || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <Badge className={`${config.bgColor} ${config.color}`}>{config.label}</Badge>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-400">
                    Are you sure you want to mark this task as completed? This action will stop the timer and update your performance score.
                  </p>
                </div>
              )}

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={currentStatus === 'assigned' ? handleStartPromise : handleCompletePromise}
                  disabled={currentStatus === 'assigned' ? !agreed || isProcessing : isProcessing}
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white"
                >
                  {isProcessing ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : currentStatus === 'assigned' ? (
                    <>
                      <Handshake className="w-4 h-4 mr-2" />
                      Start Promise
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Complete
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default PromiseButton;

// Status Badge Component for use in tables/lists
export const PromiseStatusBadge: React.FC<{ status: PromiseStatus }> = ({ status }) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  
  return (
    <Badge className={`${config.bgColor} ${config.color} border-0 gap-1`}>
      <StatusIcon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};
