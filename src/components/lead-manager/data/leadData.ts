import { 
  Lead, 
  LeadSourceConfig, 
  LeadCategoryConfig, 
  PipelineStage,
  AutomationRule,
  CategoryLevel
} from '../types/leadTypes';

// Lead Sources Configuration
export const leadSourcesConfig: LeadSourceConfig[] = [
  {
    id: 'src_website',
    source: 'website',
    name: 'Website',
    icon: 'Globe',
    color: 'blue',
    isActive: true,
    totalLeads: 1247,
    conversionRate: 18.5,
    subSources: [
      { id: 'ws_form', name: 'Web Forms', source: 'website', icon: 'FileText' },
      { id: 'ws_landing', name: 'Landing Pages', source: 'website', icon: 'Layout' },
      { id: 'ws_chat', name: 'Chat Widgets', source: 'website', icon: 'MessageCircle' },
      { id: 'ws_exit', name: 'Exit Intent Forms', source: 'website', icon: 'LogOut' },
    ]
  },
  {
    id: 'src_meta',
    source: 'meta',
    name: 'Meta / Facebook',
    icon: 'Facebook',
    color: 'indigo',
    isActive: true,
    totalLeads: 892,
    conversionRate: 22.3,
    subSources: [
      { id: 'meta_fb', name: 'Facebook Lead Ads', source: 'meta', icon: 'Facebook' },
      { id: 'meta_ig', name: 'Instagram Lead Ads', source: 'meta', icon: 'Instagram' },
      { id: 'meta_camp', name: 'Campaign Sync', source: 'meta', icon: 'Target' },
      { id: 'meta_ad', name: 'Ad-level Mapping', source: 'meta', icon: 'Layers' },
    ]
  },
  {
    id: 'src_google',
    source: 'google',
    name: 'Google',
    icon: 'Search',
    color: 'green',
    isActive: true,
    totalLeads: 654,
    conversionRate: 15.8,
    subSources: [
      { id: 'ggl_forms', name: 'Google Lead Forms', source: 'google', icon: 'FileText' },
      { id: 'ggl_ads', name: 'Google Ads', source: 'google', icon: 'DollarSign' },
      { id: 'ggl_yt', name: 'YouTube Leads', source: 'google', icon: 'Youtube' },
    ]
  },
  {
    id: 'src_whatsapp',
    source: 'whatsapp',
    name: 'WhatsApp',
    icon: 'MessageCircle',
    color: 'emerald',
    isActive: true,
    totalLeads: 423,
    conversionRate: 28.7,
    subSources: [
      { id: 'wa_click', name: 'Click-to-WhatsApp', source: 'whatsapp', icon: 'MousePointer' },
      { id: 'wa_form', name: 'WhatsApp Forms', source: 'whatsapp', icon: 'FileText' },
      { id: 'wa_chat', name: 'Chat Leads', source: 'whatsapp', icon: 'MessageSquare' },
    ]
  },
  {
    id: 'src_manual',
    source: 'manual',
    name: 'Manual Entry',
    icon: 'PenTool',
    color: 'orange',
    isActive: true,
    totalLeads: 312,
    conversionRate: 35.2,
    subSources: [
      { id: 'man_admin', name: 'Admin Entry', source: 'manual', icon: 'UserCog' },
      { id: 'man_sales', name: 'Sales Entry', source: 'manual', icon: 'Users' },
      { id: 'man_csv', name: 'CSV Upload', source: 'manual', icon: 'FileSpreadsheet' },
      { id: 'man_excel', name: 'Excel Import', source: 'manual', icon: 'Table' },
    ]
  },
  {
    id: 'src_api',
    source: 'api',
    name: 'API / Webhook',
    icon: 'Code',
    color: 'purple',
    isActive: true,
    totalLeads: 189,
    conversionRate: 24.6,
    subSources: [
      { id: 'api_partner', name: 'Partner API', source: 'api', icon: 'Handshake' },
      { id: 'api_franchise', name: 'Franchise API', source: 'api', icon: 'Building' },
      { id: 'api_crm', name: 'External CRM Sync', source: 'api', icon: 'RefreshCw' },
    ]
  }
];

