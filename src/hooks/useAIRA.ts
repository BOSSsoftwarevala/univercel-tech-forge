/**
 * useAIRA - Centralized AIRA (ValaAICommandCenter) hook
 * ======================================================
 * Security controls:
 *   - boss_owner role enforcement (all commands rejected otherwise)
 *   - Command validation (injection detection, length limits)
 *   - Audit logging to aira_logs table (success/error/rejected)
 *   - Failsafe mode (halts execution when API unavailable)
 */

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vala-ai-chat`;

// Patterns indicating potential shell injection / dangerous commands
const SHELL_INJECTION_PATTERNS: RegExp[] = [
  /;\s*rm\s+-/i,
  /&&\s*rm\s+-/i,
  /\|\s*bash/i,
  /`[^`]+`/,
  /\$\([^)]+\)/,
  />\s*\/etc\//i,
  />\s*\/var\//i,
  />\s*\/proc\//i,
  /chmod\s+[0-7]{3,4}\s+\/(?:etc|bin|usr|var)/i,
  /curl\s+.*\|\s*(?:bash|sh)/i,
  /wget\s+.*-O\s*-\s*\|/i,
];

// Approved command intent patterns (whitelist; absence triggers medium risk, not block)
const APPROVED_INTENT_PATTERNS: RegExp[] = [
  /^(?:create|update|delete|list|show|get|set|run|check|analyze|fix|deploy|rollback|status|help)/i,
  /^(?:build|test|lint|format|install|uninstall|enable|disable|config|reset|sync|describe)/i,
  /^(?:review|explain|summarize|generate|suggest|debug|optimize|validate|migrate|seed)/i,
];

type AiraLogEntry = {
  user_id: string;
  command: string;
  action_type: string;
  result: string;
  risk_level: string;
};

type ValidationResult = {
  valid: boolean;
  reason?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
};

/** Typed error codes for AIRA failures — avoids fragile string prefix checks */
export type AIRAErrorCode = 'UNAUTHORIZED' | 'FAILSAFE' | 'VALIDATION_FAILED' | 'RATE_LIMIT' | 'CREDITS_EXHAUSTED' | 'API_ERROR';

export class AIRAError extends Error {
  constructor(public readonly code: AIRAErrorCode, message: string) {
    super(message);
    this.name = 'AIRAError';
  }
}

