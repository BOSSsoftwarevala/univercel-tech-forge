// Compliance System Types
import { AppRole } from './roles';

// Role Clauses
export interface RoleClause {
  id: string;
  roleId: AppRole;
  title: string;
  clauses: string[];
  version: string;
  effectiveDate: string;
}

// Verification Status
export type VerificationStep = 
  | 'agreement'
  | 'identity'
  | 'risk_scoring'
  | 'legal_review'
  | 'activation';

export type VerificationStatus = 
  | 'pending'
  | 'in_progress'
  | 'approved'
  | 'rejected'
  | 'requires_action';

export interface VerificationRecord {
  id: string;
  userId: string;
  role: AppRole;
  currentStep: VerificationStep;
  stepStatuses: Record<VerificationStep, VerificationStatus>;
  agreementAcceptedAt?: string;
  agreementVersion?: string;
  identityDocumentUrl?: string;
  livenessPhotoUrl?: string;
  identityVerifiedAt?: string;
  riskScore?: number;
  riskFactors?: RiskFactor[];
  legalReviewStatus?: 'pending' | 'approved' | 'rejected';
  legalReviewerId?: string;
  legalReviewNotes?: string;
  legalReviewedAt?: string;
  activatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskFactor {
  type: 'ip_reputation' | 'device_fingerprint' | 'country_risk' | 'asn_check' | 'violation_history';
  score: number;
  status: 'pass' | 'warning' | 'fail';
  details: string;
}

// Penalty System
export type PenaltyLevel = 1 | 2 | 3 | 4 | 5;

export interface PenaltyLevelConfig {
  level: PenaltyLevel;
  name: string;
  description: string;
  actions: string[];
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface PenaltyRecord {
  id: string;
  userId: string;
  userRole: AppRole;
  level: PenaltyLevel;
  reason: string;
  violationType: string;
  evidence?: string;
  issuedBy: string;
  issuedAt: string;
  expiresAt?: string;
  isActive: boolean;
  canAppeal: boolean;
  appealStatus?: 'pending' | 'approved' | 'rejected';
  appealNotes?: string;
  auditTrailId: string;
}

// Legal Review
export interface LegalReviewCase {
  id: string;
  userId: string;
  userEmail: string;
  userRole: AppRole;
  reviewType: 'verification' | 'penalty_appeal' | 'escalation';
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  submittedAt: string;
  reviewedAt?: string;
  notes?: string;
  documents: string[];
  riskScore: number;
}

// Constants
export const PENALTY_LEVELS: PenaltyLevelConfig[] = [
  {
    level: 1,
    name: 'Warning',
    description: 'Minor policy violation',
    actions: ['System warning issued', 'Logged in audit trail'],
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
  },
  {
    level: 2,
    name: 'Restriction',
    description: 'Feature access limited',
    actions: ['Feature access limited', 'Earnings/actions paused', 'Manager notified'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
  },
  {
    level: 3,
    name: 'Suspension',
    description: 'Role suspended',
    actions: ['Role suspended', 'Server/code/API access blocked', 'Investigation required'],
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
  {
    level: 4,
    name: 'Termination',
    description: 'Account terminated',
    actions: ['Account terminated', 'Earnings frozen', 'Data access revoked', 'Legal record created'],
    color: 'text-red-700',
    bgColor: 'bg-red-700/10',
    borderColor: 'border-red-700/30',
  },
  {
    level: 5,
    name: 'Legal Action',
    description: 'Legal proceedings initiated',
    actions: ['Evidence package generated', 'Legal team notified', 'Permanent blacklist'],
    color: 'text-red-900',
    bgColor: 'bg-red-900/20',
    borderColor: 'border-red-900/50',
  },
];

export const ROLE_CLAUSES: RoleClause[] = [
  {
    id: 'master',
    roleId: 'master',
    title: 'Master / Super Admin Clauses',
    version: '1.0.0',
    effectiveDate: '2024-01-01',
    clauses: [
      'Responsible for platform-wide compliance and regulatory adherence',
      'Final authority on all approvals and revocations',
      'Accountable for all legal and financial decisions',
      'Must maintain complete audit trail of all administrative actions',
      'Cannot delegate ultimate responsibility for platform security',
    ],
  },
  {
    id: 'super_admin',
    roleId: 'super_admin',
    title: 'Super Admin Clauses',
    version: '1.0.0',
    effectiveDate: '2024-01-01',
    clauses: [
      'Responsible for platform-wide compliance and regulatory adherence',
      'Final authority on all approvals and revocations',
      'Accountable for all legal and financial decisions',
      'Must maintain complete audit trail of all administrative actions',
      'Cannot delegate ultimate responsibility for platform security',
    ],
  },
  {
    id: 'admin',
    roleId: 'admin',
    title: 'Admin / Server Manager Clauses',
    version: '1.0.0',
    effectiveDate: '2024-01-01',
    clauses: [
      'No server action without explicit approval from Super Admin',
      'No hidden services, ports, or scripts on any managed infrastructure',
      'No unauthorized access to user data under any circumstances',
      'All server changes must be documented and logged',
      'Must report security incidents within 1 hour of discovery',
    ],
  },
  {
    id: 'developer',
    roleId: 'developer',
    title: 'Developer Clauses',
    version: '1.0.0',
    effectiveDate: '2024-01-01',
    clauses: [
      'No source code copying, reuse, or redistribution without authorization',
      'No hidden assets, users, APIs, or backdoors in any codebase',
      'No hardcoded keys, secrets, or unauthorized access credentials',
      'All commits must be auditable and traceable to assigned tasks',
      'Must complete security training before accessing production code',
    ],
  },
  {
    id: 'franchise',
    roleId: 'franchise',
    title: 'Franchise Clauses',
    version: '1.0.0',
    effectiveDate: '2024-01-01',
    clauses: [
      'No false claims or misrepresentation of services',
      'No unauthorized discounts or billing actions',
      'Operate only within assigned territory and scope',
      'Must maintain brand guidelines at all times',
      'All sales must be properly documented and reported',
    ],
  },
  {
    id: 'reseller',
    roleId: 'reseller',
    title: 'Reseller Clauses',
    version: '1.0.0',
    effectiveDate: '2024-01-01',
    clauses: [
      'No false claims or misrepresentation of services',
      'No unauthorized discounts or billing actions',
      'Operate only within assigned scope and pricing tiers',
      'Must maintain accurate customer records',
      'No direct contact with platform end-users without approval',
    ],
  },
  {
    id: 'influencer',
    roleId: 'influencer',
    title: 'Marketing / SEO / Influencer Clauses',
    version: '1.0.0',
    effectiveDate: '2024-01-01',
    clauses: [
      'No spam, scam, or misleading marketing campaigns',
      'No impersonation or brand misuse',
      'No bulk messaging without prior approval',
      'All promotional content must be clearly disclosed',
      'Must comply with advertising regulations in all jurisdictions',
    ],
  },
  {
    id: 'prime',
    roleId: 'prime',
    title: 'Prime User Clauses',
    version: '1.0.0',
    effectiveDate: '2024-01-01',
    clauses: [
      'No illegal usage of platform resources',
      'No abuse of system resources or rate limits',
      'No circumvention of platform policies',
      'Must report bugs and vulnerabilities responsibly',
      'Account sharing is strictly prohibited',
    ],
  },
  {
    id: 'support',
    roleId: 'support',
    title: 'Support Agent Clauses',
    version: '1.0.0',
    effectiveDate: '2024-01-01',
    clauses: [
      'Must maintain confidentiality of all user information',
      'No unauthorized account modifications',
      'Must follow escalation procedures for complex issues',
      'All support interactions must be logged',
      'No personal opinions on legal or billing matters',
    ],
  },
  {
    id: 'seo_manager',
    roleId: 'seo_manager',
    title: 'SEO Manager Clauses',
    version: '1.0.0',
    effectiveDate: '2024-01-01',
    clauses: [
      'No black-hat SEO techniques or link schemes',
      'No keyword stuffing or cloaking',
      'Must follow search engine guidelines',
      'All SEO changes must be documented',
      'No unauthorized domain or redirect modifications',
    ],
  },
  {
    id: 'ai_manager',
    roleId: 'ai_manager',
    title: 'API / AI Manager Clauses',
    version: '1.0.0',
    effectiveDate: '2024-01-01',
    clauses: [
      'No unauthorized API exposure or endpoint creation',
      'No model misuse or data leakage',
      'No automation without explicit approval',
      'Must maintain API rate limits and security',
      'All API changes must be documented and reviewed',
    ],
  },
  {
    id: 'marketing_manager',
    roleId: 'marketing_manager',
    title: 'Marketing Manager Clauses',
    version: '1.0.0',
    effectiveDate: '2024-01-01',
    clauses: [
      'No spam, scam, or misleading marketing campaigns',
      'No impersonation or brand misuse',
      'No bulk messaging without prior approval',
      'All promotional content must be clearly disclosed',
      'Must comply with advertising regulations in all jurisdictions',
    ],
  },
  {
    id: 'client',
    roleId: 'client',
    title: 'User Clauses',
    version: '1.0.0',
    effectiveDate: '2024-01-01',
    clauses: [
      'No illegal usage of platform resources',
      'No abuse of system resources or rate limits',
      'No circumvention of platform policies',
      'Must report bugs and vulnerabilities responsibly',
      'Account sharing is strictly prohibited',
    ],
  },
];

export const VERIFICATION_STEPS: { step: VerificationStep; title: string; description: string }[] = [
  { step: 'agreement', title: 'Agreement Acceptance', description: 'Review and accept role-based clauses' },
  { step: 'identity', title: 'Identity Verification', description: 'Upload government ID and complete liveness check' },
  { step: 'risk_scoring', title: 'Risk Assessment', description: 'Automated security and risk analysis' },
  { step: 'legal_review', title: 'Legal Review', description: 'Manual review by legal/compliance team' },
  { step: 'activation', title: 'Activation', description: 'Role access unlocked upon approval' },
];
