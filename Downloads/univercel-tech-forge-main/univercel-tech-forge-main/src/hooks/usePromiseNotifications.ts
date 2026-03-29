/**
 * Promise Tracker Notifications Hook
 * Triggers notifications when Promise events occur
 */

import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNotificationSound } from '@/hooks/useNotificationSound';

export function usePromiseNotifications() {
  const { user, userRole } = useAuth();
  const { addNotification } = useNotifications();
  const { playWarning, playCritical, playSuccess, playInfo } = useNotificationSound(userRole || 'developer');

  useEffect(() => {
    if (!user) return;

    // Listen for promise log changes
    const promiseChannel = supabase
      .channel('promise-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'promise_logs',
        },
        async (payload) => {
          const promise = payload.new as any;
          const oldPromise = payload.old as any;
          
          // Notify developers about their own promises
          const isDeveloper = promise?.developer_id === user.id;
          const isManager = ['promise_tracker', 'promise_management', 'super_admin', 'master'].includes(userRole || '');

          if (payload.eventType === 'UPDATE') {
            // Promise completed
            if (promise.status === 'completed' && oldPromise?.status !== 'completed') {
              if (isDeveloper) {
                await addNotification('success', 'Promise completed successfully!', 'promise_completed', {});
                playSuccess();
              } else if (isManager) {
                await addNotification('info', 'A promise was marked complete', 'promise_completed_manager', {
                  roleTarget: ['promise_tracker', 'promise_management'],
                });
                playInfo();
              }
            }
            
            // Promise breached
            if (promise.status === 'breached' && oldPromise?.status !== 'breached') {
              if (isDeveloper) {
                await addNotification('danger', `Promise breached: ${promise.breach_reason || 'Deadline exceeded'}`, 'promise_breached', {
                  isBuzzer: true,
                });
                playCritical();
              } else if (isManager) {
                await addNotification('warning', 'A promise was breached', 'promise_breached_manager', {
                  actionLabel: 'Review',
                  roleTarget: ['promise_tracker', 'promise_management'],
                });
                playWarning();
              }
            }
          } else if (payload.eventType === 'INSERT') {
            // New promise created
            if (isDeveloper) {
              await addNotification('info', 'New promise assigned to you', 'promise_assigned', {});
              playInfo();
            }
          }
        }
      )
      .subscribe();

    // Listen for fines
    const finesChannel = supabase
      .channel('promise-fines-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'promise_fines',
        },
        async (payload) => {
          const fine = payload.new as any;
          
          if (fine.developer_id === user.id) {
            await addNotification('danger', `Fine issued: ₹${fine.fine_amount} - ${fine.fine_reason}`, 'promise_fine_issued', {
              isBuzzer: true,
            });
            playCritical();
          } else if (['promise_management', 'super_admin', 'master'].includes(userRole || '')) {
            await addNotification('warning', `New fine issued: ₹${fine.fine_amount}`, 'promise_fine_manager', {
              actionLabel: 'Review',
              roleTarget: ['promise_management'],
            });
            playWarning();
          }
        }
      )
      .subscribe();

    // Check for approaching deadlines every minute
    const checkDeadlines = async () => {
      if (userRole !== 'developer') return;

      const { data: promises } = await supabase
        .from('promise_logs')
        .select('id, deadline')
        .eq('developer_id', user.id)
        .in('status', ['promised', 'in_progress', 'assigned']);

      const now = new Date();
      const thirtyMinutes = 30 * 60 * 1000;

      (promises || []).forEach(async (p: any) => {
        const deadline = new Date(p.deadline);
        const timeLeft = deadline.getTime() - now.getTime();

        if (timeLeft > 0 && timeLeft <= thirtyMinutes) {
          await addNotification('warning', 'Promise deadline approaching in 30 minutes!', 'promise_deadline_warning', {
            isBuzzer: true,
          });
          playWarning();
        }
      });
    };

    const deadlineInterval = setInterval(checkDeadlines, 60000);
    checkDeadlines(); // Initial check

    return () => {
      supabase.removeChannel(promiseChannel);
      supabase.removeChannel(finesChannel);
      clearInterval(deadlineInterval);
    };
  }, [user, userRole, addNotification, playWarning, playCritical, playSuccess, playInfo]);
}

export default usePromiseNotifications;
