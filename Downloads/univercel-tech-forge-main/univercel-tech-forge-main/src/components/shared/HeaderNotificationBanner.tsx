import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useNotificationSound, type SoundTone } from '@/hooks/useNotificationSound';
import { getTemplateForRole, type NotificationCategory } from '@/config/notificationTemplates';

export interface HeaderNotification {
  id: string;
  category: NotificationCategory;
  customTitle?: string;
  customMessage?: string;
  actionLabel?: string;
  onAction?: () => void;
  autoDismiss?: boolean;
  autoDismissDelay?: number;
  timestamp: Date;
}

interface HeaderNotificationBannerProps {
  notifications: HeaderNotification[];
  userRole: string;
  onDismiss: (id: string) => void;
  onAction?: (id: string) => void;
  maxVisible?: number;
  isMuted?: boolean;
}

const HeaderNotificationBanner = ({
  notifications,
  userRole,
  onDismiss,
  onAction,
  maxVisible = 3,
  isMuted = false,
}: HeaderNotificationBannerProps) => {
  const [expanded, setExpanded] = useState(false);
  const [playedNotifications, setPlayedNotifications] = useState<Set<string>>(new Set());
  const { playTone, setMuted } = useNotificationSound(userRole);

  useEffect(() => {
    setMuted(isMuted);
  }, [isMuted, setMuted]);

  // Play sound for new notifications
  useEffect(() => {
    notifications.forEach((notification) => {
      if (!playedNotifications.has(notification.id)) {
        const template = getTemplateForRole(userRole, notification.category);
        playTone(template.tone);
        setPlayedNotifications(prev => new Set([...prev, notification.id]));
      }
    });
  }, [notifications, userRole, playTone, playedNotifications]);

  // Auto-dismiss handler
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    notifications.forEach((notification) => {
      if (notification.autoDismiss !== false) {
        const template = getTemplateForRole(userRole, notification.category);
        const isCritical = template.tone === 'critical_buzzer' || template.tone === 'warning_ping';
        
        if (!isCritical) {
          const delay = notification.autoDismissDelay || 8000;
          const timer = setTimeout(() => {
            onDismiss(notification.id);
          }, delay);
          timers.push(timer);
        }
      }
    });

    return () => timers.forEach(clearTimeout);
  }, [notifications, userRole, onDismiss]);

  const visibleNotifications = expanded 
    ? notifications 
    : notifications.slice(0, maxVisible);
  
  const hiddenCount = notifications.length - maxVisible;

  const getIcon = useCallback((iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  }, []);

  const handleAction = useCallback((id: string, notification: HeaderNotification) => {
    if (notification.onAction) {
      notification.onAction();
    }
    if (onAction) {
      onAction(id);
    }
    onDismiss(id);
  }, [onAction, onDismiss]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      <div className="max-w-4xl mx-auto px-4 pt-2">
        <AnimatePresence mode="popLayout">
          {visibleNotifications.map((notification, index) => {
            const template = getTemplateForRole(userRole, notification.category);
            const isCritical = template.tone === 'critical_buzzer' || template.tone === 'warning_ping';
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                className="pointer-events-auto mb-2"
              >
                <div
                  className={`
                    relative overflow-hidden rounded-xl border backdrop-blur-xl
                    bg-gradient-to-r ${template.accentColor} bg-opacity-20
                    border-white/20 shadow-xl
                    ${isCritical ? 'animate-pulse ring-2 ring-orange-500/50' : ''}
                  `}
                >
                  {/* Accent glow effect */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-r ${template.accentColor} opacity-10`}
                  />
                  
                  <div className="relative p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div 
                        className={`
                          flex-shrink-0 w-10 h-10 rounded-full 
                          bg-gradient-to-br ${template.accentColor}
                          flex items-center justify-center text-white shadow-lg
                        `}
                      >
                        {getIcon(template.icon)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white text-sm">
                            {notification.customTitle || template.title}
                          </h4>
                          <span className="text-xs text-white/60">
                            {notification.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">
                          {notification.customMessage || template.message}
                        </p>
                        
                        {/* Action Button */}
                        {notification.actionLabel && (
                          <button
                            onClick={() => handleAction(notification.id, notification)}
                            className={`
                              mt-3 px-4 py-1.5 rounded-lg text-xs font-medium
                              bg-white/20 hover:bg-white/30 text-white
                              transition-all duration-200 hover:scale-105
                            `}
                          >
                            {notification.actionLabel}
                          </button>
                        )}
                      </div>

                      {/* Dismiss Button (only for non-critical) */}
                      {!isCritical && (
                        <button
                          onClick={() => onDismiss(notification.id)}
                          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/20 
                                   text-white/60 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div 
                    className={`h-1 bg-gradient-to-r ${template.accentColor}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Show more/less toggle */}
        {hiddenCount > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setExpanded(!expanded)}
            className="pointer-events-auto w-full py-2 flex items-center justify-center gap-2
                     text-white/70 hover:text-white text-sm font-medium
                     bg-slate-900/50 backdrop-blur rounded-lg border border-white/10
                     hover:border-white/20 transition-all"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                +{hiddenCount} more notification{hiddenCount > 1 ? 's' : ''}
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default HeaderNotificationBanner;
