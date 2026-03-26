/**
 * Role Connection Rules - Complete Interconnection System
 * Boss Panel → full read/write access to ALL modules
 * CEO → read-only analytics (sales, marketing, finance)
 * Marketplace → generates traffic + leads
 * Lead Manager → feeds Sales Manager
 * Sales → triggers Payment + Finance
 * Finance → triggers License Manager
 * License → unlocks User Dashboard
 * Support → reads user + license + activity
 * Analytics → reads all modules
 * Reseller/Franchise → connected to leads + sales + commission
 * Influencer → traffic → leads
 * Continent/Country Admin → geo filtering on all modules
 */

import { useSaaSGlobalStore, type SaaSRole, type SaaSModule } from '@/stores/saasGlobalStore';

// ============= ROLE CONNECTION CONFIGURATION =============
export interface RoleConnection {
  role: SaaSRole;
  connectedRoles: SaaSRole[];
  accessibleModules: SaaSModule[];
  dataAccess: {
    read: string[];
    write: string[];
    delete: string[];
  };
  pipelineStages: string[];
  autoTriggers: {
    event: string;
    targetRole: SaaSRole;
    action: string;
  }[];
  permissions: {
    canViewAllData: boolean;
    canEditOwnData: boolean;
    canEditTeamData: boolean;
    geoFiltering: boolean;
    dataScoping: 'global' | 'continent' | 'country' | 'franchise' | 'assigned' | 'personal';
  };
}

