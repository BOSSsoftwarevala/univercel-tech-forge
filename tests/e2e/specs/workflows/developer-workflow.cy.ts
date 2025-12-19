// ================================================================
// Software Vala - Developer Workflow Automation Tests
// ================================================================

describe('Developer Workflow Automation', () => {
  beforeEach(() => {
    cy.loginAsRole('developer');
  });

  // ============= TASK ASSIGNMENT =============

  describe('Task Assignment Flow', () => {
    it('TC-DEV-TASK-01: Should receive task assignment notification', () => {
      // Wait for buzzer/notification
      cy.get('[data-testid="notification-bell"]').click();
      cy.get('[data-testid="notification-item"]')
        .first()
        .should('contain', 'New task assigned');
    });

    it('TC-DEV-TASK-02: Should display task details correctly', () => {
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"]').first().click();
      
      cy.get('[data-testid="task-title"]').should('be.visible');
      cy.get('[data-testid="task-description"]').should('be.visible');
      cy.get('[data-testid="task-deadline"]').should('be.visible');
      cy.get('[data-testid="task-priority"]').should('be.visible');
    });

    it('TC-DEV-TASK-03: Should show masked client info', () => {
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"]').first().click();
      
      cy.get('[data-testid="client-name"]').should('contain', '***');
      cy.checkMasking('[data-testid="client-email"]', 'email');
    });
  });

  // ============= PROMISE BUTTON WORKFLOW =============

  describe('Promise Button & Timer Workflow', () => {
    it('TC-DEV-PROMISE-01: Should see promise button for pending task', () => {
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"][data-status="pending"]').first().click();
      cy.get('[data-testid="promise-button"]').should('be.visible');
    });

    it('TC-DEV-PROMISE-02: Should show promise acceptance modal', () => {
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"][data-status="pending"]').first().click();
      cy.get('[data-testid="promise-button"]').click();
      
      cy.get('[data-testid="promise-modal"]').should('be.visible');
      cy.get('[data-testid="promise-time-input"]').should('be.visible');
      cy.get('[data-testid="promise-agree-checkbox"]').should('be.visible');
    });

    it('TC-DEV-PROMISE-03: Should require time estimate before accepting', () => {
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"][data-status="pending"]').first().click();
      cy.get('[data-testid="promise-button"]').click();
      
      cy.get('[data-testid="promise-agree-checkbox"]').check();
      cy.get('[data-testid="promise-submit"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'time estimate required');
    });

    it('TC-DEV-PROMISE-04: Should accept promise and start timer', () => {
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"][data-status="pending"]').first().click();
      cy.get('[data-testid="promise-button"]').click();
      
      cy.get('[data-testid="promise-time-input"]').type('2');
      cy.get('[data-testid="promise-agree-checkbox"]').check();
      cy.get('[data-testid="promise-submit"]').click();
      
      cy.get('[data-testid="timer-panel"]').should('be.visible');
      cy.get('[data-testid="timer-running"]').should('exist');
    });

    it('TC-DEV-PROMISE-05: Timer should NOT start without promise acceptance', () => {
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"][data-status="pending"]').first().click();
      
      cy.get('[data-testid="start-timer-button"]').should('be.disabled');
    });
  });

  // ============= TIMER CONTROLS =============

  describe('Timer Controls', () => {
    beforeEach(() => {
      // Start a task with promise
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"][data-status="in_progress"]').first().click();
    });

    it('TC-DEV-TIMER-01: Should pause timer with reason', () => {
      cy.get('[data-testid="pause-timer-button"]').click();
      cy.get('[data-testid="pause-reason-modal"]').should('be.visible');
      cy.get('[data-testid="pause-reason-input"]').type('Taking a short break');
      cy.get('[data-testid="pause-confirm"]').click();
      
      cy.get('[data-testid="timer-paused"]').should('exist');
    });

    it('TC-DEV-TIMER-02: Should resume timer after pause', () => {
      cy.get('[data-testid="pause-timer-button"]').click();
      cy.get('[data-testid="pause-reason-input"]').type('Break');
      cy.get('[data-testid="pause-confirm"]').click();
      
      cy.get('[data-testid="resume-timer-button"]').click();
      cy.get('[data-testid="timer-running"]').should('exist');
    });

    it('TC-DEV-TIMER-03: Should track total pause time', () => {
      cy.get('[data-testid="pause-timer-button"]').click();
      cy.get('[data-testid="pause-reason-input"]').type('Break');
      cy.get('[data-testid="pause-confirm"]').click();
      
      cy.wait(5000); // Wait 5 seconds
      
      cy.get('[data-testid="resume-timer-button"]').click();
      cy.get('[data-testid="total-pause-time"]').should('not.contain', '0:00');
    });

    it('TC-DEV-TIMER-04: Should limit pause count', () => {
      // Pause 3 times (max allowed)
      for (let i = 0; i < 3; i++) {
        cy.get('[data-testid="pause-timer-button"]').click();
        cy.get('[data-testid="pause-reason-input"]').type(`Pause ${i + 1}`);
        cy.get('[data-testid="pause-confirm"]').click();
        cy.get('[data-testid="resume-timer-button"]').click();
      }
      
      // 4th pause should be denied
      cy.get('[data-testid="pause-timer-button"]').click();
      cy.get('[data-testid="error-message"]').should('contain', 'pause limit reached');
    });
  });

  // ============= CODE DELIVERY =============

  describe('Code Delivery Flow', () => {
    it('TC-DEV-DELIVER-01: Should submit code delivery', () => {
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"][data-status="in_progress"]').first().click();
      
      cy.get('[data-testid="deliver-button"]').click();
      cy.get('[data-testid="delivery-modal"]').should('be.visible');
      
      cy.get('[data-testid="delivery-notes"]').type('Task completed as per requirements');
      cy.get('[data-testid="delivery-submit"]').click();
      
      cy.get('[data-testid="success-toast"]').should('contain', 'delivered');
    });

    it('TC-DEV-DELIVER-02: Should stop timer on delivery', () => {
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"][data-status="in_progress"]').first().click();
      
      cy.get('[data-testid="timer-running"]').should('exist');
      cy.get('[data-testid="deliver-button"]').click();
      cy.get('[data-testid="delivery-notes"]').type('Completed');
      cy.get('[data-testid="delivery-submit"]').click();
      
      cy.get('[data-testid="timer-stopped"]').should('exist');
    });

    it('TC-DEV-DELIVER-03: Should require delivery before stopping timer', () => {
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"][data-status="in_progress"]').first().click();
      
      cy.get('[data-testid="stop-timer-button"]').click();
      cy.get('[data-testid="error-message"]').should('contain', 'submit delivery first');
    });
  });

  // ============= LATE DELIVERY PENALTY =============

  describe('Late Delivery & Penalty', () => {
    it('TC-DEV-PENALTY-01: Should show penalty warning when deadline approaching', () => {
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"][data-deadline-warning="true"]').first().click();
      
      cy.get('[data-testid="deadline-warning"]')
        .should('be.visible')
        .and('contain', 'approaching deadline');
    });

    it('TC-DEV-PENALTY-02: Should calculate penalty for late delivery', () => {
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"][data-status="overdue"]').first().click();
      
      cy.get('[data-testid="penalty-indicator"]').should('be.visible');
      cy.get('[data-testid="penalty-amount"]').should('not.contain', '₹0');
    });

    it('TC-DEV-PENALTY-03: Should deduct penalty from wallet', () => {
      // Get initial balance
      cy.get('[data-testid="wallet-balance"]').invoke('text').as('initialBalance');
      
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"][data-status="overdue"]').first().click();
      cy.get('[data-testid="deliver-button"]').click();
      cy.get('[data-testid="delivery-notes"]').type('Late delivery');
      cy.get('[data-testid="delivery-submit"]').click();
      
      // Check balance reduced
      cy.get('@initialBalance').then((initial) => {
        cy.get('[data-testid="wallet-balance"]').invoke('text').then((newBalance) => {
          expect(parseFloat(newBalance.replace(/[₹,]/g, '')))
            .to.be.lessThan(parseFloat(String(initial).replace(/[₹,]/g, '')));
        });
      });
    });
  });

  // ============= ESCALATION =============

  describe('Escalation Flow', () => {
    it('TC-DEV-ESC-01: Should trigger escalation on overdue task', () => {
      cy.intercept('GET', '**/api-developer/tasks/*', (req) => {
        // Mock overdue task
        req.reply({
          statusCode: 200,
          body: {
            id: 'test-task',
            status: 'in_progress',
            deadline: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            escalation_level: 1
          }
        });
      });
      
      cy.visit('/tasks/test-task');
      cy.get('[data-testid="escalation-indicator"]').should('be.visible');
    });

    it('TC-DEV-ESC-02: Should show escalation chain', () => {
      cy.visit('/tasks');
      cy.get('[data-testid="task-item"][data-escalated="true"]').first().click();
      
      cy.get('[data-testid="escalation-timeline"]').should('be.visible');
      cy.get('[data-testid="escalation-level"]').should('exist');
    });
  });

  // ============= PERFORMANCE =============

  describe('Performance Dashboard', () => {
    it('TC-DEV-PERF-01: Should display performance metrics', () => {
      cy.visit('/developer/performance');
      
      cy.get('[data-testid="performance-score"]').should('be.visible');
      cy.get('[data-testid="delivery-rate"]').should('be.visible');
      cy.get('[data-testid="on-time-rate"]').should('be.visible');
    });

    it('TC-DEV-PERF-02: Should show task history', () => {
      cy.visit('/developer/performance');
      
      cy.get('[data-testid="task-history-table"]').should('be.visible');
      cy.get('[data-testid="task-history-row"]').should('have.length.at.least', 1);
    });
  });
});
