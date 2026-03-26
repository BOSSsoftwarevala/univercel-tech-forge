/**
 * JWT Authentication System - Complete Auth Implementation
 * Role-based middleware with protected routes
 * Supports login, logout, registration, token refresh, and role-based access
 */

import { supabase } from '@/integrations/supabase/client';
import { useUnifiedSaaSStore } from '@/stores/unifiedSaaSStore';

// ============= JWT TOKEN TYPES =============
export interface JWTPayload {
  sub: string; // User ID
  email: string;
  role: string;
  permissions: string[];
  iat: number; // Issued at
  exp: number; // Expires at
  jti: string; // JWT ID
  sessionId: string;
  metadata?: Record<string, any>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: string;
  metadata?: Record<string, any>;
}

// ============= AUTHENTICATION ERRORS =============
export enum AuthError {
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_INACTIVE = 'USER_INACTIVE',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// ============= JWT AUTHENTICATION CLASS =============
export class JWTAuthSystem {
  private static instance: JWTAuthSystem;
  private tokenRefreshTimer: NodeJS.Timeout | null = null;
  private readonly TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry
  private readonly MAX_RETRY_ATTEMPTS = 3;

  private constructor() {
    this.initializeTokenRefresh();
  }

  static getInstance(): JWTAuthSystem {
    if (!JWTAuthSystem.instance) {
      JWTAuthSystem.instance = new JWTAuthSystem();
    }
    return JWTAuthSystem.instance;
  }

  // ============= TOKEN MANAGEMENT =============
  async login(email: string, password: string, rememberMe: boolean = false): Promise<{
    user: AuthUser;
    tokens: AuthTokens;
  }> {
    try {
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          expiresIn: rememberMe ? '30d' : '7d', // Extended session if remember me
        },
      });

      if (error) {
        throw new Error(AuthError.INVALID_CREDENTIALS);
      }

      if (!data.user || !data.session) {
        throw new Error(AuthError.USER_NOT_FOUND);
      }

