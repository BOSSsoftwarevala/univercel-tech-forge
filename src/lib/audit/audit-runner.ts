// ================================================================
// Audit Runner - Executes full enterprise integrity audit
// Part of Enterprise Integrity Hard Check
// ================================================================

import { mapUIToRoutes } from './ui-route-mapper';
import { validateRouteControllerMapping } from './route-controller-mapper';
import { analyzeDatabaseSchema } from './database-schema-analyzer';
import { validateAPIEndpoints } from './api-endpoint-validator';
import { validateRBACMatrix } from './rbac-validator';
import { validateAuditLogs } from './audit-log-validator';
import { runSecurityScan } from './security-scanner';
import { analyzePerformance } from './performance-analyzer';
import { generateConsolidatedReport, type ConsolidatedReport } from './report-generator';
import { generateERD, type ERDDiagram } from './erd-generator';
import { generateRouteMap, type RouteMapReport } from './route-map-generator';
import { generateRBACMatrix, type RBACMatrixReport } from './rbac-matrix-generator';

export interface AuditRunOptions {
  phases?: ('ui' | 'database' | 'security' | 'performance' | 'reporting')[];
  verbose?: boolean;
  onProgress?: (phase: string, progress: number, message: string) => void;
}

export interface FullAuditResult {
  consolidatedReport: ConsolidatedReport;
  erd: ERDDiagram;
  routeMap: RouteMapReport;
  rbacMatrix: RBACMatrixReport;
  duration: number;
  completedAt: string;
  success: boolean;
  errors: string[];
}

export async function runEnterpriseAudit(options: AuditRunOptions = {}): Promise<FullAuditResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const onProgress = options.onProgress || (() => {});
  const phases = options.phases || ['ui', 'database', 'security', 'performance', 'reporting'];

  onProgress('init', 0, 'Starting Enterprise Integrity Hard Check...');

  // Phase 1: UI → Route → Controller → Service Validation
  let uiRouteReport;
  let routeControllerReport;
  if (phases.includes('ui')) {
    try {
      onProgress('ui', 10, 'Phase 1: Scanning UI → Route → Controller → Service chain...');
      uiRouteReport = mapUIToRoutes();
      onProgress('ui', 20, `UI scan complete: ${uiRouteReport.mappedElements}/${uiRouteReport.totalElements} elements mapped`);

      routeControllerReport = validateRouteControllerMapping();
      onProgress('ui', 30, `Route-Controller validation: ${routeControllerReport.completeRoutes}/${routeControllerReport.totalRoutes} complete`);
    } catch (err) {
      const msg = `Phase 1 error: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(msg);
      if (options.verbose) console.error(msg);
    }
  }

  // Phase 2: Database Analysis
  let schemaReport;
  if (phases.includes('database')) {
    try {
      onProgress('database', 35, 'Phase 2: Analyzing database schema...');
      schemaReport = analyzeDatabaseSchema();
      onProgress('database', 45, `Schema analysis: ${schemaReport.totalTables} tables, ${schemaReport.missingTables.length} missing`);
    } catch (err) {
      const msg = `Phase 2 error: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(msg);
      if (options.verbose) console.error(msg);
    }
  }

  // API Validation
  let apiReport;
  try {
    onProgress('api', 50, 'Validating API endpoints...');
    apiReport = validateAPIEndpoints();
    onProgress('api', 55, `API validation: ${apiReport.totalEndpoints} endpoints, ${apiReport.unprotectedEndpoints} unprotected`);
  } catch (err) {
    const msg = `API validation error: ${err instanceof Error ? err.message : String(err)}`;
    errors.push(msg);
    if (options.verbose) console.error(msg);
  }

  // RBAC Validation
  let rbacReport;
  try {
    onProgress('rbac', 55, 'Validating RBAC matrix...');
    rbacReport = validateRBACMatrix();
    onProgress('rbac', 60, `RBAC validation: ${rbacReport.totalEntries} entries, ${rbacReport.privilegeEscalationRisks.length} risks`);
  } catch (err) {
    const msg = `RBAC validation error: ${err instanceof Error ? err.message : String(err)}`;
    errors.push(msg);
    if (options.verbose) console.error(msg);
  }

  // Audit Log Validation
  let auditLogReport;
  try {
    onProgress('audit', 60, 'Validating audit log coverage...');
    auditLogReport = validateAuditLogs();
    onProgress('audit', 65, `Audit coverage: ${auditLogReport.auditCompleteness}% complete`);
  } catch (err) {
    const msg = `Audit log validation error: ${err instanceof Error ? err.message : String(err)}`;
    errors.push(msg);
    if (options.verbose) console.error(msg);
  }

  // Phase 3: Security Analysis
  let securityReport;
  if (phases.includes('security')) {
    try {
      onProgress('security', 65, 'Phase 3: Running security scan...');
      securityReport = runSecurityScan();
      onProgress('security', 75, `Security scan: ${securityReport.criticalFindings} critical, ${securityReport.highFindings} high findings`);
    } catch (err) {
      const msg = `Phase 3 error: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(msg);
      if (options.verbose) console.error(msg);
    }
  }

  // Phase 4: Performance Analysis
  let performanceReport;
  if (phases.includes('performance')) {
    try {
      onProgress('performance', 75, 'Phase 4: Analyzing performance baseline...');
      performanceReport = analyzePerformance();
      onProgress('performance', 85, `Performance analysis: score ${performanceReport.overallScore}/100, ${performanceReport.nPlusOneQueries.length} N+1 queries`);
    } catch (err) {
      const msg = `Phase 4 error: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(msg);
      if (options.verbose) console.error(msg);
    }
  }

  // Phase 5: Report Generation
  onProgress('reporting', 85, 'Phase 5: Generating consolidated reports...');

  const consolidatedReport = generateConsolidatedReport(
    uiRouteReport,
    routeControllerReport,
    schemaReport,
    apiReport,
    rbacReport,
    auditLogReport,
    securityReport,
    performanceReport,
  );

  const erd = generateERD();
  const routeMap = generateRouteMap();
  const rbacMatrix = generateRBACMatrix();

  onProgress('reporting', 100, 'Enterprise Integrity Hard Check complete!');

  const duration = Date.now() - startTime;

  return {
    consolidatedReport,
    erd,
    routeMap,
    rbacMatrix,
    duration,
    completedAt: new Date().toISOString(),
    success: errors.length === 0,
    errors,
  };
}

