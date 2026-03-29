import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FranchiseSidebar } from './FranchiseSidebar';
import { FranchiseDataDashboard } from './FranchiseDataDashboard';
import { IssueDetailPanel } from './IssueDetailPanel';
import { IssueListView } from './IssueListView';
import { AIInsightsPanel } from './AIInsightsPanel';
import { toast } from 'sonner';
import type { 
  FranchiseProfile, 
  FranchiseIssue, 
  ModuleSection,
  IssueStats,
  IssueTrend,
  CategoryDistribution,
  OperationalHealth,
  FinancialSignals,
  ComplianceRisk,
  AIInsight
} from './types';

// Mock data for demonstration
const mockFranchises: FranchiseProfile[] = [
  {
    id: 'fr-001',
    franchiseCode: 'FR-MUM-001',
    businessName: 'TechSolutions Mumbai Central',
    ownerName: 'Rajesh Sharma',
    managerName: 'Priya Patel',
    city: 'Mumbai',
    region: 'Maharashtra',
    country: 'India',
    startDate: '2023-01-15',
    status: 'active',
    riskLevel: 'low',
    complianceScore: 92,
    performanceScore: 88,
    totalIssues: 45,
    openIssues: 8
  },
  {
    id: 'fr-002',
    franchiseCode: 'FR-DEL-002',
    businessName: 'TechSolutions Delhi North',
    ownerName: 'Amit Kumar',
    managerName: 'Neha Singh',
    city: 'Delhi',
    region: 'NCR',
    country: 'India',
    startDate: '2023-03-20',
    status: 'risk',
    riskLevel: 'high',
    complianceScore: 65,
    performanceScore: 58,
    totalIssues: 78,
    openIssues: 24
  },
  {
    id: 'fr-003',
    franchiseCode: 'FR-BLR-003',
    businessName: 'TechSolutions Bangalore East',
    ownerName: 'Suresh Reddy',
    managerName: 'Kavitha Rao',
    city: 'Bangalore',
    region: 'Karnataka',
    country: 'India',
    startDate: '2022-11-10',
    status: 'active',
    riskLevel: 'medium',
    complianceScore: 78,
    performanceScore: 82,
    totalIssues: 32,
    openIssues: 5
  },
  {
    id: 'fr-004',
    franchiseCode: 'FR-CHE-004',
    businessName: 'TechSolutions Chennai South',
    ownerName: 'Venkat Raman',
    managerName: 'Lakshmi Iyer',
    city: 'Chennai',
    region: 'Tamil Nadu',
    country: 'India',
    startDate: '2023-06-01',
    status: 'suspended',
    riskLevel: 'critical',
    complianceScore: 42,
    performanceScore: 35,
    totalIssues: 112,
    openIssues: 67
  }
];

