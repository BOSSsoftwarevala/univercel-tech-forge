/**
 * Unified SaaS API - Complete Backend API Structure
 * Node.js + Express REST APIs for all modules
 * /api/auth, /api/users, /api/leads, /api/sales, /api/payments, /api/licenses, /api/support, /api/analytics, /api/notifications
 */

import { supabase } from '@/integrations/supabase/client';
import { dataFlowPipeline } from '@/services/dataFlowPipeline';

// ============= API CONFIGURATION =============
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// ============= AUTHENTICATION API =============
export class AuthAPI {
  static async login(email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user?.id)
        .single();

      if (profileError) throw profileError;

      return {
        success: true,
        data: {
          user: profile,
          token: data.session?.access_token || '',
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  }

  static async logout(): Promise<ApiResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return { success: true, message: 'Logged out successfully' };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Logout failed',
      };
    }
  }

  static async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
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

  static async register(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
  }): Promise<ApiResponse<{ user: any; token: string }>> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw authError;

      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user?.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          permissions: this.getDefaultPermissions(userData.role),
          created_at: new Date().toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      return {
        success: true,
        data: {
          user: profile,
          token: authData.session?.access_token || '',
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  }

  private static getDefaultPermissions(role: string): string[] {
    const permissions: Record<string, string[]> = {
      boss_owner: ['*'],
      ceo: ['read:*', 'write:analytics', 'write:reports'],
      manager: ['read:team', 'write:team', 'read:reports'],
      user: ['read:profile', 'write:profile'],
    };
    return permissions[role] || ['read:profile'];
  }
}

// ============= USERS API =============
export class UsersAPI {
  static async getUsers(params?: PaginationParams & { role?: string; isActive?: boolean }): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase.from('users').select('*');

