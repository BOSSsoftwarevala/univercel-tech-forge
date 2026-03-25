/**
 * AI OBSERVATION SERVICE
 * Central AI brain observation and decision logging
 * Observes usage, predicts failures, optimizes speed, blocks unsafe actions
 */
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export type ObservationType = 'usage' | 'prediction' | 'optimization' | 'block' | 'auto_fix';

interface AIObservation {
  observationType: ObservationType;
  moduleName: string;
  actionId?: string;
  userId?: string;
  observationData: Record<string, unknown>;
  confidenceScore?: number;
  actionTaken?: string;
  result?: string;
}

class AIObservationService {
  private static instance: AIObservationService;
  private observationQueue: AIObservation[] = [];
  private isProcessing = false;
  private flushInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {
    // Start background flush every 5 seconds
    this.flushInterval = setInterval(() => this.flushQueue(), 5000);
  }

  static getInstance(): AIObservationService {
    if (!AIObservationService.instance) {
      AIObservationService.instance = new AIObservationService();
    }
    return AIObservationService.instance;
  }

  /**
   * Log a usage observation
   */
  async logUsage(moduleName: string, data: Record<string, unknown>): Promise<void> {
    this.queueObservation({
      observationType: 'usage',
      moduleName,
      observationData: data,
    });
  }

  /**
   * Log a failure prediction
   */
  async logPrediction(
    moduleName: string,
    prediction: string,
    confidenceScore: number,
    data: Record<string, unknown>
  ): Promise<void> {
    this.queueObservation({
      observationType: 'prediction',
      moduleName,
      observationData: { prediction, ...data },
      confidenceScore,
    });
  }

  /**
   * Log an optimization action
   */
  async logOptimization(
    moduleName: string,
    optimization: string,
    result: string
  ): Promise<void> {
    this.queueObservation({
      observationType: 'optimization',
      moduleName,
      observationData: { optimization },
      actionTaken: optimization,
      result,
    });
  }

  /**
   * Log a blocked action
   */
  async logBlock(
    moduleName: string,
    reason: string,
    actionAttempted: string
  ): Promise<void> {
    this.queueObservation({
      observationType: 'block',
      moduleName,
      observationData: { reason, actionAttempted },
      actionTaken: 'blocked',
      result: reason,
    });
  }

  /**
   * Log an auto-fix action
   */
  async logAutoFix(
    moduleName: string,
    issue: string,
    fix: string,
    success: boolean
  ): Promise<void> {
    this.queueObservation({
      observationType: 'auto_fix',
      moduleName,
      observationData: { issue, fix },
      actionTaken: fix,
      result: success ? 'success' : 'failure',
    });
  }

  /**
   * Queue observation for batch processing
   */
  private queueObservation(observation: AIObservation): void {
    this.observationQueue.push(observation);
    
    // Flush immediately if queue is large
    if (this.observationQueue.length >= 10) {
      this.flushQueue();
    }
  }

  /**
   * Flush queued observations to database
   */
  private async flushQueue(): Promise<void> {
    if (this.isProcessing || this.observationQueue.length === 0) return;

    this.isProcessing = true;
    const observations = [...this.observationQueue];
    this.observationQueue = [];

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const records = observations.map(obs => ({
        observation_type: obs.observationType,
        module_name: obs.moduleName,
        action_id: obs.actionId || null,
        user_id: obs.userId || user?.id || null,
        observation_data: obs.observationData as unknown as Json,
        confidence_score: obs.confidenceScore || null,
        action_taken: obs.actionTaken || null,
        result: obs.result || null,
      }));

      await supabase.from('ai_observation_logs' as 'ai_observation_logs').insert(records as never);
    } catch (error) {
      // Silent fail - put observations back in queue
      this.observationQueue.unshift(...observations);
      console.error('[AIObservation] Failed to flush:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Cleanup on unmount
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushQueue();
  }
}

export const aiObservation = AIObservationService.getInstance();
export default AIObservationService;
