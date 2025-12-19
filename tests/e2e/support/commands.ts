// ***********************************************************
// Software Vala Custom Cypress Commands
// ***********************************************************

// Test user credentials for each role
const testUsers: Record<string, { email: string; password: string }> = {
  super_admin: { email: 'admin@softwarevala.com', password: 'TestAdmin@123' },
  admin: { email: 'admin2@softwarevala.com', password: 'TestAdmin@123' },
  franchise: { email: 'franchise@softwarevala.com', password: 'TestFranchise@123' },
  reseller: { email: 'reseller@softwarevala.com', password: 'TestReseller@123' },
  developer: { email: 'dev@softwarevala.com', password: 'TestDev@123' },
  influencer: { email: 'influencer@softwarevala.com', password: 'TestInfluencer@123' },
  prime: { email: 'prime@softwarevala.com', password: 'TestPrime@123' },
  lead_manager: { email: 'leadmgr@softwarevala.com', password: 'TestLead@123' },
  demo_manager: { email: 'demomgr@softwarevala.com', password: 'TestDemo@123' },
  finance_manager: { email: 'finance@softwarevala.com', password: 'TestFinance@123' },
  support: { email: 'support@softwarevala.com', password: 'TestSupport@123' },
  marketing_manager: { email: 'marketing@softwarevala.com', password: 'TestMarketing@123' },
  seo_manager: { email: 'seo@softwarevala.com', password: 'TestSEO@123' },
  hr_manager: { email: 'hr@softwarevala.com', password: 'TestHR@123' },
  legal_compliance: { email: 'legal@softwarevala.com', password: 'TestLegal@123' },
  rd_department: { email: 'rnd@softwarevala.com', password: 'TestRND@123' },
  product_manager: { email: 'product@softwarevala.com', password: 'TestProduct@123' },
  sales: { email: 'sales@softwarevala.com', password: 'TestSales@123' },
  client_success: { email: 'cs@softwarevala.com', password: 'TestCS@123' },
};

// Login via UI
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('not.include', '/login');
});

// Login as specific role
Cypress.Commands.add('loginAsRole', (role: string) => {
  const user = testUsers[role];
  if (!user) {
    throw new Error(`Unknown role: ${role}`);
  }
  cy.login(user.email, user.password);
});

// Logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="profile-dropdown"]').click();
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should('include', '/login');
});

// API Login for token
Cypress.Commands.add('apiLogin', (email: string, password: string) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/api-auth/login`,
    body: { email, password },
  }).then((response) => {
    expect(response.status).to.eq(200);
    return { token: response.body.access_token };
  });
});

// Check masking is applied
Cypress.Commands.add('checkMasking', (selector: string, type: 'email' | 'phone') => {
  cy.get(selector).then(($el) => {
    const text = $el.text();
    if (type === 'email') {
      // Email should be masked like j***@e***.com
      expect(text).to.match(/^[a-z]\*{2,}@[a-z]\*{2,}\.[a-z]+$/i);
    } else if (type === 'phone') {
      // Phone should be masked like +91-98***XXX12
      expect(text).to.match(/^\+?\d{1,3}[-\s]?\d{2}\*{3}[A-Z]{3}\d{2}$/);
    }
  });
});

// Wait for buzzer to appear
Cypress.Commands.add('waitForBuzzer', () => {
  cy.get('[data-testid="buzzer-alert"]', { timeout: 15000 })
    .should('be.visible')
    .and('have.class', 'pulse-animation');
});

// Check role-based module access
Cypress.Commands.add('checkRoleAccess', (allowedModules: string[]) => {
  // Check sidebar for allowed modules
  allowedModules.forEach((module) => {
    cy.get(`[data-testid="sidebar-${module}"]`).should('be.visible');
  });

  // Check that other modules are not visible
  const allModules = [
    'dashboard', 'leads', 'demos', 'products', 'developers',
    'franchise', 'reseller', 'influencer', 'prime', 'seo',
    'tasks', 'support', 'marketing', 'rnd', 'client-success',
    'performance', 'finance', 'legal', 'hr', 'settings'
  ];
  
  const hiddenModules = allModules.filter(m => !allowedModules.includes(m));
  hiddenModules.forEach((module) => {
    cy.get(`[data-testid="sidebar-${module}"]`).should('not.exist');
  });
});

// Verify notification appears
Cypress.Commands.add('verifyNotification', (message: string) => {
  cy.get('[data-testid="notification-bell"]').click();
  cy.get('[data-testid="notification-dropdown"]')
    .should('contain', message);
});

// Create test lead
Cypress.Commands.add('createTestLead', (data: object) => {
  cy.get('[data-testid="create-lead-button"]').click();
  cy.get('[data-testid="lead-form"]').within(() => {
    Object.entries(data).forEach(([key, value]) => {
      cy.get(`[data-testid="lead-${key}"]`).type(String(value));
    });
    cy.get('[data-testid="submit-lead"]').click();
  });
  cy.get('[data-testid="lead-success-toast"]').should('be.visible');
});

// Create test task
Cypress.Commands.add('createTestTask', (data: object) => {
  cy.get('[data-testid="create-task-button"]').click();
  cy.get('[data-testid="task-form"]').within(() => {
    Object.entries(data).forEach(([key, value]) => {
      cy.get(`[data-testid="task-${key}"]`).type(String(value));
    });
    cy.get('[data-testid="submit-task"]').click();
  });
  cy.get('[data-testid="task-success-toast"]').should('be.visible');
});

export {};
