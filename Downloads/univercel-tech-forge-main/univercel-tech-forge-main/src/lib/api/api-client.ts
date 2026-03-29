/**
 * SOFTWARE VALA API Client
 * Unified client for all REST + WebSocket APIs
 */

import { supabase } from '@/integrations/supabase/client';
import { callEdgeRoute } from '@/lib/api/edge-client';

const API_VERSION = 'v1';
const WS_BASE = `wss://feqdqyadkijpohyllfdq.supabase.co/functions/v1`;

// Types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
  next_action?: string;
}

interface PaginatedResponse<T> extends ApiResponse<{ items: T[]; pagination: Pagination }> {}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// API Client Class
class SoftwareValaAPI {
  private token: string | null = null;
  private wsConnections: Map<string, WebSocket> = new Map();

  constructor() {
    this.initToken();
  }

  private async initToken() {
    const { data: { session } } = await supabase.auth.getSession();
    this.token = session?.access_token || null;

    supabase.auth.onAuthStateChange((event, session) => {
      this.token = session?.access_token || null;
    });
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlcWRxeWFka2lqcG9oeWxsZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMzMxMzAsImV4cCI6MjA4MTcwOTEzMH0.zSc_B1jPHsCp9O1M_fUiym8J45YLFdIfhVQy2HWnTCM',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // ============ AUTH APIs ============
  auth = {
    login: async (email: string, password: string, deviceFingerprint?: string): Promise<ApiResponse> => {
      const { data, error } = await supabase.functions.invoke('api-auth/login', {
        body: { email, password, device_fingerprint: deviceFingerprint }
      });
      return data || { success: false, message: error?.message || 'Login failed' };
    },

    logout: async (): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke('api-auth/logout', {
        method: 'POST'
      });
      return data;
    },

    refresh: async (refreshToken: string): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke('api-auth/refresh', {
        body: { refresh_token: refreshToken }
      });
      return data;
    },

