/**
 * Unified SaaS API - Complete Backend Structure
 * Node.js + Express (simulated via Supabase client)
 * REST APIs for all modules: auth, users, leads, sales, payments, licenses, support, analytics, notifications
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useSaaSGlobalStore, type User, type Lead, type Sale, type Payment, type License, type UsageLog, type SupportTicket, type Analytics, type Notification } from '@/stores/saasGlobalStore';

// ============= API CONFIGURATION =============
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

// Initialize Supabase client
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============= API RESPONSE TYPES =============
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ============= API CLIENT CLASS =============
export class UnifiedSaaSClient {
  private static instance: UnifiedSaaSClient;
  private supabase: SupabaseClient;

  private constructor() {
    this.supabase = supabase;
  }

  static getInstance(): UnifiedSaaSClient {
    if (!UnifiedSaaSClient.instance) {
      UnifiedSaaSClient.instance = new UnifiedSaaSClient();
    }
    return UnifiedSaaSClient.instance;
  }

  // ============= AUTHENTICATION APIS =============
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user profile with role
      const { data: profile } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const user: User = {
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

      const token = data.session?.access_token || '';

      return {
        success: true,
        data: { user, token },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
    metadata?: Record<string, any>;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
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

      if (error) throw error;

      // Create user profile
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

      if (profileError) throw profileError;

      const user: User = {
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

      const token = data.session?.access_token || '';

      return {
        success: true,
        data: { user, token },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      await this.supabase.auth.signOut();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Logout failed',
      };
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      const { data, error } = await this.supabase.auth.refreshSession();
      
      if (error) throw error;

      return {
        success: true,
        data: { token: data.session?.access_token || '' },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Token refresh failed',
      };
    }
  }

  // ============= USER MANAGEMENT APIS =============
  async getUsers(filters?: {
    role?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<User>> {
    try {
      let query = this.supabase
        .from('users')
        .select('*', { count: 'exact' });

      if (filters?.role) {
        query = query.eq('role', filters.role);
      }

      if (filters?.status) {
        query = query.eq('is_active', filters.status === 'active');
      }

      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data as User[],
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch users',
      };
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
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
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as User,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update user',
      };
    }
  }

  // ============= LEAD MANAGEMENT APIS =============
  async getLeads(filters?: {
    status?: string;
    source?: string;
    assignedTo?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Lead>> {
    try {
      let query = this.supabase
        .from('leads')
        .select('*', { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.source) {
        query = query.eq('source', filters.source);
      }

      if (filters?.assignedTo) {
        query = query.eq('assigned_to', filters.assignedTo);
      }

      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data as Lead[],
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch leads',
      };
    }
  }

  async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Lead>> {
    try {
      const { data, error } = await this.supabase
        .from('leads')
        .insert({
          ...leadData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Lead,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create lead',
      };
    }
  }

  async updateLead(leadId: string, updates: Partial<Lead>): Promise<ApiResponse<Lead>> {
    try {
      const { data, error } = await this.supabase
        .from('leads')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', leadId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Lead,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update lead',
      };
    }
  }

  // ============= SALES MANAGEMENT APIS =============
  async getSales(filters?: {
    status?: string;
    salesManagerId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Sale>> {
    try {
      let query = this.supabase
        .from('sales')
        .select('*', { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.salesManagerId) {
        query = query.eq('sales_manager_id', filters.salesManagerId);
      }

      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data as Sale[],
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch sales',
      };
    }
  }

  async createSale(saleData: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Sale>> {
    try {
      const { data, error } = await this.supabase
        .from('sales')
        .insert({
          ...saleData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Sale,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create sale',
      };
    }
  }

  // ============= PAYMENT MANAGEMENT APIS =============
  async getPayments(filters?: {
    status?: string;
    saleId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Payment>> {
    try {
      let query = this.supabase
        .from('payments')
        .select('*', { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.saleId) {
        query = query.eq('sale_id', filters.saleId);
      }

      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data as Payment[],
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch payments',
      };
    }
  }

  async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt'>): Promise<ApiResponse<Payment>> {
    try {
      const { data, error } = await this.supabase
        .from('payments')
        .insert({
          ...paymentData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Payment,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create payment',
      };
    }
  }

  // ============= LICENSE MANAGEMENT APIS =============
  async getLicenses(filters?: {
    userId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<License>> {
    try {
      let query = this.supabase
        .from('licenses')
        .select('*', { count: 'exact' });

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data as License[],
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch licenses',
      };
    }
  }

  async createLicense(licenseData: Omit<License, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<License>> {
    try {
      const { data, error } = await this.supabase
        .from('licenses')
        .insert({
          ...licenseData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as License,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create license',
      };
    }
  }

  // ============= SUPPORT TICKET APIS =============
  async getSupportTickets(filters?: {
    userId?: string;
    status?: string;
    priority?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<SupportTicket>> {
    try {
      let query = this.supabase
        .from('support_tickets')
        .select('*', { count: 'exact' });

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }

      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data as SupportTicket[],
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch support tickets',
      };
    }
  }

  async createSupportTicket(ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<SupportTicket>> {
    try {
      const { data, error } = await this.supabase
        .from('support_tickets')
        .insert({
          ...ticketData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as SupportTicket,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create support ticket',
      };
    }
  }

  // ============= ANALYTICS APIS =============
  async getAnalytics(filters?: {
    module?: string;
    metric?: string;
    period?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Analytics>> {
    try {
      let query = this.supabase
        .from('analytics')
        .select('*', { count: 'exact' });

      if (filters?.module) {
        query = query.eq('module', filters.module);
      }

      if (filters?.metric) {
        query = query.eq('metric', filters.metric);
      }

      if (filters?.period) {
        query = query.eq('period', filters.period);
      }

      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .range(from, to)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data as Analytics[],
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch analytics',
      };
    }
  }

  async createAnalytics(analyticsData: Omit<Analytics, 'id' | 'timestamp'>): Promise<ApiResponse<Analytics>> {
    try {
      const { data, error } = await this.supabase
        .from('analytics')
        .insert({
          ...analyticsData,
          timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Analytics,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create analytics record',
      };
    }
  }

  // ============= NOTIFICATION APIS =============
  async getNotifications(userId: string, filters?: {
    isRead?: boolean;
    type?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Notification>> {
    try {
      let query = this.supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      if (filters?.isRead !== undefined) {
        query = query.eq('is_read', filters.isRead);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data as Notification[],
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch notifications',
      };
    }
  }

  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<ApiResponse<Notification>> {
    try {
      const { data, error } = await this.supabase
        .from('notifications')
        .insert({
          ...notificationData,
          created_at: new Date().toISOString(),
          is_read: false,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Notification,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create notification',
      };
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to mark notification as read',
      };
    }
  }

  // ============= USAGE LOGS APIS =============
  async getUsageLogs(filters?: {
    userId?: string;
    licenseId?: string;
    action?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<UsageLog>> {
    try {
      let query = this.supabase
        .from('usage_logs')
        .select('*', { count: 'exact' });

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters?.licenseId) {
        query = query.eq('license_id', filters.licenseId);
      }

      if (filters?.action) {
        query = query.eq('action', filters.action);
      }

      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .range(from, to)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data as UsageLog[],
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch usage logs',
      };
    }
  }

  async createUsageLog(logData: Omit<UsageLog, 'id' | 'timestamp'>): Promise<ApiResponse<UsageLog>> {
    try {
      const { data, error } = await this.supabase
        .from('usage_logs')
        .insert({
          ...logData,
          timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as UsageLog,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create usage log',
      };
    }
  }

  // ============= UTILITY METHODS =============
  async getDashboardStats(role: string): Promise<ApiResponse<Record<string, any>>> {
    try {
      const stats: Record<string, any> = {};

      // Get role-specific statistics
      switch (role) {
        case 'boss_panel':
          const [
            { count: totalUsers },
            { count: totalLeads },
            { count: totalSales },
            { count: totalRevenue },
          ] = await Promise.all([
            this.supabase.from('users').select('*', { count: 'exact', head: true }),
            this.supabase.from('leads').select('*', { count: 'exact', head: true }),
            this.supabase.from('sales').select('*', { count: 'exact', head: true }),
            this.supabase.from('payments').select('amount', { count: 'exact', head: true }).eq('status', 'completed'),
          ]);

          stats.totalUsers = totalUsers || 0;
          stats.totalLeads = totalLeads || 0;
          stats.totalSales = totalSales || 0;
          stats.totalRevenue = totalRevenue || 0;
          break;

        case 'lead_manager':
          const [
            { count: newLeads },
            { count: qualifiedLeads },
            { count: convertedLeads },
          ] = await Promise.all([
            this.supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
            this.supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'qualified'),
            this.supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'converted'),
          ]);

          stats.newLeads = newLeads || 0;
          stats.qualifiedLeads = qualifiedLeads || 0;
          stats.convertedLeads = convertedLeads || 0;
          break;

        case 'sales_manager':
          const [
            { count: activeSales },
            { count: completedSales },
            { count: salesRevenue },
          ] = await Promise.all([
            this.supabase.from('sales').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
            this.supabase.from('sales').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
            this.supabase.from('sales').select('amount', { count: 'exact', head: true }).eq('status', 'completed'),
          ]);

          stats.activeSales = activeSales || 0;
          stats.completedSales = completedSales || 0;
          stats.salesRevenue = salesRevenue || 0;
          break;

        // Add more role-specific stats as needed
      }

      return {
        success: true,
        data: stats,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch dashboard stats',
      };
    }
  }

  // ============= REAL-TIME SUBSCRIPTIONS =============
  subscribeToTable(tableName: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`${tableName}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: tableName }, 
        callback
      )
      .subscribe();
  }

  subscribeToUserNotifications(userId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`user_notifications_${userId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();
  }

  unsubscribe(channel: any) {
    this.supabase.removeChannel(channel);
  }
}

// ============= API CLIENT INSTANCE =============
export const apiClient = UnifiedSaaSClient.getInstance();

// ============= API HOOKS =============
export const useUnifiedAPI = () => {
  const store = useSaaSGlobalStore();

  return {
    // Authentication
    login: apiClient.login.bind(apiClient),
    register: apiClient.register.bind(apiClient),
    logout: apiClient.logout.bind(apiClient),
    refreshToken: apiClient.refreshToken.bind(apiClient),

    // Users
    getUsers: apiClient.getUsers.bind(apiClient),
    updateUser: apiClient.updateUser.bind(apiClient),

    // Leads
    getLeads: apiClient.getLeads.bind(apiClient),
    createLead: apiClient.createLead.bind(apiClient),
    updateLead: apiClient.updateLead.bind(apiClient),

    // Sales
    getSales: apiClient.getSales.bind(apiClient),
    createSale: apiClient.createSale.bind(apiClient),

    // Payments
    getPayments: apiClient.getPayments.bind(apiClient),
    createPayment: apiClient.createPayment.bind(apiClient),

    // Licenses
    getLicenses: apiClient.getLicenses.bind(apiClient),
    createLicense: apiClient.createLicense.bind(apiClient),

    // Support
    getSupportTickets: apiClient.getSupportTickets.bind(apiClient),
    createSupportTicket: apiClient.createSupportTicket.bind(apiClient),

    // Analytics
    getAnalytics: apiClient.getAnalytics.bind(apiClient),
    createAnalytics: apiClient.createAnalytics.bind(apiClient),

    // Notifications
    getNotifications: apiClient.getNotifications.bind(apiClient),
    createNotification: apiClient.createNotification.bind(apiClient),
    markNotificationAsRead: apiClient.markNotificationAsRead.bind(apiClient),

    // Usage Logs
    getUsageLogs: apiClient.getUsageLogs.bind(apiClient),
    createUsageLog: apiClient.createUsageLog.bind(apiClient),

    // Dashboard Stats
    getDashboardStats: apiClient.getDashboardStats.bind(apiClient),

    // Real-time
    subscribeToTable: apiClient.subscribeToTable.bind(apiClient),
    subscribeToUserNotifications: apiClient.subscribeToUserNotifications.bind(apiClient),
    unsubscribe: apiClient.unsubscribe.bind(apiClient),

    // Store access
    store,
  };
};

export default apiClient;
