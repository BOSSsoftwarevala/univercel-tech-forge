// Franchise Intelligence & Issue Tracking Types

export type FranchiseStatus = 'active' | 'risk' | 'suspended' | 'pending';
export type IssueCategory = 'operations' | 'finance' | 'staff' | 'supply' | 'tech' | 'compliance' | 'customer';
export type IssuePriority = 'critical' | 'high' | 'medium' | 'low';
export type IssueStatus = 'open' | 'in_progress' | 'escalated' | 'resolved' | 'closed';

export interface FranchiseProfile {
  id: string;
  franchiseCode: string;
  businessName: string;
  ownerName: string;
  managerName: string;
  city: string;
  region: string;
  country: string;
  startDate: string;
  status: FranchiseStatus;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceScore: number;
  performanceScore: number;
  totalIssues: number;
  openIssues: number;
}

export interface FranchiseIssue {
  id: string;
  franchiseId: string;
  franchiseCode: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  title: string;
  description: string;
  reportedBy: string;
  reportedByRole: string;
  reportedAt: string;
  assignedTo?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  attachments?: string[];
  aiRiskAssessment?: string;
  impactEstimate?: string;
  resolutionNotes?: string;
  escalationHistory?: EscalationEntry[];
}

export interface EscalationEntry {
  timestamp: string;
  from: string;
  to: string;
  reason: string;
}

export interface FranchiseKPI {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  color: 'default' | 'success' | 'warning' | 'danger';
}

export interface IssueStats {
  totalOpen: number;
  critical: number;
  avgResolutionTime: string;
  revenueImpact: number;
  complianceScore: number;
  performanceScore: number;
}

export interface IssueTrend {
  month: string;
  open: number;
  closed: number;
}

export interface CategoryDistribution {
  category: IssueCategory;
  count: number;
  percentage: number;
}

export interface AIInsight {
  id: string;
  franchiseId: string;
  type: 'pattern' | 'prediction' | 'recommendation' | 'warning';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  confidence: number;
  generatedAt: string;
  acknowledged: boolean;
}

export interface OperationalHealth {
  dailyActivityVolume: number;
  missedTasks: number;
  slaBreaches: number;
  uptime: number;
}

export interface FinancialSignals {
  revenueTrend: number;
  expenseAnomalies: number;
  paymentDelays: number;
  projectedRevenue: number;
}

export interface ComplianceRisk {
  auditScore: number;
  violations: number;
  escalationRisk: number;
  lastAuditDate: string;
}

export type ModuleSection = 
  | 'overview'
  | 'issues'
  | 'operations'
  | 'performance'
  | 'financial'
  | 'compliance'
  | 'staff'
  | 'inventory'
  | 'feedback'
  | 'ai_insights'
  | 'documents'
  | 'history';
