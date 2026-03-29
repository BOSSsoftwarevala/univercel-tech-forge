import { Category } from '../types/categoryTypes';

export const resellerCategories: Category[] = [
  {
    id: 'sales',
    name: 'Sales Operations',
    icon: 'TrendingUp',
    description: 'Lead management, orders, and conversions',
    count: 1247,
    subs: [
      {
        id: 'leads',
        name: 'Leads',
        icon: 'Users',
        count: 456,
        categoryId: 'sales',
        micros: [
          {
            id: 'lead-status',
            name: 'Lead Status',
            icon: 'Activity',
            count: 456,
            subId: 'leads',
            nanos: [
              { id: 'new-leads', name: 'New Leads', count: 89, status: 'active', microId: 'lead-status' },
              { id: 'contacted', name: 'Contacted', count: 156, status: 'active', microId: 'lead-status' },
              { id: 'qualified', name: 'Qualified', count: 78, status: 'active', microId: 'lead-status' },
              { id: 'converted', name: 'Converted', count: 98, status: 'active', microId: 'lead-status' },
              { id: 'lost', name: 'Lost', count: 35, status: 'warning', microId: 'lead-status' }
            ]
          },
          {
            id: 'lead-source',
            name: 'Lead Source',
            icon: 'Globe',
            count: 456,
            subId: 'leads',
            nanos: [
              { id: 'direct', name: 'Direct', count: 120, status: 'active', microId: 'lead-source' },
              { id: 'referral', name: 'Referral', count: 89, status: 'active', microId: 'lead-source' },
              { id: 'campaign', name: 'Campaign', count: 156, status: 'active', microId: 'lead-source' },
              { id: 'partner', name: 'Partner', count: 91, status: 'active', microId: 'lead-source' }
            ]
          }
        ]
      },
      {
        id: 'orders',
        name: 'Orders',
        icon: 'ShoppingCart',
        count: 523,
        categoryId: 'sales',
        micros: [
          {
            id: 'order-status',
            name: 'Order Status',
            icon: 'Package',
            count: 523,
            subId: 'orders',
            nanos: [
              { id: 'pending-orders', name: 'Pending', count: 45, status: 'warning', microId: 'order-status' },
              { id: 'processing', name: 'Processing', count: 78, status: 'active', microId: 'order-status' },
              { id: 'completed', name: 'Completed', count: 356, status: 'active', microId: 'order-status' },
              { id: 'cancelled', name: 'Cancelled', count: 44, status: 'warning', microId: 'order-status' }
            ]
          }
        ]
      },
      {
        id: 'revenue',
        name: 'Revenue',
        icon: 'DollarSign',
        count: 268,
        categoryId: 'sales',
        micros: [
          {
            id: 'revenue-type',
            name: 'Revenue Type',
            icon: 'Wallet',
            count: 268,
            subId: 'revenue',
            nanos: [
              { id: 'product-sales', name: 'Product Sales', count: 189, status: 'active', microId: 'revenue-type' },
              { id: 'service-fees', name: 'Service Fees', count: 56, status: 'active', microId: 'revenue-type' },
              { id: 'subscriptions', name: 'Subscriptions', count: 23, status: 'active', microId: 'revenue-type' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'support',
    name: 'Support & Tickets',
    icon: 'Headphones',
    description: 'Customer support and issue resolution',
    count: 342,
    subs: [
      {
        id: 'tickets',
        name: 'Tickets',
        icon: 'Ticket',
        count: 234,
        categoryId: 'support',
        micros: [
          {
            id: 'ticket-priority',
            name: 'By Priority',
            icon: 'AlertTriangle',
            count: 234,
            subId: 'tickets',
            nanos: [
              { id: 'critical-tickets', name: 'Critical', count: 12, status: 'warning', microId: 'ticket-priority' },
              { id: 'high-tickets', name: 'High', count: 34, status: 'warning', microId: 'ticket-priority' },
              { id: 'medium-tickets', name: 'Medium', count: 89, status: 'active', microId: 'ticket-priority' },
              { id: 'low-tickets', name: 'Low', count: 99, status: 'active', microId: 'ticket-priority' }
            ]
          },
          {
            id: 'ticket-status',
            name: 'By Status',
            icon: 'CheckCircle',
            count: 234,
            subId: 'tickets',
            nanos: [
              { id: 'open-tickets', name: 'Open', count: 67, status: 'active', microId: 'ticket-status' },
              { id: 'in-progress', name: 'In Progress', count: 45, status: 'active', microId: 'ticket-status' },
              { id: 'resolved', name: 'Resolved', count: 112, status: 'active', microId: 'ticket-status' },
              { id: 'closed', name: 'Closed', count: 10, status: 'inactive', microId: 'ticket-status' }
            ]
          }
        ]
      },
      {
        id: 'escalations',
        name: 'Escalations',
        icon: 'ArrowUp',
        count: 108,
        categoryId: 'support',
        micros: [
          {
            id: 'escalation-level',
            name: 'Escalation Level',
            icon: 'Layers',
            count: 108,
            subId: 'escalations',
            nanos: [
              { id: 'level-1', name: 'Level 1', count: 56, status: 'active', microId: 'escalation-level' },
              { id: 'level-2', name: 'Level 2', count: 34, status: 'warning', microId: 'escalation-level' },
              { id: 'level-3', name: 'Level 3', count: 18, status: 'warning', microId: 'escalation-level' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'payments',
    name: 'Payments & Commissions',
    icon: 'CreditCard',
    description: 'Financial transactions and payouts',
    count: 891,
    subs: [
      {
        id: 'commissions',
        name: 'Commissions',
        icon: 'Percent',
        count: 445,
        categoryId: 'payments',
        micros: [
          {
            id: 'commission-status',
            name: 'Commission Status',
            icon: 'Clock',
            count: 445,
            subId: 'commissions',
            nanos: [
              { id: 'pending-commission', name: 'Pending', count: 89, status: 'warning', microId: 'commission-status' },
              { id: 'approved-commission', name: 'Approved', count: 156, status: 'active', microId: 'commission-status' },
              { id: 'paid-commission', name: 'Paid', count: 178, status: 'active', microId: 'commission-status' },
              { id: 'held-commission', name: 'On Hold', count: 22, status: 'warning', microId: 'commission-status' }
            ]
          }
        ]
      },
      {
        id: 'payouts',
        name: 'Payouts',
        icon: 'Banknote',
        count: 446,
        categoryId: 'payments',
        micros: [
          {
            id: 'payout-method',
            name: 'Payout Method',
            icon: 'Wallet',
            count: 446,
            subId: 'payouts',
            nanos: [
              { id: 'bank-transfer', name: 'Bank Transfer', count: 234, status: 'active', microId: 'payout-method' },
              { id: 'wallet', name: 'Wallet', count: 156, status: 'active', microId: 'payout-method' },
              { id: 'crypto', name: 'Crypto', count: 56, status: 'active', microId: 'payout-method' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'compliance',
    name: 'Compliance & Risk',
    icon: 'Shield',
    description: 'Policy compliance and risk management',
    count: 156,
    subs: [
      {
        id: 'violations',
        name: 'Violations',
        icon: 'AlertOctagon',
        count: 67,
        categoryId: 'compliance',
        micros: [
          {
            id: 'violation-type',
            name: 'Violation Type',
            icon: 'FileWarning',
            count: 67,
            subId: 'violations',
            nanos: [
              { id: 'policy-violation', name: 'Policy', count: 23, status: 'warning', microId: 'violation-type' },
              { id: 'trademark', name: 'Trademark', count: 12, status: 'warning', microId: 'violation-type' },
              { id: 'fraud-attempt', name: 'Fraud Attempt', count: 8, status: 'warning', microId: 'violation-type' },
              { id: 'terms-breach', name: 'Terms Breach', count: 24, status: 'warning', microId: 'violation-type' }
            ]
          }
        ]
      },
      {
        id: 'risk-scores',
        name: 'Risk Scores',
        icon: 'Gauge',
        count: 89,
        categoryId: 'compliance',
        micros: [
          {
            id: 'risk-level',
            name: 'Risk Level',
            icon: 'BarChart',
            count: 89,
            subId: 'risk-scores',
            nanos: [
              { id: 'high-risk', name: 'High Risk', count: 12, status: 'warning', microId: 'risk-level' },
              { id: 'medium-risk', name: 'Medium Risk', count: 34, status: 'active', microId: 'risk-level' },
              { id: 'low-risk', name: 'Low Risk', count: 43, status: 'active', microId: 'risk-level' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'performance',
    name: 'Performance Analytics',
    icon: 'BarChart3',
    description: 'KPIs and performance metrics',
    count: 2156,
    subs: [
      {
        id: 'metrics',
        name: 'Metrics',
        icon: 'TrendingUp',
        count: 1200,
        categoryId: 'performance',
        micros: [
          {
            id: 'metric-type',
            name: 'Metric Type',
            icon: 'PieChart',
            count: 1200,
            subId: 'metrics',
            nanos: [
              { id: 'conversion-rate', name: 'Conversion Rate', count: 400, status: 'active', microId: 'metric-type' },
              { id: 'avg-order-value', name: 'Avg Order Value', count: 400, status: 'active', microId: 'metric-type' },
              { id: 'customer-ltv', name: 'Customer LTV', count: 400, status: 'active', microId: 'metric-type' }
            ]
          }
        ]
      },
      {
        id: 'rankings',
        name: 'Rankings',
        icon: 'Award',
        count: 956,
        categoryId: 'performance',
        micros: [
          {
            id: 'ranking-tier',
            name: 'Ranking Tier',
            icon: 'Medal',
            count: 956,
            subId: 'rankings',
            nanos: [
              { id: 'platinum', name: 'Platinum', count: 45, status: 'active', microId: 'ranking-tier' },
              { id: 'gold', name: 'Gold', count: 156, status: 'active', microId: 'ranking-tier' },
              { id: 'silver', name: 'Silver', count: 345, status: 'active', microId: 'ranking-tier' },
              { id: 'bronze', name: 'Bronze', count: 410, status: 'active', microId: 'ranking-tier' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ai-insights',
    name: 'AI Insights',
    icon: 'Brain',
    description: 'AI-powered analytics and predictions',
    count: 78,
    subs: [
      {
        id: 'predictions',
        name: 'Predictions',
        icon: 'Sparkles',
        count: 45,
        categoryId: 'ai-insights',
        micros: [
          {
            id: 'prediction-type',
            name: 'Prediction Type',
            icon: 'Lightbulb',
            count: 45,
            subId: 'predictions',
            nanos: [
              { id: 'churn-risk', name: 'Churn Risk', count: 12, status: 'warning', microId: 'prediction-type' },
              { id: 'growth-opportunity', name: 'Growth Opportunity', count: 23, status: 'active', microId: 'prediction-type' },
              { id: 'fraud-probability', name: 'Fraud Probability', count: 10, status: 'warning', microId: 'prediction-type' }
            ]
          }
        ]
      },
      {
        id: 'recommendations',
        name: 'Recommendations',
        icon: 'MessageSquare',
        count: 33,
        categoryId: 'ai-insights',
        micros: [
          {
            id: 'recommendation-type',
            name: 'Recommendation Type',
            icon: 'Target',
            count: 33,
            subId: 'recommendations',
            nanos: [
              { id: 'action-items', name: 'Action Items', count: 18, status: 'active', microId: 'recommendation-type' },
              { id: 'alerts', name: 'Alerts', count: 8, status: 'warning', microId: 'recommendation-type' },
              { id: 'suggestions', name: 'Suggestions', count: 7, status: 'active', microId: 'recommendation-type' }
            ]
          }
        ]
      }
    ]
  }
];
