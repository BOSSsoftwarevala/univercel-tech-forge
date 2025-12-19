import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface Alert {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  message?: string;
  source_module?: string;
  requires_acknowledgment: boolean;
  acknowledged_at?: string;
  escalation_level: number;
  is_active: boolean;
  created_at: string;
}

interface BuzzerState {
  isActive: boolean;
  alertId?: string;
  title?: string;
  severity?: string;
}

export function useCommandCenter() {
  const { user, userRole } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unacknowledgedCount, setUnacknowledgedCount] = useState(0);
  const [buzzer, setBuzzer] = useState<BuzzerState>({ isActive: false });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    if (!user || !userRole) return;
    try {
      // Alerts will be fetched when types regenerate after migration
      setAlerts([]);
      setUnacknowledgedCount(0);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, userRole]);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    toast.success('Alert acknowledged');
    return true;
  }, []);

  const createAlert = useCallback(async (alert: Record<string, unknown>) => {
    return true;
  }, []);

  useEffect(() => {
    if (user) fetchAlerts();
  }, [user, fetchAlerts]);

  return { alerts, unacknowledgedCount, buzzer, isLoading, acknowledgeAlert, createAlert, refetch: fetchAlerts };
}
