// ================================================================
// Software Vala - Buzzer & Notification Automation Tests
// ================================================================

describe('Buzzer & Notification System', () => {

  // ============= BUZZER TRIGGERS =============

  describe('Buzzer Trigger Events', () => {
    beforeEach(() => {
      cy.loginAsRole('super_admin');
    });

    it('TC-BUZZ-01: Should trigger buzzer on new lead', () => {
      cy.visit('/leads');
      cy.get('[data-testid="create-lead-button"]').click();
      
      cy.get('[data-testid="lead-name"]').type('Buzzer Test Lead');
      cy.get('[data-testid="lead-email"]').type('buzzer@test.com');
      cy.get('[data-testid="lead-phone"]').type('+91-9876543213');
      cy.get('[data-testid="submit-lead"]').click();
      
      cy.get('[data-testid="buzzer-icon"]')
        .should('be.visible')
        .and('have.class', 'pulse-animation');
    });

    it('TC-BUZZ-02: Should trigger buzzer on task assignment', () => {
      cy.visit('/tasks');
      cy.get('[data-testid="create-task-button"]').click();
      
      cy.get('[data-testid="task-title"]').type('Urgent Task');
      cy.get('[data-testid="task-priority"]').select('urgent');
      cy.get('[data-testid="task-developer"]').select('developer_1');
      cy.get('[data-testid="submit-task"]').click();
      
      // Login as developer to check buzzer
      cy.logout();
      cy.loginAsRole('developer');
      
      cy.get('[data-testid="buzzer-icon"]').should('have.class', 'pulse-animation');
    });

    it('TC-BUZZ-03: Should trigger buzzer on demo failure', () => {
      // Mock demo health check failure
      cy.intercept('GET', '**/api-demo/health/*', {
        statusCode: 200,
        body: { status: 'down', response_time: null }
      });
      
      cy.visit('/demos');
      
      cy.get('[data-testid="buzzer-icon"]')
        .should('have.class', 'pulse-animation');
      
      cy.get('[data-testid="notification-bell"]').click();
      cy.get('[data-testid="notification-item"]')
        .should('contain', 'Demo is down');
    });

    it('TC-BUZZ-04: Should trigger buzzer on wallet low balance', () => {
      // Mock low balance response
      cy.intercept('GET', '**/api-wallet/balance', {
        statusCode: 200,
        body: { balance: 500, threshold: 1000 }
      });
      
      cy.visit('/dashboard');
      
      cy.get('[data-testid="buzzer-icon"]').should('have.class', 'pulse-animation');
      cy.get('[data-testid="notification-item"]')
        .should('contain', 'Low balance');
    });

    it('TC-BUZZ-05: Should trigger buzzer when promise not accepted', () => {
      // Create task for developer
      cy.visit('/tasks');
      cy.get('[data-testid="create-task-button"]').click();
      cy.get('[data-testid="task-title"]').type('Promise Test');
      cy.get('[data-testid="task-developer"]').select('developer_1');
      cy.get('[data-testid="submit-task"]').click();
      
      // Wait 5+ minutes (simulated)
      cy.clock();
      cy.tick(6 * 60 * 1000);
      
      cy.get('[data-testid="buzzer-icon"]').should('have.class', 'pulse-animation');
    });
  });

  // ============= BUZZER BEHAVIOR =============

  describe('Buzzer Behavior', () => {
    beforeEach(() => {
      cy.loginAsRole('super_admin');
    });

    it('TC-BUZZ-BEH-01: Buzzer should appear in header only', () => {
      cy.visit('/dashboard');
      
      // Create event to trigger buzzer
      cy.window().then((win) => {
        win.dispatchEvent(new CustomEvent('buzzer:trigger', {
          detail: { type: 'lead.new', priority: 'high' }
        }));
      });
      
      cy.get('[data-testid="global-header"] [data-testid="buzzer-icon"]')
        .should('be.visible');
      
      // Should NOT appear elsewhere
      cy.get('[data-testid="sidebar"] [data-testid="buzzer-icon"]')
        .should('not.exist');
    });

    it('TC-BUZZ-BEH-02: Buzzer should continue until acknowledged', () => {
      cy.visit('/dashboard');
      
      // Trigger buzzer
      cy.window().then((win) => {
        win.dispatchEvent(new CustomEvent('buzzer:trigger', {
          detail: { type: 'task.overdue', priority: 'urgent' }
        }));
      });
      
      // Wait and verify still pulsing
      cy.wait(10000);
      cy.get('[data-testid="buzzer-icon"]').should('have.class', 'pulse-animation');
      
      // Acknowledge
      cy.get('[data-testid="buzzer-icon"]').click();
      cy.get('[data-testid="acknowledge-buzzer"]').click();
      
      cy.get('[data-testid="buzzer-icon"]').should('not.have.class', 'pulse-animation');
    });

    it('TC-BUZZ-BEH-03: Should queue multiple buzzers', () => {
      cy.visit('/dashboard');
      
      // Trigger multiple buzzers
      for (let i = 0; i < 3; i++) {
        cy.window().then((win) => {
          win.dispatchEvent(new CustomEvent('buzzer:trigger', {
            detail: { type: `event_${i}`, priority: 'high' }
          }));
        });
      }
      
      cy.get('[data-testid="buzzer-count"]').should('contain', '3');
    });

    it('TC-BUZZ-BEH-04: Should show urgent buzzers first', () => {
      cy.visit('/dashboard');
      
      // Trigger normal buzzer
      cy.window().then((win) => {
        win.dispatchEvent(new CustomEvent('buzzer:trigger', {
          detail: { type: 'normal', priority: 'normal' }
        }));
      });
      
      // Trigger urgent buzzer
      cy.window().then((win) => {
        win.dispatchEvent(new CustomEvent('buzzer:trigger', {
          detail: { type: 'urgent', priority: 'urgent' }
        }));
      });
      
      cy.get('[data-testid="buzzer-icon"]').click();
      cy.get('[data-testid="buzzer-item"]').first()
        .should('have.attr', 'data-priority', 'urgent');
    });
  });

  // ============= BUZZER ESCALATION =============

  describe('Buzzer Escalation Chain', () => {
    it('TC-BUZZ-ESC-01: Should escalate to team lead after 5 min', () => {
      cy.loginAsRole('super_admin');
      cy.visit('/tasks');
      
      // Create urgent task
      cy.get('[data-testid="create-task-button"]').click();
      cy.get('[data-testid="task-title"]').type('Escalation Test');
      cy.get('[data-testid="task-priority"]').select('urgent');
      cy.get('[data-testid="submit-task"]').click();
      
      // Fast-forward time
      cy.clock();
      cy.tick(6 * 60 * 1000);
      
      cy.get('[data-testid="buzzer-item"]').first()
        .should('contain', 'Escalated to Team Lead');
    });

    it('TC-BUZZ-ESC-02: Should escalate to manager after 30 min', () => {
      cy.loginAsRole('super_admin');
      
      cy.clock();
      cy.visit('/tasks');
      
      // Trigger and ignore buzzer
      cy.tick(31 * 60 * 1000);
      
      cy.get('[data-testid="buzzer-item"]').first()
        .should('contain', 'Escalated to Manager');
    });

    it('TC-BUZZ-ESC-03: Should escalate to super admin after 2 hrs', () => {
      cy.loginAsRole('admin');
      
      cy.clock();
      cy.visit('/dashboard');
      
      // Trigger and ignore buzzer
      cy.tick(121 * 60 * 1000);
      
      cy.get('[data-testid="buzzer-item"]').first()
        .should('contain', 'Escalated to Super Admin');
    });
  });

  // ============= NOTIFICATION SYSTEM =============

  describe('Notification Display', () => {
    beforeEach(() => {
      cy.loginAsRole('super_admin');
      cy.visit('/dashboard');
    });

    it('TC-NOTIF-01: Should display notification in header only', () => {
      // Trigger notification
      cy.window().then((win) => {
        win.dispatchEvent(new CustomEvent('notification:new', {
          detail: { message: 'New lead created', type: 'info' }
        }));
      });
      
      cy.get('[data-testid="global-header"] [data-testid="notification-bell"]')
        .should('be.visible');
      
      // Should NOT show modal popup
      cy.get('[data-testid="notification-modal"]').should('not.exist');
    });

    it('TC-NOTIF-02: Should show notification count badge', () => {
      // Trigger multiple notifications
      for (let i = 0; i < 5; i++) {
        cy.window().then((win) => {
          win.dispatchEvent(new CustomEvent('notification:new', {
            detail: { message: `Notification ${i}`, type: 'info' }
          }));
        });
      }
      
      cy.get('[data-testid="notification-count"]').should('contain', '5');
    });

    it('TC-NOTIF-03: Should mark notification as read on click', () => {
      cy.get('[data-testid="notification-bell"]').click();
      cy.get('[data-testid="notification-item"]').first().click();
      
      cy.get('[data-testid="notification-item"]').first()
        .should('have.class', 'read');
    });

    it('TC-NOTIF-04: Should show notification history', () => {
      cy.get('[data-testid="notification-bell"]').click();
      cy.get('[data-testid="view-all-notifications"]').click();
      
      cy.url().should('include', '/notifications');
      cy.get('[data-testid="notification-list"]').should('be.visible');
    });

    it('TC-NOTIF-05: No intrusive popups during developer work', () => {
      cy.loginAsRole('developer');
      cy.visit('/tasks');
      
      // Trigger notification while working
      cy.window().then((win) => {
        win.dispatchEvent(new CustomEvent('notification:new', {
          detail: { message: 'New notification', type: 'info' }
        }));
      });
      
      // Should NOT show modal
      cy.get('[data-testid="notification-modal"]').should('not.exist');
      cy.get('.modal-overlay').should('not.exist');
      
      // Only header indicator
      cy.get('[data-testid="notification-bell"]').should('have.class', 'has-new');
    });
  });

  // ============= POPUP PREMIUM TONE =============

  describe('Premium Tone Popups', () => {
    beforeEach(() => {
      cy.loginAsRole('super_admin');
      cy.visit('/dashboard');
    });

    it('TC-POPUP-01: Error messages should be professional', () => {
      cy.intercept('GET', '**/api-leads', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      });
      
      cy.visit('/leads');
      
      cy.get('[data-testid="error-message"]')
        .should('not.contain', 'crash')
        .and('not.contain', 'fail')
        .and('contain', 'temporarily unavailable')
        .or('contain', 'please try again');
    });

    it('TC-POPUP-02: Success messages should be professional', () => {
      cy.visit('/leads');
      cy.get('[data-testid="create-lead-button"]').click();
      cy.get('[data-testid="lead-name"]').type('Test');
      cy.get('[data-testid="lead-email"]').type('test@test.com');
      cy.get('[data-testid="lead-phone"]').type('+91-9876543214');
      cy.get('[data-testid="submit-lead"]').click();
      
      cy.get('[data-testid="success-toast"]')
        .should('contain', 'successfully')
        .and('have.class', 'premium-toast');
    });

    it('TC-POPUP-03: Confirmation dialogs should be professional', () => {
      cy.visit('/leads');
      cy.get('[data-testid="lead-item"]').first().click();
      cy.get('[data-testid="delete-lead-button"]').click();
      
      cy.get('[data-testid="confirm-dialog"]')
        .should('contain', 'Are you sure')
        .and('have.class', 'premium-dialog');
      
      cy.get('[data-testid="confirm-dialog"]')
        .should('not.contain', 'Warning!')
        .and('not.contain', 'Danger!');
    });
  });
});
