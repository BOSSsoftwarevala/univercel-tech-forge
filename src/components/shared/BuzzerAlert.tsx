import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle, X, Clock, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface BuzzerItem {
  id: string;
  triggerType: string;
  roleTarget?: string;
  region?: string;
  taskId?: string;
  leadId?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'accepted' | 'escalated' | 'dismissed';
  createdAt: string;
  escalationLevel: number;
  message?: string;
}

interface BuzzerAlertProps {
  buzzers: BuzzerItem[];
  onAccept: (buzzerId: string) => void;
  onDismiss: (buzzerId: string) => void;
  showInline?: boolean;
  maxVisible?: number;
}

const priorityConfig = {
  low: { color: 'text-slate-400', bg: 'bg-slate-500/20', ring: 'ring-slate-500/30' },
  normal: { color: 'text-cyan-400', bg: 'bg-cyan-500/20', ring: 'ring-cyan-500/30' },
  high: { color: 'text-amber-400', bg: 'bg-amber-500/20', ring: 'ring-amber-500/30' },
  urgent: { color: 'text-red-400', bg: 'bg-red-500/20', ring: 'ring-red-500/30' },
};

const BuzzerAlert: React.FC<BuzzerAlertProps> = ({
  buzzers,
  onAccept,
  onDismiss,
  showInline = false,
  maxVisible = 5,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const pendingBuzzers = buzzers.filter(b => b.status === 'pending');
  const urgentCount = pendingBuzzers.filter(b => b.priority === 'urgent').length;
  const highPriorityCount = pendingBuzzers.filter(b => b.priority === 'urgent' || b.priority === 'high').length;

  // DISABLED: The blocking overlay was causing "dead button" issues across the app.
  // Users reported buttons not working because the overlay was blocking all clicks.
  // Solution: Rely on visual alerts (toasts, animations) instead of blocking interaction.
  // The buzzer UI itself should be attention-grabbing enough without blocking the app.
  /*
  useEffect(() => {
    if (highPriorityCount > 0) {
      document.body.classList.add('buzzer-blocking');
    } else {
      document.body.classList.remove('buzzer-blocking');
    }
    return () => {
      document.body.classList.remove('buzzer-blocking');
    };
  }, [highPriorityCount]);
  */
  
  // Cleanup: Remove any existing buzzer-blocking class on mount to fix stuck state
  useEffect(() => {
    document.body.classList.remove('buzzer-blocking');
  }, []);

  // Play buzzer sound for urgent alerts
  useEffect(() => {
    if (urgentCount > 0 && !audioPlaying) {
      setAudioPlaying(true);
      // In production, you'd play an actual sound here
      const interval = setInterval(() => {
        toast.warning('Urgent buzzer alert! Action required.', {
          icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
          duration: Infinity, // Don't auto-dismiss urgent notifications
        });
      }, 10000);

      return () => {
        clearInterval(interval);
        setAudioPlaying(false);
      };
    }
  }, [urgentCount, audioPlaying]);

  const handleAccept = async (buzzerId: string) => {
    try {
      await onAccept(buzzerId);
      toast.success('Buzzer accepted', {
        icon: <CheckCircle className="w-4 h-4 text-green-400" />,
      });
    } catch (error) {
      toast.error('Failed to accept buzzer');
    }
  };

  // BUG FIX: Prevent dismissing urgent/high priority alerts - must be accepted
  const handleDismiss = (buzzerId: string) => {
    const buzzer = buzzers.find(b => b.id === buzzerId);
    if (buzzer && (buzzer.priority === 'urgent' || buzzer.priority === 'high')) {
      toast.error('High priority alerts cannot be dismissed. Please accept the alert.', {
        icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
      });
      return;
    }
    onDismiss(buzzerId);
  };

  if (showInline) {
    return (
      <div className="space-y-2">
        <AnimatePresence>
          {pendingBuzzers.slice(0, maxVisible).map((buzzer, index) => (
            <motion.div
              key={buzzer.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                p-3 rounded-xl border backdrop-blur-sm
                ${priorityConfig[buzzer.priority].bg}
                ${priorityConfig[buzzer.priority].ring}
                ring-1
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={buzzer.priority === 'urgent' ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <Bell className={`w-5 h-5 ${priorityConfig[buzzer.priority].color}`} />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium text-sm">{buzzer.triggerType}</span>
                      <Badge className={`${priorityConfig[buzzer.priority].bg} ${priorityConfig[buzzer.priority].color} text-xs`}>
                        {buzzer.priority.toUpperCase()}
                      </Badge>
                      {buzzer.escalationLevel > 1 && (
                        <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                          L{buzzer.escalationLevel}
                        </Badge>
                      )}
                    </div>
                    {buzzer.message && (
                      <p className="text-slate-400 text-xs mb-2">{buzzer.message}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      {buzzer.region && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {buzzer.region}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(buzzer.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    onClick={() => handleAccept(buzzer.id)}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 h-7 px-2"
                  >
                    <CheckCircle className="w-3 h-3" />
                  </Button>
                  {/* Only show dismiss button for low/normal priority - urgent/high must be accepted */}
                  {buzzer.priority !== 'urgent' && buzzer.priority !== 'high' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDismiss(buzzer.id)}
                      className="text-slate-400 hover:text-slate-300 h-7 px-2"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {pendingBuzzers.length > maxVisible && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full text-center py-2 text-cyan-400 text-sm hover:text-cyan-300"
          >
            +{pendingBuzzers.length - maxVisible} more alerts
          </button>
        )}
      </div>
    );
  }

  // Floating notification style
  return (
    <AnimatePresence>
      {pendingBuzzers.length > 0 && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 right-4 z-50 w-80"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl border border-cyan-500/30 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-cyan-500/20 bg-slate-800/50">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Bell className="w-5 h-5 text-cyan-400" />
                </motion.div>
                <span className="text-white font-semibold">Buzzer Queue</span>
                <Badge className="bg-cyan-500/20 text-cyan-400">{pendingBuzzers.length}</Badge>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {isExpanded ? <X className="w-4 h-4" /> : '↓'}
              </button>
            </div>

            {/* Buzzer List */}
            <div className={`${isExpanded ? 'max-h-96' : 'max-h-48'} overflow-auto transition-all duration-300`}>
              {pendingBuzzers.slice(0, isExpanded ? undefined : 3).map((buzzer) => (
                <div
                  key={buzzer.id}
                  className={`p-3 border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${
                    buzzer.priority === 'urgent' ? 'bg-red-500/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium text-sm ${priorityConfig[buzzer.priority].color}`}>
                          {buzzer.triggerType}
                        </span>
                        {buzzer.escalationLevel > 1 && (
                          <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                            ESC L{buzzer.escalationLevel}
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs truncate">{buzzer.message}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAccept(buzzer.id)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white h-6 text-xs"
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {urgentCount > 0 && (
              <div className="p-2 bg-red-500/10 border-t border-red-500/30">
                <div className="flex items-center justify-center gap-2 text-red-400 text-xs">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </motion.div>
                  {urgentCount} urgent alert{urgentCount > 1 ? 's' : ''} requiring immediate attention
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuzzerAlert;
