// ================================================================
// Software Vala - Lead Workflow Automation Tests
// ================================================================

describe('Lead Workflow Automation', () => {
  
  // ============= LEAD CREATION =============

  describe('Lead Creation Flow', () => {
    beforeEach(() => {
      cy.loginAsRole('lead_manager');
      cy.visit('/leads');
    });

    it('TC-LEAD-CREATE-01: Should create new lead successfully', () => {
      cy.get('[data-testid="create-lead-button"]').click();
      
      cy.get('[data-testid="lead-form"]').within(() => {
        cy.get('[data-testid="lead-name"]').type('Test Lead Company');
        cy.get('[data-testid="lead-email"]').type('test@company.com');
        cy.get('[data-testid="lead-phone"]').type('+91-9876543210');
        cy.get('[data-testid="lead-industry"]').select('Technology');
        cy.get('[data-testid="lead-source"]').select('Website');
        cy.get('[data-testid="lead-value"]').type('50000');
        cy.get('[data-testid="submit-lead"]').click();
      });
      
      cy.get('[data-testid="success-toast"]').should('contain', 'Lead created');
    });

    it('TC-LEAD-CREATE-02: Should validate required fields', () => {
      cy.get('[data-testid="create-lead-button"]').click();
      cy.get('[data-testid="submit-lead"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'required');
    });

    it('TC-LEAD-CREATE-03: Should detect duplicate leads', () => {
      cy.get('[data-testid="create-lead-button"]').click();
      
      cy.get('[data-testid="lead-email"]').type('existing@company.com');
      cy.get('[data-testid="lead-phone"]').type('+91-9876543210');
      cy.get('[data-testid="submit-lead"]').click();
      
      cy.get('[data-testid="duplicate-warning"]').should('be.visible');
    });

    it('TC-LEAD-CREATE-04: Should trigger buzzer on new lead', () => {
      cy.get('[data-testid="create-lead-button"]').click();
      
      cy.get('[data-testid="lead-form"]').within(() => {
        cy.get('[data-testid="lead-name"]').type('Urgent Lead');
        cy.get('[data-testid="lead-email"]').type('urgent@company.com');
        cy.get('[data-testid="lead-phone"]').type('+91-9876543211');
        cy.get('[data-testid="submit-lead"]').click();
      });
      
      // Check buzzer triggered
      cy.get('[data-testid="buzzer-alert"]').should('be.visible');
    });
  });

  // ============= LEAD ASSIGNMENT =============

  describe('Lead Assignment Flow', () => {
    beforeEach(() => {
      cy.loginAsRole('super_admin');
      cy.visit('/leads');
    });

    it('TC-LEAD-ASSIGN-01: Should assign lead to sales team', () => {
      cy.get('[data-testid="lead-item"][data-status="new"]').first().click();
      cy.get('[data-testid="assign-button"]').click();
      
      cy.get('[data-testid="assignee-select"]').select('sales_team');
      cy.get('[data-testid="confirm-assign"]').click();
      
      cy.get('[data-testid="success-toast"]').should('contain', 'assigned');
    });

    it('TC-LEAD-ASSIGN-02: Should route lead by region', () => {
      cy.get('[data-testid="lead-item"][data-region="Mumbai"]').first().click();
      cy.get('[data-testid="assign-button"]').click();
      
      // Should show Mumbai team members
      cy.get('[data-testid="assignee-select"] option')
        .should('contain', 'Mumbai Team');
    });

    it('TC-LEAD-ASSIGN-03: Should trigger buzzer if unassigned for 120s', () => {
      // Create unassigned lead
      cy.get('[data-testid="create-lead-button"]').click();
      cy.get('[data-testid="lead-name"]').type('Unassigned Test');
      cy.get('[data-testid="lead-email"]').type('unassigned@test.com');
      cy.get('[data-testid="lead-phone"]').type('+91-9876543212');
      cy.get('[data-testid="submit-lead"]').click();
      
      // Wait for 120 seconds
      cy.wait(121000);
      
      // Check escalation buzzer
      cy.get('[data-testid="buzzer-alert"]')
        .should('be.visible')
        .and('contain', 'unassigned');
    });
  });

  // ============= LEAD PIPELINE =============

  describe('Lead Pipeline Flow', () => {
    beforeEach(() => {
      cy.loginAsRole('lead_manager');
      cy.visit('/leads/pipeline');
    });

    it('TC-LEAD-PIPE-01: Should display all pipeline stages', () => {
      const stages = ['New', 'Qualified', 'In Progress', 'Negotiation', 'Closed'];
      
      stages.forEach((stage) => {
        cy.get('[data-testid="pipeline-stage"]').should('contain', stage);
      });
    });

    it('TC-LEAD-PIPE-02: Should drag lead between stages', () => {
      const dataTransfer = new DataTransfer();
      
      cy.get('[data-testid="lead-card"][data-stage="new"]').first()
        .trigger('dragstart', { dataTransfer });
      
      cy.get('[data-testid="pipeline-stage"][data-stage="qualified"]')
        .trigger('drop', { dataTransfer });
      
      cy.get('[data-testid="lead-card"][data-stage="qualified"]')
        .should('have.length.at.least', 1);
    });

    it('TC-LEAD-PIPE-03: Should update lead status on stage change', () => {
      cy.get('[data-testid="lead-card"][data-stage="new"]').first().then(($card) => {
        const leadId = $card.data('lead-id');
        
        // Move to qualified
        const dataTransfer = new DataTransfer();
        cy.wrap($card).trigger('dragstart', { dataTransfer });
        cy.get('[data-testid="pipeline-stage"][data-stage="qualified"]')
          .trigger('drop', { dataTransfer });
        
        // Verify status update
        cy.request(`${Cypress.env('API_URL')}/api-leads/${leadId}`).then((response) => {
          expect(response.body.status).to.eq('qualified');
        });
      });
    });
  });

  // ============= LEAD MASKING =============

  describe('Lead Masking Validation', () => {
    it('TC-LEAD-MASK-01: Franchise should see masked lead contact', () => {
      cy.loginAsRole('franchise');
      cy.visit('/leads');
      
      cy.get('[data-testid="lead-item"]').first().click();
      cy.checkMasking('[data-testid="lead-email"]', 'email');
      cy.checkMasking('[data-testid="lead-phone"]', 'phone');
    });

    it('TC-LEAD-MASK-02: Reseller should see masked lead contact', () => {
      cy.loginAsRole('reseller');
      cy.visit('/leads');
      
      cy.get('[data-testid="lead-item"]').first().click();
      cy.checkMasking('[data-testid="lead-email"]', 'email');
      cy.checkMasking('[data-testid="lead-phone"]', 'phone');
    });

    it('TC-LEAD-MASK-03: Developer should see fully masked client info', () => {
      cy.loginAsRole('developer');
      cy.visit('/tasks');
      
      cy.get('[data-testid="task-item"]').first().click();
      cy.get('[data-testid="client-info"]')
        .should('contain', '***')
        .and('not.contain', '@');
    });

    it('TC-LEAD-MASK-04: Super admin can view unmasked (with audit)', () => {
      cy.loginAsRole('super_admin');
      cy.visit('/leads');
      
      cy.get('[data-testid="lead-item"]').first().click();
      cy.get('[data-testid="reveal-contact-button"]').click();
      
      cy.get('[data-testid="confirm-reveal-modal"]').should('be.visible');
      cy.get('[data-testid="reveal-reason"]').type('Customer requested callback');
      cy.get('[data-testid="confirm-reveal"]').click();
      
      cy.get('[data-testid="lead-email"]').should('contain', '@');
    });
  });

  // ============= LEAD ESCALATION =============

  describe('Lead Escalation Flow', () => {
    beforeEach(() => {
      cy.loginAsRole('lead_manager');
      cy.visit('/leads');
    });

    it('TC-LEAD-ESC-01: Should escalate stale lead', () => {
      cy.get('[data-testid="lead-item"][data-stale="true"]').first().click();
      cy.get('[data-testid="escalate-button"]').click();
      
      cy.get('[data-testid="escalation-reason"]').type('No response for 48 hours');
      cy.get('[data-testid="confirm-escalate"]').click();
      
      cy.get('[data-testid="success-toast"]').should('contain', 'escalated');
    });

    it('TC-LEAD-ESC-02: Should notify super admin on escalation', () => {
      cy.get('[data-testid="lead-item"]').first().click();
      cy.get('[data-testid="escalate-button"]').click();
      cy.get('[data-testid="escalation-reason"]').type('Urgent escalation');
      cy.get('[data-testid="confirm-escalate"]').click();
      
      // Login as super admin to check notification
      cy.logout();
      cy.loginAsRole('super_admin');
      
      cy.get('[data-testid="notification-bell"]').click();
      cy.get('[data-testid="notification-item"]')
        .should('contain', 'Lead escalated');
    });
  });

  // ============= LEAD CLOSURE =============

  describe('Lead Closure Flow', () => {
    beforeEach(() => {
      cy.loginAsRole('sales');
      cy.visit('/leads');
    });

    it('TC-LEAD-CLOSE-01: Should close lead as won', () => {
      cy.get('[data-testid="lead-item"][data-stage="negotiation"]').first().click();
      cy.get('[data-testid="close-lead-button"]').click();
      
      cy.get('[data-testid="close-status"]').select('won');
      cy.get('[data-testid="deal-value"]').type('100000');
      cy.get('[data-testid="confirm-close"]').click();
      
      cy.get('[data-testid="success-toast"]').should('contain', 'closed');
    });

    it('TC-LEAD-CLOSE-02: Should update commission on closure', () => {
      cy.get('[data-testid="lead-item"][data-stage="negotiation"]').first().click();
      
      // Get current commission
      cy.get('[data-testid="wallet-balance"]').invoke('text').as('beforeBalance');
      
      cy.get('[data-testid="close-lead-button"]').click();
      cy.get('[data-testid="close-status"]').select('won');
      cy.get('[data-testid="deal-value"]').type('100000');
      cy.get('[data-testid="confirm-close"]').click();
      
      // Check commission credited
      cy.wait(2000);
      cy.get('@beforeBalance').then((before) => {
        cy.get('[data-testid="wallet-balance"]').invoke('text').then((after) => {
          const beforeVal = parseFloat(String(before).replace(/[₹,]/g, ''));
          const afterVal = parseFloat(after.replace(/[₹,]/g, ''));
          expect(afterVal).to.be.greaterThan(beforeVal);
        });
      });
    });

    it('TC-LEAD-CLOSE-03: Should close lead as lost with reason', () => {
      cy.get('[data-testid="lead-item"][data-stage="negotiation"]').first().click();
      cy.get('[data-testid="close-lead-button"]').click();
      
      cy.get('[data-testid="close-status"]').select('lost');
      cy.get('[data-testid="lost-reason"]').select('Budget constraints');
      cy.get('[data-testid="confirm-close"]').click();
      
      cy.get('[data-testid="lead-status-badge"]').should('contain', 'Lost');
    });
  });

  // ============= LEAD CHAT =============

  describe('Lead Chat (Masked)', () => {
    beforeEach(() => {
      cy.loginAsRole('franchise');
      cy.visit('/leads');
    });

    it('TC-LEAD-CHAT-01: Should open masked chat', () => {
      cy.get('[data-testid="lead-item"]').first().click();
      cy.get('[data-testid="chat-button"]').click();
      
      cy.get('[data-testid="chat-panel"]').should('be.visible');
      cy.get('[data-testid="sender-name"]').should('contain', '***');
    });

    it('TC-LEAD-CHAT-02: Should send message successfully', () => {
      cy.get('[data-testid="lead-item"]').first().click();
      cy.get('[data-testid="chat-button"]').click();
      
      cy.get('[data-testid="chat-input"]').type('Hello, I am interested in your services');
      cy.get('[data-testid="send-message"]').click();
      
      cy.get('[data-testid="chat-message"]').last()
        .should('contain', 'interested in your services');
    });

    it('TC-LEAD-CHAT-03: Should block contact info in chat', () => {
      cy.get('[data-testid="lead-item"]').first().click();
      cy.get('[data-testid="chat-button"]').click();
      
      cy.get('[data-testid="chat-input"]').type('Call me at 9876543210');
      cy.get('[data-testid="send-message"]').click();
      
      cy.get('[data-testid="warning-toast"]')
        .should('contain', 'contact information not allowed');
    });
  });
});
