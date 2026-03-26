/**
 * Data Flow Pipeline - STRICT PIPELINE IMPLEMENTATION
 * Marketplace → Lead → Sales → Payment → License → Usage → Support → Analytics → Boss Panel
 * Each step auto-updates next module with real-time sync across dashboards
 */

import { useUnifiedSaaSStore, type Lead, type Sale, type Payment, type License, type UsageLog, type SupportTicket, type Analytics } from '@/stores/unifiedSaaSStore';
import { supabase } from '@/integrations/supabase/client';

// ============= PIPELINE STAGES =============
export enum PipelineStage {
  MARKETPLACE = 'marketplace',
  LEAD = 'lead',
  SALES = 'sales',
  PAYMENT = 'payment',
  LICENSE = 'license',
  USAGE = 'usage',
  SUPPORT = 'support',
  ANALYTICS = 'analytics',
  BOSS_PANEL = 'boss_panel',
}

// ============= PIPELINE EVENTS =============
export interface PipelineEvent {
  id: string;
  stage: PipelineStage;
  type: 'created' | 'updated' | 'deleted' | 'converted';
  entityId: string;
  entityType: string;
  data: any;
  metadata: Record<string, any>;
  timestamp: string;
  triggeredBy: string;
  nextStages: PipelineStage[];
}

// ============= PIPELINE CONFIGURATION =============
interface PipelineConfig {
  stage: PipelineStage;
  nextStages: PipelineStage[];
  transformations: Record<string, (data: any) => any>;
  notifications: {
    roles: string[];
    template: string;
    channels: ('in_app' | 'email' | 'sms' | 'webhook')[];
  }[];
  autoActions: Array<{
    condition: (data: any) => boolean;
    action: (data: any) => Promise<void>;
  }>;
}