export const useAIRA = () => {
  const { user, isBossOwner } = useAuth();
  const [systemHealthy, setSystemHealthy] = useState(true);

  // Write a log entry to aira_logs (best-effort, never throws)
  const writeAiraLog = useCallback(async (entry: AiraLogEntry): Promise<void> => {
    try {
      // aira_logs is a new table not yet in generated types; cast until types are regenerated
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('aira_logs').insert(entry);
    } catch (err) {
      console.error('[AIRA] Log write failed:', err);
    }
  }, []);

  // Validate a command for security concerns
  const validateCommand = useCallback((command: string): ValidationResult => {
    if (command.length > 2000) {
      return { valid: false, reason: 'Command exceeds maximum length of 2000 characters', riskLevel: 'low' };
    }

    for (const pattern of SHELL_INJECTION_PATTERNS) {
      if (pattern.test(command)) {
        return { valid: false, reason: 'Potential shell injection pattern detected', riskLevel: 'critical' };
      }
    }

    const matchesApproved = APPROVED_INTENT_PATTERNS.some(p => p.test(command.trim()));
    return { valid: true, riskLevel: matchesApproved ? 'low' : 'medium' };
  }, []);

  /**
   * Execute an AIRA command.
   * Returns the raw ReadableStream on success, or throws AIRAError.
   * All executions (including rejections) are logged to aira_logs.
   */
  const executeCommand = useCallback(async (
    command: string,
    messages: Array<{ role: string; content: string }>,
    context: string,
    options: { voiceEnabled?: boolean } = {},
  ): Promise<ReadableStream<Uint8Array>> => {
    const userId = user?.id ?? '';

    // ── 1. Boss-owner enforcement ──────────────────────────────────────────
    if (!isBossOwner || !user) {
      await writeAiraLog({
        user_id: userId,
        command: command.slice(0, 500),
        action_type: 'rejected',
        result: 'Unauthorized: boss_owner role required',
        risk_level: 'high',
      });
      throw new AIRAError('UNAUTHORIZED', 'Only boss_owner can execute AIRA commands');
    }

    // ── 2. Failsafe: system health check ──────────────────────────────────
    if (!systemHealthy) {
      await writeAiraLog({
        user_id: userId,
        command: command.slice(0, 500),
        action_type: 'rejected',
        result: 'Failsafe: system health check failed — command execution halted',
        risk_level: 'high',
      });
      throw new AIRAError('FAILSAFE', 'System health check failed. Command execution halted until recovery.');
    }

    // ── 3. Command validation ─────────────────────────────────────────────
    const { valid, reason, riskLevel } = validateCommand(command);
    if (!valid) {
      await writeAiraLog({
        user_id: userId,
        command: command.slice(0, 500),
        action_type: 'rejected',
        result: `Validation failed: ${reason}`,
        risk_level: riskLevel,
      });
      throw new AIRAError('VALIDATION_FAILED', reason ?? 'Command validation failed');
    }

    // ── 4. Pre-execution audit log ────────────────────────────────────────
    await writeAiraLog({
      user_id: userId,
      command: command.slice(0, 500),
      action_type: 'execute',
      result: 'executing',
      risk_level: riskLevel,
    });

    // ── 5. Call edge function (uses Supabase anon/publishable key with RLS) ─
    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        messages: [...messages, { role: 'user', content: command }],
        userRole: 'boss_owner',
        context,
        voiceEnabled: options.voiceEnabled ?? false,
      }),
    });

    if (!resp.ok) {
      const errCode: AIRAErrorCode =
        resp.status === 429 ? 'RATE_LIMIT' :
        resp.status === 402 ? 'CREDITS_EXHAUSTED' :
        'API_ERROR';
      const errLabel =
        errCode === 'RATE_LIMIT' ? 'Rate limit exceeded' :
        errCode === 'CREDITS_EXHAUSTED' ? 'AI credits exhausted' :
        `Command execution failed (HTTP ${resp.status})`;

      await writeAiraLog({
        user_id: userId,
        command: command.slice(0, 500),
        action_type: 'execute',
        result: `error: ${errLabel}`,
        risk_level: riskLevel,
      });

      // Mark system unhealthy on server errors; auto-recover after 30 s
      if (resp.status >= 500) {
        setSystemHealthy(false);
        setTimeout(() => setSystemHealthy(true), 30_000);
      }

      throw new AIRAError(errCode, errLabel);
    }

    if (!resp.body) {
      throw new AIRAError('API_ERROR', 'No response body received from AI service');
    }

    return resp.body;
  }, [isBossOwner, user, systemHealthy, validateCommand, writeAiraLog]);

  /** Log a successful command completion to aira_logs */
  const logCommandSuccess = useCallback(async (
    command: string,
    riskLevel: 'low' | 'medium' = 'low',
  ): Promise<void> => {
    if (!user) return;
    await writeAiraLog({
      user_id: user.id,
      command: command.slice(0, 500),
      action_type: 'execute',
      result: 'success',
      risk_level: riskLevel,
    });
  }, [user, writeAiraLog]);

  /** Log a command error to aira_logs */
  const logCommandError = useCallback(async (
    command: string,
    errorMessage: string,
    riskLevel: 'low' | 'medium' | 'high' = 'low',
  ): Promise<void> => {
    if (!user) return;
    await writeAiraLog({
      user_id: user.id,
      command: command.slice(0, 500),
      action_type: 'execute',
      result: `error: ${errorMessage}`,
      risk_level: riskLevel,
    });
  }, [user, writeAiraLog]);

  return {
    executeCommand,
    logCommandSuccess,
    logCommandError,
    validateCommand,
    systemHealthy,
    isBossOwner,
    user,
  };
};