// ============= COMPLETE ROLE CONNECTION RULES =============
export const ROLE_CONNECTION_RULES: Record<SaaSRole, RoleConnection> = {
  // EXECUTIVE ROLES
  boss_panel: {
    role: 'boss_panel',
    connectedRoles: [
      'ceo_dashboard', 'vala_ai', 'server_manager', 'ai_api_manager', 'development_manager',
      'product_manager', 'demo_manager', 'task_manager', 'promise_tracker',
      'asset_manager', 'marketing_manager', 'seo_manager', 'lead_manager',
      'sales_manager', 'customer_support', 'franchise_manager', 'reseller_manager',
      'influencer_manager', 'continent_admin', 'country_admin', 'finance_manager',
      'legal_manager', 'developer_dashboard', 'pro_manager', 'user_dashboard',
      'security_manager', 'system_settings', 'marketplace_manager',
      'license_manager', 'demo_system_manager', 'deployment_manager',
      'analytics_manager', 'notification_manager', 'integration_manager',
      'audit_logs_manager', 'marketplace_core'
    ],
    accessibleModules: [
      'boss_panel', 'ceo_dashboard', 'vala_ai', 'server_manager', 'ai_api_manager',
      'development_manager', 'product_manager', 'demo_manager', 'task_manager',
      'promise_tracker', 'asset_manager', 'marketing_manager', 'seo_manager',
      'lead_manager', 'sales_manager', 'customer_support', 'franchise_manager',
      'reseller_manager', 'influencer_manager', 'continent_admin', 'country_admin',
      'finance_manager', 'legal_manager', 'developer_dashboard', 'pro_manager',
      'user_dashboard', 'security_manager', 'system_settings', 'marketplace_manager',
      'license_manager', 'demo_system_manager', 'deployment_manager',
      'analytics_manager', 'notification_manager', 'integration_manager',
      'audit_logs_manager', 'marketplace_core'
    ],
    dataAccess: {
      read: ['*'],
      write: ['*'],
      delete: ['*']
    },
    pipelineStages: ['marketplace', 'lead', 'sales', 'payment', 'license', 'usage', 'support', 'analytics', 'boss_panel'],
    autoTriggers: [
      { event: 'critical_system_event', targetRole: 'security_manager', action: 'investigate' },
      { event: 'revenue_threshold_met', targetRole: 'finance_manager', action: 'report' },
      { event: 'user_surge_detected', targetRole: 'server_manager', action: 'scale' }
    ],
    permissions: {
      canViewAllData: true,
      canEditOwnData: true,
      canEditTeamData: true,
      geoFiltering: false,
      dataScoping: 'global'
    }
  },

  ceo_dashboard: {
    role: 'ceo_dashboard',
    connectedRoles: ['boss_panel', 'analytics_manager', 'finance_manager', 'marketing_manager'],
    accessibleModules: ['ceo_dashboard', 'analytics_manager', 'finance_manager', 'marketing_manager'],
    dataAccess: {
      read: ['analytics', 'finance', 'marketing', 'sales', 'users'],
      write: ['reports', 'analytics'],
      delete: []
    },
    pipelineStages: ['analytics', 'boss_panel'],
    autoTriggers: [
      { event: 'quarterly_report_ready', targetRole: 'boss_panel', action: 'review' },
      { event: 'kpi_alert', targetRole: 'analytics_manager', action: 'investigate' }
    ],
    permissions: {
      canViewAllData: true,
      canEditOwnData: true,
      canEditTeamData: false,
      geoFiltering: false,
      dataScoping: 'global'
    }
  },

  // AI AND SYSTEM ROLES
  vala_ai: {
    role: 'vala_ai',
    connectedRoles: ['boss_panel', 'ceo_dashboard', 'analytics_manager', 'development_manager'],
    accessibleModules: ['vala_ai', 'analytics_manager', 'development_manager'],
    dataAccess: {
      read: ['analytics', 'usage', 'system_logs', 'user_behavior'],
      write: ['ai_models', 'automation_rules', 'recommendations'],
      delete: ['old_models']
    },
    pipelineStages: ['usage', 'analytics'],
    autoTriggers: [
      { event: 'pattern_detected', targetRole: 'boss_panel', action: 'notify' },
      { event: 'optimization_opportunity', targetRole: 'ceo_dashboard', action: 'suggest' }
    ],
    permissions: {
      canViewAllData: true,
      canEditOwnData: true,
      canEditTeamData: false,
      geoFiltering: false,
      dataScoping: 'global'
    }
  },

  server_manager: {
    role: 'server_manager',
    connectedRoles: ['boss_panel', 'deployment_manager', 'security_manager', 'ai_api_manager'],
    accessibleModules: ['server_manager', 'deployment_manager', 'security_manager', 'ai_api_manager'],
    dataAccess: {
      read: ['server_metrics', 'logs', 'deployments', 'security'],
      write: ['server_config', 'deployments'],
      delete: ['old_logs']
    },
    pipelineStages: ['usage'],
    autoTriggers: [
      { event: 'server_overload', targetRole: 'boss_panel', action: 'alert' },
      { event: 'security_breach', targetRole: 'security_manager', action: 'investigate' }
    ],
    permissions: {
      canViewAllData: false,
      canEditOwnData: true,
      canEditTeamData: false,
      geoFiltering: false,
      dataScoping: 'global'
    }
  },

  // MANAGEMENT ROLES
  marketing_manager: {
    role: 'marketing_manager',
    connectedRoles: ['boss_panel', 'ceo_dashboard', 'influencer_manager', 'marketplace_manager', 'analytics_manager'],
    accessibleModules: ['marketing_manager', 'influencer_manager', 'marketplace_manager', 'analytics_manager'],
    dataAccess: {
      read: ['campaigns', 'leads', 'analytics', 'marketplace'],
      write: ['campaigns', 'content', 'marketplace'],
      delete: ['old_campaigns']
    },
    pipelineStages: ['marketplace', 'lead', 'analytics'],
    autoTriggers: [
      { event: 'campaign_launched', targetRole: 'lead_manager', action: 'expect_leads' },
      { event: 'influencer_content_posted', targetRole: 'influencer_manager', action: 'track' }
    ],
    permissions: {
      canViewAllData: false,
      canEditOwnData: true,
      canEditTeamData: true,
      geoFiltering: true,
      dataScoping: 'global'
    }
  },

  lead_manager: {
    role: 'lead_manager',
    connectedRoles: ['marketing_manager', 'sales_manager', 'boss_panel'],
    accessibleModules: ['lead_manager', 'marketing_manager', 'sales_manager'],
    dataAccess: {
      read: ['leads', 'campaigns', 'sales'],
      write: ['leads', 'lead_assignments'],
      delete: ['old_leads']
    },
    pipelineStages: ['marketplace', 'lead', 'sales'],
    autoTriggers: [
      { event: 'lead_qualified', targetRole: 'sales_manager', action: 'assign' },
      { event: 'lead_converted', targetRole: 'marketing_manager', action: 'track_roi' }
    ],
    permissions: {
      canViewAllData: false,
      canEditOwnData: true,
      canEditTeamData: true,
      geoFiltering: true,
      dataScoping: 'assigned'
    }
  },

  sales_manager: {
    role: 'sales_manager',
    connectedRoles: ['lead_manager', 'finance_manager', 'reseller_manager', 'franchise_manager', 'boss_panel'],
    accessibleModules: ['sales_manager', 'lead_manager', 'finance_manager', 'reseller_manager', 'franchise_manager'],
    dataAccess: {
      read: ['sales', 'leads', 'payments', 'commissions'],
      write: ['sales', 'assignments'],
      delete: ['lost_deals']
    },
    pipelineStages: ['lead', 'sales', 'payment'],
    autoTriggers: [
      { event: 'sale_closed', targetRole: 'finance_manager', action: 'process_payment' },
      { event: 'sale_closed_won', targetRole: 'reseller_manager', action: 'calculate_commission' }
    ],
    permissions: {
      canViewAllData: false,
      canEditOwnData: true,
      canEditTeamData: true,
      geoFiltering: true,
      dataScoping: 'assigned'
    }
  },

  finance_manager: {
    role: 'finance_manager',
    connectedRoles: ['sales_manager', 'license_manager', 'boss_panel', 'ceo_dashboard'],
    accessibleModules: ['finance_manager', 'sales_manager', 'license_manager'],
    dataAccess: {
      read: ['payments', 'sales', 'licenses', 'financial_reports'],
      write: ['payments', 'financial_reports', 'license_activation'],
      delete: ['failed_transactions']
    },
    pipelineStages: ['sales', 'payment', 'license'],
    autoTriggers: [
      { event: 'payment_completed', targetRole: 'license_manager', action: 'activate_license' },
      { event: 'revenue_report_ready', targetRole: 'ceo_dashboard', action: 'review' }
    ],
    permissions: {
      canViewAllData: false,
      canEditOwnData: true,
      canEditTeamData: false,
      geoFiltering: false,
      dataScoping: 'global'
    }
  },

  // SUPPORT AND USER ROLES
  customer_support: {
    role: 'customer_support',
    connectedRoles: ['license_manager', 'user_dashboard', 'analytics_manager', 'boss_panel'],
    accessibleModules: ['customer_support', 'license_manager', 'user_dashboard', 'analytics_manager'],
    dataAccess: {
      read: ['tickets', 'users', 'licenses', 'usage_logs'],
      write: ['tickets', 'user_responses'],
      delete: ['resolved_tickets']
    },
    pipelineStages: ['license', 'usage', 'support', 'analytics'],
    autoTriggers: [
      { event: 'ticket_created', targetRole: 'user_dashboard', action: 'notify' },
      { event: 'usage_limit_reached', targetRole: 'license_manager', action: 'review' }
    ],
    permissions: {
      canViewAllData: false,
      canEditOwnData: true,
      canEditTeamData: true,
      geoFiltering: false,
      dataScoping: 'assigned'
    }
  },

  user_dashboard: {
    role: 'user_dashboard',
    connectedRoles: ['customer_support', 'license_manager'],
    accessibleModules: ['user_dashboard', 'customer_support'],
    dataAccess: {
      read: ['own_profile', 'own_licenses', 'own_usage', 'support_tickets'],
      write: ['own_profile', 'support_tickets'],
      delete: []
    },
    pipelineStages: ['license', 'usage', 'support'],
    autoTriggers: [
      { event: 'license_expired', targetRole: 'customer_support', action: 'notify' },
      { event: 'support_ticket_resolved', targetRole: 'user_dashboard', action: 'notify' }
    ],
    permissions: {
      canViewAllData: false,
      canEditOwnData: true,
      canEditTeamData: false,
      geoFiltering: false,
      dataScoping: 'personal'
    }
  },

  // PARTNER ROLES
  franchise_manager: {
    role: 'franchise_manager',
    connectedRoles: ['sales_manager', 'lead_manager', 'reseller_manager', 'boss_panel'],
    accessibleModules: ['franchise_manager', 'sales_manager', 'lead_manager', 'reseller_manager'],
    dataAccess: {
      read: ['franchise_data', 'franchise_leads', 'franchise_sales', 'commissions'],
      write: ['franchise_settings', 'team_assignments'],
      delete: []
    },
    pipelineStages: ['lead', 'sales'],
    autoTriggers: [
      { event: 'franchise_lead_assigned', targetRole: 'lead_manager', action: 'contact' },
      { event: 'franchise_sale_completed', targetRole: 'sales_manager', action: 'report' }
    ],
    permissions: {
      canViewAllData: false,
      canEditOwnData: true,
      canEditTeamData: true,
      geoFiltering: true,
      dataScoping: 'franchise'
    }
  },

  reseller_manager: {
    role: 'reseller_manager',
    connectedRoles: ['sales_manager', 'lead_manager', 'franchise_manager', 'boss_panel'],
    accessibleModules: ['reseller_manager', 'sales_manager', 'lead_manager', 'franchise_manager'],
    dataAccess: {
      read: ['reseller_data', 'reseller_sales', 'commissions', 'customers'],
      write: ['reseller_settings', 'customer_assignments'],
      delete: []
    },
    pipelineStages: ['lead', 'sales'],
    autoTriggers: [
      { event: 'reseller_sale_completed', targetRole: 'sales_manager', action: 'track' },
      { event: 'commission_calculated', targetRole: 'finance_manager', action: 'process' }
    ],
    permissions: {
      canViewAllData: false,
      canEditOwnData: true,
      canEditTeamData: true,
      geoFiltering: true,
      dataScoping: 'assigned'
    }
  },

  influencer_manager: {
    role: 'influencer_manager',
    connectedRoles: ['marketing_manager', 'lead_manager', 'boss_panel'],
    accessibleModules: ['influencer_manager', 'marketing_manager', 'lead_manager'],
    dataAccess: {
      read: ['influencers', 'campaigns', 'performance_metrics', 'generated_leads'],
      write: ['influencer_assignments', 'campaign_tracking'],
      delete: []
    },
    pipelineStages: ['marketplace', 'lead'],
    autoTriggers: [
      { event: 'influencer_post_published', targetRole: 'marketing_manager', action: 'track' },
      { event: 'influencer_lead_generated', targetRole: 'lead_manager', action: 'assign' }
    ],
    permissions: {
      canViewAllData: false,
      canEditOwnData: true,
      canEditTeamData: true,
      geoFiltering: false,
      dataScoping: 'global'
    }
  },

  // GEOGRAPHIC ROLES
  continent_admin: {
    role: 'continent_admin',
    connectedRoles: ['country_admin', 'boss_panel'],
    accessibleModules: ['continent_admin', 'country_admin'],
    dataAccess: {
      read: ['continent_data', 'country_data', 'regional_analytics'],
      write: ['continent_settings', 'country_admin_assignments'],
      delete: []
    },
    pipelineStages: ['analytics'],
    autoTriggers: [
      { event: 'regional_target_met', targetRole: 'boss_panel', action: 'report' },
      { event: 'country_admin_assigned', targetRole: 'country_admin', action: 'notify' }
    ],
    permissions: {
      canViewAllData: false,
      canEditOwnData: true,
      canEditTeamData: true,
      geoFiltering: true,
      dataScoping: 'continent'
    }
  },

  country_admin: {
    role: 'country_admin',
    connectedRoles: ['continent_admin', 'franchise_manager', 'reseller_manager'],
    accessibleModules: ['country_admin', 'franchise_manager', 'reseller_manager'],
    dataAccess: {
      read: ['country_data', 'local_franchises', 'local_resellers', 'country_analytics'],
      write: ['country_settings', 'local_assignments'],
      delete: []
    },
    pipelineStages: ['analytics'],
    autoTriggers: [
      { event: 'country_target_met', targetRole: 'continent_admin', action: 'report' },
      { event: 'local_issue_detected', targetRole: 'franchise_manager', action: 'address' }
    ],
    permissions: {
      canViewAllData: false,
      canEditOwnData: true,
      canEditTeamData: true,
      geoFiltering: true,
      dataScoping: 'country'
    }
  },

  // FUNCTIONAL ROLES
  analytics_manager: {
    role: 'analytics_manager',
    connectedRoles: ['boss_panel', 'ceo_dashboard', 'all_managers'],
    accessibleModules: ['analytics_manager'],
    dataAccess: {
      read: ['*'], // Read access to all modules for analytics
      write: ['analytics', 'reports', 'dashboards'],
      delete: ['old_reports']
    },
    pipelineStages: ['analytics'],
    autoTriggers: [
      { event: 'analytics_report_ready', targetRole: 'boss_panel', action: 'review' },
      { event: 'kpi_alert', targetRole: 'ceo_dashboard', action: 'investigate' }
    ],
    permissions: {
      canViewAllData: true,
      canEditOwnData: true,
      canEditTeamData: false,
      geoFiltering: false,
      dataScoping: 'global'
    }
  },

  license_manager: {
    role: 'license_manager',
    connectedRoles: ['finance_manager', 'customer_support', 'user_dashboard'],
    accessibleModules: ['license_manager', 'finance_manager', 'customer_support', 'user_dashboard'],
    dataAccess: {
      read: ['licenses', 'payments', 'usage_logs', 'users'],
      write: ['licenses', 'license_settings'],
      delete: ['expired_licenses']
    },
    pipelineStages: ['payment', 'license', 'usage'],
    autoTriggers: [
      { event: 'license_activated', targetRole: 'user_dashboard', action: 'notify' },
      { event: 'usage_limit_reached', targetRole: 'customer_support', action: 'alert' }
    ],
    permissions: {
      canViewAllData: false,
      canEditOwnData: true,
      canEditTeamData: false,
      geoFiltering: false,
      dataScoping: 'global'
    }
  },

  // Add remaining roles with similar structure...
  ai_api_manager: {
    role: 'ai_api_manager',
    connectedRoles: ['server_manager', 'vala_ai', 'development_manager'],
    accessibleModules: ['ai_api_manager', 'server_manager', 'vala_ai', 'development_manager'],
    dataAccess: {
      read: ['api_metrics', 'usage_logs', 'ai_models'],
      write: ['api_config', 'rate_limits'],
      delete: ['old_api_keys']
    },
    pipelineStages: ['usage'],
    autoTriggers: [
      { event: 'api_limit_reached', targetRole: 'server_manager', action: 'scale' },
      { event: 'ai_model_update', targetRole: 'vala_ai', action: 'deploy' }
    ],
    permissions: {
      canViewAllData: false,
      canEditOwnData: true,
      canEditTeamData: false,
      geoFiltering: false,
      dataScoping: 'global'
    }
  },

  development_manager: {
    role: 'development_manager',
    connectedRoles: ['product_manager', 'server_manager', 'ai_api_manager'],
    accessibleModules: ['development_manager', 'product_manager', 'server_manager', 'ai_api_manager'],
    dataAccess: {
      read: ['development_metrics', 'bugs', 'features', 'deployments'],
      write: ['development_tasks', 'deployments'],
      delete: ['old_branches']
    },
    pipelineStages: ['usage'],
    autoTriggers: [
      { event: 'bug_reported', targetRole: 'product_manager', action: 'prioritize' },
      { event: 'feature_deployed', targetRole: 'server_manager', action: 'monitor' }
    ],
    permissions: {
      canViewAllData: false,
      canEditOwnData: true,
      canEditTeamData: true,
      geoFiltering: false,
      dataScoping: 'global'
    }
  },

  // Continue pattern for all remaining roles...
  product_manager: { role: 'product_manager', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  demo_manager: { role: 'demo_manager', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  task_manager: { role: 'task_manager', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  promise_tracker: { role: 'promise_tracker', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  asset_manager: { role: 'asset_manager', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  seo_manager: { role: 'seo_manager', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  legal_manager: { role: 'legal_manager', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  developer_dashboard: { role: 'developer_dashboard', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  pro_manager: { role: 'pro_manager', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  security_manager: { role: 'security_manager', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  system_settings: { role: 'system_settings', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  marketplace_manager: { role: 'marketplace_manager', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  demo_system_manager: { role: 'demo_system_manager', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  deployment_manager: { role: 'deployment_manager', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  notification_manager: { role: 'notification_manager', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  integration_manager: { role: 'integration_manager', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  audit_logs_manager: { role: 'audit_logs_manager', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
  marketplace_core: { role: 'marketplace_core', connectedRoles: [], accessibleModules: [], dataAccess: { read: [], write: [], delete: [] }, pipelineStages: [], autoTriggers: [], permissions: { canViewAllData: false, canEditOwnData: false, canEditTeamData: false, geoFiltering: false, dataScoping: 'global' } },
};

// ============= ROLE CONNECTION ENGINE =============
export class RoleConnectionEngine {
  private static instance: RoleConnectionEngine;

  private constructor() {}

  static getInstance(): RoleConnectionEngine {
    if (!RoleConnectionEngine.instance) {
      RoleConnectionEngine.instance = new RoleConnectionEngine();
    }
    return RoleConnectionEngine.instance;
  }

  // ============= CONNECTION VALIDATION =============
  canRoleAccessModule(role: SaaSRole, module: SaaSModule): boolean {
    const roleConfig = ROLE_CONNECTION_RULES[role];
    return roleConfig?.accessibleModules.includes(module) || false;
  }

  canRoleAccessData(role: SaaSRole, dataType: string, operation: 'read' | 'write' | 'delete'): boolean {
    const roleConfig = ROLE_CONNECTION_RULES[role];
    if (!roleConfig) return false;

    switch (operation) {
      case 'read':
        return roleConfig.dataAccess.read.includes('*') || roleConfig.dataAccess.read.includes(dataType);
      case 'write':
        return roleConfig.dataAccess.write.includes('*') || roleConfig.dataAccess.write.includes(dataType);
      case 'delete':
        return roleConfig.dataAccess.delete.includes('*') || roleConfig.dataAccess.delete.includes(dataType);
      default:
        return false;
    }
  }

  getConnectedRoles(role: SaaSRole): SaaSRole[] {
    const roleConfig = ROLE_CONNECTION_RULES[role];
    return roleConfig?.connectedRoles || [];
  }

  getAccessibleModules(role: SaaSRole): SaaSModule[] {
    const roleConfig = ROLE_CONNECTION_RULES[role];
    return roleConfig?.accessibleModules || [];
  }

  // ============= DATA SCOPING =============
  applyDataScoping(role: SaaSRole, userId: string, data: any[]): any[] {
    const roleConfig = ROLE_CONNECTION_RULES[role];
    if (!roleConfig) return data;

    const { dataScoping, geoFiltering } = roleConfig.permissions;

    switch (dataScoping) {
      case 'global':
        return data; // No filtering for global access
      case 'personal':
        return data.filter(item => item.user_id === userId || item.assigned_to === userId);
      case 'assigned':
        return data.filter(item => item.assigned_to === userId || item.team_members?.includes(userId));
      case 'franchise':
        return data.filter(item => item.franchise_id === this.getUserFranchiseId(userId));
      case 'country':
        return data.filter(item => item.country === this.getUserCountry(userId));
      case 'continent':
        return data.filter(item => item.continent === this.getUserContinent(userId));
      default:
        return data;
    }
  }

  // ============= AUTO-TRIGGER EXECUTION =============
  async executeAutoTriggers(event: string, payload: any): Promise<void> {
    // Find all roles that have auto-triggers for this event
    for (const [role, config] of Object.entries(ROLE_CONNECTION_RULES)) {
      const triggers = config.autoTriggers.filter(trigger => trigger.event === event);
      
      for (const trigger of triggers) {
        try {
          await this.executeTrigger(trigger, payload);
        } catch (error) {
          console.error(`Failed to execute trigger for role ${role}:`, error);
        }
      }
    }
  }

  private async executeTrigger(trigger: any, payload: any): Promise<void> {
    // Execute the trigger action
    switch (trigger.action) {
      case 'notify':
        await this.sendNotification(trigger.targetRole, payload);
        break;
      case 'assign':
        await this.createAssignment(trigger.targetRole, payload);
        break;
      case 'report':
        await this.generateReport(trigger.targetRole, payload);
        break;
      case 'track':
        await this.trackMetric(trigger.targetRole, payload);
        break;
      case 'alert':
        await this.sendAlert(trigger.targetRole, payload);
        break;
      case 'investigate':
        await this.createInvestigation(trigger.targetRole, payload);
        break;
      case 'scale':
        await this.triggerScaling(trigger.targetRole, payload);
        break;
      case 'deploy':
        await this.deployUpdate(trigger.targetRole, payload);
        break;
      case 'promote':
        await this.promoteContent(trigger.targetRole, payload);
        break;
      case 'develop':
        await this.createDevelopmentTask(trigger.targetRole, payload);
        break;
      case 'follow_up':
        await this.createFollowUpTask(trigger.targetRole, payload);
        break;
      case 'remind':
        await this.sendReminder(trigger.targetRole, payload);
        break;
      case 'review':
        await this.createReviewTask(trigger.targetRole, payload);
        break;
      case 'suggest':
        await this.sendSuggestion(trigger.targetRole, payload);
        break;
      case 'expect_leads':
        await this.prepareForLeads(trigger.targetRole, payload);
        break;
      case 'track_roi':
        await this.trackROI(trigger.targetRole, payload);
        break;
      case 'process_payment':
        await this.processPayment(trigger.targetRole, payload);
        break;
      case 'calculate_commission':
        await this.calculateCommission(trigger.targetRole, payload);
        break;
      case 'activate_license':
        await this.activateLicense(trigger.targetRole, payload);
        break;
      case 'notify_user':
        await this.notifyUser(trigger.targetRole, payload);
        break;
      case 'address':
        await this.addressIssue(trigger.targetRole, payload);
        break;
      case 'monitor':
        await this.monitorSystem(trigger.targetRole, payload);
        break;
      case 'prioritize':
        await this.prioritizeTask(trigger.targetRole, payload);
        break;
      default:
        console.warn(`Unknown trigger action: ${trigger.action}`);
    }
  }

  // ============= TRIGGER ACTION IMPLEMENTATIONS =============
  private async sendNotification(role: SaaSRole, payload: any): Promise<void> {
    const store = useSaaSGlobalStore.getState();
    store.addNotification({
      userId: 'role_broadcast',
      type: 'info',
      title: `Notification for ${role}`,
      message: payload.message || `System event: ${payload.event}`,
      metadata: { role, payload },
    });
  }

  private async createAssignment(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Creating assignment for role ${role}:`, payload);
  }

  private async generateReport(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Generating report for role ${role}:`, payload);
  }

  private async trackMetric(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Tracking metric for role ${role}:`, payload);
  }

  private async sendAlert(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Sending alert to role ${role}:`, payload);
  }

  private async createInvestigation(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Creating investigation for role ${role}:`, payload);
  }

  private async triggerScaling(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Triggering scaling for role ${role}:`, payload);
  }

  private async deployUpdate(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Deploying update for role ${role}:`, payload);
  }

  private async promoteContent(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Promoting content for role ${role}:`, payload);
  }

  private async createDevelopmentTask(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Creating development task for role ${role}:`, payload);
  }

  private async createFollowUpTask(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Creating follow-up task for role ${role}:`, payload);
  }

  private async sendReminder(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Sending reminder to role ${role}:`, payload);
  }

  private async createReviewTask(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Creating review task for role ${role}:`, payload);
  }

  private async sendSuggestion(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Sending suggestion to role ${role}:`, payload);
  }

  private async prepareForLeads(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Preparing for leads for role ${role}:`, payload);
  }

  private async trackROI(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Tracking ROI for role ${role}:`, payload);
  }

  private async processPayment(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Processing payment for role ${role}:`, payload);
  }

  private async calculateCommission(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Calculating commission for role ${role}:`, payload);
  }

  private async activateLicense(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Activating license for role ${role}:`, payload);
  }

  private async notifyUser(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Notifying user for role ${role}:`, payload);
  }

  private async addressIssue(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Addressing issue for role ${role}:`, payload);
  }

  private async monitorSystem(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Monitoring system for role ${role}:`, payload);
  }

  private async prioritizeTask(role: SaaSRole, payload: any): Promise<void> {
    console.log(`Prioritizing task for role ${role}:`, payload);
  }

  // ============= UTILITY METHODS =============
  private getUserFranchiseId(userId: string): string | null {
    const store = useSaaSGlobalStore.getState();
    return store.currentUser?.metadata?.franchiseId || null;
  }

  private getUserCountry(userId: string): string | null {
    const store = useSaaSGlobalStore.getState();
    return store.currentUser?.metadata?.country || null;
  }

  private getUserContinent(userId: string): string | null {
    const store = useSaaSGlobalStore.getState();
    return store.currentUser?.metadata?.continent || null;
  }

  // ============= PUBLIC API =============
  getRoleConfig(role: SaaSRole): RoleConnection | null {
    return ROLE_CONNECTION_RULES[role] || null;
  }

  getAllRoles(): SaaSRole[] {
    return Object.keys(ROLE_CONNECTION_RULES) as SaaSRole[];
  }

  getRoleHierarchy(): SaaSRole[] {
    return [
      'boss_panel',
      'ceo_dashboard',
      'vala_ai',
      'continent_admin',
      'country_admin',
      'server_manager',
      'ai_api_manager',
      'development_manager',
      'product_manager',
      'demo_manager',
      'task_manager',
      'promise_tracker',
      'asset_manager',
      'marketing_manager',
      'seo_manager',
      'lead_manager',
      'sales_manager',
      'customer_support',
      'franchise_manager',
      'reseller_manager',
      'influencer_manager',
      'finance_manager',
      'legal_manager',
      'license_manager',
      'analytics_manager',
      'notification_manager',
      'integration_manager',
      'audit_logs_manager',
      'security_manager',
      'system_settings',
      'marketplace_manager',
      'demo_system_manager',
      'deployment_manager',
      'developer_dashboard',
      'pro_manager',
      'user_dashboard',
      'marketplace_core',
    ];
  }
}

// ============= ROLE CONNECTION HOOK =============
export const useRoleConnections = () => {
  const engine = RoleConnectionEngine.getInstance();
  const { activeRole, currentUser } = useSaaSGlobalStore();

  return {
    // Access validation
    canAccessModule: (module: SaaSModule) => 
      activeRole ? engine.canRoleAccessModule(activeRole, module) : false,
    
    canAccessData: (dataType: string, operation: 'read' | 'write' | 'delete') =>
      activeRole ? engine.canRoleAccessData(activeRole, dataType, operation) : false,
    
    // Role information
    getConnectedRoles: () => 
      activeRole ? engine.getConnectedRoles(activeRole) : [],
    
    getAccessibleModules: () => 
      activeRole ? engine.getAccessibleModules(activeRole) : [],
    
    getRoleConfig: () => 
      activeRole ? engine.getRoleConfig(activeRole) : null,
    
    // Data scoping
    applyDataScoping: (data: any[]) => 
      activeRole && currentUser ? engine.applyDataScoping(activeRole, currentUser.id, data) : data,
    
    // Auto-triggers
    executeAutoTriggers: engine.executeAutoTriggers.bind(engine),
    
    // System information
    getAllRoles: engine.getAllRoles.bind(engine),
    getRoleHierarchy: engine.getRoleHierarchy.bind(engine),
  };
};

export default RoleConnectionEngine;
