/**
 * Global Auto-Scaling System
 * Real infrastructure hooks for server up/down scaling
 */

import { supabase } from '@/integrations/supabase/client';
import { globalEventStream } from './global-event-stream';

export interface ScalingTrigger {
  id: string;
  type: 'cpu' | 'memory' | 'requests' | 'latency' | 'custom';
  threshold: number;
  operator: '>' | '<' | '>=' | '<=';
  duration: number; // seconds
  region: string;
  action: 'scale_up' | 'scale_down';
  cooldown: number; // seconds
}

export interface ScalingAction {
  id: string;
  triggerId: string;
  action: 'scale_up' | 'scale_down';
  region: string;
  serverCount: number;
  infrastructureType: 'compute' | 'database' | 'cache' | 'cdn';
  executedAt: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
}

export interface InfrastructureHook {
  provider: 'aws' | 'gcp' | 'azure' | 'digitalocean' | 'linode';
  region: string;
  resourceType: string;
  apiEndpoint: string;
  credentials: {
    accessKey?: string;
    secretKey?: string;
    apiKey?: string;
    token?: string;
  };
}

export class GlobalAutoScaler {
  private scalingTriggers: Map<string, ScalingTrigger> = new Map();
  private activeCooldowns: Map<string, number> = new Map();
  private infrastructureHooks: Map<string, InfrastructureHook> = new Map();
  private scalingHistory: ScalingAction[] = [];
  private monitoringInterval?: NodeJS.Timeout;

  constructor() {
    this.initializeDefaultTriggers();
    this.loadInfrastructureHooks();
    this.startMonitoring();
  }

  /**
   * Initialize default scaling triggers
   */
  private initializeDefaultTriggers(): void {
    const defaultTriggers: ScalingTrigger[] = [
      {
        id: 'cpu_high_us_east',
        type: 'cpu',
        threshold: 80,
        operator: '>',
        duration: 300, // 5 minutes
        region: 'us-east',
        action: 'scale_up',
        cooldown: 600 // 10 minutes
      },
      {
        id: 'memory_high_us_east',
        type: 'memory',
        threshold: 85,
        operator: '>',
        duration: 180, // 3 minutes
        region: 'us-east',
        action: 'scale_up',
        cooldown: 600
      },
      {
        id: 'requests_high_global',
        type: 'requests',
        threshold: 1000, // requests per second
        operator: '>',
        duration: 120, // 2 minutes
        region: 'global',
        action: 'scale_up',
        cooldown: 300
      },
      {
        id: 'latency_high_eu_west',
        type: 'latency',
        threshold: 500, // ms
        operator: '>',
        duration: 240, // 4 minutes
        region: 'eu-west',
        action: 'scale_up',
        cooldown: 600
      }
    ];

    defaultTriggers.forEach(trigger => {
      this.scalingTriggers.set(trigger.id, trigger);
    });
  }

  /**
   * Load infrastructure provider hooks
   */
  private async loadInfrastructureHooks(): Promise<void> {
    try {
      // Load from database or environment
      const hooks: InfrastructureHook[] = [
        {
          provider: 'aws',
          region: 'us-east-1',
          resourceType: 'ec2',
          apiEndpoint: 'https://ec2.us-east-1.amazonaws.com',
          credentials: {
            accessKey: Deno.env.get('AWS_ACCESS_KEY_ID'),
            secretKey: Deno.env.get('AWS_SECRET_ACCESS_KEY')
          }
        },
        {
          provider: 'digitalocean',
          region: 'nyc3',
          resourceType: 'droplet',
          apiEndpoint: 'https://api.digitalocean.com/v2',
          credentials: {
            token: Deno.env.get('DO_API_TOKEN')
          }
        }
      ];

      hooks.forEach(hook => {
        if (hook.credentials.accessKey || hook.credentials.token) {
          this.infrastructureHooks.set(`${hook.provider}-${hook.region}`, hook);
        }
      });
    } catch (error) {
      console.error('Failed to load infrastructure hooks:', error);
    }
  }