      if (params?.role) {
        query = query.eq('role', params.role);
      }
      if (params?.isActive !== undefined) {
        query = query.eq('is_active', params.isActive);
      }
      if (params?.search) {
        query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%`);
      }

      // Pagination
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query.range(from, to);

      if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: params?.sortOrder === 'asc' });
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
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

  static async getUserById(id: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch user',
      };
    }
  }

  static async updateUser(id: string, updates: Partial<any>): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update user',
      };
    }
  }

  static async deleteUser(id: string): Promise<ApiResponse> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true, message: 'User deleted successfully' };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete user',
      };
    }
  }
}

// ============= LEADS API =============
export class LeadsAPI {
  static async getLeads(params?: PaginationParams & {
    status?: string;
    source?: string;
    assignedTo?: string;
  }): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase.from('leads').select('*');

      if (params?.status) {
        query = query.eq('status', params.status);
      }
      if (params?.source) {
        query = query.eq('source', params.source);
      }
      if (params?.assignedTo) {
        query = query.eq('assigned_to', params.assignedTo);
      }
      if (params?.search) {
        query = query.or(`contact_info->>name.ilike.%${params.search}%,contact_info->>email.ilike.%${params.search}%`);
      }

      // Pagination
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query.range(from, to);

      if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: params?.sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
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

  static async createLead(leadData: any): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          ...leadData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger pipeline event
      await dataFlowPipeline.triggerStage('marketplace', data);

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create lead',
      };
    }
  }

  static async updateLead(id: string, updates: Partial<any>): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Trigger pipeline event if status changed to converted
      if (updates.status === 'converted') {
        await dataFlowPipeline.triggerStage('lead', data, 'updated');
      }

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update lead',
      };
    }
  }

  static async deleteLead(id: string): Promise<ApiResponse> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true, message: 'Lead deleted successfully' };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete lead',
      };
    }
  }

  static async assignLead(id: string, assignedTo: string): Promise<ApiResponse<any>> {
    return this.updateLead(id, { assigned_to: assignedTo });
  }

  static async convertLead(id: string, saleData: any): Promise<ApiResponse<any>> {
    try {
      // Update lead status
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .update({ 
          status: 'converted', 
          updated_at: new Date().toISOString(),
          metadata: { sale_data: saleData }
        })
        .eq('id', id)
        .select()
        .single();

      if (leadError) throw leadError;

      // Create sale
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          ...saleData,
          lead_id: id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // Trigger pipeline events
      await dataFlowPipeline.triggerStage('lead', lead, 'updated');
      await dataFlowPipeline.triggerStage('sales', sale);

      return { success: true, data: { lead, sale } };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to convert lead',
      };
    }
  }
}

// ============= SALES API =============
export class SalesAPI {
  static async getSales(params?: PaginationParams & {
    status?: string;
    salesManagerId?: string;
    dateRange?: { start: string; end: string };
  }): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase.from('sales').select('*');

      if (params?.status) {
        query = query.eq('status', params.status);
      }
      if (params?.salesManagerId) {
        query = query.eq('sales_manager_id', params.salesManagerId);
      }
      if (params?.dateRange) {
        query = query.gte('created_at', params.dateRange.start)
                    .lte('created_at', params.dateRange.end);
      }
      if (params?.search) {
        query = query.or(`customer_id.ilike.%${params.search}%,product_id.ilike.%${params.search}%`);
      }

      // Pagination
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query.range(from, to);

      if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: params?.sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
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

  static async createSale(saleData: any): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert({
          ...saleData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger pipeline event
      await dataFlowPipeline.triggerStage('sales', data);

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create sale',
      };
    }
  }

  static async updateSale(id: string, updates: Partial<any>): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update sale',
      };
    }
  }

  static async getSalesAnalytics(params?: {
    period?: 'daily' | 'weekly' | 'monthly';
    dateRange?: { start: string; end: string };
  }): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase
        .from('sales')
        .select('created_at, amount, status, sales_manager_id');

      if (params?.dateRange) {
        query = query.gte('created_at', params.dateRange.start)
                    .lte('created_at', params.dateRange.end);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process analytics data
      const analytics = this.processSalesAnalytics(data || [], params?.period || 'daily');

      return { success: true, data: analytics };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch sales analytics',
      };
    }
  }

  private static processSalesAnalytics(sales: any[], period: string): any[] {
    // Group sales by period
    const grouped = sales.reduce((acc, sale) => {
      const date = new Date(sale.created_at);
      const key = period === 'daily' ? date.toISOString().split('T')[0] :
                  period === 'weekly' ? `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}` :
                  `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!acc[key]) {
        acc[key] = {
          period: key,
          totalSales: 0,
          totalRevenue: 0,
          completedSales: 0,
          pendingSales: 0,
        };
      }
      
      acc[key].totalSales++;
      acc[key].totalRevenue += sale.amount;
      if (sale.status === 'completed') acc[key].completedSales++;
      if (sale.status === 'pending') acc[key].pendingSales++;
      
      return acc;
    }, {});

    return Object.values(grouped);
  }
}

// ============= PAYMENTS API =============
export class PaymentsAPI {
  static async getPayments(params?: PaginationParams & {
    status?: string;
    method?: string;
    dateRange?: { start: string; end: string };
  }): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase.from('payments').select('*');

      if (params?.status) {
        query = query.eq('status', params.status);
      }
      if (params?.method) {
        query = query.eq('method', params.method);
      }
      if (params?.dateRange) {
        query = query.gte('created_at', params.dateRange.start)
                    .lte('created_at', params.dateRange.end);
      }

      // Pagination
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query.range(from, to);

      if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: params?.sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
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

