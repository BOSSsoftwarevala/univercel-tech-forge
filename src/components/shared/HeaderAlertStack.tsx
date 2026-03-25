import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Info, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Siren,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NotificationAlert, NotificationType } from './GlobalNotificationHeader';

interface HeaderAlertStackProps {
  alerts: NotificationAlert[];
  onDismiss: (id: string) => void;
  onAction: (id: string) => void;
  maxVisible?: number;
}

const alertConfig: Record<NotificationType, { 
  color: string; 
  bgColor: string; 
  borderColor: string;
  icon: React.ReactNode;
  glowColor: string;
}> = {
  info: { 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-500/10', 
    borderColor: 'border-blue-500/40',
    glowColor: 'shadow-blue-500/20',
    icon: <Info className="w-4 h-4" /> 
  },
  success: { 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-500/10', 
    borderColor: 'border-emerald-500/40',
    glowColor: 'shadow-emerald-500/20',
    icon: <CheckCircle className="w-4 h-4" /> 
  },
  warning: { 
    color: 'text-amber-400', 
    bgColor: 'bg-amber-500/10', 
    borderColor: 'border-amber-500/40',
    glowColor: 'shadow-amber-500/20',
    icon: <AlertCircle className="w-4 h-4" /> 
  },
  danger: { 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/10', 
    borderColor: 'border-red-500/40',
    glowColor: 'shadow-red-500/20',
    icon: <AlertTriangle className="w-4 h-4" /> 
  },
  priority: { 
    color: 'text-rose-300', 
    bgColor: 'bg-rose-500/20', 
    borderColor: 'border-rose-500/60',
    glowColor: 'shadow-rose-500/40',
    icon: <Siren className="w-4 h-4" /> 
  },
};

const HeaderAlertStack = ({ 
  alerts, 
  onDismiss, 
  onAction,
  maxVisible = 3 
}: HeaderAlertStackProps) => {
  const visibleAlerts = alerts.slice(0, maxVisible);
  const hiddenCount = Math.max(0, alerts.length - maxVisible);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-row-reverse items-start gap-2">
      <AnimatePresence mode="popLayout">
        {visibleAlerts.map((alert, index) => {
          const config = alertConfig[alert.type];
          const isBuzzer = alert.isBuzzer && alert.type === 'priority';
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1,
                ...(isBuzzer && {
                  boxShadow: [
                    '0 0 0 0 rgba(244, 63, 94, 0)',
                    '0 0 20px 5px rgba(244, 63, 94, 0.4)',
                    '0 0 0 0 rgba(244, 63, 94, 0)'
                  ]
                })
              }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ 
                type: 'spring',
                stiffness: 300,
                damping: 25,
                delay: index * 0.05,
                ...(isBuzzer && { 
                  boxShadow: { duration: 1.5, repeat: Infinity } 
                })
              }}
              className={`
                min-w-72 max-w-80 p-3 rounded-xl backdrop-blur-xl 
                ${config.bgColor} ${config.borderColor} border
                shadow-lg ${config.glowColor}
                ${isBuzzer ? 'ring-2 ring-rose-500/50 ring-offset-2 ring-offset-slate-900' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <motion.div 
                  className={`p-2 rounded-lg ${config.bgColor} ${config.color} flex-shrink-0`}
                  animate={isBuzzer ? { scale: [1, 1.2, 1] } : {}}
                  transition={isBuzzer ? { duration: 0.5, repeat: Infinity } : {}}
                >
                  {config.icon}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold uppercase tracking-wide ${config.color}`}>
                      {alert.eventType}
                    </span>
                    {isBuzzer && (
                      <motion.span 
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded"
                      >
                        URGENT
                      </motion.span>
                    )}
                  </div>
                  <p className="text-sm text-white font-medium line-clamp-2">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-500">{formatTime(alert.timestamp)}</span>
                  </div>
                </div>

                {/* Close Button (disabled for buzzer until action) */}
                {!isBuzzer && (
                  <button
                    onClick={() => onDismiss(alert.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700/50 transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Action Button */}
              {alert.actionLabel && (
                <motion.div 
                  className="mt-3 pt-3 border-t border-slate-700/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    size="sm"
                    onClick={() => onAction(alert.id)}
                    className={`w-full ${
                      isBuzzer 
                        ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                        : 'bg-slate-700/50 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {alert.actionLabel}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Hidden Count Indicator */}
        {hiddenCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-400 text-sm font-bold"
          >
            +{hiddenCount}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderAlertStack;
