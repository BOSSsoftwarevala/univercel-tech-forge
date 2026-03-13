/**
 * INTEGRATION ACTIVITY LOGGER
 * Logs every step of the end-to-end deployment workflow to activity_logs table.
 */

import { supabase } from '@/integrations/supabase/client';

export type IntegrationActivityEvent =
  | 'order_received'
  | 'scan_started'
  | 'framework_detected'
  | 'dependencies_analyzed'
  | 'security_issues_found'
  | 'auto_repair_applied'
  | 'source_code_locked'
  | 'deployment_package_created'
  | 'deployment_sent_to_server_manager'
  | 'docker_image_built'
  | 'container_created'
  | 'kubernetes_deployment_applied'
  | 'domain_configured'
  | 'ssl_certificate_installed'
  | 'service_started'
  | 'license_generated'
  | 'welcome_email_queued'
  | 'deployment_completed';

export interface ActivityLogEntry {
  event: IntegrationActivityEvent;
  order_id?: string;
  metadata?: Record<string, unknown>;
}

class IntegrationActivityLogger {
  private static instance: IntegrationActivityLogger;

  static getInstance(): IntegrationActivityLogger {
    if (!IntegrationActivityLogger.instance) {
      IntegrationActivityLogger.instance = new IntegrationActivityLogger();
    }
    return IntegrationActivityLogger.instance;
  }

  async log(entry: ActivityLogEntry): Promise<void> {
    const message = this.buildMessage(entry);
    console.log(`[IntegrationActivityLogger] ${message}`);

    try {
      await supabase.from('activity_logs' as 'activity_logs').insert({
        event_type: entry.event,
        module_name: 'integration_pipeline',
        entity_id: entry.order_id || null,
        entity_type: 'order',
        metadata: entry.metadata as never,
        message,
        created_at: new Date().toISOString(),
      } as never);
    } catch (error) {
      // Non-fatal: log to console if DB write fails
      console.error('[IntegrationActivityLogger] Failed to persist log:', error);
    }
  }

  private buildMessage(entry: ActivityLogEntry): string {
    const meta = entry.metadata || {};
    switch (entry.event) {
      case 'order_received':
        return `order_received: ${entry.order_id}`;
      case 'scan_started':
        return `scan_started: ${entry.order_id}`;
      case 'framework_detected':
        return `framework_detected: ${meta.framework_type}`;
      case 'dependencies_analyzed':
        return `dependencies_analyzed: ${meta.count}`;
      case 'security_issues_found':
        return `security_issues_found: ${meta.count}`;
      case 'auto_repair_applied':
        return `auto_repair_applied: ${meta.fixes}`;
      case 'source_code_locked':
        return `source_code_locked: ${entry.order_id}`;
      case 'deployment_package_created':
        return `deployment_package_created: ${meta.package_id}`;
      case 'deployment_sent_to_server_manager':
        return `deployment_sent_to_server_manager: ${meta.package_id}`;
      case 'docker_image_built':
        return `docker_image_built: ${meta.image_id}`;
      case 'container_created':
        return `container_created: ${meta.container_id}`;
      case 'kubernetes_deployment_applied':
        return `kubernetes_deployment_applied: ${meta.namespace}`;
      case 'domain_configured':
        return `domain_configured: ${meta.domain}`;
      case 'ssl_certificate_installed':
        return `ssl_certificate_installed: ${meta.domain}`;
      case 'service_started':
        return `service_started: LIVE`;
      case 'license_generated':
        return `license_generated: ${meta.license_key}`;
      case 'welcome_email_queued':
        return `welcome_email_queued: ${meta.customer_email}`;
      case 'deployment_completed':
        return `deployment_completed: ${entry.order_id} → ${meta.deployment_url}`;
      default:
        return `${entry.event}: ${entry.order_id}`;
    }
  }
}

export const integrationActivityLogger = IntegrationActivityLogger.getInstance();
export default IntegrationActivityLogger;