// Lead Categories Configuration
export const leadCategoriesConfig: LeadCategoryConfig[] = [
  {
    id: 'cat_franchise',
    category: 'franchise',
    name: 'Franchise',
    icon: 'Building2',
    color: 'blue',
    subCategories: buildCategoryHierarchy('franchise')
  },
  {
    id: 'cat_reseller',
    category: 'reseller',
    name: 'Reseller',
    icon: 'Store',
    color: 'green',
    subCategories: buildCategoryHierarchy('reseller')
  },
  {
    id: 'cat_influencer',
    category: 'influencer',
    name: 'Influencer',
    icon: 'Star',
    color: 'pink',
    subCategories: buildCategoryHierarchy('influencer')
  },
  {
    id: 'cat_job',
    category: 'job',
    name: 'Job Applicant',
    icon: 'Briefcase',
    color: 'orange',
    subCategories: buildCategoryHierarchy('job')
  },
  {
    id: 'cat_buyer',
    category: 'product_buyer',
    name: 'Product Buyer',
    icon: 'ShoppingCart',
    color: 'emerald',
    subCategories: buildCategoryHierarchy('product_buyer')
  },
  {
    id: 'cat_enterprise',
    category: 'enterprise_client',
    name: 'Enterprise Client',
    icon: 'Building',
    color: 'purple',
    subCategories: buildCategoryHierarchy('enterprise_client')
  },
  {
    id: 'cat_support',
    category: 'support_inquiry',
    name: 'Support / Inquiry',
    icon: 'HelpCircle',
    color: 'cyan',
    subCategories: buildCategoryHierarchy('support_inquiry')
  },
  {
    id: 'cat_custom',
    category: 'custom',
    name: 'Custom',
    icon: 'Settings',
    color: 'gray',
    subCategories: buildCategoryHierarchy('custom')
  }
];