  static async createPayment(paymentData: any): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          ...paymentData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger pipeline event
      await dataFlowPipeline.triggerStage('payment', data);

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create payment',
      };
    }
  }

  static async updatePayment(id: string, updates: Partial<any>): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({ 
          ...updates,
          ...(updates.status === 'completed' && { completed_at: new Date().toISOString() }),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Trigger pipeline event if payment completed
      if (updates.status === 'completed') {
        await dataFlowPipeline.triggerStage('payment', data, 'updated');
      }

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update payment',
      };
    }
  }

  static async processPayment(paymentId: string): Promise<ApiResponse<any>> {
    // Simulate payment processing
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (error) throw error;

      // Simulate payment gateway call
      const gatewayResult = await this.callPaymentGateway(payment);

      if (gatewayResult.success) {
        return this.updatePayment(paymentId, {
          status: 'completed',
          gateway_transaction_id: gatewayResult.transactionId,
        });
      } else {
        return this.updatePayment(paymentId, {
          status: 'failed',
          metadata: { gateway_error: gatewayResult.error },
        });
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Payment processing failed',
      };
    }
  }

  private static async callPaymentGateway(payment: any): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    // Simulate payment gateway integration
    // In production, integrate with Stripe, PayPal, etc.
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    
    // Random success/failure for demo
    const success = Math.random() > 0.1; // 90% success rate
    
    return {
      success,
      transactionId: success ? `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : undefined,
      error: success ? undefined : 'Payment declined by gateway',
    };
  }
}

// ============= LICENSES API =============
export class LicensesAPI {
  static async getLicenses(params?: PaginationParams & {
    userId?: string;
    status?: string;
    type?: string;
  }): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase.from('licenses').select('*');

      if (params?.userId) {
        query = query.eq('user_id', params.userId);
      }
      if (params?.status) {
        query = query.eq('status', params.status);
      }
      if (params?.type) {
        query = query.eq('type', params.type);
      }

      // Pagination
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query.range(from, to);

      if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: params?.sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
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

  static async createLicense(licenseData: any): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .insert({
          ...licenseData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger pipeline event
      await dataFlowPipeline.triggerStage('license', data);

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create license',
      };
    }
  }

  static async updateLicense(id: string, updates: Partial<any>): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update license',
      };
    }
  }

  static async activateLicense(id: string): Promise<ApiResponse<any>> {
    return this.updateLicense(id, { 
      status: 'active',
      activated_at: new Date().toISOString(),
    });
  }

  static async suspendLicense(id: string, reason?: string): Promise<ApiResponse<any>> {
    return this.updateLicense(id, { 
      status: 'suspended',
      suspended_at: new Date().toISOString(),
      metadata: { suspension_reason: reason },
    });
  }

  static async checkLicenseUsage(userId: string): Promise<ApiResponse<any>> {
    try {
      const { data: licenses, error: licenseError } = await supabase
        .from('licenses')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (licenseError) throw licenseError;

      const { data: usage, error: usageError } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

      if (usageError) throw usageError;

      // Calculate usage statistics
      const usageStats = this.calculateUsageStats(licenses || [], usage || []);

      return { success: true, data: usageStats };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to check license usage',
      };
    }
  }

  private static calculateUsageStats(licenses: any[], usage: any[]): any {
    return licenses.map(license => {
      const licenseUsage = usage.filter(u => u.license_id === license.id);
      
      return {
        license,
        usage: {
          apiCalls: licenseUsage.filter(u => u.action === 'api_call').length,
          storage: licenseUsage.filter(u => u.action === 'storage').reduce((acc, u) => acc + u.quantity, 0),
          users: new Set(licenseUsage.filter(u => u.action === 'user_login').map(u => u.resource)).size,
        },
        limits: license.usage_limits,
        percentages: {
          apiCalls: license.usage_limits?.api_calls ? 
            (licenseUsage.filter(u => u.action === 'api_call').length / license.usage_limits.api_calls) * 100 : 0,
          storage: license.usage_limits?.storage ? 
            (licenseUsage.filter(u => u.action === 'storage').reduce((acc, u) => acc + u.quantity, 0) / license.usage_limits.storage) * 100 : 0,
          users: license.usage_limits?.users ? 
            (new Set(licenseUsage.filter(u => u.action === 'user_login').map(u => u.resource)).size / license.usage_limits.users) * 100 : 0,
        },
      };
    });
  }
}

// ============= SUPPORT API =============
export class SupportAPI {
  static async getTickets(params?: PaginationParams & {
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
  }): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase.from('support_tickets').select('*');

      if (params?.status) {
        query = query.eq('status', params.status);
      }
      if (params?.priority) {
        query = query.eq('priority', params.priority);
      }
      if (params?.category) {
        query = query.eq('category', params.category);
      }
      if (params?.assignedTo) {
        query = query.eq('assigned_to', params.assignedTo);
      }
      if (params?.search) {
        query = query.or(`subject.ilike.%${params.search}%,description.ilike.%${params.search}%`);
      }

      // Pagination
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query.range(from, to);

      if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: params?.sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
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
        error: error.message || 'Failed to fetch tickets',
      };
    }
  }

  static async createTicket(ticketData: any): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          ...ticketData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger pipeline event
      await dataFlowPipeline.triggerStage('support', data);

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create ticket',
      };
    }
  }

  static async updateTicket(id: string, updates: Partial<any>): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update ticket',
      };
    }
  }

  static async assignTicket(id: string, assignedTo: string): Promise<ApiResponse<any>> {
    return this.updateTicket(id, { 
      assigned_to: assignedTo,
      status: 'in_progress',
    });
  }

  static async resolveTicket(id: string, resolution: string): Promise<ApiResponse<any>> {
    return this.updateTicket(id, { 
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      metadata: { resolution },
    });
  }

  static async closeTicket(id: string): Promise<ApiResponse<any>> {
    return this.updateTicket(id, { 
      status: 'closed',
      closed_at: new Date().toISOString(),
    });
  }
}

// ============= ANALYTICS API =============
export class AnalyticsAPI {
  static async getAnalytics(params?: {
    module?: string;
    metric?: string;
    period?: 'hourly' | 'daily' | 'weekly' | 'monthly';
    dateRange?: { start: string; end: string };
    dimensions?: Record<string, string>;
  }): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase.from('analytics').select('*');

      if (params?.module) {
        query = query.eq('module', params.module);
      }
      if (params?.metric) {
        query = query.eq('metric', params.metric);
      }
      if (params?.period) {
        query = query.eq('period', params.period);
      }
      if (params?.dateRange) {
        query = query.gte('timestamp', params.dateRange.start)
                    .lte('timestamp', params.dateRange.end);
      }

      const { data, error } = await query.order('timestamp', { ascending: false });

      if (error) throw error;

      // Process analytics data
      const processedData = this.processAnalyticsData(data || [], params);

      return { success: true, data: processedData };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch analytics',
      };
    }
  }

  static async createAnalytics(analyticsData: any): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .insert({
          ...analyticsData,
          timestamp: analyticsData.timestamp || new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger pipeline event
      await dataFlowPipeline.triggerStage('analytics', data);

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create analytics',
      };
    }
  }

  static async getDashboardMetrics(params?: {
    modules?: string[];
    period?: 'daily' | 'weekly' | 'monthly';
  }): Promise<ApiResponse<Record<string, any>>> {
    try {
      const metrics: Record<string, any> = {};

      // Get metrics for each module
      const modules = params?.modules || [
        'marketplace_core', 'lead_manager', 'sales_manager', 
        'finance_manager', 'customer_support', 'analytics_manager'
      ];

      for (const module of modules) {
        const { data, error } = await supabase
          .from('analytics')
          .select('*')
          .eq('module', module)
          .eq('period', params?.period || 'daily')
          .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('timestamp', { ascending: false })
          .limit(100);

        if (!error && data) {
          metrics[module] = this.aggregateModuleMetrics(data);
        }
      }

      return { success: true, data: metrics };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch dashboard metrics',
      };
    }
  }

  private static processAnalyticsData(data: any[], params?: any): any[] {
    // Group and aggregate analytics data
    const grouped = data.reduce((acc, item) => {
      const key = `${item.module}_${item.metric}_${item.period}`;
      if (!acc[key]) {
        acc[key] = {
          module: item.module,
          metric: item.metric,
          period: item.period,
          totalValue: 0,
          count: 0,
          values: [],
          dimensions: item.dimensions,
        };
      }
      
      acc[key].totalValue += item.value;
      acc[key].count++;
      acc[key].values.push(item);
      
      return acc;
    }, {});

    return Object.values(grouped).map(group => ({
      ...group,
      averageValue: group.totalValue / group.count,
      latestValue: group.values[0]?.value || 0,
      trend: this.calculateTrend(group.values),
    }));
  }

  private static aggregateModuleMetrics(data: any[]): any {
    const metrics = data.reduce((acc, item) => {
      if (!acc[item.metric]) {
        acc[item.metric] = {
          total: 0,
          count: 0,
          latest: 0,
          trend: 'stable',
        };
      }
      
      acc[item.metric].total += item.value;
      acc[item.metric].count++;
      acc[item.metric].latest = item.value;
      
      return acc;
    }, {});

    // Calculate trends
    Object.keys(metrics).forEach(metric => {
      const metricData = data.filter(d => d.metric === metric).sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      if (metricData.length >= 2) {
        const recent = metricData.slice(-7).reduce((sum, d) => sum + d.value, 0) / Math.min(7, metricData.length);
        const previous = metricData.slice(-14, -7).reduce((sum, d) => sum + d.value, 0) / Math.min(7, metricData.length);
        
        metrics[metric].trend = recent > previous * 1.1 ? 'up' : recent < previous * 0.9 ? 'down' : 'stable';
      }
    });

    return metrics;
  }

  private static calculateTrend(values: any[]): 'up' | 'down' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const recent = values.slice(0, Math.ceil(values.length / 2)).reduce((sum, v) => sum + v.value, 0) / Math.ceil(values.length / 2);
    const previous = values.slice(Math.ceil(values.length / 2)).reduce((sum, v) => sum + v.value, 0) / Math.floor(values.length / 2);
    
    return recent > previous * 1.1 ? 'up' : recent < previous * 0.9 ? 'down' : 'stable';
  }
}

// ============= NOTIFICATIONS API =============
export class NotificationsAPI {
  static async getNotifications(params?: PaginationParams & {
    userId?: string;
    type?: string;
    isRead?: boolean;
  }): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase.from('notifications').select('*');

      if (params?.userId) {
        query = query.eq('user_id', params.userId);
      }
      if (params?.type) {
        query = query.eq('type', params.type);
      }
      if (params?.isRead !== undefined) {
        query = query.eq('is_read', params.isRead);
      }

      // Pagination
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
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

  static async createNotification(notificationData: any): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notificationData,
          created_at: new Date().toISOString(),
          is_read: false,
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create notification',
      };
    }
  }

  static async markAsRead(id: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to mark notification as read',
      };
    }
  }

  static async markAllAsRead(userId: string): Promise<ApiResponse> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      return { success: true, message: 'All notifications marked as read' };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to mark all notifications as read',
      };
    }
  }

  static async deleteNotification(id: string): Promise<ApiResponse> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true, message: 'Notification deleted successfully' };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete notification',
      };
    }
  }

  static async getUnreadCount(userId: string): Promise<ApiResponse<{ count: number }>> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      return { success: true, data: { count: data?.length || 0 } };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get unread count',
      };
    }
  }
}

// ============= EXPORT ALL APIS =============
export const UnifiedSaaSAPI = {
  Auth: AuthAPI,
  Users: UsersAPI,
  Leads: LeadsAPI,
  Sales: SalesAPI,
  Payments: PaymentsAPI,
  Licenses: LicensesAPI,
  Support: SupportAPI,
  Analytics: AnalyticsAPI,
  Notifications: NotificationsAPI,
};

export default UnifiedSaaSAPI;