    deviceCheck: async (): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke('api-auth/device-check');
      return data;
    },

    getMaskedIdentity: async (): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke('api-auth/masked-identity');
      return data;
    }
  };

  // ============ WALLET APIs ============
  wallet = {
    get: async (): Promise<ApiResponse> => {
      const response = await callEdgeRoute<any>('api-wallet', 'balance');
      return { success: true, message: 'Wallet fetched', data: response.data };
    },

    getTransactions: async (page = 1, limit = 20): Promise<ApiResponse> => {
      const response = await callEdgeRoute<any>('api-wallet', 'transactions', {
        query: { page, limit },
      });
      return { success: true, message: 'Transactions fetched', data: response.data };
    },

    topup: async (amount: number, paymentMethod: string, transactionRef?: string): Promise<ApiResponse> => {
      const response = await callEdgeRoute<any>('api-wallet', 'topup', {
        method: 'POST',
        body: { amount, payment_method: paymentMethod, transaction_ref: transactionRef }
      });
      return { success: true, message: 'Topup submitted', data: response.data };
    },

    withdraw: async (amount: number, payoutMethod: string, bankDetails?: any): Promise<ApiResponse> => {
      const response = await callEdgeRoute<any>('api-wallet', 'withdraw', {
        method: 'POST',
        body: { amount, payout_method: payoutMethod, bank_details: bankDetails }
      });
      return { success: true, message: 'Withdrawal submitted', data: response.data };
    },

    processFranchiseCommission: async (franchiseId: string, saleAmount: number, commissionRate: number, leadId?: string): Promise<ApiResponse> => {
      const response = await callEdgeRoute<any>('api-wallet', 'commission/franchise', {
        method: 'POST',
        body: { franchise_id: franchiseId, sale_amount: saleAmount, commission_rate: commissionRate, lead_id: leadId }
      });
      return { success: true, message: 'Franchise commission processed', data: response.data };
    },

    processResellerCommission: async (resellerId: string, saleAmount: number, commissionRate: number, leadId?: string): Promise<ApiResponse> => {
      const response = await callEdgeRoute<any>('api-wallet', 'commission/reseller', {
        method: 'POST',
        body: { reseller_id: resellerId, sale_amount: saleAmount, commission_rate: commissionRate, lead_id: leadId }
      });
      return { success: true, message: 'Reseller commission processed', data: response.data };
    },

    getInvoice: async (invoiceId: string): Promise<ApiResponse> => {
      const response = await callEdgeRoute<any>('api-wallet', `invoice/${invoiceId}`);
      return { success: true, message: 'Invoice fetched', data: response.data };
    }
  };

  // ============ LEADS APIs ============
  leads = {
    create: async (leadData: {
      name: string;
      email?: string;
      phone?: string;
      company?: string;
      source?: string;
      region?: string;
      country?: string;
      priority?: string;
      notes?: string;
    }): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke('api-leads/create', {
        body: leadData
      });
      return data;
    },

    list: async (params?: { page?: number; limit?: number; status?: string; priority?: string }): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke('api-leads/list', {
        body: params
      });
      return data;
    },

    assign: async (leadId: string, assignedTo: string, notes?: string): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke(`api-leads/${leadId}/assign`, {
        body: { assigned_to: assignedTo, notes }
      });
      return data;
    },

    updateStatus: async (leadId: string, status: string, notes?: string): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke(`api-leads/${leadId}/status`, {
        body: { status, notes }
      });
      return data;
    },

    getTimeline: async (leadId: string): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke(`api-leads/${leadId}/timeline`);
      return data;
    }
  };

  // ============ TASKS APIs ============
  tasks = {
    create: async (taskData: {
      title: string;
      description?: string;
      category: string;
      priority?: string;
      tech_stack?: string[];
      deadline?: string;
      estimated_hours?: number;
      sla_hours?: number;
    }): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke('api-tasks/create', {
        body: taskData
      });
      return data;
    },

    list: async (params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke('api-tasks/list', {
        body: params
      });
      return data;
    },

    assign: async (taskId: string, developerId: string): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke(`api-tasks/${taskId}/assign`, {
        body: { developer_id: developerId }
      });
      return data;
    },

    accept: async (taskId: string): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke(`api-tasks/${taskId}/accept`, {
        method: 'PATCH'
      });
      return data;
    },

    startTimer: async (taskId: string): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke(`api-tasks/${taskId}/timer/start`, {
        method: 'PATCH'
      });
      return data;
    },

    stopTimer: async (taskId: string, pauseReason?: string): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke(`api-tasks/${taskId}/timer/stop`, {
        body: { pause_reason: pauseReason }
      });
      return data;
    },

    getProgress: async (taskId: string): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke(`api-tasks/${taskId}/progress`);
      return data;
    },

    deliver: async (taskId: string, notes?: string, files?: string[]): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke(`api-tasks/${taskId}/deliver`, {
        body: { delivery_notes: notes, files }
      });
      return data;
    }
  };

  // ============ DEMOS APIs ============
  demos = {
    list: async (params?: { page?: number; limit?: number; category?: string; tech?: string }): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke('api-demos/list', {
        body: params
      });
      return data;
    },

    create: async (demoData: {
      title: string;
      url: string;
      category: string;
      description?: string;
      tech_stack?: string;
      backup_url?: string;
      video_fallback_url?: string;
      login_credentials?: Array<{
        role: string;
        username: string;
        password: string;
        login_url?: string;
      }>;
    }): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke('api-demos/upload', {
        body: demoData
      });
      return data;
    },

    assign: async (demoId: string, requesterId: string, requesterRole: string, expiresAt?: string, maxViews?: number): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke(`api-demos/${demoId}/assign`, {
        body: { requester_id: requesterId, requester_role: requesterRole, expires_at: expiresAt, max_views: maxViews }
      });
      return data;
    },

    getUptime: async (demoId: string): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke(`api-demos/${demoId}/uptime`);
      return data;
    },

    requestRental: async (demoId: string, notes?: string, accessType?: string): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke('api-demos/rent', {
        body: { demo_id: demoId, notes, access_type: accessType }
      });
      return data;
    },

    getClickAnalytics: async (demoId?: string, startDate?: string, endDate?: string): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke('api-demos/track/clicks', {
        body: { demo_id: demoId, start_date: startDate, end_date: endDate }
      });
      return data;
    }
  };

  // ============ ALERTS APIs ============
  alerts = {
    create: async (alertData: {
      trigger_type: string;
      role_target: string;
      priority?: string;
      task_id?: string;
      lead_id?: string;
      region?: string;
    }): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke('api-alerts/create', {
        body: alertData
      });
      return data;
    },

    getLive: async (page = 1, limit = 20): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke('api-alerts/live', {
        body: { page, limit }
      });
      return data;
    },

    accept: async (alertId: string): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke(`api-alerts/${alertId}/accept`, {
        method: 'PATCH'
      });
      return data;
    },

    escalate: async (alertId: string, escalateToRole?: string, reason?: string): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke(`api-alerts/${alertId}/escalate`, {
        body: { escalate_to_role: escalateToRole, reason }
      });
      return data;
    },

    getStats: async (): Promise<ApiResponse> => {
      const { data } = await supabase.functions.invoke('api-alerts/stats');
      return data;
    }
  };

  // ============ WEBSOCKET CONNECTIONS ============
  websocket = {
    connect: (onMessage: (data: any) => void, onError?: (error: any) => void): WebSocket => {
      const ws = new WebSocket(`${WS_BASE}/ws-realtime`);
      
      ws.onopen = () => {
        console.log('[WS] Connected to realtime hub');
        
        // Authenticate
        if (this.token) {
          ws.send(JSON.stringify({
            type: 'auth',
            token: this.token
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.error('[WS] Parse error:', e);
        }
      };

      ws.onerror = (error) => {
        console.error('[WS] Error:', error);
        onError?.(error);
      };

      ws.onclose = () => {
        console.log('[WS] Disconnected');
      };

      this.wsConnections.set('main', ws);
      return ws;
    },

    subscribe: (channels: string[]): void => {
      const ws = this.wsConnections.get('main');
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'subscribe',
          channels
        }));
      }
    },

    unsubscribe: (channels: string[]): void => {
      const ws = this.wsConnections.get('main');
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'unsubscribe',
          channels
        }));
      }
    },

    sendChat: (threadId: string, message: string): void => {
      const ws = this.wsConnections.get('main');
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'send_chat',
          thread_id: threadId,
          message
        }));
      }
    },

    acknowledgeAlert: (alertId: string): void => {
      const ws = this.wsConnections.get('main');
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'acknowledge_alert',
          alert_id: alertId
        }));
      }
    },

    disconnect: (): void => {
      this.wsConnections.forEach((ws) => {
        ws.close();
      });
      this.wsConnections.clear();
    }
  };
}

// Export singleton instance
export const api = new SoftwareValaAPI();

// Export types
export type { ApiResponse, PaginatedResponse, Pagination };
