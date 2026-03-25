/**
 * System Notifications Initializer
 * Component that initializes all system notification listeners
 */

import { useEffect } from 'react';
import { useSystemNotifications } from '@/hooks/useSystemNotifications';

export function SystemNotificationsInitializer() {
  // Initialize all notification listeners
  useSystemNotifications();
  
  return null; // This component doesn't render anything
}

export default SystemNotificationsInitializer;
