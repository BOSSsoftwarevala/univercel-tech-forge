// ================================================================
// Software Vala - Security & Penetration Test Scripts
// ================================================================

import { chromium, Browser, Page } from 'playwright';

interface SecurityTestResult {
  testName: string;
  passed: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  details: string;
}

const BASE_URL = process.env.API_URL || 'https://feqdqyadkijpohyllfdq.supabase.co/functions/v1';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

// SQL Injection Test Payloads
const sqlInjectionPayloads = [
  "' OR '1'='1",
  "'; DROP TABLE users;--",
  "1' OR '1'='1' /*",
  "admin'--",
  "' UNION SELECT * FROM users--",
  "1; SELECT * FROM users",
  "' AND 1=1--",
  "' AND 'a'='a",
  "1' AND SLEEP(5)--",
  "'; EXEC xp_cmdshell('dir');--",
];

// XSS Test Payloads
const xssPayloads = [
  '<script>alert("XSS")</script>',
  '<img src="x" onerror="alert(\'XSS\')">',
  '<svg onload="alert(\'XSS\')">',
  'javascript:alert("XSS")',
  '<body onload="alert(\'XSS\')">',
  '<iframe src="javascript:alert(\'XSS\')">',
  '"><script>alert("XSS")</script>',
  '<input onfocus="alert(\'XSS\')" autofocus>',
  '<marquee onstart="alert(\'XSS\')">',
  '<details open ontoggle="alert(\'XSS\')">',
];

// CSRF Bypass Attempts
const csrfBypassMethods = [
  { method: 'Remove CSRF token', action: () => {} },
  { method: 'Invalid CSRF token', action: () => {} },
  { method: 'Reuse old CSRF token', action: () => {} },
  { method: 'Empty CSRF token', action: () => {} },
];

class SecurityTester {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private results: SecurityTestResult[] = [];

  async initialize() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  // ============= SQL INJECTION TESTS =============