export function formatAuditReport(result: FullAuditResult): string {
  const r = result.consolidatedReport;
  const lines: string[] = [];

  lines.push('');
  lines.push('================================================================================');
  lines.push('         SOFTWARE VALA - ENTERPRISE INTEGRITY HARD CHECK REPORT');
  lines.push('================================================================================');
  lines.push('');
  lines.push(`Generated: ${result.completedAt}`);
  lines.push(`Duration: ${(result.duration / 1000).toFixed(2)}s`);
  lines.push('');
  lines.push('================================================================================');
  lines.push('                           EXECUTIVE SUMMARY');
  lines.push('================================================================================');
  lines.push('');
  lines.push(`System Health Score:     ${r.systemHealthScore}/100`);
  lines.push(`Level 3 Readiness:       ${r.level3ReadinessScore}/100`);
  lines.push(`Overall Status:          ${r.executiveSummary.overallStatus.toUpperCase()}`);
  lines.push('');
  lines.push('Component Scores:');
  lines.push(`  UI → Route Mapping:    ${r.componentScores.uiRouteMappingScore}/100`);
  lines.push(`  Route → Controller:    ${r.componentScores.routeControllerScore}/100`);
  lines.push(`  Database Schema:       ${r.componentScores.databaseScore}/100`);
  lines.push(`  API Endpoints:         ${r.componentScores.apiScore}/100`);
  lines.push(`  RBAC Matrix:           ${r.componentScores.rbacScore}/100`);
  lines.push(`  Audit Log Coverage:    ${r.componentScores.auditLogScore}/100`);
  lines.push(`  Security:              ${r.componentScores.securityScore}/100`);
  lines.push(`  Performance:           ${r.componentScores.performanceScore}/100`);
  lines.push('');

  if (r.executiveSummary.blockers.length > 0) {
    lines.push('⛔ BLOCKERS (Must fix before Level 3):');
    for (const blocker of r.executiveSummary.blockers) {
      lines.push(`  - ${blocker}`);
    }
    lines.push('');
  }

  lines.push('🔴 Critical Issues:');
  if (r.executiveSummary.criticalIssues.length === 0) {
    lines.push('  None');
  } else {
    for (const issue of r.executiveSummary.criticalIssues) {
      lines.push(`  - ${issue}`);
    }
  }
  lines.push('');

  lines.push('🟠 High Priority Issues:');
  if (r.executiveSummary.highPriorityIssues.length === 0) {
    lines.push('  None');
  } else {
    for (const issue of r.executiveSummary.highPriorityIssues) {
      lines.push(`  - ${issue}`);
    }
  }
  lines.push('');

  lines.push('================================================================================');
  lines.push('                      LEVEL 3 READINESS CHECKLIST');
  lines.push('================================================================================');
  lines.push('');
  for (const item of r.level3ChecklistStatus) {
    const icon = item.passed ? '✅' : '❌';
    lines.push(`${icon} ${item.item}`);
    if (!item.passed) {
      lines.push(`   ↳ ${item.notes}`);
    }
  }
  lines.push('');

  lines.push('================================================================================');
  lines.push('                           ACTION ITEMS');
  lines.push('================================================================================');
  lines.push('');
  lines.push('| ID       | Severity | Component                | Title                                           | Blocks L3 |');
  lines.push('|----------|----------|--------------------------|-------------------------------------------------|-----------|');
  for (const action of r.actionItems) {
    const id = action.id.padEnd(8);
    const sev = action.severity.toUpperCase().padEnd(8);
    const comp = action.component.substring(0, 24).padEnd(24);
    const title = action.title.substring(0, 47).padEnd(47);
    const blocks = action.blocksLevel3 ? '   YES   ' : '   no    ';
    lines.push(`| ${id} | ${sev} | ${comp} | ${title} | ${blocks} |`);
  }
  lines.push('');
  lines.push('================================================================================');
  lines.push(`  AUDIT COMPLETE - ${result.errors.length === 0 ? 'SUCCESS' : `${result.errors.length} ERRORS`}`);
  lines.push('================================================================================');
  lines.push('');

  return lines.join('\n');
}