const mockIssues: FranchiseIssue[] = [
  {
    id: 'ISS-2024-001',
    franchiseId: 'fr-001',
    franchiseCode: 'FR-MUM-001',
    category: 'operations',
    priority: 'high',
    status: 'open',
    title: 'System downtime affecting customer service',
    description: 'POS system experiencing intermittent failures during peak hours, causing customer delays and lost sales.',
    reportedBy: 'Priya Patel',
    reportedByRole: 'Manager',
    reportedAt: '2024-01-15T09:30:00Z',
    aiRiskAssessment: 'High revenue impact expected. Pattern suggests hardware degradation. Recommend immediate technical inspection.',
    impactEstimate: '₹45,000 estimated daily loss'
  },
  {
    id: 'ISS-2024-002',
    franchiseId: 'fr-002',
    franchiseCode: 'FR-DEL-002',
    category: 'staff',
    priority: 'critical',
    status: 'escalated',
    title: 'High staff turnover causing service quality issues',
    description: 'Lost 4 trained staff members in the last month. Training new hires is affecting service quality.',
    reportedBy: 'Neha Singh',
    reportedByRole: 'Manager',
    reportedAt: '2024-01-14T14:00:00Z',
    assignedTo: 'HR Team',
    aiRiskAssessment: 'Critical HR issue. Recurring pattern detected. Root cause analysis suggests compensation and work environment factors.',
    impactEstimate: '₹120,000 training costs + service degradation',
    escalationHistory: [
      { timestamp: '2024-01-14T16:00:00Z', from: 'Manager', to: 'Area Manager', reason: 'Urgent staffing crisis' },
      { timestamp: '2024-01-15T10:00:00Z', from: 'Area Manager', to: 'HR Head', reason: 'Systemic issue identified' }
    ]
  },
  {
    id: 'ISS-2024-003',
    franchiseId: 'fr-002',
    franchiseCode: 'FR-DEL-002',
    category: 'compliance',
    priority: 'critical',
    status: 'in_progress',
    title: 'Fire safety equipment inspection overdue',
    description: 'Annual fire safety inspection was due 30 days ago. Risk of regulatory action.',
    reportedBy: 'System Auto-Alert',
    reportedByRole: 'Automated',
    reportedAt: '2024-01-10T08:00:00Z',
    assignedTo: 'Compliance Officer',
    aiRiskAssessment: 'Regulatory risk: High. Immediate scheduling required to avoid penalties and operational suspension.',
    impactEstimate: 'Potential fine: ₹50,000 + operational risk'
  },
  {
    id: 'ISS-2024-004',
    franchiseId: 'fr-003',
    franchiseCode: 'FR-BLR-003',
    category: 'finance',
    priority: 'medium',
    status: 'open',
    title: 'Revenue reconciliation discrepancy',
    description: 'Monthly revenue reports showing ₹15,000 discrepancy between POS and bank statements.',
    reportedBy: 'Kavitha Rao',
    reportedByRole: 'Manager',
    reportedAt: '2024-01-12T11:30:00Z',
    aiRiskAssessment: 'Financial anomaly detected. Could be timing difference or data entry error. Recommend detailed transaction audit.',
    impactEstimate: '₹15,000 under investigation'
  },
  {
    id: 'ISS-2024-005',
    franchiseId: 'fr-004',
    franchiseCode: 'FR-CHE-004',
    category: 'supply',
    priority: 'high',
    status: 'open',
    title: 'Critical inventory shortage',
    description: 'Running out of essential supplies. Vendor payments delayed due to cash flow issues.',
    reportedBy: 'Lakshmi Iyer',
    reportedByRole: 'Manager',
    reportedAt: '2024-01-16T07:00:00Z',
    aiRiskAssessment: 'Supply chain risk: Critical. Connected to financial health issues. Recommend emergency vendor negotiation.',
    impactEstimate: 'Operations may halt within 48 hours'
  },
  {
    id: 'ISS-2024-006',
    franchiseId: 'fr-001',
    franchiseCode: 'FR-MUM-001',
    category: 'customer',
    priority: 'medium',
    status: 'resolved',
    title: 'Customer complaint about service delays',
    description: 'Multiple customers reported long wait times during weekend rush hours.',
    reportedBy: 'Customer Feedback System',
    reportedByRole: 'Automated',
    reportedAt: '2024-01-08T18:00:00Z',
    resolvedAt: '2024-01-11T14:00:00Z',
    resolvedBy: 'Priya Patel',
    resolutionNotes: 'Added weekend shift staff. Implemented queue management system.'
  }
];

const mockAIInsights: AIInsight[] = [
  {
    id: 'ai-001',
    franchiseId: 'fr-002',
    type: 'pattern',
    severity: 'critical',
    message: 'This franchise shows recurring staff issues. 3 similar complaints in last 30 days. Recommend HR intervention.',
    confidence: 89,
    generatedAt: '2024-01-16T08:00:00Z',
    acknowledged: false
  },
  {
    id: 'ai-002',
    franchiseId: 'fr-002',
    type: 'prediction',
    severity: 'warning',
    message: 'High risk of revenue drop in next 30 days. Probability of 15% decline: 72%. Contributing factors: staff turnover, compliance issues.',
    confidence: 72,
    generatedAt: '2024-01-16T08:00:00Z',
    acknowledged: false
  },
  {
    id: 'ai-003',
    franchiseId: 'fr-004',
    type: 'warning',
    severity: 'critical',
    message: 'Compliance breach probability: 78%. Multiple overdue inspections and documentation gaps detected.',
    confidence: 78,
    generatedAt: '2024-01-16T08:00:00Z',
    acknowledged: false
  },
  {
    id: 'ai-004',
    franchiseId: 'fr-001',
    type: 'recommendation',
    severity: 'info',
    message: 'Performance optimization opportunity: Implementing automated inventory alerts could reduce stockout incidents by 40%.',
    confidence: 85,
    generatedAt: '2024-01-15T12:00:00Z',
    acknowledged: true
  },
  {
    id: 'ai-005',
    franchiseId: 'fr-003',
    type: 'pattern',
    severity: 'warning',
    message: 'Financial reconciliation issues detected for 3 consecutive months. Recommend process audit.',
    confidence: 67,
    generatedAt: '2024-01-14T09:00:00Z',
    acknowledged: false
  }
];