      // Get user profile with role and permissions
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', data.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error(AuthError.USER_NOT_FOUND);
      }

      if (!profile.is_active) {
        throw new Error(AuthError.USER_INACTIVE);
      }

      // Create session record
      await this.createSession(profile.id, data.session.access_token, data.session.refresh_token);

      // Update last login
      await this.updateLastLogin(profile.id);

      // Store tokens
      const tokens: AuthTokens = {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token!,
        expiresAt: Date.now() + (data.session.expires_in * 1000),
      };

      const user: AuthUser = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        permissions: profile.permissions || [],
        avatar: profile.avatar_url,
        isActive: profile.is_active,
        lastLoginAt: new Date().toISOString(),
        metadata: profile.metadata,
      };

      // Store in local storage
      this.storeTokens(tokens);
      this.storeUser(user);

      // Start token refresh timer
      this.startTokenRefreshTimer(tokens);

      // Update global store
      useUnifiedSaaSStore.getState().login(user);

      return { user, tokens };
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || AuthError.UNKNOWN_ERROR);
    }
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
    metadata?: Record<string, any>;
  }): Promise<{
    user: AuthUser;
    tokens: AuthTokens;
  }> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'user',
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error(AuthError.USER_NOT_FOUND);
      }

      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert({
          auth_id: authData.user.id,
          email: userData.email,
          name: userData.name,
          role: userData.role || 'user',
          permissions: this.getDefaultPermissions(userData.role || 'user'),
          is_active: true,
          is_verified: false,
          metadata: userData.metadata || {},
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (profileError || !profile) {
        throw new Error('Failed to create user profile');
      }

      // Auto-login after registration
      return this.login(userData.email, userData.password);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || AuthError.UNKNOWN_ERROR);
    }
  }

  async logout(): Promise<void> {
    try {
      const tokens = this.getStoredTokens();
      
      if (tokens) {
        // Sign out from Supabase
        await supabase.auth.signOut();
        
        // Invalidate session in database
        await this.invalidateSession(tokens.accessToken);
      }

      // Clear local storage
      this.clearStoredData();
      
      // Stop token refresh timer
      this.stopTokenRefreshTimer();

      // Update global store
      useUnifiedSaaSStore.getState().logout();
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local data
      this.clearStoredData();
      useUnifiedSaaSStore.getState().logout();
    }
  }

  async refreshTokens(refreshToken?: string): Promise<AuthTokens> {
    try {
      const token = refreshToken || this.getStoredTokens()?.refreshToken;
      
      if (!token) {
        throw new Error(AuthError.TOKEN_EXPIRED);
      }

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: token,
      });

      if (error) {
        throw new Error(AuthError.TOKEN_EXPIRED);
      }

      if (!data.session) {
        throw new Error(AuthError.SESSION_EXPIRED);
      }

      const tokens: AuthTokens = {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token!,
        expiresAt: Date.now() + (data.session.expires_in * 1000),
      };

      // Update stored tokens
      this.storeTokens(tokens);
      
      // Restart refresh timer
      this.startTokenRefreshTimer(tokens);

      return tokens;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      throw new Error(error.message || AuthError.TOKEN_EXPIRED);
    }
  }

  // ============= TOKEN VALIDATION =============
  async validateToken(token?: string): Promise<JWTPayload | null> {
    try {
      const accessToken = token || this.getStoredTokens()?.accessToken;
      
      if (!accessToken) {
        return null;
      }

      // Get current session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return null;
      }

      // Parse JWT payload (simplified - in production, verify signature)
      const payload = this.parseJWT(session.access_token);
      
      return payload;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const payload = await this.validateToken();
      
      if (!payload) {
        return null;
      }

      // Get full user profile from database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', payload.sub)
        .single();

      if (error || !user || !user.is_active) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions || [],
        avatar: user.avatar_url,
        isActive: user.is_active,
        lastLoginAt: user.last_login_at,
        metadata: user.metadata,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // ============= ROLE-BASED AUTHORIZATION =============
  hasPermission(user: AuthUser, permission: string): boolean {
    return user.permissions.includes('*') || user.permissions.includes(permission);
  }

  hasRole(user: AuthUser, role: string): boolean {
    return user.role === role;
  }

  hasAnyRole(user: AuthUser, roles: string[]): boolean {
    return roles.includes(user.role);
  }

  canAccessResource(user: AuthUser, resource: string, action: string): boolean {
    const permission = `${resource}:${action}`;
    return this.hasPermission(user, permission) || this.hasPermission(user, '*');
  }

  // ============= MIDDLEWARE HELPERS =============
  createAuthMiddleware(requiredRole?: string, requiredPermissions?: string[]) {
    return async (req: any, res: any, next: any) => {
      try {
        const token = this.extractTokenFromRequest(req);
        
        if (!token) {
          return res.status(401).json({ error: AuthError.INVALID_TOKEN });
        }

        const payload = await this.validateToken(token);
        
        if (!payload) {
          return res.status(401).json({ error: AuthError.TOKEN_EXPIRED });
        }

        const user = await this.getCurrentUser();
        
        if (!user) {
          return res.status(401).json({ error: AuthError.USER_NOT_FOUND });
        }

        // Check role requirements
        if (requiredRole && !this.hasRole(user, requiredRole)) {
          return res.status(403).json({ error: AuthError.INSUFFICIENT_PERMISSIONS });
        }

        // Check permission requirements
        if (requiredPermissions) {
          const hasAllPermissions = requiredPermissions.every(permission => 
            this.hasPermission(user, permission)
          );
          
          if (!hasAllPermissions) {
            return res.status(403).json({ error: AuthError.INSUFFICIENT_PERMISSIONS });
          }
        }

        // Attach user to request
        req.user = user;
        req.token = token;
        
        next();
      } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ error: AuthError.UNKNOWN_ERROR });
      }
    };
  }

  // ============= TOKEN REFRESH MANAGEMENT =============
  private initializeTokenRefresh(): void {
    const tokens = this.getStoredTokens();
    
    if (tokens && tokens.expiresAt > Date.now()) {
      this.startTokenRefreshTimer(tokens);
    }
  }

  private startTokenRefreshTimer(tokens: AuthTokens): void {
    this.stopTokenRefreshTimer();
    
    const refreshDelay = Math.max(
      tokens.expiresAt - Date.now() - this.TOKEN_REFRESH_THRESHOLD,
      1000 // Minimum 1 second
    );

    this.tokenRefreshTimer = setTimeout(async () => {
      try {
        await this.refreshTokens();
      } catch (error) {
        console.error('Auto token refresh failed:', error);
        // Force logout on refresh failure
        await this.logout();
      }
    }, refreshDelay);
  }

  private stopTokenRefreshTimer(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }

  // ============= SESSION MANAGEMENT =============
  private async createSession(userId: string, accessToken: string, refreshToken: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          token_hash: this.hashToken(accessToken),
          refresh_token_hash: this.hashToken(refreshToken),
          device_info: this.getDeviceInfo(),
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          created_at: new Date().toISOString(),
          last_used_at: new Date().toISOString(),
          is_active: true,
        });

      if (error) {
        console.error('Failed to create session:', error);
      }
    } catch (error) {
      console.error('Session creation error:', error);
    }
  }

  private async invalidateSession(accessToken: string): Promise<void> {
    try {
      const tokenHash = this.hashToken(accessToken);
      
      const { error } = await supabase
        .from('user_sessions')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('token_hash', tokenHash);

      if (error) {
        console.error('Failed to invalidate session:', error);
      }
    } catch (error) {
      console.error('Session invalidation error:', error);
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          last_login_at: new Date().toISOString(),
          last_active_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Failed to update last login:', error);
      }
    } catch (error) {
      console.error('Update last login error:', error);
    }
  }

  // ============= UTILITY METHODS =============
  private parseJWT(token: string): JWTPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error(AuthError.INVALID_TOKEN);
    }
  }

  private hashToken(token: string): string {
    // Simple hash for demonstration - use proper crypto in production
    return btoa(token).slice(0, 255);
  }

  private extractTokenFromRequest(req: any): string | null {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    return req.cookies?.token || req.query?.token || null;
  }

  private getDeviceInfo(): Record<string, any> {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
      },
    };
  }

  private async getClientIP(): Promise<string> {
    try {
      // In production, you'd get this from your backend
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  private getDefaultPermissions(role: string): string[] {
    const permissions: Record<string, string[]> = {
      boss_owner: ['*'],
      ceo: ['read:*', 'write:analytics', 'write:reports', 'write:dashboard'],
      vala_ai: ['read:*', 'write:ai', 'write:automation'],
      manager: ['read:team', 'write:team', 'read:reports', 'write:reports'],
      user: ['read:profile', 'write:profile', 'read:dashboard'],
    };
    
    return permissions[role] || ['read:profile', 'write:profile'];
  }

  // ============= LOCAL STORAGE MANAGEMENT =============
  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  }

  private storeUser(user: AuthUser): void {
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  private getStoredTokens(): AuthTokens | null {
    try {
      const stored = localStorage.getItem('auth_tokens');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  private getStoredUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  private clearStoredData(): void {
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_user');
  }

  // ============= PUBLIC ACCESSORS =============
  public isAuthenticated(): boolean {
    const tokens = this.getStoredTokens();
    return tokens !== null && tokens.expiresAt > Date.now();
  }

  public getTokens(): AuthTokens | null {
    return this.getStoredTokens();
  }

  public getUser(): AuthUser | null {
    return this.getStoredUser();
  }

  public async initializeAuth(): Promise<AuthUser | null> {
    try {
      const tokens = this.getStoredTokens();
      
      if (!tokens || tokens.expiresAt <= Date.now()) {
        return null;
      }

      // Validate current session
      const user = await this.getCurrentUser();
      
      if (user) {
        // Start token refresh timer
        this.startTokenRefreshTimer(tokens);
        
        // Update global store
        useUnifiedSaaSStore.getState().login(user);
        
        return user;
      } else {
        // Clear invalid data
        this.clearStoredData();
        return null;
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.clearStoredData();
      return null;
    }
  }
}

// ============= AUTH HOOK =============
export const useJWTAuth = () => {
  const authSystem = JWTAuthSystem.getInstance();
  const store = useUnifiedSaaSStore();

  return {
    // Authentication methods
    login: authSystem.login.bind(authSystem),
    register: authSystem.register.bind(authSystem),
    logout: authSystem.logout.bind(authSystem),
    refreshTokens: authSystem.refreshTokens.bind(authSystem),
    
    // Authorization methods
    hasPermission: authSystem.hasPermission.bind(authSystem),
    hasRole: authSystem.hasRole.bind(authSystem),
    hasAnyRole: authSystem.hasAnyRole.bind(authSystem),
    canAccessResource: authSystem.canAccessResource.bind(authSystem),
    
    // State
    isAuthenticated: authSystem.isAuthenticated(),
    user: authSystem.getUser(),
    tokens: authSystem.getTokens(),
    
    // Store methods
    currentUser: store.currentUser,
    isAuthenticated: store.isAuthenticated,
    
    // Initialize auth on app start
    initialize: authSystem.initializeAuth.bind(authSystem),
  };
};

// ============= HIGHER-ORDER COMPONENTS =============
export interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole, 
  requiredPermissions, 
  fallback 
}) => {
  const { isAuthenticated, user, hasRole, hasPermission } = useJWTAuth();

  if (!isAuthenticated || !user) {
    return <>{fallback || <div>Please log in to access this page.</div>}</>;
  }

  if (requiredRole && !hasRole(user, requiredRole)) {
    return <>{fallback || <div>You don't have permission to access this page.</div>}</>;
  }

  if (requiredPermissions) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(user, permission)
    );
    
    if (!hasAllPermissions) {
      return <>{fallback || <div>You don't have the required permissions.</div>}</>;
    }
  }

  return <>{children}</>;
};

export default JWTAuthSystem;