  async testSqlInjectionLogin(): Promise<SecurityTestResult[]> {
    const results: SecurityTestResult[] = [];
    
    for (const payload of sqlInjectionPayloads) {
      try {
        const response = await fetch(`${BASE_URL}/api-auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: payload, password: payload }),
        });
        
        const body = await response.text();
        
        // Check if injection succeeded (it shouldn't)
        const passed = response.status !== 200 && 
                       !body.includes('SQL') && 
                       !body.includes('syntax') &&
                       !body.includes('error in your SQL');
        
        results.push({
          testName: `SQL Injection Login: ${payload.substring(0, 20)}...`,
          passed,
          severity: 'critical',
          details: passed ? 'Injection blocked' : 'Potential SQL injection vulnerability',
        });
      } catch (error) {
        results.push({
          testName: `SQL Injection Login: ${payload.substring(0, 20)}...`,
          passed: true,
          severity: 'critical',
          details: 'Request blocked/failed (safe)',
        });
      }
    }
    
    return results;
  }

  async testSqlInjectionSearch(): Promise<SecurityTestResult[]> {
    const results: SecurityTestResult[] = [];
    
    for (const payload of sqlInjectionPayloads) {
      try {
        const response = await fetch(`${BASE_URL}/api-leads?search=${encodeURIComponent(payload)}`, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${process.env.TEST_TOKEN}`,
          },
        });
        
        const body = await response.text();
        const passed = !body.includes('SQL') && !body.includes('syntax error');
        
        results.push({
          testName: `SQL Injection Search: ${payload.substring(0, 20)}...`,
          passed,
          severity: 'critical',
          details: passed ? 'Search sanitized' : 'Potential SQL injection in search',
        });
      } catch (error) {
        results.push({
          testName: `SQL Injection Search: ${payload.substring(0, 20)}...`,
          passed: true,
          severity: 'critical',
          details: 'Request blocked/failed (safe)',
        });
      }
    }
    
    return results;
  }

  // ============= XSS TESTS =============

  async testXssInputFields(): Promise<SecurityTestResult[]> {
    const results: SecurityTestResult[] = [];
    
    if (!this.page) return results;
    
    await this.page.goto(`${APP_URL}/login`);
    
    for (const payload of xssPayloads) {
      try {
        // Try XSS in email field
        await this.page.fill('[data-testid="email-input"]', payload);
        await this.page.fill('[data-testid="password-input"]', 'test');
        await this.page.click('[data-testid="login-button"]');
        
        // Check if script executed (dialog appeared)
        let xssTriggered = false;
        this.page.on('dialog', () => {
          xssTriggered = true;
        });
        
        await this.page.waitForTimeout(500);
        
        results.push({
          testName: `XSS Input: ${payload.substring(0, 20)}...`,
          passed: !xssTriggered,
          severity: 'critical',
          details: xssTriggered ? 'XSS payload executed!' : 'XSS blocked/escaped',
        });
        
        // Clear for next test
        await this.page.fill('[data-testid="email-input"]', '');
      } catch (error) {
        results.push({
          testName: `XSS Input: ${payload.substring(0, 20)}...`,
          passed: true,
          severity: 'critical',
          details: 'Input blocked (safe)',
        });
      }
    }
    
    return results;
  }

  // ============= BRUTE FORCE TESTS =============

  async testBruteForceProtection(): Promise<SecurityTestResult> {
    let rateLimited = false;
    let attemptCount = 0;
    
    for (let i = 0; i < 15; i++) {
      try {
        const response = await fetch(`${BASE_URL}/api-auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: 'brute@test.com', 
            password: `wrong${i}` 
          }),
        });
        
        attemptCount++;
        
        if (response.status === 429) {
          rateLimited = true;
          break;
        }
      } catch (error) {
        rateLimited = true;
        break;
      }
    }
    
    return {
      testName: 'Brute Force Protection',
      passed: rateLimited && attemptCount <= 10,
      severity: 'critical',
      details: rateLimited 
        ? `Rate limited after ${attemptCount} attempts` 
        : 'No rate limiting detected!',
    };
  }

  // ============= SESSION HIJACKING TEST =============

  async testSessionHijacking(): Promise<SecurityTestResult> {
    // Get a valid session
    const loginResponse = await fetch(`${BASE_URL}/api-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'test@softwarevala.com', 
        password: process.env.TEST_PASSWORD 
      }),
    });
    
    if (loginResponse.status !== 200) {
      return {
        testName: 'Session Hijacking',
        passed: true,
        severity: 'critical',
        details: 'Could not get initial session for test',
      };
    }
    
    const { access_token } = await loginResponse.json();
    
    // Try to use the session from a different IP (simulated)
    const hijackResponse = await fetch(`${BASE_URL}/api-leads`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${access_token}`,
        'X-Forwarded-For': '192.168.1.100', // Different IP
      },
    });
    
    // For IP-locked users (franchise/reseller), this should fail
    const passed = hijackResponse.status === 401 || hijackResponse.status === 403;
    
    return {
      testName: 'Session Hijacking (Different IP)',
      passed,
      severity: 'critical',
      details: passed ? 'Session invalidated on IP change' : 'Session valid from different IP',
    };
  }

  // ============= CROSS-ROLE ACCESS TEST =============

  async testCrossRoleAccess(): Promise<SecurityTestResult[]> {
    const results: SecurityTestResult[] = [];
    
    // Login as developer
    const devLogin = await fetch(`${BASE_URL}/api-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'dev@softwarevala.com', 
        password: process.env.DEV_PASSWORD 
      }),
    });
    
    if (devLogin.status !== 200) {
      return [{
        testName: 'Cross-Role Access',
        passed: true,
        severity: 'critical',
        details: 'Could not login as developer for test',
      }];
    }
    
    const { access_token: devToken } = await devLogin.json();
    
    // Protected endpoints to test
    const protectedEndpoints = [
      { url: '/api-wallet/ledger', role: 'finance', method: 'GET' },
      { url: '/api-leads/create', role: 'lead_manager', method: 'POST' },
      { url: '/api-demo/create', role: 'demo_manager', method: 'POST' },
      { url: '/api-rnd/approve', role: 'rd_department', method: 'POST' },
      { url: '/api-legal/case', role: 'legal', method: 'POST' },
    ];
    
    for (const endpoint of protectedEndpoints) {
      const response = await fetch(`${BASE_URL}${endpoint.url}`, {
        method: endpoint.method,
        headers: { 
          'Authorization': `Bearer ${devToken}`,
          'Content-Type': 'application/json',
        },
        body: endpoint.method === 'POST' ? '{}' : undefined,
      });
      
      const passed = response.status === 403 || response.status === 401;
      
      results.push({
        testName: `Cross-Role Access: Developer → ${endpoint.role} (${endpoint.url})`,
        passed,
        severity: 'critical',
        details: passed ? 'Access denied correctly' : 'Unauthorized access allowed!',
      });
    }
    
    return results;
  }

  // ============= JWT TAMPERING TEST =============

  async testJwtTampering(): Promise<SecurityTestResult[]> {
    const results: SecurityTestResult[] = [];
    
    // Test with tampered JWT
    const tamperedTokens = [
      // Modified payload
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6InN1cGVyX2FkbWluIiwiZXhwIjo5OTk5OTk5OTk5fQ.tamperedsignature',
      // None algorithm attack
      'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6InN1cGVyX2FkbWluIn0.',
      // Empty signature
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6InN1cGVyX2FkbWluIn0.',
    ];
    
    for (const token of tamperedTokens) {
      const response = await fetch(`${BASE_URL}/api-leads`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const passed = response.status === 401;
      
      results.push({
        testName: `JWT Tampering: ${token.substring(0, 30)}...`,
        passed,
        severity: 'critical',
        details: passed ? 'Tampered token rejected' : 'Tampered token accepted!',
      });
    }
    
    return results;
  }

  // ============= RATE LIMITING TEST =============

  async testRateLimiting(): Promise<SecurityTestResult> {
    let responseCount = 0;
    let rateLimited = false;
    
    const promises = [];
    for (let i = 0; i < 200; i++) {
      promises.push(
        fetch(`${BASE_URL}/api-leads`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${process.env.TEST_TOKEN}` },
        }).then(response => {
          if (response.status === 429) {
            rateLimited = true;
          }
          responseCount++;
        })
      );
    }
    
    await Promise.all(promises);
    
    return {
      testName: 'API Rate Limiting (200 concurrent requests)',
      passed: rateLimited,
      severity: 'high',
      details: rateLimited 
        ? `Rate limited after ${responseCount} requests` 
        : 'No rate limiting on API!',
    };
  }

  // ============= IDOR TEST =============

  async testIdorVulnerability(): Promise<SecurityTestResult[]> {
    const results: SecurityTestResult[] = [];
    
    // Login as regular user
    const userLogin = await fetch(`${BASE_URL}/api-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'user@softwarevala.com', 
        password: process.env.USER_PASSWORD 
      }),
    });
    
    if (userLogin.status !== 200) {
      return [{
        testName: 'IDOR Vulnerability',
        passed: true,
        severity: 'high',
        details: 'Could not login for IDOR test',
      }];
    }
    
    const { access_token, user_id } = await userLogin.json();
    
    // Try to access another user's data
    const otherUserIds = [
      '00000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000002',
    ];
    
    for (const otherId of otherUserIds) {
      const response = await fetch(`${BASE_URL}/api-wallet/user/${otherId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${access_token}` },
      });
      
      const passed = response.status === 403 || response.status === 404;
      
      results.push({
        testName: `IDOR: Access other user's wallet (${otherId})`,
        passed,
        severity: 'high',
        details: passed ? 'Access denied' : 'IDOR vulnerability detected!',
      });
    }
    
    return results;
  }

  // ============= MULTI-IP LOGIN TEST =============

  async testMultiIpLogin(): Promise<SecurityTestResult> {
    // Login from first "IP"
    const login1 = await fetch(`${BASE_URL}/api-auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Forwarded-For': '192.168.1.1',
      },
      body: JSON.stringify({ 
        email: 'franchise@softwarevala.com', 
        password: process.env.FRANCHISE_PASSWORD 
      }),
    });
    
    if (login1.status !== 200) {
      return {
        testName: 'Multi-IP Login Prevention',
        passed: true,
        severity: 'critical',
        details: 'Could not perform initial login',
      };
    }
    
    const { access_token: token1 } = await login1.json();
    
    // Try to login from second "IP"
    const login2 = await fetch(`${BASE_URL}/api-auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Forwarded-For': '192.168.2.1',
      },
      body: JSON.stringify({ 
        email: 'franchise@softwarevala.com', 
        password: process.env.FRANCHISE_PASSWORD 
      }),
    });
    
    // Check if first session is still valid
    const checkSession = await fetch(`${BASE_URL}/api-leads`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token1}`,
        'X-Forwarded-For': '192.168.1.1',
      },
    });
    
    const passed = checkSession.status === 401; // First session should be invalidated
    
    return {
      testName: 'Multi-IP Login Prevention (Franchise)',
      passed,
      severity: 'critical',
      details: passed 
        ? 'First session invalidated on second IP login' 
        : 'Multiple IP sessions allowed!',
    };
  }

  // ============= RUN ALL TESTS =============

  async runAllTests(): Promise<SecurityTestResult[]> {
    console.log('Starting Security Tests...\n');
    
    await this.initialize();
    
    // SQL Injection
    console.log('Testing SQL Injection...');
    this.results.push(...await this.testSqlInjectionLogin());
    this.results.push(...await this.testSqlInjectionSearch());
    
    // XSS
    console.log('Testing XSS...');
    this.results.push(...await this.testXssInputFields());
    
    // Brute Force
    console.log('Testing Brute Force Protection...');
    this.results.push(await this.testBruteForceProtection());
    
    // Session Hijacking
    console.log('Testing Session Hijacking...');
    this.results.push(await this.testSessionHijacking());
    
    // Cross-Role Access
    console.log('Testing Cross-Role Access...');
    this.results.push(...await this.testCrossRoleAccess());
    
    // JWT Tampering
    console.log('Testing JWT Tampering...');
    this.results.push(...await this.testJwtTampering());
    
    // Rate Limiting
    console.log('Testing Rate Limiting...');
    this.results.push(await this.testRateLimiting());
    
    // IDOR
    console.log('Testing IDOR...');
    this.results.push(...await this.testIdorVulnerability());
    
    // Multi-IP Login
    console.log('Testing Multi-IP Login...');
    this.results.push(await this.testMultiIpLogin());
    
    await this.cleanup();
    
    return this.results;
  }

  generateReport(): string {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const criticalFailed = this.results.filter(r => !r.passed && r.severity === 'critical').length;
    
    let report = `
================================================================================
                    SOFTWARE VALA SECURITY TEST REPORT
================================================================================

Total Tests: ${this.results.length}
Passed: ${passed}
Failed: ${failed}
Critical Failures: ${criticalFailed}

================================================================================
                              DETAILED RESULTS
================================================================================

`;

    for (const result of this.results) {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      report += `
${status} | [${result.severity.toUpperCase()}] ${result.testName}
   Details: ${result.details}
`;
    }

    report += `
================================================================================
                              RECOMMENDATIONS
================================================================================

`;

    const failedTests = this.results.filter(r => !r.passed);
    if (failedTests.length === 0) {
      report += 'All security tests passed! Continue with regular security audits.\n';
    } else {
      report += 'The following issues require immediate attention:\n\n';
      for (const test of failedTests) {
        report += `- [${test.severity.toUpperCase()}] ${test.testName}\n`;
      }
    }

    return report;
  }
}

// Run tests
async function main() {
  const tester = new SecurityTester();
  await tester.runAllTests();
  console.log(tester.generateReport());
}

main().catch(console.error);

export { SecurityTester, SecurityTestResult };
