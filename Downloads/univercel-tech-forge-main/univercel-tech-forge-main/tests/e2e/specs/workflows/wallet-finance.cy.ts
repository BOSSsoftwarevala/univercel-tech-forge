// ================================================================
// Software Vala - Wallet & Finance Automation Tests
// ================================================================

describe('Wallet & Finance Automation', () => {

  // ============= WALLET OPERATIONS =============

  describe('Wallet Credit Operations', () => {
    beforeEach(() => {
      cy.loginAsRole('finance_manager');
      cy.visit('/finance/wallets');
    });

    it('TC-WALLET-01: Should credit commission to wallet', () => {
      cy.get('[data-testid="select-user"]').select('reseller_1');
      cy.get('[data-testid="credit-amount"]').type('5000');
      cy.get('[data-testid="credit-reason"]').select('Commission');
      cy.get('[data-testid="credit-button"]').click();
      
      cy.get('[data-testid="success-toast"]').should('contain', 'credited');
      
      // Verify ledger entry
      cy.get('[data-testid="view-ledger"]').click();
      cy.get('[data-testid="ledger-entry"]').first()
        .should('contain', '5,000')
        .and('contain', 'Credit')
        .and('contain', 'Commission');
    });

    it('TC-WALLET-02: Should add balance to user wallet', () => {
      cy.get('[data-testid="select-user"]').select('developer_1');
      
      // Get initial balance
      cy.get('[data-testid="current-balance"]').invoke('text').as('initialBalance');
      
      cy.get('[data-testid="credit-amount"]').type('10000');
      cy.get('[data-testid="credit-reason"]').select('Task Payment');
      cy.get('[data-testid="credit-button"]').click();
      
      // Verify balance increased
      cy.get('@initialBalance').then((initial) => {
        const initialVal = parseFloat(String(initial).replace(/[₹,]/g, ''));
        cy.get('[data-testid="current-balance"]').invoke('text').then((newBalance) => {
          const newVal = parseFloat(newBalance.replace(/[₹,]/g, ''));
          expect(newVal).to.eq(initialVal + 10000);
        });
      });
    });
  });

  // ============= WALLET DEBIT OPERATIONS =============

  describe('Wallet Debit Operations', () => {
    beforeEach(() => {
      cy.loginAsRole('finance_manager');
      cy.visit('/finance/wallets');
    });

    it('TC-WALLET-03: Should debit from wallet successfully', () => {
      cy.get('[data-testid="select-user"]').select('developer_1');
      cy.get('[data-testid="debit-amount"]').type('1000');
      cy.get('[data-testid="debit-reason"]').select('Penalty');
      cy.get('[data-testid="debit-button"]').click();
      
      cy.get('[data-testid="success-toast"]').should('contain', 'debited');
    });

    it('TC-WALLET-04: Should block debit when insufficient balance', () => {
      cy.get('[data-testid="select-user"]').select('new_user');
      
      // Try to debit more than balance
      cy.get('[data-testid="current-balance"]').invoke('text').then((balance) => {
        const currentBalance = parseFloat(balance.replace(/[₹,]/g, ''));
        const debitAmount = currentBalance + 1000;
        
        cy.get('[data-testid="debit-amount"]').type(String(debitAmount));
        cy.get('[data-testid="debit-reason"]').select('Other');
        cy.get('[data-testid="debit-button"]').click();
        
        cy.get('[data-testid="error-toast"]')
          .should('contain', 'Insufficient balance');
      });
    });

    it('TC-WALLET-05: Should process refund correctly', () => {
      cy.get('[data-testid="refunds-tab"]').click();
      cy.get('[data-testid="pending-refund"]').first().click();
      
      cy.get('[data-testid="approve-refund"]').click();
      cy.get('[data-testid="confirm-refund"]').click();
      
      cy.get('[data-testid="success-toast"]').should('contain', 'Refund processed');
    });
  });

  // ============= DEVELOPER PAYOUT =============

  describe('Developer Payout Flow', () => {
    beforeEach(() => {
      cy.loginAsRole('developer');
    });

    it('TC-WALLET-06: Should request payout successfully', () => {
      cy.visit('/wallet');
      cy.get('[data-testid="request-payout"]').click();
      
      cy.get('[data-testid="payout-amount"]').type('5000');
      cy.get('[data-testid="payout-method"]').select('Bank Transfer');
      cy.get('[data-testid="submit-payout"]').click();
      
      cy.get('[data-testid="success-toast"]').should('contain', 'Payout requested');
    });

    it('TC-WALLET-07: Should show payout pending status', () => {
      cy.visit('/wallet');
      cy.get('[data-testid="request-payout"]').click();
      cy.get('[data-testid="payout-amount"]').type('3000');
      cy.get('[data-testid="submit-payout"]').click();
      
      cy.get('[data-testid="payout-status"]').should('contain', 'Pending Approval');
    });

    it('TC-WALLET-08: Should enforce minimum payout threshold', () => {
      cy.visit('/wallet');
      cy.get('[data-testid="request-payout"]').click();
      
      cy.get('[data-testid="payout-amount"]').type('100');
      cy.get('[data-testid="submit-payout"]').click();
      
      cy.get('[data-testid="error-toast"]').should('contain', 'Minimum payout');
    });
  });

  // ============= PAYOUT APPROVAL =============

  describe('Payout Approval Workflow', () => {
    beforeEach(() => {
      cy.loginAsRole('finance_manager');
      cy.visit('/finance/payouts');
    });

    it('TC-WALLET-09: Should approve payout request', () => {
      cy.get('[data-testid="pending-payout"]').first().click();
      cy.get('[data-testid="approve-payout"]').click();
      cy.get('[data-testid="confirm-approval"]').click();
      
      cy.get('[data-testid="success-toast"]').should('contain', 'approved');
    });

    it('TC-WALLET-10: Should reject payout with reason', () => {
      cy.get('[data-testid="pending-payout"]').first().click();
      cy.get('[data-testid="reject-payout"]').click();
      
      cy.get('[data-testid="rejection-reason"]').type('Insufficient documentation');
      cy.get('[data-testid="confirm-rejection"]').click();
      
      cy.get('[data-testid="success-toast"]').should('contain', 'rejected');
    });
  });

  // ============= INVOICE GENERATION =============

  describe('Invoice Generation', () => {
    beforeEach(() => {
      cy.loginAsRole('finance_manager');
      cy.visit('/finance/invoices');
    });

    it('TC-WALLET-11: Should generate monthly invoice', () => {
      cy.get('[data-testid="generate-invoice"]').click();
      cy.get('[data-testid="invoice-month"]').select('December 2024');
      cy.get('[data-testid="invoice-user"]').select('client_1');
      cy.get('[data-testid="create-invoice"]').click();
      
      cy.get('[data-testid="success-toast"]').should('contain', 'Invoice generated');
    });

    it('TC-WALLET-12: Should download invoice PDF', () => {
      cy.get('[data-testid="invoice-row"]').first().click();
      cy.get('[data-testid="download-pdf"]').click();
      
      // Verify PDF download initiated
      cy.readFile('cypress/downloads/invoice.pdf').should('exist');
    });

    it('TC-WALLET-13: Should send invoice via email', () => {
      cy.get('[data-testid="invoice-row"]').first().click();
      cy.get('[data-testid="send-email"]').click();
      
      cy.get('[data-testid="success-toast"]').should('contain', 'Invoice sent');
    });
  });

  // ============= LEDGER & AUDIT =============

  describe('Ledger & Audit Trail', () => {
    beforeEach(() => {
      cy.loginAsRole('finance_manager');
      cy.visit('/finance/ledger');
    });

    it('TC-WALLET-14: Should show double-entry ledger', () => {
      cy.get('[data-testid="ledger-table"]').should('be.visible');
      
      cy.get('[data-testid="ledger-entry"]').each(($entry) => {
        // Each entry should have debit and credit columns
        cy.wrap($entry).find('[data-testid="debit-amount"]').should('exist');
        cy.wrap($entry).find('[data-testid="credit-amount"]').should('exist');
      });
    });

    it('TC-WALLET-15: Should verify balance calculation', () => {
      let runningBalance = 0;
      
      cy.get('[data-testid="ledger-entry"]').each(($entry, index) => {
        const debit = parseFloat($entry.find('[data-testid="debit-amount"]').text().replace(/[₹,]/g, '') || '0');
        const credit = parseFloat($entry.find('[data-testid="credit-amount"]').text().replace(/[₹,]/g, '') || '0');
        runningBalance = runningBalance + credit - debit;
        
        const displayedBalance = parseFloat($entry.find('[data-testid="balance"]').text().replace(/[₹,]/g, ''));
        expect(displayedBalance).to.eq(runningBalance);
      });
    });

    it('TC-WALLET-16: Should not allow ledger modification', () => {
      cy.get('[data-testid="ledger-entry"]').first().click();
      
      cy.get('[data-testid="edit-entry"]').should('not.exist');
      cy.get('[data-testid="delete-entry"]').should('not.exist');
    });

    it('TC-WALLET-17: Should show complete audit trail', () => {
      cy.get('[data-testid="audit-tab"]').click();
      
      cy.get('[data-testid="audit-entry"]').each(($entry) => {
        cy.wrap($entry).find('[data-testid="audit-timestamp"]').should('be.visible');
        cy.wrap($entry).find('[data-testid="audit-user"]').should('be.visible');
        cy.wrap($entry).find('[data-testid="audit-action"]').should('be.visible');
      });
    });
  });

  // ============= COMMISSION CALCULATIONS =============

  describe('Commission Calculations', () => {
    it('TC-WALLET-18: Should calculate franchise commission correctly', () => {
      cy.loginAsRole('super_admin');
      cy.visit('/leads');
      
      // Close a lead won
      cy.get('[data-testid="lead-item"][data-franchise="franchise_1"]').first().click();
      cy.get('[data-testid="close-lead-button"]').click();
      cy.get('[data-testid="close-status"]').select('won');
      cy.get('[data-testid="deal-value"]').type('100000');
      cy.get('[data-testid="confirm-close"]').click();
      
      // Verify commission (15% default)
      cy.loginAsRole('franchise');
      cy.visit('/wallet');
      
      cy.get('[data-testid="transaction-list"] [data-testid="transaction"]').first()
        .should('contain', '15,000')
        .and('contain', 'Commission');
    });

    it('TC-WALLET-19: Should calculate reseller commission correctly', () => {
      cy.loginAsRole('super_admin');
      cy.visit('/leads');
      
      cy.get('[data-testid="lead-item"][data-reseller="reseller_1"]').first().click();
      cy.get('[data-testid="close-lead-button"]').click();
      cy.get('[data-testid="close-status"]').select('won');
      cy.get('[data-testid="deal-value"]').type('50000');
      cy.get('[data-testid="confirm-close"]').click();
      
      // Verify commission (10% default)
      cy.loginAsRole('reseller');
      cy.visit('/wallet');
      
      cy.get('[data-testid="transaction-list"] [data-testid="transaction"]').first()
        .should('contain', '5,000')
        .and('contain', 'Commission');
    });

    it('TC-WALLET-20: Should calculate influencer commission on conversion', () => {
      cy.loginAsRole('super_admin');
      cy.visit('/leads');
      
      cy.get('[data-testid="lead-item"][data-influencer="influencer_1"]').first().click();
      cy.get('[data-testid="close-lead-button"]').click();
      cy.get('[data-testid="close-status"]').select('won');
      cy.get('[data-testid="deal-value"]').type('25000');
      cy.get('[data-testid="confirm-close"]').click();
      
      // Verify commission
      cy.loginAsRole('influencer');
      cy.visit('/wallet');
      
      cy.get('[data-testid="transaction-list"] [data-testid="transaction"]').first()
        .should('contain', 'Commission');
    });
  });

  // ============= TAX CALCULATIONS =============

  describe('Tax Calculations', () => {
    beforeEach(() => {
      cy.loginAsRole('finance_manager');
      cy.visit('/finance/invoices');
    });

    it('TC-WALLET-21: Should apply GST correctly', () => {
      cy.get('[data-testid="generate-invoice"]').click();
      cy.get('[data-testid="invoice-amount"]').type('10000');
      cy.get('[data-testid="apply-gst"]').check();
      
      cy.get('[data-testid="gst-amount"]').should('contain', '1,800'); // 18%
      cy.get('[data-testid="total-amount"]').should('contain', '11,800');
    });

    it('TC-WALLET-22: Should apply TDS on developer payout', () => {
      cy.visit('/finance/payouts');
      cy.get('[data-testid="pending-payout"]').first().click();
      
      cy.get('[data-testid="payout-amount"]').invoke('text').then((amount) => {
        const payoutAmount = parseFloat(amount.replace(/[₹,]/g, ''));
        const expectedTDS = payoutAmount * 0.10; // 10% TDS
        
        cy.get('[data-testid="tds-amount"]').invoke('text').then((tds) => {
          const tdsAmount = parseFloat(tds.replace(/[₹,]/g, ''));
          expect(tdsAmount).to.eq(expectedTDS);
        });
      });
    });
  });
});
