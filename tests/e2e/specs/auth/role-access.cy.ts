// ================================================================
// Software Vala - Role-Based Access Control Tests
// ================================================================

describe('Role-Based Access Control Tests', () => {
  
  // ============= SUPER ADMIN ACCESS =============
  
  describe('Super Admin Full Access', () => {
    beforeEach(() => {
      cy.loginAsRole('super_admin');
    });

    it('TC-RBAC-SA-01: Should access all dashboard modules', () => {
      const allModules = [
        'dashboard', 'leads', 'demos', 'products', 'developers',
        'franchise', 'reseller', 'influencer', 'seo', 'tasks',
        'support', 'marketing', 'rnd', 'client-success',
        'performance', 'finance', 'legal', 'hr', 'settings'
      ];
      
      cy.checkRoleAccess(allModules);
    });

    it('TC-RBAC-SA-02: Should see all 21 KPI cards on dashboard', () => {
      cy.get('[data-testid="kpi-card"]').should('have.length', 21);
    });

    it('TC-RBAC-SA-03: Should access finance module', () => {
      cy.visit('/finance');
      cy.url().should('include', '/finance');
      cy.get('[data-testid="finance-dashboard"]').should('be.visible');
    });

    it('TC-RBAC-SA-04: Should access legal module', () => {
      cy.visit('/legal');
      cy.url().should('include', '/legal');
      cy.get('[data-testid="legal-dashboard"]').should('be.visible');
    });

    it('TC-RBAC-SA-05: Should override all permissions', () => {
      // Access any restricted resource
      cy.visit('/settings/permissions');
      cy.get('[data-testid="permission-matrix"]').should('be.visible');
    });
  });

  // ============= FRANCHISE ACCESS =============

  describe('Franchise Limited Access', () => {
    beforeEach(() => {
      cy.loginAsRole('franchise');
    });

    it('TC-RBAC-FR-01: Should only see franchise-specific modules', () => {
      const allowedModules = ['dashboard', 'leads', 'demos', 'reseller', 'support'];
      cy.checkRoleAccess(allowedModules);
    });

    it('TC-RBAC-FR-02: Should NOT access developer panel', () => {
      cy.visit('/developers');
      cy.url().should('not.include', '/developers');
      cy.get('[data-testid="access-denied"]').should('be.visible');
    });

    it('TC-RBAC-FR-03: Should NOT access finance module', () => {
      cy.visit('/finance');
      cy.url().should('not.include', '/finance');
      cy.get('[data-testid="access-denied"]').should('be.visible');
    });

    it('TC-RBAC-FR-04: Should only see own territory leads', () => {
      cy.visit('/leads');
      cy.get('[data-testid="lead-item"]').each(($lead) => {
        cy.wrap($lead).find('[data-testid="lead-region"]')
          .should('contain', 'Assigned Territory');
      });
    });

    it('TC-RBAC-FR-05: Should NOT modify pricing', () => {
      cy.visit('/demos');
      cy.get('[data-testid="demo-pricing"]').should('not.have.attr', 'contenteditable');
      cy.get('[data-testid="edit-pricing-button"]').should('not.exist');
    });
  });

  // ============= RESELLER ACCESS =============

  describe('Reseller Limited Access', () => {
    beforeEach(() => {
      cy.loginAsRole('reseller');
    });

    it('TC-RBAC-RS-01: Should only see reseller-specific modules', () => {
      const allowedModules = ['dashboard', 'demos', 'support'];
      cy.checkRoleAccess(allowedModules);
    });

    it('TC-RBAC-RS-02: Should NOT access admin panel', () => {
      cy.visit('/admin');
      cy.get('[data-testid="access-denied"]').should('be.visible');
    });

    it('TC-RBAC-RS-03: Should NOT modify demo pricing', () => {
      cy.visit('/demos');
      cy.get('[data-testid="demo-price"]').should('have.attr', 'readonly');
    });

    it('TC-RBAC-RS-04: Should see commission analytics', () => {
      cy.get('[data-testid="commission-panel"]').should('be.visible');
    });

    it('TC-RBAC-RS-05: Should generate tracking links', () => {
      cy.get('[data-testid="generate-link-button"]').click();
      cy.get('[data-testid="tracking-link"]').should('be.visible');
    });
  });

  // ============= DEVELOPER ACCESS =============

  describe('Developer Limited Access', () => {
    beforeEach(() => {
      cy.loginAsRole('developer');
    });

    it('TC-RBAC-DEV-01: Should only see developer-specific modules', () => {
      const allowedModules = ['dashboard', 'tasks', 'support'];
      cy.checkRoleAccess(allowedModules);
    });

    it('TC-RBAC-DEV-02: Should NOT see client identity', () => {
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"]').first().click();
      cy.get('[data-testid="client-info"]').should('contain', '***');
      cy.checkMasking('[data-testid="client-email"]', 'email');
    });

    it('TC-RBAC-DEV-03: Should NOT access finance', () => {
      cy.visit('/finance');
      cy.get('[data-testid="access-denied"]').should('be.visible');
    });

    it('TC-RBAC-DEV-04: Should see timer panel', () => {
      cy.get('[data-testid="timer-panel"]').should('be.visible');
    });

    it('TC-RBAC-DEV-05: Should see promise button', () => {
      cy.get('[data-testid="promise-button"]').should('be.visible');
    });
  });

  // ============= INFLUENCER ACCESS =============

  describe('Influencer Limited Access', () => {
    beforeEach(() => {
      cy.loginAsRole('influencer');
    });

    it('TC-RBAC-INF-01: Should only see influencer-specific modules', () => {
      const allowedModules = ['dashboard', 'support'];
      cy.checkRoleAccess(allowedModules);
    });

    it('TC-RBAC-INF-02: Should NOT access lead management', () => {
      cy.visit('/leads');
      cy.get('[data-testid="access-denied"]').should('be.visible');
    });

    it('TC-RBAC-INF-03: Should see click heatmap', () => {
      cy.get('[data-testid="click-heatmap"]').should('be.visible');
    });

    it('TC-RBAC-INF-04: Should see earnings panel', () => {
      cy.get('[data-testid="earnings-panel"]').should('be.visible');
    });
  });

  // ============= PRIME USER ACCESS =============

  describe('Prime User Access', () => {
    beforeEach(() => {
      cy.loginAsRole('prime');
    });

    it('TC-RBAC-PR-01: Should see priority support', () => {
      cy.get('[data-testid="priority-badge"]').should('be.visible');
    });

    it('TC-RBAC-PR-02: Should see fast-track option', () => {
      cy.get('[data-testid="fasttrack-button"]').should('be.visible');
    });

    it('TC-RBAC-PR-03: Should see SLA timer', () => {
      cy.get('[data-testid="sla-timer"]').should('be.visible');
    });

    it('TC-RBAC-PR-04: Should get priority in task queue', () => {
      cy.visit('/support/ticket/new');
      cy.get('[data-testid="priority-indicator"]').should('contain', 'HIGH');
    });
  });

  // ============= UNAUTHORIZED ACCESS ATTEMPTS =============

  describe('Unauthorized Access Prevention', () => {
    it('TC-RBAC-UNAUTH-01: Developer cannot access /admin via URL', () => {
      cy.loginAsRole('developer');
      cy.visit('/admin', { failOnStatusCode: false });
      cy.get('[data-testid="access-denied"]').should('be.visible');
    });

    it('TC-RBAC-UNAUTH-02: Reseller cannot access /finance via URL', () => {
      cy.loginAsRole('reseller');
      cy.visit('/finance', { failOnStatusCode: false });
      cy.get('[data-testid="access-denied"]').should('be.visible');
    });

    it('TC-RBAC-UNAUTH-03: Franchise cannot access /developers via URL', () => {
      cy.loginAsRole('franchise');
      cy.visit('/developers', { failOnStatusCode: false });
      cy.get('[data-testid="access-denied"]').should('be.visible');
    });

    it('TC-RBAC-UNAUTH-04: Influencer cannot access /legal via URL', () => {
      cy.loginAsRole('influencer');
      cy.visit('/legal', { failOnStatusCode: false });
      cy.get('[data-testid="access-denied"]').should('be.visible');
    });

    it('TC-RBAC-UNAUTH-05: API rejects unauthorized role access', () => {
      cy.loginAsRole('developer');
      cy.request({
        method: 'GET',
        url: `${Cypress.env('API_URL')}/api-finance/wallet`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });
  });
});