function buildCategoryHierarchy(category: string): CategoryLevel[] {
  // Level 2: Sub Categories (Location-based)
  return [
    {
      id: `${category}_india`,
      name: 'India',
      icon: 'MapPin',
      leadCount: 542,
      children: [
        {
          id: `${category}_india_mh`,
          name: 'Maharashtra',
          leadCount: 234,
          children: [
            { id: `${category}_india_mh_web`, name: 'Website', leadCount: 89, children: buildNanoCategories() },
            { id: `${category}_india_mh_meta`, name: 'Meta Ads', leadCount: 76, children: buildNanoCategories() },
            { id: `${category}_india_mh_google`, name: 'Google', leadCount: 45, children: buildNanoCategories() },
            { id: `${category}_india_mh_wa`, name: 'WhatsApp', leadCount: 24, children: buildNanoCategories() },
          ]
        },
        {
          id: `${category}_india_ka`,
          name: 'Karnataka',
          leadCount: 156,
          children: [
            { id: `${category}_india_ka_web`, name: 'Website', leadCount: 56, children: buildNanoCategories() },
            { id: `${category}_india_ka_meta`, name: 'Meta Ads', leadCount: 48, children: buildNanoCategories() },
            { id: `${category}_india_ka_google`, name: 'Google', leadCount: 32, children: buildNanoCategories() },
            { id: `${category}_india_ka_wa`, name: 'WhatsApp', leadCount: 20, children: buildNanoCategories() },
          ]
        },
        {
          id: `${category}_india_dl`,
          name: 'Delhi NCR',
          leadCount: 152,
          children: [
            { id: `${category}_india_dl_web`, name: 'Website', leadCount: 52, children: buildNanoCategories() },
            { id: `${category}_india_dl_meta`, name: 'Meta Ads', leadCount: 44, children: buildNanoCategories() },
            { id: `${category}_india_dl_google`, name: 'Google', leadCount: 36, children: buildNanoCategories() },
            { id: `${category}_india_dl_wa`, name: 'WhatsApp', leadCount: 20, children: buildNanoCategories() },
          ]
        }
      ]
    },
    {
      id: `${category}_usa`,
      name: 'United States',
      icon: 'MapPin',
      leadCount: 328,
      children: [
        {
          id: `${category}_usa_ca`,
          name: 'California',
          leadCount: 145,
          children: [
            { id: `${category}_usa_ca_web`, name: 'Website', leadCount: 58, children: buildNanoCategories() },
            { id: `${category}_usa_ca_meta`, name: 'Meta Ads', leadCount: 42, children: buildNanoCategories() },
            { id: `${category}_usa_ca_google`, name: 'Google', leadCount: 28, children: buildNanoCategories() },
            { id: `${category}_usa_ca_wa`, name: 'WhatsApp', leadCount: 17, children: buildNanoCategories() },
          ]
        },
        {
          id: `${category}_usa_tx`,
          name: 'Texas',
          leadCount: 98,
          children: [
            { id: `${category}_usa_tx_web`, name: 'Website', leadCount: 38, children: buildNanoCategories() },
            { id: `${category}_usa_tx_meta`, name: 'Meta Ads', leadCount: 28, children: buildNanoCategories() },
            { id: `${category}_usa_tx_google`, name: 'Google', leadCount: 22, children: buildNanoCategories() },
            { id: `${category}_usa_tx_wa`, name: 'WhatsApp', leadCount: 10, children: buildNanoCategories() },
          ]
        },
        {
          id: `${category}_usa_ny`,
          name: 'New York',
          leadCount: 85,
          children: [
            { id: `${category}_usa_ny_web`, name: 'Website', leadCount: 34, children: buildNanoCategories() },
            { id: `${category}_usa_ny_meta`, name: 'Meta Ads', leadCount: 24, children: buildNanoCategories() },
            { id: `${category}_usa_ny_google`, name: 'Google', leadCount: 17, children: buildNanoCategories() },
            { id: `${category}_usa_ny_wa`, name: 'WhatsApp', leadCount: 10, children: buildNanoCategories() },
          ]
        }
      ]
    },
    {
      id: `${category}_uk`,
      name: 'United Kingdom',
      icon: 'MapPin',
      leadCount: 186,
      children: [
        {
          id: `${category}_uk_london`,
          name: 'London',
          leadCount: 98,
          children: [
            { id: `${category}_uk_london_web`, name: 'Website', leadCount: 42, children: buildNanoCategories() },
            { id: `${category}_uk_london_meta`, name: 'Meta Ads', leadCount: 28, children: buildNanoCategories() },
            { id: `${category}_uk_london_google`, name: 'Google', leadCount: 18, children: buildNanoCategories() },
            { id: `${category}_uk_london_wa`, name: 'WhatsApp', leadCount: 10, children: buildNanoCategories() },
          ]
        },
        {
          id: `${category}_uk_manchester`,
          name: 'Manchester',
          leadCount: 88,
          children: [
            { id: `${category}_uk_manchester_web`, name: 'Website', leadCount: 36, children: buildNanoCategories() },
            { id: `${category}_uk_manchester_meta`, name: 'Meta Ads', leadCount: 26, children: buildNanoCategories() },
            { id: `${category}_uk_manchester_google`, name: 'Google', leadCount: 16, children: buildNanoCategories() },
            { id: `${category}_uk_manchester_wa`, name: 'WhatsApp', leadCount: 10, children: buildNanoCategories() },
          ]
        }
      ]
    }
  ];
}

function buildNanoCategories(): CategoryLevel[] {
  return [
    { id: 'nano_morning', name: 'Morning (6AM-12PM)', leadCount: 28 },
    { id: 'nano_afternoon', name: 'Afternoon (12PM-6PM)', leadCount: 35 },
    { id: 'nano_evening', name: 'Evening (6PM-12AM)', leadCount: 22 },
    { id: 'nano_night', name: 'Night (12AM-6AM)', leadCount: 8 },
    { id: 'nano_low_risk', name: 'Low IP Risk', leadCount: 65 },
    { id: 'nano_med_risk', name: 'Medium IP Risk', leadCount: 20 },
    { id: 'nano_high_risk', name: 'High IP Risk', leadCount: 8 },
    { id: 'nano_high_conf', name: 'AI Score 80%+', leadCount: 42 },
    { id: 'nano_med_conf', name: 'AI Score 50-80%', leadCount: 35 },
    { id: 'nano_low_conf', name: 'AI Score <50%', leadCount: 16 },
  ];
}

