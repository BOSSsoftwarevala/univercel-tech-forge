/**
 * OVER AI - Core Intelligence Engine Types
 * LOCKED - DO NOT MODIFY
 */

export type OverAISection =
  | 'dashboard'
  | 'speed-engine'
  | 'server-orchestration'
  | 'self-healing'
  | 'decision-logic'
  | 'support-integration'
  | 'security-control'
  | 'fail-safe';

export type AIStatus = 'active' | 'degraded' | 'critical';

export type UserRole = 'ceo' | 'core_ai_admin' | 'server_manager' | 'support_manager';

export interface AIMetrics {
  status: AIStatus;
  responseSpeedMs: number;
  systemLoadPercent: number;
  activeFlowsCount: number;
  errorsAutoResolved: number;
  predictedFailures24h: number;
}

export interface SpeedEngineMetric {
  id: string;
  name: string;
  status: 'optimal' | 'active' | 'standby';
  latencyMs: number;
  hitRate?: number;
}

export interface ServerNode {
  id: string;
  name: string;
  region: string;
  status: 'primary' | 'backup' | 'cache';
  load: number;
  responseTime: number;
}

export interface HealingEvent {
  id: string;
  type: 'restart' | 'switch' | 'rebuild' | 'rerun' | 'log';
  target: string;
  timestamp: string;
  status: 'resolved' | 'in-progress' | 'pending';
  silent: boolean;
}

export interface DecisionMetric {
  id: string;
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

export interface SupportTicket {
  id: string;
  issueType: string;
  confidence: number;
  resolution: string;
  status: 'auto-fixed' | 'escalated' | 'pending';
  timestamp: string;
}