export function FranchiseIntelligenceCenter() {
  const [selectedFranchise, setSelectedFranchise] = useState<FranchiseProfile | null>(null);
  const [activeSection, setActiveSection] = useState<ModuleSection>('overview');
  const [selectedIssue, setSelectedIssue] = useState<FranchiseIssue | null>(null);
  const [issues, setIssues] = useState(mockIssues);
  const [insights, setInsights] = useState(mockAIInsights);

  // Filter issues for selected franchise
  const franchiseIssues = useMemo(() => {
    if (!selectedFranchise) return [];
    return issues.filter(i => i.franchiseId === selectedFranchise.id);
  }, [selectedFranchise, issues]);

  // Filter insights for selected franchise
  const franchiseInsights = useMemo(() => {
    if (!selectedFranchise) return [];
    return insights.filter(i => i.franchiseId === selectedFranchise.id);
  }, [selectedFranchise, insights]);

  // Calculate stats for selected franchise
  const stats: IssueStats = useMemo(() => {
    const openIssues = franchiseIssues.filter(i => i.status === 'open' || i.status === 'in_progress' || i.status === 'escalated');
    const criticalIssues = franchiseIssues.filter(i => i.priority === 'critical');
    
    return {
      totalOpen: openIssues.length,
      critical: criticalIssues.length,
      avgResolutionTime: '2.3 days',
      revenueImpact: 180000,
      complianceScore: selectedFranchise?.complianceScore || 0,
      performanceScore: selectedFranchise?.performanceScore || 0
    };
  }, [franchiseIssues, selectedFranchise]);

  // Mock data for charts
  const issueTrends: IssueTrend[] = [
    { month: 'Aug', open: 12, closed: 8 },
    { month: 'Sep', open: 15, closed: 12 },
    { month: 'Oct', open: 18, closed: 14 },
    { month: 'Nov', open: 14, closed: 16 },
    { month: 'Dec', open: 10, closed: 18 },
    { month: 'Jan', open: 8, closed: 6 }
  ];

  const categoryDistribution: CategoryDistribution[] = [
    { category: 'operations', count: 12, percentage: 25 },
    { category: 'finance', count: 8, percentage: 17 },
    { category: 'staff', count: 10, percentage: 21 },
    { category: 'supply', count: 6, percentage: 12 },
    { category: 'tech', count: 5, percentage: 10 },
    { category: 'compliance', count: 4, percentage: 8 },
    { category: 'customer', count: 3, percentage: 7 }
  ];

  const operationalHealth: OperationalHealth = {
    dailyActivityVolume: 85,
    missedTasks: 3,
    slaBreaches: 2,
    uptime: 98.5
  };

  const financialSignals: FinancialSignals = {
    revenueTrend: -5,
    expenseAnomalies: 2,
    paymentDelays: 1,
    projectedRevenue: 450000
  };

  const complianceRisk: ComplianceRisk = {
    auditScore: selectedFranchise?.complianceScore || 0,
    violations: 2,
    escalationRisk: 35,
    lastAuditDate: '2024-01-01'
  };

  const handleIssueAction = (action: string, issueId: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        switch (action) {
          case 'resolve':
            return { ...issue, status: 'resolved' as const, resolvedAt: new Date().toISOString() };
          case 'close':
            return { ...issue, status: 'closed' as const };
          case 'escalate':
            return { ...issue, status: 'escalated' as const };
          case 'mark_critical':
            return { ...issue, priority: 'critical' as const };
          default:
            return issue;
        }
      }
      return issue;
    }));
    setSelectedIssue(null);
  };

  const handleAcknowledgeInsight = (insightId: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId ? { ...insight, acknowledged: true } : insight
    ));
    toast.success('Insight acknowledged');
  };

  const renderCenterContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <FranchiseDataDashboard
            franchise={selectedFranchise}
            stats={stats}
            issueTrends={issueTrends}
            categoryDistribution={categoryDistribution}
            operationalHealth={operationalHealth}
            financialSignals={financialSignals}
            complianceRisk={complianceRisk}
          />
        );
      case 'issues':
        return (
          <IssueListView
            issues={franchiseIssues}
            selectedIssue={selectedIssue}
            onSelectIssue={setSelectedIssue}
          />
        );
      case 'ai_insights':
        return (
          <AIInsightsPanel
            franchise={selectedFranchise}
            insights={franchiseInsights}
            onAcknowledge={handleAcknowledgeInsight}
          />
        );
      default:
        return (
          <FranchiseDataDashboard
            franchise={selectedFranchise}
            stats={stats}
            issueTrends={issueTrends}
            categoryDistribution={categoryDistribution}
            operationalHealth={operationalHealth}
            financialSignals={financialSignals}
            complianceRisk={complianceRisk}
          />
        );
    }
  };

  return (
    <div className="h-full flex bg-background">
      {/* Left Sidebar */}
      <FranchiseSidebar
        franchises={mockFranchises}
        selectedFranchise={selectedFranchise}
        onSelectFranchise={setSelectedFranchise}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Center Content */}
      <div className="flex-1 flex overflow-hidden">
        {renderCenterContent()}
      </div>

      {/* Right Panel - Issue Details (only shown when issue is selected) */}
      {activeSection === 'issues' && (
        <IssueDetailPanel
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onAction={handleIssueAction}
        />
      )}
    </div>
  );
}