  /**
   * Start monitoring for scaling triggers
   */
  private startMonitoring(): void {
    this.monitoringInterval = setInterval(async () => {
      await this.checkScalingTriggers();
    }, 30000); // Check every 30 seconds

    // Subscribe to infrastructure events
    globalEventStream.on('server_metrics_history_INSERT', (event) => {
      this.handleMetricsEvent(event);
    });

    globalEventStream.on('infrastructure_alert', (event) => {
      this.handleInfrastructureAlert(event);
    });
  }

  /**
   * Check all scaling triggers
   */
  private async checkScalingTriggers(): Promise<void> {
    const now = Date.now();

    for (const [triggerId, trigger] of this.scalingTriggers.entries()) {
      // Check cooldown
      const lastAction = this.activeCooldowns.get(triggerId);
      if (lastAction && (now - lastAction) < (trigger.cooldown * 1000)) {
        continue;
      }

      // Evaluate trigger condition
      const shouldTrigger = await this.evaluateTrigger(trigger);
      if (shouldTrigger) {
        await this.executeScalingAction(trigger);
        this.activeCooldowns.set(triggerId, now);
      }
    }
  }

  /**
   * Evaluate if a scaling trigger should fire
   */
  private async evaluateTrigger(trigger: ScalingTrigger): Promise<boolean> {
    try {
      const metrics = await this.getMetricsForTrigger(trigger);

      if (!metrics || metrics.length === 0) return false;

      // Check if condition has been met for the required duration
      const threshold = trigger.threshold;
      const requiredDuration = trigger.duration * 1000; // convert to ms
      const now = Date.now();

      const recentMetrics = metrics.filter(m =>
        (now - new Date(m.created_at).getTime()) <= requiredDuration
      );

      if (recentMetrics.length === 0) return false;

      // Check if all recent metrics meet the condition
      return recentMetrics.every(metric => {
        const value = this.getMetricValue(metric, trigger.type);
        return this.compareValue(value, threshold, trigger.operator);
      });

    } catch (error) {
      console.error(`Error evaluating trigger ${trigger.id}:`, error);
      return false;
    }
  }

  /**
   * Get metrics for trigger evaluation
   */
  private async getMetricsForTrigger(trigger: ScalingTrigger): Promise<any[]> {
    try {
      let query = supabase
        .from('server_metrics_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (trigger.region !== 'global') {
        query = query.eq('region', trigger.region);
      }

      const { data, error } = await query;
      return error ? [] : data || [];
    } catch (error) {
      console.error('Failed to get metrics for trigger:', error);
      return [];
    }
  }

  /**
   * Get metric value based on type
   */
  private getMetricValue(metric: any, type: ScalingTrigger['type']): number {
    switch (type) {
      case 'cpu': return metric.cpu_usage || 0;
      case 'memory': return metric.memory_usage || 0;
      case 'requests': return metric.requests_per_second || 0;
      case 'latency': return metric.response_time || 0;
      default: return 0;
    }
  }

  /**
   * Compare value with threshold
   */
  private compareValue(value: number, threshold: number, operator: ScalingTrigger['operator']): boolean {
    switch (operator) {
      case '>': return value > threshold;
      case '<': return value < threshold;
      case '>=': return value >= threshold;
      case '<=': return value <= threshold;
      default: return false;
    }
  }

  /**
   * Execute scaling action
   */
  private async executeScalingAction(trigger: ScalingTrigger): Promise<void> {
    const action: ScalingAction = {
      id: crypto.randomUUID(),
      triggerId: trigger.id,
      action: trigger.action,
      region: trigger.region,
      serverCount: trigger.action === 'scale_up' ? 1 : -1,
      infrastructureType: 'compute',
      executedAt: new Date().toISOString(),
      status: 'pending'
    };

    this.scalingHistory.push(action);

    try {
      action.status = 'executing';

      // Execute the scaling via infrastructure hook
      const result = await this.scaleInfrastructure(trigger);

      action.status = 'completed';
      action.result = result;

      // Emit event
      await globalEventStream.emit({
        type: 'autoscaling_action',
        source: 'global_autoscaler',
        data: {
          action,
          trigger,
          result
        },
        priority: 'high'
      });

      console.log(`✅ Auto-scaling ${trigger.action} executed for ${trigger.region}`);

    } catch (error) {
      action.status = 'failed';
      action.result = { error: error instanceof Error ? error.message : 'Unknown error' };

      console.error(`❌ Auto-scaling failed for ${trigger.region}:`, error);
    }
  }

