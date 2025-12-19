// ***********************************************************
// Software Vala E2E Test Support File
// ***********************************************************

import './commands';

// Global hooks
beforeEach(() => {
  // Clear local storage and cookies before each test
  cy.clearLocalStorage();
  cy.clearCookies();
});

afterEach(function () {
  // Take screenshot on failure
  if (this.currentTest?.state === 'failed') {
    const testName = this.currentTest.title.replace(/\s+/g, '_');
    cy.screenshot(`failure_${testName}`);
  }
});

// Prevent uncaught exception failures
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent the error from failing the test
  console.error('Uncaught exception:', err.message);
  return false;
});

// Add custom assertions
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      loginAsRole(role: string): Chainable<void>;
      logout(): Chainable<void>;
      apiLogin(email: string, password: string): Chainable<{ token: string }>;
      checkMasking(selector: string, type: 'email' | 'phone'): Chainable<void>;
      waitForBuzzer(): Chainable<void>;
      checkRoleAccess(allowedModules: string[]): Chainable<void>;
      verifyNotification(message: string): Chainable<void>;
      createTestLead(data: object): Chainable<void>;
      createTestTask(data: object): Chainable<void>;
    }
  }
}

export {};
