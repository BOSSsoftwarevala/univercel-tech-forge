// Enterprise Lead Manager Type Definitions

export type LeadStatus = 
  | 'new' 
  | 'contacted' 
  | 'qualified' 
  | 'interested' 
  | 'proposal_sent' 
  | 'negotiation' 
  | 'won' 
  | 'lost' 
  | 'dormant';

export type LeadSource = 
  | 'website' 
  | 'meta' 
  | 'google' 
  | 'whatsapp' 
  | 'manual' 
  | 'api';

export type LeadCategory = 
  | 'franchise' 
  | 'reseller' 
  | 'influencer' 
  | 'job' 
  | 'product_buyer' 
  | 'enterprise_client' 
  | 'support_inquiry' 
  | 'custom';

export type LeadPriority = 'low' | 'medium' | 'high' | 'critical';

export interface LeadSubSource {
  id: string;
  name: string;
  source: LeadSource;
  icon: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  maskedPhone: string;
  company?: string;
  
  // Status & Pipeline
  status: LeadStatus;
  priority: LeadPriority;
  
  // Source Tracking
  source: LeadSource;
  subSource: string;
  campaign?: string;
  adId?: string;
  
  // Category Hierarchy
  category: LeadCategory;
  subCategory: string;
  microCategory: string;
  nanoCategory: string;
  
  // Location
  country: string;
  state: string;
  city: string;
  area?: string;
  geoPin?: { lat: number; lng: number };
  
  // Assignment
  assignedTo?: string;
  assignedRole?: string;
  assignedAt?: string;
  
  // AI Scoring
  aiScore: number;
  riskScore: number;
  conversionProbability: number;
  duplicateScore: number;
  fraudScore: number;
  
  // Metadata
  budget?: string;
  urgency?: string;
  language?: string;
  device?: string;
  ipAddress?: string;
  
  // Activity
  lastActivity?: string;
  lastActivityTime?: string;
  totalActivities: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  convertedAt?: string;
  
  // Notes & Attachments
  notes: LeadNote[];
  attachments: LeadAttachment[];
  
  // Communication
  communications: LeadCommunication[];
}

export interface LeadNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  isPrivate: boolean;
}

export interface LeadAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface LeadCommunication {
  id: string;
  type: 'call' | 'email' | 'sms' | 'whatsapp' | 'meeting' | 'note';
  subject?: string;
  content: string;
  direction: 'inbound' | 'outbound';
  status: 'completed' | 'pending' | 'failed';
  createdBy: string;
  createdAt: string;
  duration?: number;
}

export interface LeadSourceConfig {
  id: string;
  source: LeadSource;
  name: string;
  icon: string;
  color: string;
  subSources: LeadSubSource[];
  isActive: boolean;
  totalLeads: number;
  conversionRate: number;
}

export interface LeadCategoryConfig {
  id: string;
  category: LeadCategory;
  name: string;
  icon: string;
  color: string;
  subCategories: CategoryLevel[];
}

export interface CategoryLevel {
  id: string;
  name: string;
  icon?: string;
  children?: CategoryLevel[];
  leadCount: number;
}

export interface PipelineStage {
  id: LeadStatus;
  name: string;
  color: string;
  icon: string;
  count: number;
  value: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  isActive: boolean;
  executionCount: number;
  lastExecuted?: string;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in';
  value: string | number | string[];
}

export interface AutomationAction {
  type: 'assign' | 'tag' | 'notify' | 'update_status' | 'send_email' | 'create_task';
  params: Record<string, any>;
}

export interface LeadReport {
  id: string;
  name: string;
  type: 'source' | 'campaign' | 'conversion' | 'performance' | 'geography';
  data: any;
  generatedAt: string;
}

export interface LeadManagerSidebarItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
  children?: LeadManagerSidebarItem[];
}
