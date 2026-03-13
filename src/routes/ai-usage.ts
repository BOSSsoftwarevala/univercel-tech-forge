/**
 * AI Usage & Monitoring Routes
 * Service functions that back the usage monitoring dashboard.
 */

import {
  getMonthlyCostSummary,
  checkCostAlerts,
  getUsageDetails,
} from '@/lib/ai-orchestration/usage-tracker';

// GET /api/v1/ai-usage/summary
export async function getUsageSummary(tenantId?: string) {
  return getMonthlyCostSummary(tenantId);
}

// GET /api/v1/ai-usage/details
export async function getUsageDetailsRoute(opts: {
  serviceId?: string;
  tenantId?: string;
  page?: number;
  pageSize?: number;
}) {
  return getUsageDetails(opts);
}

// GET /api/v1/ai-usage/costs
export async function getCostBreakdown(tenantId?: string) {
  const summaries = await getMonthlyCostSummary(tenantId);
  return summaries.map(s => ({
    serviceId: s.serviceId,
    serviceName: s.serviceName,
    totalCost: s.totalCost,
    month: s.month,
  }));
}

// GET /api/v1/ai-usage/alerts
export async function getCostAlerts() {
  return checkCostAlerts();
}