// Pipeline Stages
export const pipelineStages: PipelineStage[] = [
  { id: 'new', name: 'New', color: 'blue', icon: 'Inbox', count: 247, value: 0 },
  { id: 'contacted', name: 'Contacted', color: 'cyan', icon: 'Phone', count: 156, value: 45000 },
  { id: 'qualified', name: 'Qualified', color: 'green', icon: 'CheckCircle', count: 89, value: 125000 },
  { id: 'interested', name: 'Interested', color: 'emerald', icon: 'Heart', count: 67, value: 185000 },
  { id: 'proposal_sent', name: 'Proposal Sent', color: 'yellow', icon: 'FileText', count: 45, value: 320000 },
  { id: 'negotiation', name: 'Negotiation', color: 'orange', icon: 'MessageSquare', count: 32, value: 450000 },
  { id: 'won', name: 'Won', color: 'green', icon: 'Trophy', count: 28, value: 680000 },
  { id: 'lost', name: 'Lost', color: 'red', icon: 'XCircle', count: 18, value: 0 },
  { id: 'dormant', name: 'Dormant', color: 'gray', icon: 'Moon', count: 42, value: 0 },
];

// Sample Leads
export const sampleLeads: Lead[] = [
  {
    id: 'lead_001',
    name: 'Rajesh Kumar',
    email: 'r****@techcorp.in',
    phone: '+91 98765*****',
    maskedPhone: '+91 98765*****',
    company: 'TechCorp Solutions',
    status: 'qualified',
    priority: 'high',
    source: 'website',
    subSource: 'Web Forms',
    campaign: 'Summer Sale 2024',
    category: 'franchise',
    subCategory: 'India',
    microCategory: 'Maharashtra',
    nanoCategory: 'Morning (6AM-12PM)',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    area: 'Andheri',
    geoPin: { lat: 19.1136, lng: 72.8697 },
    aiScore: 87,
    riskScore: 12,
    conversionProbability: 78,
    duplicateScore: 5,
    fraudScore: 3,
    budget: '₹5-10 Lakhs',
    urgency: 'High',
    language: 'English',
    device: 'Desktop',
    lastActivity: 'Proposal Reviewed',
    lastActivityTime: '2 hours ago',
    totalActivities: 12,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-17T14:20:00Z',
    notes: [],
    attachments: [],
    communications: []
  },
  {
    id: 'lead_002',
    name: 'Sarah Johnson',
    email: 's****@enterprise.com',
    phone: '+1 555****567',
    maskedPhone: '+1 555****567',
    company: 'Enterprise Inc',
    status: 'proposal_sent',
    priority: 'critical',
    source: 'meta',
    subSource: 'Facebook Lead Ads',
    campaign: 'B2B Campaign Q1',
    category: 'enterprise_client',
    subCategory: 'United States',
    microCategory: 'California',
    nanoCategory: 'AI Score 80%+',
    country: 'United States',
    state: 'California',
    city: 'San Francisco',
    geoPin: { lat: 37.7749, lng: -122.4194 },
    aiScore: 94,
    riskScore: 8,
    conversionProbability: 89,
    duplicateScore: 0,
    fraudScore: 2,
    budget: '$50,000+',
    urgency: 'Critical',
    language: 'English',
    device: 'Mobile',
    lastActivity: 'Contract Sent',
    lastActivityTime: '30 mins ago',
    totalActivities: 24,
    createdAt: '2024-01-10T08:15:00Z',
    updatedAt: '2024-01-17T16:45:00Z',
    notes: [],
    attachments: [],
    communications: []
  },
  {
    id: 'lead_003',
    name: 'Mohammed Ali',
    email: 'm****@retail.ae',
    phone: '+971 50****890',
    maskedPhone: '+971 50****890',
    company: 'Retail Emirates',
    status: 'interested',
    priority: 'high',
    source: 'whatsapp',
    subSource: 'Click-to-WhatsApp',
    campaign: 'UAE Expansion',
    category: 'reseller',
    subCategory: 'UAE',
    microCategory: 'Dubai',
    nanoCategory: 'Low IP Risk',
    country: 'UAE',
    state: 'Dubai',
    city: 'Dubai',
    geoPin: { lat: 25.2048, lng: 55.2708 },
    aiScore: 82,
    riskScore: 15,
    conversionProbability: 72,
    duplicateScore: 8,
    fraudScore: 5,
    budget: 'AED 100,000+',
    urgency: 'Medium',
    language: 'Arabic',
    device: 'Mobile',
    lastActivity: 'WhatsApp Chat',
    lastActivityTime: '1 hour ago',
    totalActivities: 8,
    createdAt: '2024-01-14T12:00:00Z',
    updatedAt: '2024-01-17T15:30:00Z',
    notes: [],
    attachments: [],
    communications: []
  }
];