const PIPELINE_CONFIG: Record<PipelineStage, PipelineConfig> = {
  [PipelineStage.MARKETPLACE]: {
    stage: PipelineStage.MARKETPLACE,
    nextStages: [PipelineStage.LEAD],
    transformations: {
      visitor_to_lead: (data) => ({
        id: `lead_${Date.now()}`,
        source: 'marketplace',
        status: 'new',
        contactInfo: data.contactInfo,
        value: data.estimatedValue || 0,
        probability: 0.3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { source_traffic_id: data.trafficId, page: data.page },
      }),
    },
    notifications: [
      {
        roles: ['lead_manager', 'marketing_manager'],
        template: 'New visitor converted to lead from {page}',
        channels: ['in_app', 'email'],
      },
    ],
    autoActions: [
      {
        condition: (data) => data.estimatedValue > 1000,
        action: async (data) => {
          // Auto-assign high-value leads
          console.log('Auto-assigning high-value lead:', data);
        },
      },
    ],
  },
  
  [PipelineStage.LEAD]: {
    stage: PipelineStage.LEAD,
    nextStages: [PipelineStage.SALES],
    transformations: {
      lead_to_sale: (data) => ({
        id: `sale_${Date.now()}`,
        leadId: data.id,
        customerId: data.contactInfo.email,
        productId: data.selectedProduct,
        amount: data.value,
        currency: 'USD',
        status: 'pending',
        paymentMethod: 'pending',
        salesManagerId: data.assignedTo,
        commission: {
          reseller: data.resellerCommission || 0,
          franchise: data.franchiseCommission || 0,
          influencer: data.influencerCommission || 0,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { lead_source: data.source },
      }),
    },
    notifications: [
      {
        roles: ['sales_manager', 'lead_manager'],
        template: 'Lead {leadId} converted to sale opportunity',
        channels: ['in_app', 'email'],
      },
    ],
    autoActions: [
      {
        condition: (data) => data.status === 'qualified',
        action: async (data) => {
          // Auto-create sales opportunity
          console.log('Creating sales opportunity for qualified lead:', data);
        },
      },
    ],
  },
  
  [PipelineStage.SALES]: {
    stage: PipelineStage.SALES,
    nextStages: [PipelineStage.PAYMENT],
    transformations: {
      sale_to_payment: (data) => ({
        id: `payment_${Date.now()}`,
        saleId: data.id,
        amount: data.amount,
        currency: data.currency,
        method: data.paymentMethod || 'card',
        status: 'pending',
        gateway: 'stripe',
        createdAt: new Date().toISOString(),
        metadata: { sales_manager: data.salesManagerId },
      }),
    },
    notifications: [
      {
        roles: ['finance_manager', 'sales_manager'],
        template: 'Payment initiated for sale {saleId}',
        channels: ['in_app'],
      },
    ],
    autoActions: [],
  },
  
  [PipelineStage.PAYMENT]: {
    stage: PipelineStage.PAYMENT,
    nextStages: [PipelineStage.LICENSE],
    transformations: {
      payment_to_license: (data) => ({
        id: `license_${Date.now()}`,
        userId: data.customerId,
        productId: data.productId,
        saleId: data.saleId,
        type: data.amount > 500 ? 'premium' : 'basic',
        status: 'active',
        features: ['basic_access'],
        usageLimits: {
          apiCalls: data.amount > 500 ? 10000 : 1000,
          storage: data.amount > 500 ? 100 : 10,
          users: data.amount > 500 ? 50 : 5,
        },
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { payment_id: data.id },
      }),
    },
    notifications: [
      {
        roles: ['license_manager', 'finance_manager'],
        template: 'License created for successful payment {paymentId}',
        channels: ['in_app', 'email'],
      },
    ],
    autoActions: [
      {
        condition: (data) => data.status === 'completed',
        action: async (data) => {
          // Auto-activate license
          console.log('Activating license for payment:', data);
        },
      },
    ],
  },
  
  [PipelineStage.LICENSE]: {
    stage: PipelineStage.LICENSE,
    nextStages: [PipelineStage.USAGE],
    transformations: {
      license_to_usage: (data) => ({
        id: `usage_${Date.now()}`,
        userId: data.userId,
        licenseId: data.id,
        action: 'license_activated',
        resource: 'system_access',
        quantity: 1,
        timestamp: new Date().toISOString(),
        metadata: { license_type: data.type },
      }),
    },
    notifications: [
      {
        roles: ['user_dashboard'],
        template: 'Your license has been activated!',
        channels: ['in_app', 'email'],
      },
    ],
    autoActions: [],
  },
  
  [PipelineStage.USAGE]: {
    stage: PipelineStage.USAGE,
    nextStages: [PipelineStage.SUPPORT],
    transformations: {
      usage_to_support: (data) => ({
        id: `ticket_${Date.now()}`,
        userId: data.userId,
        licenseId: data.licenseId,
        subject: 'Usage limit warning',
        description: `User has reached ${data.percentage}% of their ${data.resource} limit`,
        priority: data.percentage > 90 ? 'high' : 'medium',
        status: 'open',
        category: 'technical',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { usage_log_id: data.id },
      }),
    },
    notifications: [
      {
        roles: ['customer_support', 'user_dashboard'],
        template: 'Usage limit approaching for {resource}',
        channels: ['in_app', 'email'],
      },
    ],
    autoActions: [],
  },
  
  [PipelineStage.SUPPORT]: {
    stage: PipelineStage.SUPPORT,
    nextStages: [PipelineStage.ANALYTICS],
    transformations: {
      support_to_analytics: (data) => ({
        id: `analytics_${Date.now()}`,
        module: 'customer_support',
        metric: 'support_tickets',
        value: 1,
        period: 'daily',
        timestamp: new Date().toISOString(),
        dimensions: {
          category: data.category,
          priority: data.priority,
          status: data.status,
        },
        metadata: { ticket_id: data.id },
      }),
    },
    notifications: [
      {
        roles: ['analytics_manager', 'customer_support'],
        template: 'Support ticket {ticketId} created',
        channels: ['in_app'],
      },
    ],
    autoActions: [],
  },
  
  [PipelineStage.ANALYTICS]: {
    stage: PipelineStage.ANALYTICS,
    nextStages: [PipelineStage.BOSS_PANEL],
    transformations: {
      analytics_to_boss: (data) => ({
        id: `boss_analytics_${Date.now()}`,
        module: data.module,
        metric: data.metric,
        value: data.value,
        period: data.period,
        timestamp: data.timestamp,
        dimensions: data.dimensions,
        metadata: { ...data.metadata, aggregated: true },
      }),
    },
    notifications: [
      {
        roles: ['boss_owner', 'ceo'],
        template: 'Analytics update: {metric} = {value}',
        channels: ['in_app'],
      },
    ],
    autoActions: [],
  },
  
  [PipelineStage.BOSS_PANEL]: {
    stage: PipelineStage.BOSS_PANEL,
    nextStages: [],
    transformations: {},
    notifications: [],
    autoActions: [],
  },
};

// ============= PIPELINE SERVICE =============
export class DataFlowPipeline {
  private eventQueue: PipelineEvent[] = [];
  private processing = false;
  private subscribers: Map<string, ((event: PipelineEvent) => void)[]> = new Map();

  constructor() {
    this.initializeWebSocket();
  }

  // ============= EVENT PROCESSING =============
  async processEvent(event: Omit<PipelineEvent, 'id' | 'timestamp' | 'nextStages'>): Promise<void> {
    const pipelineEvent: PipelineEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      nextStages: PIPELINE_CONFIG[event.stage]?.nextStages || [],
    };

    this.eventQueue.push(pipelineEvent);
    await this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!;
      await this.handleEvent(event);
    }

    this.processing = false;
  }

  private async handleEvent(event: PipelineEvent): Promise<void> {
    const config = PIPELINE_CONFIG[event.stage];
    if (!config) return;

    // Store event
    await this.storeEvent(event);

    // Apply transformations
    await this.applyTransformations(event);

    // Send notifications
    await this.sendNotifications(event);

    // Execute auto actions
    await this.executeAutoActions(event);

    // Notify subscribers
    this.notifySubscribers(event);

    // Trigger next stages
    await this.triggerNextStages(event);
  }

  // ============= TRANSFORMATIONS =============
  private async applyTransformations(event: PipelineEvent): Promise<void> {
    const config = PIPELINE_CONFIG[event.stage];
    const store = useUnifiedSaaSStore.getState();

    for (const [transformationType, transformFn] of Object.entries(config.transformations)) {
      if (this.shouldTransform(event, transformationType)) {
        const transformedData = transformFn(event.data);
        
        // Add to store
        switch (event.stage) {
          case PipelineStage.MARKETPLACE:
            if (transformationType === 'visitor_to_lead') {
              store.addLead(transformedData);
            }
            break;
          case PipelineStage.LEAD:
            if (transformationType === 'lead_to_sale') {
              store.addSale(transformedData);
            }
            break;
          case PipelineStage.SALES:
            if (transformationType === 'sale_to_payment') {
              store.addPayment(transformedData);
            }
            break;
          case PipelineStage.PAYMENT:
            if (transformationType === 'payment_to_license') {
              store.addLicense(transformedData);
            }
            break;
          case PipelineStage.LICENSE:
            if (transformationType === 'license_to_usage') {
              store.addUsageLog(transformedData);
            }
            break;
          case PipelineStage.USAGE:
            if (transformationType === 'usage_to_support') {
              store.addSupportTicket(transformedData);
            }
            break;
          case PipelineStage.SUPPORT:
            if (transformationType === 'support_to_analytics') {
              store.addAnalytics(transformedData);
            }
            break;
          case PipelineStage.ANALYTICS:
            if (transformationType === 'analytics_to_boss') {
              store.addAnalytics(transformedData);
            }
            break;
        }

        // Store in database
        await this.persistTransformedData(event.stage, transformedData);
      }
    }
  }

  private shouldTransform(event: PipelineEvent, transformationType: string): boolean {
    switch (transformationType) {
      case 'visitor_to_lead':
        return event.type === 'created' && event.entityType === 'visitor';
      case 'lead_to_sale':
        return event.type === 'updated' && event.data.status === 'converted';
      case 'sale_to_payment':
        return event.type === 'created' && event.entityType === 'sale';
      case 'payment_to_license':
        return event.type === 'updated' && event.data.status === 'completed';
      case 'license_to_usage':
        return event.type === 'created' && event.entityType === 'license';
      case 'usage_to_support':
        return event.type === 'created' && event.data.percentage > 80;
      case 'support_to_analytics':
        return event.type === 'created' && event.entityType === 'support_ticket';
      case 'analytics_to_boss':
        return event.type === 'created' && event.entityType === 'analytics';
      default:
        return false;
    }
  }

  // ============= NOTIFICATIONS =============
  private async sendNotifications(event: PipelineEvent): Promise<void> {
    const config = PIPELINE_CONFIG[event.stage];
    const store = useUnifiedSaaSStore.getState();

    for (const notification of config.notifications) {
      const message = this.templateToMessage(notification.template, event);
      
      for (const channel of notification.channels) {
        if (channel === 'in_app') {
          store.addNotification({
            userId: 'broadcast', // Will be filtered by role
            type: 'info',
            title: `${event.stage} Update`,
            message,
            metadata: { event_id: event.id, stage: event.stage },
          });
        }
        // Add email, SMS, webhook implementations
      }
    }
  }

  private templateToMessage(template: string, event: PipelineEvent): string {
    return template.replace(/{(\w+)}/g, (match, key) => {
      return event.data[key] || event.metadata[key] || match;
    });
  }

  // ============= AUTO ACTIONS =============
  private async executeAutoActions(event: PipelineEvent): Promise<void> {
    const config = PIPELINE_CONFIG[event.stage];

    for (const autoAction of config.autoActions) {
      if (autoAction.condition(event.data)) {
        try {
          await autoAction.action(event.data);
        } catch (error) {
          console.error('Auto action failed:', error);
        }
      }
    }
  }

  // ============= NEXT STAGES =============
  private async triggerNextStages(event: PipelineEvent): Promise<void> {
    for (const nextStage of event.nextStages) {
      await this.processEvent({
        stage: nextStage,
        type: 'converted',
        entityId: event.entityId,
        entityType: event.entityType,
        data: event.data,
        metadata: { ...event.metadata, previous_stage: event.stage },
        triggeredBy: 'pipeline',
      });
    }
  }

  // ============= PERSISTENCE =============
  private async storeEvent(event: PipelineEvent): Promise<void> {
    try {
      await supabase.from('pipeline_events').insert({
        id: event.id,
        stage: event.stage,
        type: event.type,
        entity_id: event.entityId,
        entity_type: event.entityType,
        data: event.data,
        metadata: event.metadata,
        timestamp: event.timestamp,
        triggered_by: event.triggeredBy,
        next_stages: event.nextStages,
      });
    } catch (error) {
      console.error('Failed to store event:', error);
    }
  }

  private async persistTransformedData(stage: PipelineStage, data: any): Promise<void> {
    const tableName = this.getTableNameForStage(stage);
    if (!tableName) return;

    try {
      await supabase.from(tableName).insert(data);
    } catch (error) {
      console.error(`Failed to persist ${tableName}:`, error);
    }
  }

  private getTableNameForStage(stage: PipelineStage): string | null {
    const tableMap: Record<PipelineStage, string> = {
      [PipelineStage.MARKETPLACE]: 'marketplace_visitors',
      [PipelineStage.LEAD]: 'leads',
      [PipelineStage.SALES]: 'sales',
      [PipelineStage.PAYMENT]: 'payments',
      [PipelineStage.LICENSE]: 'licenses',
      [PipelineStage.USAGE]: 'usage_logs',
      [PipelineStage.SUPPORT]: 'support_tickets',
      [PipelineStage.ANALYTICS]: 'analytics',
      [PipelineStage.BOSS_PANEL]: 'boss_analytics',
    };
    return tableMap[stage] || null;
  }

  // ============= WEBSOCKET =============
  private initializeWebSocket(): void {
    // Initialize real-time subscriptions
    supabase
      .channel('pipeline-events')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'pipeline_events' },
        (payload) => {
          this.handleRealtimeEvent(payload.new as PipelineEvent);
        }
      )
      .subscribe();
  }

  private async handleRealtimeEvent(event: PipelineEvent): Promise<void> {
    const store = useUnifiedSaaSStore.getState();
    
    // Update real-time metrics
    store.updateRealTimeMetrics({
      newLeads: event.stage === PipelineStage.LEAD ? 1 : 0,
      newSales: event.stage === PipelineStage.SALES ? 1 : 0,
      newPayments: event.stage === PipelineStage.PAYMENT ? 1 : 0,
      newTickets: event.stage === PipelineStage.SUPPORT ? 1 : 0,
    });

    // Notify subscribers
    this.notifySubscribers(event);
  }

  // ============= SUBSCRIPTIONS =============
  subscribe(stage: PipelineStage, callback: (event: PipelineEvent) => void): () => void {
    if (!this.subscribers.has(stage)) {
      this.subscribers.set(stage, []);
    }
    
    this.subscribers.get(stage)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(stage);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private notifySubscribers(event: PipelineEvent): void {
    const callbacks = this.subscribers.get(event.stage);
    if (callbacks) {
      callbacks.forEach(callback => callback(event));
    }
  }

  // ============= UTILITY METHODS =============
  async triggerStage(stage: PipelineStage, data: any, type: 'created' | 'updated' | 'deleted' = 'created'): Promise<void> {
    await this.processEvent({
      stage,
      type,
      entityId: data.id || `temp_${Date.now()}`,
      entityType: this.getEntityTypeForStage(stage),
      data,
      metadata: {},
      triggeredBy: 'manual',
    });
  }

  private getEntityTypeForStage(stage: PipelineStage): string {
    const typeMap: Record<PipelineStage, string> = {
      [PipelineStage.MARKETPLACE]: 'visitor',
      [PipelineStage.LEAD]: 'lead',
      [PipelineStage.SALES]: 'sale',
      [PipelineStage.PAYMENT]: 'payment',
      [PipelineStage.LICENSE]: 'license',
      [PipelineStage.USAGE]: 'usage_log',
      [PipelineStage.SUPPORT]: 'support_ticket',
      [PipelineStage.ANALYTICS]: 'analytics',
      [PipelineStage.BOSS_PANEL]: 'boss_analytics',
    };
    return typeMap[stage] || 'unknown';
  }

  getPipelineStatus(): {
    queueLength: number;
    processing: boolean;
    lastEvent: PipelineEvent | null;
  } {
    return {
      queueLength: this.eventQueue.length,
      processing: this.processing,
      lastEvent: this.eventQueue[this.eventQueue.length - 1] || null,
    };
  }
}

