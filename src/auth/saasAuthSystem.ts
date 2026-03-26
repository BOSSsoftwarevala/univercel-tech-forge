/**
 * JWT Authentication System - Complete Implementation
 * Login, registration, logout, token refresh, role-based access control
 * Integration with Supabase for user management
 * Local storage for token persistence
 * Middleware helpers and React hooks
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useSaaSGlobalStore, type User } from '@/stores/saasGlobalStore';

// ============= AUTH CONFIGURATION =============
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

// Initialize Supabase client
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// JWT Token interface
export interface JWTTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp
}

// Auth user interface
export interface AuthUser extends User {
  tokens?: JWTTokens;
}

// Auth context interface
export interface AuthContext {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (userData: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<AuthResult>;
  updateProfile: (updates: Partial<User>) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<AuthResult>;
}

// Auth result interface
export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
  message?: string;
}

// Register data interface
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: string;
  metadata?: Record<string, any>;
}

// ============= JWT TOKEN MANAGER =============
export class JWTTokenManager {
  private static instance: JWTTokenManager;
  private readonly ACCESS_TOKEN_KEY = 'saas_access_token';
  private readonly REFRESH_TOKEN_KEY = 'saas_refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'saas_token_expiry';
  private readonly USER_KEY = 'saas_user';

  private constructor() {}

  static getInstance(): JWTTokenManager {
    if (!JWTTokenManager.instance) {
      JWTTokenManager.instance = new JWTTokenManager();
    }
    return JWTTokenManager.instance;
  }

  // Store tokens in localStorage
  setTokens(tokens: JWTTokens): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, tokens.expiresAt.toString());
  }

  // Get tokens from localStorage
  getTokens(): JWTTokens | null {
    const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    const expiresAt = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (!accessToken || !refreshToken || !expiresAt) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      expiresAt: parseInt(expiresAt, 10),
    };
  }

  // Clear tokens from localStorage
  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Check if access token is expired
  isAccessTokenExpired(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return true;

    return Date.now() >= tokens.expiresAt * 1000;
  }

  // Get access token
  getAccessToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.accessToken || null;
  }

  // Get refresh token
  getRefreshToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.refreshToken || null;
  }

  // Store user data
  setUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Get user data
  getUser(): AuthUser | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  }

  // Clear user data
  clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const tokens = this.getTokens();
    const user = this.getUser();

    return !!(tokens && user && !this.isAccessTokenExpired());
  }

  // Get authorization header
  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// ============= AUTHENTICATION SERVICE =============
export class AuthenticationService {
  private static instance: AuthenticationService;
  private tokenManager: JWTTokenManager;
  private supabase: SupabaseClient;

  private constructor() {
    this.tokenManager = JWTTokenManager.getInstance();
    this.supabase = supabase;
  }

  static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  // Login with email and password
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Get user profile with role
      const { data: profile, error: profileError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        return {
          success: false,
          error: profileError.message,
        };
      }

      // Create user object
      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name || data.user.user_metadata?.name || 'User',
        role: profile?.role || 'user_dashboard',
        permissions: profile?.permissions || [],
        createdAt: data.user.created_at,
        lastLoginAt: new Date().toISOString(),
        isActive: profile?.is_active ?? true,
        metadata: profile?.metadata || {},
        franchiseId: profile?.franchise_id,
        resellerId: profile?.reseller_id,
        continent: profile?.continent,
        country: profile?.country,
      };

      // Create tokens
      const tokens: JWTTokens = {
        accessToken: data.session?.access_token || '',
        refreshToken: data.session?.refresh_token || '',
        expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      };

      // Store tokens and user
      this.tokenManager.setTokens(tokens);
      this.tokenManager.setUser({ ...user, tokens });

      // Update last login in database
      await this.updateLastLogin(user.id);

      return {
        success: true,
        user: { ...user, tokens },
        message: 'Login successful',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  }

  // Register new user
  async register(userData: RegisterData): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'user_dashboard',
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Create user profile in database
      const { error: profileError } = await this.supabase
        .from('users')
        .insert({
          id: data.user!.id,
          email: userData.email,
          name: userData.name,
          role: userData.role || 'user_dashboard',
          permissions: [],
          is_active: true,
          metadata: userData.metadata || {},
        });

      if (profileError) {
        return {
          success: false,
          error: profileError.message,
        };
      }

      // Create user object
      const user: AuthUser = {
        id: data.user!.id,
        email: userData.email,
        name: userData.name,
        role: userData.role as any || 'user_dashboard',
        permissions: [],
        createdAt: data.user!.created_at,
        lastLoginAt: new Date().toISOString(),
        isActive: true,
        metadata: userData.metadata || {},
      };

      // Create tokens (if email confirmation is not required)
      let tokens: JWTTokens | undefined;
      if (data.session) {
        tokens = {
          accessToken: data.session.access_token || '',
          refreshToken: data.session.refresh_token || '',
          expiresAt: Math.floor(Date.now() / 1000) + 3600,
        };
        this.tokenManager.setTokens(tokens);
        this.tokenManager.setUser({ ...user, tokens });
      }

      return {
        success: true,
        user: tokens ? { ...user, tokens } : user,
        message: data.session ? 'Registration successful' : 'Registration successful. Please check your email to verify your account.',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await this.supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.tokenManager.clearTokens();
      this.tokenManager.clearUser();
    }
  }

  // Refresh access token
  async refreshToken(): Promise<AuthResult> {
    try {
      const refreshToken = this.tokenManager.getRefreshToken();
      if (!refreshToken) {
        return {
          success: false,
          error: 'No refresh token available',
        };
      }

      const { data, error } = await this.supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        // Clear invalid tokens
        this.tokenManager.clearTokens();
        this.tokenManager.clearUser();
        return {
          success: false,
          error: error.message,
        };
      }

      // Get current user
      const currentUser = this.tokenManager.getUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'No user session found',
        };
      }

      // Update tokens
      const tokens: JWTTokens = {
        accessToken: data.session?.access_token || '',
        refreshToken: data.session?.refresh_token || '',
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
      };

      this.tokenManager.setTokens(tokens);
      this.tokenManager.setUser({ ...currentUser, tokens });

      return {
        success: true,
        user: { ...currentUser, tokens },
        message: 'Token refreshed successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Token refresh failed',
      };
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<AuthResult> {
    try {
      const currentUser = this.tokenManager.getUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'No user session found',
        };
      }

      const { data, error } = await this.supabase
        .from('users')
        .update({
          name: updates.name,
          role: updates.role,
          permissions: updates.permissions,
          is_active: updates.isActive,
          metadata: updates.metadata,
          franchise_id: updates.franchiseId,
          reseller_id: updates.resellerId,
          continent: updates.continent,
          country: updates.country,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentUser.id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      const updatedUser: AuthUser = {
        ...currentUser,
        ...data,
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        permissions: data.permissions,
        isActive: data.is_active,
        metadata: data.metadata,
        franchiseId: data.franchise_id,
        resellerId: data.reseller_id,
        continent: data.continent,
        country: data.country,
      };

      this.tokenManager.setUser(updatedUser);

      return {
        success: true,
        user: updatedUser,
        message: 'Profile updated successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Profile update failed',
      };
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<AuthResult> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        message: 'Password reset email sent',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password reset failed',
      };
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResult> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password change failed',
      };
    }
  }

  // Update last login timestamp
  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Failed to update last login:', error);
    }
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    return this.tokenManager.getUser();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.tokenManager.isAuthenticated();
  }

  // Get auth headers
  getAuthHeaders(): { Authorization: string } | {} {
    return this.tokenManager.getAuthHeader();
  }
}

// ============= AUTHENTICATION MIDDLEWARE =============
export class AuthMiddleware {
  private static instance: AuthMiddleware;
  private authService: AuthenticationService;

  private constructor() {
    this.authService = AuthenticationService.getInstance();
  }

  static getInstance(): AuthMiddleware {
    if (!AuthMiddleware.instance) {
      AuthMiddleware.instance = new AuthMiddleware();
    }
    return AuthMiddleware.instance;
  }

  // Check if user has required role
  hasRole(user: AuthUser | null, requiredRoles: string | string[]): boolean {
    if (!user) return false;

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(user.role);
  }

  // Check if user has required permissions
  hasPermission(user: AuthUser | null, requiredPermissions: string | string[]): boolean {
    if (!user) return false;

    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    return permissions.every(permission => user.permissions.includes(permission));
  }

  // Check if user can access resource
  canAccess(user: AuthUser | null, resource: string, action: 'read' | 'write' | 'delete'): boolean {
    if (!user) return false;

    // Boss panel has access to everything
    if (user.role === 'boss_panel') return true;

    // Check role-based access rules
    const roleAccessMap: Record<string, Record<string, string[]>> = {
      ceo_dashboard: {
        read: ['analytics', 'finance', 'marketing', 'sales', 'users'],
        write: ['reports', 'analytics'],
        delete: [],
      },
      lead_manager: {
        read: ['leads', 'campaigns', 'sales'],
        write: ['leads', 'lead_assignments'],
        delete: ['old_leads'],
      },
      sales_manager: {
        read: ['sales', 'leads', 'payments', 'commissions'],
        write: ['sales', 'assignments'],
        delete: ['lost_deals'],
      },
      customer_support: {
        read: ['tickets', 'users', 'licenses', 'usage_logs'],
        write: ['tickets', 'user_responses'],
        delete: ['resolved_tickets'],
      },
      user_dashboard: {
        read: ['own_profile', 'own_licenses', 'own_usage', 'support_tickets'],
        write: ['own_profile', 'support_tickets'],
        delete: [],
      },
      // Add more role access mappings as needed
    };

    const userAccess = roleAccessMap[user.role];
    if (!userAccess) return false;

    return userAccess[action]?.includes(resource) || false;
  }

  // Middleware function for API calls
  async requireAuth(): Promise<AuthUser | null> {
    const user = this.authService.getCurrentUser();
    
    if (!user || !this.authService.isAuthenticated()) {
      // Try to refresh token
      const refreshResult = await this.authService.refreshToken();
      if (!refreshResult.success) {
        return null;
      }
      return refreshResult.user || null;
    }

    return user;
  }

  // Middleware function for role-based access
  async requireRole(requiredRoles: string | string[]): Promise<AuthUser | null> {
    const user = await this.requireAuth();
    
    if (!user || !this.hasRole(user, requiredRoles)) {
      return null;
    }

    return user;
  }

  // Middleware function for permission-based access
  async requirePermission(requiredPermissions: string | string[]): Promise<AuthUser | null> {
    const user = await this.requireAuth();
    
    if (!user || !this.hasPermission(user, requiredPermissions)) {
      return null;
    }

    return user;
  }

  // Middleware function for resource access
  async requireResourceAccess(resource: string, action: 'read' | 'write' | 'delete'): Promise<AuthUser | null> {
    const user = await this.requireAuth();
    
    if (!user || !this.canAccess(user, resource, action)) {
      return null;
    }

    return user;
  }
}

// ============= REACT HOOKS =============
export const useAuth = (): AuthContext => {
  const authService = AuthenticationService.getInstance();
  const authMiddleware = AuthMiddleware.getInstance();
  const store = useSaaSGlobalStore();

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const result = await authService.login(email, password);
    
    if (result.success && result.user) {
      // Update global store
      store.setCurrentUser(result.user);
      store.setActiveRole(result.user.role);
    }
    
    return result;
  };

  const register = async (userData: RegisterData): Promise<AuthResult> => {
    const result = await authService.register(userData);
    
    if (result.success && result.user) {
      // Update global store
      store.setCurrentUser(result.user);
      store.setActiveRole(result.user.role);
    }
    
    return result;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    // Clear global store
    store.setCurrentUser(null);
    store.setActiveRole(null);
  };

  const refreshToken = async (): Promise<AuthResult> => {
    const result = await authService.refreshToken();
    
    if (result.success && result.user) {
      // Update global store
      store.setCurrentUser(result.user);
      store.setActiveRole(result.user.role);
    }
    
    return result;
  };

  const updateProfile = async (updates: Partial<User>): Promise<AuthResult> => {
    const result = await authService.updateProfile(updates);
    
    if (result.success && result.user) {
      // Update global store
      store.setCurrentUser(result.user);
      store.setActiveRole(result.user.role);
    }
    
    return result;
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {
    return await authService.resetPassword(email);
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<AuthResult> => {
    return await authService.changePassword(currentPassword, newPassword);
  };

  // Get current user from store or token manager
  const user = store.currentUser || authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();
  const isLoading = false; // Could be updated based on loading state

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    resetPassword,
    changePassword,
  };
};

// Hook for role-based access
export const useRoleAccess = () => {
  const authMiddleware = AuthMiddleware.getInstance();
  const { user } = useAuth();

  return {
    hasRole: (requiredRoles: string | string[]) => authMiddleware.hasRole(user, requiredRoles),
    hasPermission: (requiredPermissions: string | string[]) => authMiddleware.hasPermission(user, requiredPermissions),
    canAccess: (resource: string, action: 'read' | 'write' | 'delete') => authMiddleware.canAccess(user, resource, action),
    requireAuth: () => authMiddleware.requireAuth(),
    requireRole: (requiredRoles: string | string[]) => authMiddleware.requireRole(requiredRoles),
    requirePermission: (requiredPermissions: string | string[]) => authMiddleware.requirePermission(requiredPermissions),
    requireResourceAccess: (resource: string, action: 'read' | 'write' | 'delete') => authMiddleware.requireResourceAccess(resource, action),
  };
};

// ============= EXPORTS =============
export const authService = AuthenticationService.getInstance();
export const authMiddleware = AuthMiddleware.getInstance();
export const tokenManager = JWTTokenManager.getInstance();

export default {
  useAuth,
  useRoleAccess,
  authService,
  authMiddleware,
  tokenManager,
};