// Automation Rules
export const automationRules: AutomationRule[] = [
  {
    id: 'rule_001',
    name: 'Auto-assign by Region',
    trigger: 'lead_created',
    conditions: [
      { field: 'country', operator: 'equals', value: 'India' }
    ],
    actions: [
      { type: 'assign', params: { team: 'india_sales' } }
    ],
    isActive: true,
    executionCount: 1247,
    lastExecuted: '2024-01-17T16:30:00Z'
  },
  {
    id: 'rule_002',
    name: 'High Score Priority',
    trigger: 'ai_score_updated',
    conditions: [
      { field: 'aiScore', operator: 'greater_than', value: 80 }
    ],
    actions: [
      { type: 'update_status', params: { priority: 'high' } },
      { type: 'notify', params: { channel: 'slack', message: 'High-value lead detected' } }
    ],
    isActive: true,
    executionCount: 456,
    lastExecuted: '2024-01-17T15:45:00Z'
  },
  {
    id: 'rule_003',
    name: 'Follow-up Reminder',
    trigger: 'status_dormant_3days',
    conditions: [
      { field: 'status', operator: 'equals', value: 'contacted' }
    ],
    actions: [
      { type: 'create_task', params: { title: 'Follow up required', dueIn: '1d' } },
      { type: 'send_email', params: { template: 'followup_reminder' } }
    ],
    isActive: true,
    executionCount: 89,
    lastExecuted: '2024-01-17T09:00:00Z'
  },
  {
    id: 'rule_004',
    name: 'SLA Breach Alert',
    trigger: 'no_activity_24h',
    conditions: [
      { field: 'priority', operator: 'in', value: ['high', 'critical'] }
    ],
    actions: [
      { type: 'notify', params: { channel: 'email', to: 'manager', template: 'sla_breach' } }
    ],
    isActive: true,
    executionCount: 34,
    lastExecuted: '2024-01-17T08:00:00Z'
  }
];

// Sidebar Menu Items
export const leadManagerSidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', badge: 0 },
  { id: 'all_leads', label: 'All Leads', icon: 'Users', badge: 724 },
  { id: 'pipeline', label: 'Sales Pipeline', icon: 'GitBranch', badge: 0 },
  { id: 'sources', label: 'Lead Sources', icon: 'Layers', badge: 6 },
  { id: 'assignments', label: 'Assignments', icon: 'UserPlus', badge: 12 },
  { id: 'activity', label: 'Lead Activity', icon: 'Activity', badge: 0 },
  { id: 'automation', label: 'Automation Rules', icon: 'Zap', badge: 4 },
  { id: 'ai_scoring', label: 'AI Lead Scoring', icon: 'Brain', badge: 0 },
  { id: 'duplicates', label: 'Duplicate Control', icon: 'Copy', badge: 8 },
  { id: 'fraud_filter', label: 'Fraud / Spam Filter', icon: 'ShieldAlert', badge: 15 },
  { id: 'geography', label: 'Lead Geography', icon: 'Globe', badge: 0 },
  { id: 'integrations', label: 'Integrations', icon: 'Plug', badge: 0 },
  { id: 'reports', label: 'Exports & Reports', icon: 'FileBarChart', badge: 0 },
  { id: 'settings', label: 'Settings', icon: 'Settings', badge: 0 },
];