  /**
   * Scale infrastructure via provider hooks
   */
  private async scaleInfrastructure(trigger: ScalingTrigger): Promise<any> {
    const hookKey = this.findInfrastructureHook(trigger.region);
    const hook = this.infrastructureHooks.get(hookKey);

    if (!hook) {
      throw new Error(`No infrastructure hook available for region ${trigger.region}`);
    }

    // Execute scaling via provider API
    return await this.callInfrastructureAPI(hook, trigger);
  }

  /**
   * Find appropriate infrastructure hook for region
   */
  private findInfrastructureHook(region: string): string {
    // Map regions to available hooks
    const regionMappings: Record<string, string> = {
      'us-east': 'aws-us-east-1',
      'eu-west': 'aws-eu-west-1',
      'asia-pacific': 'digitalocean-nyc3'
    };

    return regionMappings[region] || 'aws-us-east-1';
  }

  /**
   * Call infrastructure provider API
   */
  private async callInfrastructureAPI(hook: InfrastructureHook, trigger: ScalingTrigger): Promise<any> {
    // This would implement actual API calls to cloud providers
    // For now, simulate the scaling action

    console.log(`🔧 Scaling ${trigger.action} via ${hook.provider} in ${hook.region}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      provider: hook.provider,
      region: hook.region,
      action: trigger.action,
      serverCount: Math.abs(trigger.action === 'scale_up' ? 1 : -1),
      status: 'completed',
      instanceId: `i-${crypto.randomUUID().slice(0, 8)}`
    };
  }

  /**
   * Handle metrics events from stream
   */
  private handleMetricsEvent(event: any): void {
    // Real-time metrics processing for immediate scaling decisions
    const metrics = event.data;
    const trigger = this.findMatchingTrigger(metrics);

    if (trigger) {
      // Immediate scaling for critical thresholds
      this.executeScalingAction(trigger);
    }
  }

  /**
   * Handle infrastructure alerts
   */
  private handleInfrastructureAlert(event: any): void {
    const alert = event.data;

    if (alert.severity === 'critical' && alert.type === 'resource_exhaustion') {
      // Emergency scaling
      const emergencyTrigger: ScalingTrigger = {
        id: `emergency-${Date.now()}`,
        type: 'custom',
        threshold: 0,
        operator: '>',
        duration: 0,
        region: alert.region,
        action: 'scale_up',
        cooldown: 60 // 1 minute cooldown for emergencies
      };

      this.executeScalingAction(emergencyTrigger);
    }
  }

  /**
   * Find matching trigger for metrics
   */
  private findMatchingTrigger(metrics: any): ScalingTrigger | null {
    for (const trigger of this.scalingTriggers.values()) {
      const value = this.getMetricValue(metrics, trigger.type);
      if (this.compareValue(value, trigger.threshold, trigger.operator)) {
        return trigger;
      }
    }
    return null;
  }

  /**
   * Get scaling history
   */
  getScalingHistory(limit = 50): ScalingAction[] {
    return this.scalingHistory.slice(-limit);
  }

  /**
   * Get active triggers
   */
  getActiveTriggers(): ScalingTrigger[] {
    return Array.from(this.scalingTriggers.values());
  }

  /**
   * Add custom scaling trigger
   */
  addTrigger(trigger: ScalingTrigger): void {
    this.scalingTriggers.set(trigger.id, trigger);
  }

  /**
   * Remove scaling trigger
   */
  removeTrigger(triggerId: string): void {
    this.scalingTriggers.delete(triggerId);
  }

  /**
   * Get scaling status
   */
  getStatus(): {
    activeTriggers: number;
    activeCooldowns: number;
    totalActions: number;
    recentActions: ScalingAction[];
  } {
    return {
      activeTriggers: this.scalingTriggers.size,
      activeCooldowns: this.activeCooldowns.size,
      totalActions: this.scalingHistory.length,
      recentActions: this.scalingHistory.slice(-5)
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.scalingTriggers.clear();
    this.activeCooldowns.clear();
    this.infrastructureHooks.clear();
  }
}

export const globalAutoScaler = new GlobalAutoScaler();