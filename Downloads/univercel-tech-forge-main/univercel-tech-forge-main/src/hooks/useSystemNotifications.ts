/**
 * System Notifications Hook
 * Aggregates all notification subscriptions for the app
 */

import { useSafeAssistNotifications } from './useSafeAssistNotifications';
import { usePromiseNotifications } from './usePromiseNotifications';

export function useSystemNotifications() {
  // Initialize all notification listeners
  useSafeAssistNotifications();
  usePromiseNotifications();
}

export default useSystemNotifications;
