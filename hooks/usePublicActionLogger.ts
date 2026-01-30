'use client';
import { useCallback } from 'react';

/**
 * Minimal public action logger hook.
 * Use across critical public UI actions (login, buy, demo, apply).
 * This is best-effort non-blocking logging to /api/audit.
 */
export function usePublicActionLogger() {
  const logAction = useCallback(async (payload: { action: string; label?: string; meta?: any }) => {
    try {
      await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, ts: new Date().toISOString() }),
      });
    } catch (err) {
      console.error('audit log failed', err);
    }
  }, []);
  return { logAction };
}