// ============= GLOBAL INSTANCE =============
export const dataFlowPipeline = new DataFlowPipeline();

// ============= HOOKS =============
export const useDataFlowPipeline = () => {
  const store = useUnifiedSaaSStore();

  return {
    // Pipeline actions
    triggerMarketplaceVisitor: (data: any) => dataFlowPipeline.triggerStage(PipelineStage.MARKETPLACE, data),
    triggerLeadUpdate: (lead: Lead) => dataFlowPipeline.triggerStage(PipelineStage.LEAD, lead, 'updated'),
    triggerSaleCreation: (sale: Sale) => dataFlowPipeline.triggerStage(PipelineStage.SALES, sale),
    triggerPaymentCompletion: (payment: Payment) => dataFlowPipeline.triggerStage(PipelineStage.PAYMENT, payment, 'updated'),
    triggerLicenseActivation: (license: License) => dataFlowPipeline.triggerStage(PipelineStage.LICENSE, license),
    triggerUsageActivity: (usage: UsageLog) => dataFlowPipeline.triggerStage(PipelineStage.USAGE, usage),
    triggerSupportTicket: (ticket: SupportTicket) => dataFlowPipeline.triggerStage(PipelineStage.SUPPORT, ticket),
    triggerAnalyticsUpdate: (analytics: Analytics) => dataFlowPipeline.triggerStage(PipelineStage.ANALYTICS, analytics),

    // Subscribe to events
    subscribeToEvents: (stage: PipelineStage, callback: (event: PipelineEvent) => void) => 
      dataFlowPipeline.subscribe(stage, callback),

    // Pipeline status
    getPipelineStatus: () => dataFlowPipeline.getPipelineStatus(),

    // Store data
    ...store,
  };
};

export default DataFlowPipeline;
