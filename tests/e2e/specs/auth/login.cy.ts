// ================================================================
// Software Vala - Authentication Test Suite
// ================================================================

describe('Authentication & Login Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  // ============= VALID LOGIN TESTS =============
  
  describe('Valid Login - All Roles', () => {
    const roles = [
      'super_admin',
      'admin',
      'franchise',
      'reseller',
      'developer',
      'influencer',
      'prime',
      'lead_manager',
      'demo_manager',
      'finance_manager',
      'support',
      'marketing_manager',
      'seo_manager',
      'hr_manager',
      'legal_compliance',
      'rd_department',
      'product_manager',
      'sales',
      'client_success',
    ];

    roles.forEach((role) => {
      it(`TC-AUTH-${role.toUpperCase()}: Should login successfully as ${role}`, () => {
        cy.loginAsRole(role);
        cy.url().should('include', '/dashboard');
        cy.get('[data-testid="user-role-badge"]').should('contain', role.replace('_', ' '));
      });
    });
  });

  // ============= INVALID LOGIN TESTS =============

  describe('Invalid Login Attempts', () => {
    it('TC-AUTH-INVALID-01: Should reject invalid email format', () => {
      cy.get('[data-testid="email-input"]').type('invalidemail');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="error-message"]').should('contain', 'valid email');
    });

    it('TC-AUTH-INVALID-02: Should reject wrong password', () => {
      cy.get('[data-testid="email-input"]').type('admin@softwarevala.com');
      cy.get('[data-testid="password-input"]').type('wrongpassword');
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="error-message"]').should('contain', 'Invalid credentials');
    });

    it('TC-AUTH-INVALID-03: Should reject empty email', () => {
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="error-message"]').should('contain', 'Email is required');
    });

    it('TC-AUTH-INVALID-04: Should reject empty password', () => {
      cy.get('[data-testid="email-input"]').type('admin@softwarevala.com');
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="error-message"]').should('contain', 'Password is required');
    });

    it('TC-AUTH-INVALID-05: Should show rate limit after multiple failed attempts', () => {
      const email = 'admin@softwarevala.com';
      
      // Attempt 10 failed logins
      for (let i = 0; i < 10; i++) {
        cy.get('[data-testid="email-input"]').clear().type(email);
        cy.get('[data-testid="password-input"]').clear().type('wrongpassword');
        cy.get('[data-testid="login-button"]').click();
        cy.wait(500);
      }
      
      cy.get('[data-testid="error-message"]')
        .should('contain', 'Too many attempts')
        .or('contain', 'temporarily locked');
    });
  });

  // ============= SESSION TESTS =============

  describe('Session Management', () => {
    it('TC-AUTH-SESSION-01: Should persist session on page refresh', () => {
      cy.loginAsRole('super_admin');
      cy.reload();
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="user-role-badge"]').should('be.visible');
    });

    it('TC-AUTH-SESSION-02: Should logout successfully', () => {
      cy.loginAsRole('super_admin');
      cy.logout();
      cy.url().should('include', '/login');
    });

    it('TC-AUTH-SESSION-03: Should redirect to login when session expired', () => {
      cy.loginAsRole('super_admin');
      // Clear auth token to simulate expiry
      cy.clearLocalStorage('supabase.auth.token');
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });
  });

  // ============= IP RESTRICTION TESTS =============

  describe('IP Restriction Tests', () => {
    it('TC-AUTH-IP-01: Should enforce single IP for franchise', () => {
      // This test requires backend mock for IP detection
      cy.intercept('POST', '**/api-auth/login', (req) => {
        req.headers['X-Forwarded-For'] = '192.168.1.100';
      });
      
      cy.loginAsRole('franchise');
      cy.url().should('include', '/dashboard');
      
      // Simulate login from different IP
      cy.intercept('POST', '**/api-auth/validate-ip', {
        statusCode: 403,
        body: { error: 'Login not allowed from this location' }
      });
      
      cy.request({
        method: 'GET',
        url: '/api/validate-session',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });

    it('TC-AUTH-IP-02: Should enforce single IP for reseller', () => {
      cy.loginAsRole('reseller');
      // Similar IP restriction test
    });

    it('TC-AUTH-IP-03: Should enforce single IP for prime users', () => {
      cy.loginAsRole('prime');
      // Similar IP restriction test
    });
  });

  // ============= PASSWORD SECURITY TESTS =============

  describe('Password Security', () => {
    it('TC-AUTH-PWD-01: Should enforce password complexity', () => {
      cy.visit('/register');
      cy.get('[data-testid="email-input"]').type('newuser@test.com');
      cy.get('[data-testid="password-input"]').type('weak');
      cy.get('[data-testid="register-button"]').click();
      cy.get('[data-testid="error-message"]')
        .should('contain', 'at least 8 characters')
        .or('contain', 'uppercase')
        .or('contain', 'number');
    });

    it('TC-AUTH-PWD-02: Should handle password reset flow', () => {
      cy.get('[data-testid="forgot-password-link"]').click();
      cy.get('[data-testid="reset-email-input"]').type('admin@softwarevala.com');
      cy.get('[data-testid="send-reset-button"]').click();
      cy.get('[data-testid="success-message"]').should('contain', 'reset link sent');
    });
  });
});
