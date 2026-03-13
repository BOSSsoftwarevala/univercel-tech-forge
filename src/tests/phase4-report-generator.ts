// ================================================================
// Phase 4 – Report Generator
// ================================================================
//
// Aggregates results from all five test suites and emits a
// structured executive summary to the console (and returns the
// report as a plain string so callers can persist/display it).

import { runProductionOrderFlowTest } from './e2e/production-order-flow.test';
import { runSoftwareVaultReadinessTest } from './vault/software-vault-readiness.test';
import { runDeploymentExecutorReadinessTest } from './deployment/deployment-executor-readiness.test';
import { runSecurityAuditTest } from './security/security-audit.test';
import { runLoadTest } from './performance/load-test.test';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SuiteReport {
  name: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  durationMs: number;
  status: 'PASS' | 'FAIL';
}

interface Phase4Report {
  generatedAt: string;
  overallStatus: 'PRODUCTION READY' | 'NOT PRODUCTION READY';
  suites: SuiteReport[];
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  totalDurationMs: number;
  executiveSummary: string;
  productionReadinessConfirmation: string;
  deploymentRecommendation: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pad(str: string, width: number): string {
  return str.length >= width ? str : str + ' '.repeat(width - str.length);
}

// ---------------------------------------------------------------------------
// Report builder
// ---------------------------------------------------------------------------

function buildReport(suites: SuiteReport[]): Phase4Report {
  const totalTests = suites.reduce((s, r) => s + r.totalTests, 0);
  const totalPassed = suites.reduce((s, r) => s + r.passedTests, 0);
  const totalFailed = suites.reduce((s, r) => s + r.failedTests, 0);
  const totalDurationMs = suites.reduce((s, r) => s + r.durationMs, 0);
  const allPass = totalFailed === 0;

  const overallStatus: Phase4Report['overallStatus'] = allPass
    ? 'PRODUCTION READY'
    : 'NOT PRODUCTION READY';

  const executiveSummary = allPass
    ? `All ${totalTests} automated tests across 5 validation suites completed successfully. ` +
      `The system demonstrates end-to-end order processing integrity, vault capacity at scale, ` +
      `deployment executor reliability, comprehensive security enforcement, and acceptable ` +
      `performance under load. Total validation time: ${(totalDurationMs / 1000).toFixed(1)}s.`
    : `${totalFailed} of ${totalTests} tests failed across the 5 validation suites. ` +
      `Review failed suites before proceeding to production deployment.`;

  const productionReadinessConfirmation = allPass
    ? '✅ System confirmed PRODUCTION READY. All critical validation gates passed.'
    : `❌ System NOT production ready. ${totalFailed} test(s) require remediation.`;

  const deploymentRecommendation = allPass
    ? 'APPROVED FOR PRODUCTION DEPLOYMENT — Proceed with staged rollout as planned.'
    : 'HOLD DEPLOYMENT — Address failing tests before production rollout.';

  return {
    generatedAt: new Date().toISOString(),
    overallStatus,
    suites,
    totalTests,
    totalPassed,
    totalFailed,
    totalDurationMs,
    executiveSummary,
    productionReadinessConfirmation,
    deploymentRecommendation,
  };
}

function formatReport(report: Phase4Report): string {
  const LINE = '='.repeat(72);
  const DASH = '-'.repeat(72);
  const SEP = '─'.repeat(60);

  const suiteRows = report.suites
    .map(
      (s) =>
        `  ${pad(s.name, 44)} ${pad(s.passedTests + '/' + s.totalTests, 8)} ${s.status === 'PASS' ? '✅' : '❌'}`,
    )
    .join('\n');

  return `
${LINE}
              PHASE 4 – AUTOMATED SYSTEM VALIDATION REPORT
${LINE}
  Generated  : ${report.generatedAt}
  Status     : ${report.overallStatus}
${DASH}

  EXECUTIVE SUMMARY
  ${report.executiveSummary}

${DASH}
  TEST RESULTS
${DASH}
  ${pad('Suite', 44)} ${pad('Passed', 8)} Status
  ${SEP}
${suiteRows}
  ${SEP}
  ${pad('TOTAL', 44)} ${pad(report.totalPassed + '/' + report.totalTests, 8)} ${report.totalFailed === 0 ? '✅' : '❌'}

${DASH}
  PERFORMANCE METRICS
${DASH}
  Total validation time : ${(report.totalDurationMs / 1000).toFixed(1)}s
  Tests passed          : ${report.totalPassed}
  Tests failed          : ${report.totalFailed}
  Pass rate             : ${((report.totalPassed / report.totalTests) * 100).toFixed(1)}%

${DASH}
  SECURITY STATUS
${DASH}
  ${report.suites.find((s) => s.name.includes('Security'))?.status === 'PASS'
    ? '✅ All access controls enforced — no data exposure — no vulnerabilities found'
    : '❌ Security checks require attention'}

${DASH}
  PRODUCTION READINESS
${DASH}
  ${report.productionReadinessConfirmation}

  DEPLOYMENT RECOMMENDATION
  ${report.deploymentRecommendation}

${LINE}
`;
}

// ---------------------------------------------------------------------------
// Main runner
// ---------------------------------------------------------------------------

export async function generatePhase4Report(): Promise<Phase4Report> {
  console.log('\n' + '='.repeat(72));
  console.log('  PHASE 4: AUTOMATED SYSTEM VALIDATION & PRODUCTION READINESS');
  console.log('='.repeat(72));

  const suites: SuiteReport[] = [];

  // ---- Task 1: E2E --------------------------------------------------------
  {
    const start = Date.now();
    const result = await runProductionOrderFlowTest();
    suites.push({
      name: 'Task 1: Production Order Flow',
      totalTests: result.totalSteps,
      passedTests: result.completedSteps,
      failedTests: result.totalSteps - result.completedSteps,
      durationMs: Date.now() - start,
      status: result.passed ? 'PASS' : 'FAIL',
    });
  }

  // ---- Task 2: Vault -------------------------------------------------------
  {
    const start = Date.now();
    const results = await runSoftwareVaultReadinessTest();
    const passed = results.filter((r) => r.passed).length;
    suites.push({
      name: 'Task 2: SoftwareVault Readiness',
      totalTests: results.length,
      passedTests: passed,
      failedTests: results.length - passed,
      durationMs: Date.now() - start,
      status: passed === results.length ? 'PASS' : 'FAIL',
    });
  }

  // ---- Task 3: Deployment --------------------------------------------------
  {
    const start = Date.now();
    const results = await runDeploymentExecutorReadinessTest();
    const passed = results.filter((r) => r.passed).length;
    suites.push({
      name: 'Task 3: Deployment Executor Readiness',
      totalTests: results.length,
      passedTests: passed,
      failedTests: results.length - passed,
      durationMs: Date.now() - start,
      status: passed === results.length ? 'PASS' : 'FAIL',
    });
  }

  // ---- Task 4: Security ----------------------------------------------------
  {
    const start = Date.now();
    const results = await runSecurityAuditTest();
    const passed = results.filter((r) => r.passed).length;
    suites.push({
      name: 'Task 4: Security Audit',
      totalTests: results.length,
      passedTests: passed,
      failedTests: results.length - passed,
      durationMs: Date.now() - start,
      status: passed === results.length ? 'PASS' : 'FAIL',
    });
  }

  // ---- Task 5: Performance -------------------------------------------------
  {
    const start = Date.now();
    const results = await runLoadTest();
    const passed = results.filter((r) => r.passed).length;
    suites.push({
      name: 'Task 5: Performance Load Test',
      totalTests: results.length,
      passedTests: passed,
      failedTests: results.length - passed,
      durationMs: Date.now() - start,
      status: passed === results.length ? 'PASS' : 'FAIL',
    });
  }

  const report = buildReport(suites);
  console.log(formatReport(report));

  return report;
}


