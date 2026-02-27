import { supabase } from "@/integrations/supabase/client";

export interface AIRATask {
  id?: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  status?: "pending" | "in_progress" | "completed";
}

export interface AIRANotification {
  id?: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "urgent";
  read?: boolean;
  createdAt?: string;
}

export interface AIRAStatus {
  status: string;
  unreadNotifications: number;
  notifications: AIRANotification[];
  upcomingTasks: AIRATask[];
}

export const airaAssistantService = {
  // Get AIRA status (notifications + tasks)
  async getStatus(): Promise<AIRAStatus> {
    const { data, error } = await supabase.functions.invoke("aira-assistant", {
      body: { action: "status" },
    });
    if (error) throw error;
    return data;
  },

  // Create a new task
  async createTask(task: AIRATask): Promise<{ created: boolean; id: string }> {
    const { data, error } = await supabase.functions.invoke("aira-assistant", {
      body: { action: "create_task", taskData: task },
    });
    if (error) throw error;
    return data;
  },

  // List all pending tasks
  async listTasks(): Promise<AIRATask[]> {
    const { data, error } = await supabase.functions.invoke("aira-assistant", {
      body: { action: "list_tasks" },
    });
    if (error) throw error;
    return data?.tasks || [];
  },

  // Send a notification
  async sendNotification(notification: AIRANotification): Promise<void> {
    const { error } = await supabase.functions.invoke("aira-assistant", {
      body: { action: "notify", notificationData: notification },
    });
    if (error) throw error;
  },

  // Get AI-generated daily briefing
  async getDailyBriefing(): Promise<{ briefing: string; pendingTasks: number }> {
    const { data, error } = await supabase.functions.invoke("aira-assistant", {
      body: { action: "daily_briefing" },
    });
    if (error) throw error;
    return data;
  },

  // Mark notification as read
  async markRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from("aira_notifications")
      .update({ read: true })
      .eq("id", notificationId);
    if (error) throw error;
  },

  // Update task status
  async updateTaskStatus(taskId: string, status: AIRATask["status"]): Promise<void> {
    const { error } = await supabase
      .from("aira_tasks")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", taskId);
    if (error) throw error;
  },
};
